import { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import {
  ArrowLeft,
  Check,
  ExternalLink,
  HardDrive,
  KeyRound,
  LogOut,
  Trash2,
} from '@/ui/icons';

import { clearCache } from '@/api/cache';
import { disconnectAccount } from '@/logic/usecases/connectAccount';
import { useRootStore } from '@/logic/store';
import { useSafeBack } from '@/shared/lib/navigation';
import type { AccentColor, TextSize, ThemeMode } from '@/shared/types/filters';
import { Avatar } from '@/ui/components/primitives/Avatar';
import { GlassHeader } from '@/ui/components/layout/GlassHeader';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { Screen } from '@/ui/components/layout/Screen';
import { Segmented } from '@/ui/components/primitives/Segmented';
import { useThemeColors } from '@/ui/theme/ThemeProvider';
import { ACCENT_PALETTES } from '@/ui/theme/tokens';

export function SettingsScreen() {
  const { goBack, router } = useSafeBack();
  const colors = useThemeColors();

  const uid = useRootStore((state) => state.uid);
  const username = useRootStore((state) => state.username);
  const themeMode = useRootStore((state) => state.themeMode);
  const textSize = useRootStore((state) => state.textSize);
  const accentColor = useRootStore((state) => state.accentColor);
  const setThemeMode = useRootStore((state) => state.setThemeMode);
  const setTextSize = useRootStore((state) => state.setTextSize);
  const setAccentColor = useRootStore((state) => state.setAccentColor);

  const [cacheSize, setCacheSize] = useState('12.4 MB');

  const handleClearCache = () => {
    clearCache();
    setCacheSize('0 KB');
    Alert.alert('Cache Cleared', 'HTTP and image cache have been reset.');
  };

  const handleRevokeKey = () => {
    Alert.alert('Disconnect Account', 'Are you sure you want to disconnect and clear your API key?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Disconnect',
        style: 'destructive',
        onPress: async () => {
          await disconnectAccount();
          router.replace('/(auth)/onboarding');
        },
      },
    ]);
  };

  return (
    <Screen edges={['top']}>
      <GlassHeader
        edge={false}
        left={
          <IconButton
            icon={ArrowLeft}
            accessibilityLabel="Back"
            onPress={goBack}
          />
        }
        title="Settings"
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-xl p-lg pb-3xl">
        {/* Account Section */}
        <View className="gap-sm">
          <Text className="text-caption font-inter-semibold text-muted">ACCOUNT</Text>
          <View className="gap-md rounded-md border border-border bg-card p-md">
            <View className="flex-row items-center gap-md">
              <Avatar name={username ?? 'User'} size={48} />
              <View className="flex-1">
                <Text className="text-body font-inter-semibold text-foreground">
                  {username ?? 'Connected User'}
                </Text>
                <Text className="text-caption text-muted">ID: {uid ?? 'local'}</Text>
              </View>
            </View>

            <View className="h-px bg-border" />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Disconnect account"
              onPress={handleRevokeKey}
              className="flex-row items-center justify-between py-xs active:opacity-70"
            >
              <View className="flex-row items-center gap-sm">
                <LogOut size={18} color={colors.destructive} />
                <Text className="text-body font-inter-semibold text-destructive">
                  Disconnect Account
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Appearance Section */}
        <View className="gap-sm">
          <Text className="text-caption font-inter-semibold text-muted">APPEARANCE</Text>
          <View className="gap-md rounded-md border border-border bg-card p-md">
            <View className="gap-xs">
              <Text className="text-body font-inter-semibold text-foreground">Theme mode</Text>
              <Segmented
                options={[
                  { label: 'Dark', value: 'dark' },
                  { label: 'AMOLED', value: 'amoled' },
                  { label: 'Light', value: 'light' },
                ]}
                value={themeMode}
                onChange={(val) => setThemeMode(val as ThemeMode)}
              />
            </View>

            <View className="h-px bg-border" />

            <View className="gap-sm">
              <View className="flex-row items-center justify-between">
                <Text className="text-body font-inter-semibold text-foreground">Accent color</Text>
                <Text className="text-caption font-inter-medium text-muted">
                  {ACCENT_PALETTES[accentColor]?.label ?? accentColor}
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-sm">
                {(Object.keys(ACCENT_PALETTES) as AccentColor[]).map((key) => {
                  const palette = ACCENT_PALETTES[key];
                  const isSelected = accentColor === key;
                  return (
                    <Pressable
                      key={key}
                      onPress={() => setAccentColor(key)}
                      accessibilityRole="button"
                      accessibilityLabel={`Accent color ${palette.label}`}
                      accessibilityState={{ selected: isSelected }}
                      className={`min-w-[30%] flex-1 flex-row items-center gap-xs rounded-md border p-sm active:opacity-75 ${
                        isSelected ? 'border-primary bg-primary-soft' : 'border-border bg-surface'
                      }`}
                    >
                      <View
                        className="h-5 w-5 items-center justify-center rounded-full"
                        style={{ backgroundColor: palette.primary }}
                      >
                        {isSelected ? <Check size={12} color={colors.onPrimary} strokeWidth={3} /> : null}
                      </View>
                      <Text
                        className={`text-caption font-inter-medium ${
                          isSelected ? 'font-inter-semibold text-foreground' : 'text-muted'
                        }`}
                        numberOfLines={1}
                      >
                        {palette.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="h-px bg-border" />

            <View className="gap-xs">
              <Text className="text-body font-inter-semibold text-foreground">Text size</Text>
              <Segmented
                options={[
                  { label: 'Compact', value: 'compact' },
                  { label: 'Default', value: 'default' },
                  { label: 'Large', value: 'large' },
                ]}
                value={textSize}
                onChange={(val) => setTextSize(val as TextSize)}
              />
            </View>
          </View>
        </View>

        {/* API Key & Security */}
        <View className="gap-sm">
          <Text className="text-caption font-inter-semibold text-muted">SECURITY & API KEY</Text>
          <View className="flex-row items-center justify-between rounded-md border border-border bg-card p-md">
            <View className="flex-row items-center gap-md">
              <KeyRound size={20} color={colors.primary} />
              <View>
                <Text className="text-body font-inter-semibold text-foreground">Personal API Key</Text>
                <Text className="text-caption font-inter-mono text-muted">phdb_live_••••••••••••</Text>
              </View>
            </View>
            <IconButton
              icon={Trash2}
              accessibilityLabel="Revoke API key"
              onPress={handleRevokeKey}
              variant="surface"
              size={18}
            />
          </View>
        </View>

        {/* Storage & Cache */}
        <View className="gap-sm">
          <Text className="text-caption font-inter-semibold text-muted">STORAGE & CACHE</Text>
          <View className="flex-row items-center justify-between rounded-md border border-border bg-card p-md">
            <View className="flex-row items-center gap-md">
              <HardDrive size={20} color={colors.primary} />
              <View>
                <Text className="text-body font-inter-semibold text-foreground">Cached Data</Text>
                <Text className="text-caption text-muted">{cacheSize}</Text>
              </View>
            </View>
            <IconButton
              icon={Trash2}
              accessibilityLabel="Clear cached data"
              onPress={handleClearCache}
              variant="surface"
              size={18}
            />
          </View>
        </View>

        {/* About Section */}
        <View className="gap-sm">
          <Text className="text-caption font-inter-semibold text-muted">ABOUT</Text>
          <View className="gap-md rounded-md border border-border bg-card p-md">
            <View className="flex-row items-center justify-between">
              <Text className="text-body text-foreground">App Version</Text>
              <Text className="text-caption font-inter-mono text-muted">v1.0.0 (SDK 54)</Text>
            </View>

            <View className="h-px bg-border" />

            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Pornhwa DB Website"
              onPress={() => void Linking.openURL('https://pornhwadb.com')}
              className="flex-row items-center justify-between active:opacity-70"
            >
              <Text className="text-body text-foreground">Official Website</Text>
              <ExternalLink size={16} color={colors.muted} />
            </Pressable>

            <View className="h-px bg-border" />

            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Privacy Policy"
              onPress={() => void Linking.openURL('https://pornhwadb.com/privacy')}
              className="flex-row items-center justify-between active:opacity-70"
            >
              <Text className="text-body text-foreground">Privacy Policy</Text>
              <ExternalLink size={16} color={colors.muted} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
