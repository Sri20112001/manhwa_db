import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';

import { API_BASE_URL, API_KEY_HEADER, REQUEST_TIMEOUT_MS } from '@/shared/constants/config';
import { loadApiKey } from '@/shared/lib/secure';

import {
  cacheKey,
  getCacheEntry,
  isNoStore,
  parseMaxAge,
  setCacheEntry,
} from './cache';
import { ApiError, AuthError, NetworkError, RateLimitError } from './errors';
import { backoffReads, backoffWrites, parseRetryAfter, throttleRequest } from './throttle';

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { Accept: 'application/json' },
  validateStatus: (status) => (status >= 200 && status < 300) || status === 304,
});

const configKeys = new WeakMap<object, string>();

let authAbortController = new AbortController();

export function abortAuthenticatedRequests(): void {
  authAbortController.abort();
  authAbortController = new AbortController();
}

let authFailureHandler: ((failedKey?: string) => void) | null = null;

export function setAuthFailureHandler(handler: ((failedKey?: string) => void) | null): void {
  authFailureHandler = handler;
}

let accountIdProvider: () => string | null = () => null;

export function setAccountIdProvider(provider: (() => string | null) | null): void {
  accountIdProvider = provider ?? (() => null);
}

function headerValue(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return undefined;
}

http.interceptors.request.use(async (config) => {
  const method = config.method ?? 'get';
  await throttleRequest(method);

  const key = await loadApiKey();
  if (key) {
    config.headers.set(API_KEY_HEADER, key);
    if (!config.signal) {
      config.signal = authAbortController.signal;
    }
  }

  const cacheable = method.toUpperCase() === 'GET';
  if (cacheable) {
    const url = `${config.baseURL ?? ''}${config.url ?? ''}`;
    const requestKey = cacheKey(method, url, config.params, accountIdProvider());
    configKeys.set(config, requestKey);
    const cached = getCacheEntry(requestKey);
    if (cached?.etag) config.headers.set('If-None-Match', cached.etag);
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    const requestKey = configKeys.get(response.config);
    const cacheControl = response.headers['cache-control'];

    if (response.status === 304) {
      const cached = requestKey ? getCacheEntry(requestKey) : undefined;
      if (cached) {
        response.status = 200;
        response.data = cached.payload;
        return response;
      }
    }

    if (requestKey && response.status === 200 && !isNoStore(cacheControl)) {
      const etag = headerValue(response.headers.etag);
      setCacheEntry(requestKey, {
        etag,
        payload: response.data,
        cachedAt: Date.now(),
        maxAge: parseMaxAge(cacheControl),
        accountId: accountIdProvider(),
      });
    }
    return response;
  },
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error?: string; code?: string; requestId?: string }>;
      const status = axiosError.response?.status;
      const requestId = axiosError.response?.data?.requestId;
      const serverMessage = axiosError.response?.data?.error;

      if (status === 429) {
        const retryAfter = parseRetryAfter(axiosError.response?.headers);
        const method = (axiosError.config?.method ?? 'get').toUpperCase();
        if (method === 'GET') backoffReads(retryAfter);
        else backoffWrites(retryAfter);
        return Promise.reject(
          new RateLimitError(serverMessage ?? 'Rate limit reached. Retrying shortly.', {
            status,
            code: axiosError.response?.data?.code ?? 'RATE_LIMITED',
            requestId,
            retryAfter,
          }),
        );
      }

      if (status === 401 || status === 403) {
        const authError = new AuthError(
          serverMessage ?? 'Your API key is invalid, revoked, or lacks the required scope.',
          {
            status,
            code: axiosError.response?.data?.code ?? 'INVALID_API_KEY',
            requestId,
          },
        );
        if (status === 401) {
          const usedKey =
            headerValue(axiosError.config?.headers?.[API_KEY_HEADER]) ??
            (axiosError.config?.headers?.get?.(API_KEY_HEADER) as string | undefined);
          authFailureHandler?.(usedKey);
        }
        return Promise.reject(authError);
      }

      if (axiosError.response) {
        return Promise.reject(
          new ApiError(serverMessage ?? 'The server rejected the request.', {
            status,
            code: axiosError.response.data?.code,
            requestId,
          }),
        );
      }

      return Promise.reject(
        new NetworkError(
          axiosError.code === 'ECONNABORTED'
            ? 'The request timed out. Check your connection.'
            : 'Network request failed. Check your connection.',
          { cause: axiosError },
        ),
      );
    }
    return Promise.reject(error);
  },
);

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await http.request<T>(config);
  return response.data;
}
