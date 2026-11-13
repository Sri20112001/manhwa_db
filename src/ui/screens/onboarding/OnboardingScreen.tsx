import { useState } from 'react';
import { Linking, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, ExternalLink, Eye, EyeOff, Info, KeyRound, ShieldCheck } from '@/ui/icons';

import { useValidateKey } from '@/logic/hooks/useValidateKey';
import { LogoMark } from '@/ui/components/brand/LogoMark';
import { Button } from '@/ui/components/primitives/Button';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { Input } from '@/ui/components/primitives/Input';
import { ScreenScroll } from '@/ui/components/layout/Screen';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

const KEY_PORTAL_URL = 'https://pornhwadb.com/profile?tab=settings&section=developer';

const STEPS = [
  {
    title: 'Sign in on the website',
    description:
      'Use your email and password at pornhwadb.com. Your password is never entered in this app.',
  },
  {
    title: 'Create an API key',
    description:
      'Open Settings → Developer and create a key with catalogue:read, library:read and library:write.',
  },
  {
    title: 'Paste the key here',
    description: 'Your key starts with phdb_live_ and is stored securely on this device.',
  },
];

export function OnboardingScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { validate, isValidating, error, clearError } = useValidateKey();
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleValidate = async () => {
    if (!apiKey.trim()) return;
    const ok = await validate(apiKey.trim());
    if (ok) {
      router.replace('/(tabs)');
    }
  };

  const openKeyPortal = () => {
    void Linking.openURL(KEY_PORTAL_URL);
  };

  return (
    <ScreenScroll contentClassName="flex-1 justify-center px-lg py-xl">
      <View className="items-center gap-md">
        <LogoMark size={96} />
        <Text className="font-inter-bold text-display text-foreground">Pornhwa DB</Text>
        <View className="items-center gap-xs">
          <Text className="font-inter-bold text-h1 text-foreground">Connect your account</Text>
          <Text className="text-center text-body text-muted">
            The Pornhwa DB API uses key-based sign-in only. Sign in on the website once, create a
            key, then paste it below.
          </Text>
        </View>
      </View>

      <View className="mt-xl gap-sm">
        {STEPS.map((step, index) => (
          <View
            key={step.title}
            className="flex-row gap-md rounded-md border border-border bg-card p-md"
          >
            <View className="h-6 w-6 items-center justify-center rounded-full bg-elevated">
              <Text className="font-inter-semibold text-caption text-muted">{index + 1}</Text>
            </View>
            <View className="flex-1 gap-xs">
              <Text className="font-inter-semibold text-body text-foreground">{step.title}</Text>
              <Text className="text-caption text-muted">{step.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className="mt-lg gap-md">
        <Button
          label="Open Pornhwa DB to get a key"
          variant="outline"
          icon={ExternalLink}
          onPress={openKeyPortal}
          accessibilityHint="Opens the Pornhwa DB website where you can sign in and create an API key"
          fullWidth
        />

        <View className="gap-xs">
          <Text className="font-inter-semibold text-caption text-muted">API key</Text>
          <Input
            placeholder="phdb_live_................................"
            value={apiKey}
            onChangeText={(val) => {
              clearError();
              setApiKey(val);
            }}
            secureTextEntry={!showKey}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            mono
            leadingIcon={KeyRound}
            accessibilityLabel="API Key"
            trailing={
              <IconButton
                icon={showKey ? EyeOff : Eye}
                accessibilityLabel={showKey ? 'Hide API key' : 'Show API key'}
                onPress={() => setShowKey((v) => !v)}
                size={18}
              />
            }
          />
        </View>

        {error ? (
          <Text className="font-inter-semibold text-caption text-destructive">{error}</Text>
        ) : null}

        <Button
          label="Connect account"
          trailingIcon={ArrowRight}
          onPress={handleValidate}
          loading={isValidating}
          disabled={!apiKey.trim() || isValidating}
          fullWidth
        />

        <View className="flex-row flex-wrap justify-center gap-sm">
          {['catalogue:read', 'library:read', 'library:write'].map((scope) => (
            <View
              key={scope}
              className="flex-row items-center gap-xs rounded-full border border-border bg-card px-md py-xs"
            >
              <ShieldCheck size={14} color={colors.primary} />
              <Text className="font-inter-medium text-caption text-muted">{scope}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-2xl flex-row items-start justify-center gap-xs px-md">
        <Info size={14} color={colors.muted} style={{ marginTop: 2 }} />
        <Text className="flex-1 text-center text-[11px] text-muted">
          Email and password sign-in is only available on pornhwadb.com. The API has no login
          endpoint, so this app authenticates with your key alone.
        </Text>
      </View>
    </ScreenScroll>
  );
}
