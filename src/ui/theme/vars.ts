import { vars } from 'nativewind';

import type { AccentColor, ThemeMode } from '@/shared/types/filters';

import { getColorsWithAccent, hexToChannels, statusTokens } from './tokens';

type Vars = Record<string, string>;

export function buildThemeVars(mode: ThemeMode, accent: AccentColor = 'rose'): Vars {
  const colors = getColorsWithAccent(mode, accent);
  const ongoing = statusTokens.ongoing;
  return vars({
    '--background': hexToChannels(colors.background),
    '--surface': hexToChannels(colors.surface),
    '--card': hexToChannels(colors.card),
    '--elevated': hexToChannels(colors.elevated),
    '--border': hexToChannels(colors.border),
    '--foreground': hexToChannels(colors.foreground),
    '--muted': hexToChannels(colors.muted),
    '--primary': hexToChannels(colors.primary),
    '--primary-hover': hexToChannels(colors.primaryHover),
    '--primary-soft': colors.primarySoft,
    '--on-primary': hexToChannels(colors.onPrimary),
    '--destructive': hexToChannels(colors.destructive),
    '--success': hexToChannels(colors.success),
    '--warning': hexToChannels(colors.warning),
    '--info': hexToChannels(colors.info),
    '--ring': hexToChannels(colors.ring),
    '--status-ongoing-bg': ongoing.bg,
    '--status-ongoing-text': hexToChannels(ongoing.text),
    '--status-completed-bg': hexToChannels(statusTokens.completed.bg),
    '--status-completed-text': hexToChannels(statusTokens.completed.text),
    '--status-hiatus-bg': hexToChannels(statusTokens.hiatus.bg),
    '--status-hiatus-text': hexToChannels(statusTokens.hiatus.text),
  });
}

export const themeVars: Record<ThemeMode, Vars> = {
  dark: buildThemeVars('dark', 'rose'),
  amoled: buildThemeVars('amoled', 'rose'),
  light: buildThemeVars('light', 'rose'),
};
