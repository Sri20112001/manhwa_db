import { useRouter } from 'expo-router';

/**
 * Hook providing a safe `goBack` function that checks `router.canGoBack()`
 * and falls back to a default route (or no-op) if there is no back history.
 *
 * This prevents React Navigation's warning:
 * "The action 'GO_BACK' was not handled by any navigator. Is there any screen to go back to?"
 */
export function useSafeBack(fallbackRoute: string = '/(tabs)') {
  const router = useRouter();

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallbackRoute as any);
    }
  };

  return { goBack, router };
}
