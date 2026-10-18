import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { hydrateCache } from '@/api/cache';
import { setAuthFailureHandler } from '@/api/client';
import { queryClient } from '@/logic/query/client';
import { hydrateQueue } from '@/logic/query/mutations.queue';
import { persistOptions } from '@/logic/query/persistence';
import { useRootStore } from '@/logic/store';
import { disconnectAccount, refreshSession } from '@/logic/usecases/connectAccount';
import { loadApiKey } from '@/shared/lib/secure';
import { ToastHost } from '@/ui/components/feedback/Toast';
import { ThemeProvider, useThemeMode } from '@/ui/theme/ThemeProvider';

import '../global.css';

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync().catch(() => {});
}

function RootNavigation() {
  const router = useRouter();
  const segments = useSegments();
  const hasKey = useRootStore((state) => state.hasKey);
  const themeMode = useThemeMode();
  const [storeHydrated, setStoreHydrated] = useState(false);

  useEffect(() => {
    setAuthFailureHandler(async (failedKey) => {
      const currentKey = await loadApiKey();
      if (!failedKey || !currentKey || failedKey === currentKey) {
        await disconnectAccount();
        router.replace('/(auth)/onboarding');
      }
    });
  }, [router]);

  useEffect(() => {
    void Promise.all([
      hydrateQueue().catch(() => {}),
      hydrateCache().catch(() => {}),
    ]);
  }, []);

  useEffect(() => {
    let mounted = true;
    const unsub = useRootStore.persist.onFinishHydration(() => {
      if (mounted) setStoreHydrated(true);
    });

    void (async () => {
      try {
        const key = await loadApiKey();
        if (key && !useRootStore.getState().hasKey) {
          await refreshSession();
        }
      } catch {
        // ignore
      } finally {
        if (mounted) setStoreHydrated(true);
      }
    })();

    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  useEffect(() => {
    if (!storeHydrated) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!hasKey && !inAuthGroup) {
      router.replace('/(auth)/onboarding');
    } else if (hasKey && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [storeHydrated, hasKey, segments, router]);

  return (
    <View className="flex-1 bg-background">
      <StatusBar style={themeMode === 'light' ? 'dark' : 'light'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="pornhwa/[slug]" options={{ headerShown: false }} />
        <Stack.Screen name="character/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="reader/[slug]" options={{ headerShown: false }} />
        <Stack.Screen name="lists/index" options={{ headerShown: false }} />
        <Stack.Screen name="lists/new" options={{ headerShown: false }} />
        <Stack.Screen name="lists/[username]/[slug]" options={{ headerShown: false }} />
        <Stack.Screen name="activity" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="stats" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="review/[identifier]" options={{ headerShown: false }} />
        <Stack.Screen
          name="filters"
          options={{
            presentation: 'transparentModal',
            animation: 'slide_from_bottom',
            headerShown: false,
          }}
        />
        <Stack.Screen name="u/[uid]" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
      <ToastHost />
    </View>
  );
}

export default function RootLayout() {
  const [fontTimeout, setFontTimeout] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular: require('../assets/fonts/Inter_400Regular.ttf'),
    Inter_500Medium: require('../assets/fonts/Inter_500Medium.ttf'),
    Inter_600SemiBold: require('../assets/fonts/Inter_600SemiBold.ttf'),
    Inter_700Bold: require('../assets/fonts/Inter_700Bold.ttf'),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setFontTimeout(true);
      SplashScreen.hideAsync().catch(() => {});
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const isReady = fontsLoaded || Boolean(fontError) || fontTimeout;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
          <ThemeProvider>
            <RootNavigation />
          </ThemeProvider>
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
