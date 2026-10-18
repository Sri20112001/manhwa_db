import { clearUserCache } from '@/api/cache';
import { abortAuthenticatedRequests } from '@/api/client';
import { getHealth } from '@/api/endpoints/health';
import { getMe } from '@/api/endpoints/users';
import { ApiError, errorMessage } from '@/api/errors';
import { queryClient } from '@/logic/query/client';
import { flushQueue } from '@/logic/query/mutations.queue';
import { asyncStoragePersister } from '@/logic/query/persistence';
import { useRootStore } from '@/logic/store';
import { clearApiKey, saveApiKey } from '@/shared/lib/secure';

export interface ConnectResult {
  ok: boolean;
  error?: string;
}

let activeAuthAttempt = 0;

export async function connectAccount(rawKey: string): Promise<ConnectResult> {
  const key = rawKey.trim();
  if (!key) return { ok: false, error: 'Enter your API key to continue.' };

  const currentAttempt = ++activeAuthAttempt;
  const store = useRootStore.getState();
  store.setValidating(true);

  try {
    await saveApiKey(key);
    await getHealth();
    const me = await getMe();

    if (currentAttempt !== activeAuthAttempt) {
      return { ok: false, error: 'Authentication was superseded or cancelled.' };
    }

    abortAuthenticatedRequests();
    await queryClient.cancelQueries();
    queryClient.clear();
    try {
      await asyncStoragePersister.removeClient();
    } catch {
      // ignore
    }

    store.setSession({
      uid: me.data.uid,
      username: me.data.username,
      scopes: me.data.scopes ?? [],
    });

    void flushQueue();

    return { ok: true };
  } catch (error) {
    if (currentAttempt === activeAuthAttempt) {
      await clearApiKey();
      store.clearSession();
    }
    return { ok: false, error: errorMessage(error) };
  } finally {
    if (currentAttempt === activeAuthAttempt) {
      useRootStore.getState().setValidating(false);
    }
  }
}

export async function disconnectAccount(): Promise<void> {
  activeAuthAttempt += 1;

  abortAuthenticatedRequests();
  await queryClient.cancelQueries();
  queryClient.clear();
  try {
    await asyncStoragePersister.removeClient();
  } catch {
    // ignore
  }

  const uid = useRootStore.getState().uid;
  clearUserCache(uid ?? undefined);

  await clearApiKey();
  useRootStore.getState().clearSession();
}

export async function refreshSession(): Promise<boolean> {
  const currentAttempt = ++activeAuthAttempt;
  try {
    const me = await getMe();
    if (currentAttempt !== activeAuthAttempt) return false;
    useRootStore.getState().setSession({
      uid: me.data.uid,
      username: me.data.username,
      scopes: me.data.scopes ?? [],
    });
    return true;
  } catch (error) {
    if (currentAttempt === activeAuthAttempt && error instanceof ApiError && error.status === 401) {
      await disconnectAccount();
    }
    return false;
  }
}
