import { getHealth } from '@/api/endpoints/health';
import { getMe } from '@/api/endpoints/users';
import { ApiError, errorMessage } from '@/api/errors';
import { useRootStore } from '@/logic/store';
import { clearApiKey, saveApiKey } from '@/shared/lib/secure';

export interface ConnectResult {
  ok: boolean;
  error?: string;
}

export async function connectAccount(rawKey: string): Promise<ConnectResult> {
  const key = rawKey.trim();
  if (!key) return { ok: false, error: 'Enter your API key to continue.' };

  const store = useRootStore.getState();
  store.setValidating(true);

  try {
    await saveApiKey(key);
    await getHealth();
    const me = await getMe();
    store.setSession({
      uid: me.data.uid,
      username: me.data.username,
      scopes: me.data.scopes ?? [],
    });
    return { ok: true };
  } catch (error) {
    await clearApiKey();
    store.clearSession();
    return { ok: false, error: errorMessage(error) };
  } finally {
    useRootStore.getState().setValidating(false);
  }
}

export async function disconnectAccount(): Promise<void> {
  await clearApiKey();
  useRootStore.getState().clearSession();
}

export async function refreshSession(): Promise<boolean> {
  try {
    const me = await getMe();
    useRootStore.getState().setSession({
      uid: me.data.uid,
      username: me.data.username,
      scopes: me.data.scopes ?? [],
    });
    return true;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      await clearApiKey();
      useRootStore.getState().clearSession();
    }
    return false;
  }
}
