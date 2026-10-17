import { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, ExternalLink, Eye, EyeOff, ShieldCheck } from '@/ui/icons';

import { useValidateKey } from '@/logic/hooks/useValidateKey';
import { LogoMark } from '@/ui/components/brand/LogoMark';
import { Button } from '@/ui/components/primitives/Button';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { Input } from '@/ui/components/primitives/Input';
import { ScreenScroll } from '@/ui/components/layout/Screen';
import { useThemeColors } from '@/ui/theme/ThemeProvider';

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
    void Linking.openURL('https://pornhwadb.com/settings/api-keys');
  };

  return (
    <ScreenScroll contentClassName="flex-1 justify-center px-lg py-xl">
      <View className="items-center gap-md">
        <LogoMark size={96} />
        <Text className="text-display font-inter-bold text-foreground">Pornhwa DB</Text>
        <View className="items-center gap-xs">
          <Text className="text-h1 font-inter-bold text-foreground">Connect your account</Text>
          <Text className="text-center text-body text-muted">
            Paste your API key to sync your reading library.
          </Text>
        </View>
      </View>

      <View className="mt-xl gap-md">
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
          mono
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

        {error ? (
          <Text className="text-caption font-inter-semibold text-destructive">{error}</Text>
        ) : null}

        <Button
          label="Validate & continue"
          trailingIcon={ArrowRight}
          onPress={handleValidate}
          loading={isValidating}
          disabled={!apiKey.trim() || isValidating}
          fullWidth
        />

        <View className="mt-sm flex-row flex-wrap justify-center gap-sm">
          {['catalogue:read', 'library:read', 'library:write'].map((scope) => (
            <View
              key={scope}
              className="flex-row items-center gap-xs rounded-full border border-border bg-card px-md py-xs"
            >
              <ShieldCheck size={14} color={colors.primary} />
              <Text className="text-caption font-inter-medium text-muted">{scope}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-2xl items-center gap-xs">
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Get an API key"
          onPress={openKeyPortal}
          className="flex-row items-center gap-xs active:opacity-70"
        >
          <Text className="text-body text-muted underline">Get a key</Text>
          <ExternalLink size={14} color={colors.muted} />
        </Pressable>
        <Text className="text-center text-[11px] text-muted">
          Your key is stored securely on device and never shared.
        </Text>
      </View>
    </ScreenScroll>
  );
}
