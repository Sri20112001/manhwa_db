import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Pornhwa DB',
  slug: 'pornhwa-db-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'pornhwadb',
  userInterfaceStyle: 'dark',
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.pornhwadb.mobile',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: 'com.pornhwadb.mobile',
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#000000',
    },
  },
  web: {
    bundler: 'metro',
    output: 'single',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#000000',
      },
    ],
    [
      'expo-font',
      {
        fonts: [
          './assets/fonts/Inter_400Regular.ttf',
          './assets/fonts/Inter_500Medium.ttf',
          './assets/fonts/Inter_600SemiBold.ttf',
          './assets/fonts/Inter_700Bold.ttf',
        ],
      },
    ],
  ],
  experiments: {
    typedRoutes: false,
  },
  updates: {
    enabled: false,
    checkAutomatically: 'NEVER',
  },
  extra: {
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://pornhwadb.com/api/v1',
    ...(process.env.EAS_PROJECT_ID
      ? {
          eas: {
            projectId: process.env.EAS_PROJECT_ID,
          },
        }
      : {}),
  },
});
