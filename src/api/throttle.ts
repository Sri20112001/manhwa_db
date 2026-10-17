import { acquireRead, acquireWrite, freezeReads, freezeWrites } from '@/shared/lib/rateLimit';

export async function throttleRequest(method: string): Promise<void> {
  const normalised = method.toUpperCase();
  if (normalised === 'GET' || normalised === 'HEAD') {
    await acquireRead();
    return;
  }
  await acquireWrite();
}

export function backoffReads(retryAfterSeconds: number): void {
  freezeReads(retryAfterSeconds * 1_000);
}

export function backoffWrites(retryAfterSeconds: number): void {
  freezeWrites(retryAfterSeconds * 1_000);
}

export function parseRetryAfter(headers: unknown): number {
  if (!headers || typeof headers !== 'object') return 60;
  const raw = (headers as Record<string, unknown>)['retry-after'];
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = Number(value);
  if (Number.isFinite(parsed) && parsed > 0) return Math.min(parsed, 3_600);
  return 60;
}
