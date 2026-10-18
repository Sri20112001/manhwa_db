import type { AccentColor } from '@/shared/types/filters';

export interface ColorTokens {
  background: string;
  surface: string;
  card: string;
  elevated: string;
  border: string;
  foreground: string;
  muted: string;
  primary: string;
  primaryHover: string;
  primarySoft: string;
  onPrimary: string;
  destructive: string;
  success: string;
  warning: string;
  info: string;
  ring: string;
}

export interface StatusTokens {
  ongoing: { bg: string; text: string };
  completed: { bg: string; text: string };
  hiatus: { bg: string; text: string };
}

export const darkColors: ColorTokens = {
  background: '#000000',
  surface: '#0B0B0B',
  card: '#141414',
  elevated: '#1C1C1F',
  border: '#27272A',
  foreground: '#FAFAFA',
  muted: '#A1A1AA',
  primary: '#9B3E64',
  primaryHover: '#903C5F',
  primarySoft: 'rgba(155,62,100,0.14)',
  onPrimary: '#FFFFFF',
  destructive: '#DC2626',
  success: '#059669',
  warning: '#D97706',
  info: '#2563EB',
  ring: '#9B3E64',
};

export const amoledColors: ColorTokens = {
  ...darkColors,
  surface: '#000000',
  card: '#0A0A0A',
  elevated: '#171719',
};

export const lightColors: ColorTokens = {
  background: '#FAF1F3',
  surface: '#FFF7F9',
  card: '#FFFAFB',
  elevated: '#F0E0E5',
  border: '#E2CDD4',
  foreground: '#422D38',
  muted: '#795568',
  primary: '#9B3E64',
  primaryHover: '#903C5F',
  primarySoft: 'rgba(155,62,100,0.10)',
  onPrimary: '#FFFFFF',
  destructive: '#DC2626',
  success: '#059669',
  warning: '#D97706',
  info: '#2563EB',
  ring: '#9B3E64',
};

export const statusTokens: StatusTokens = {
  ongoing: { bg: 'rgba(155,62,100,0.14)', text: '#9B3E64' },
  completed: { bg: '#DCFCE7', text: '#15803D' },
  hiatus: { bg: '#FEF3C7', text: '#B45309' },
};

export const radius = { sm: 6, md: 12, lg: 16, xl: 24, pill: 999 } as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32 } as const;

export const type = {
  display: { size: 28, weight: '700', lineHeight: 36 },
  h1: { size: 24, weight: '700', lineHeight: 32 },
  h2: { size: 20, weight: '700', lineHeight: 28 },
  h3: { size: 16, weight: '600', lineHeight: 24 },
  body: { size: 16, weight: '400', lineHeight: 24 },
  caption: { size: 13, weight: '400', lineHeight: 18 },
  overline: { size: 12, weight: '600', lineHeight: 16, letterSpacing: 0.6 },
} as const;

export const cover = { aspectRatio: 2 / 3, radius: 12, gap: 12 } as const;

export const icons = { stroke: 1.75, size: { nav: 26, action: 22, inline: 18 } } as const;

/** Alias kept for components that read icon geometry from the token module. */
export const iconTokens = icons;

export const glass = { background: 'rgba(0,0,0,0.6)' } as const;

export const ACCENT_PALETTES: Record<
  AccentColor,
  { primary: string; primaryHover: string; primarySoft: string; label: string }
> = {
  rose: {
    label: 'Rose',
    primary: '#9B3E64',
    primaryHover: '#903C5F',
    primarySoft: 'rgba(155,62,100,0.14)',
  },
  violet: {
    label: 'Violet',
    primary: '#8B5CF6',
    primaryHover: '#7C3AED',
    primarySoft: 'rgba(139,92,246,0.16)',
  },
  sapphire: {
    label: 'Sapphire',
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    primarySoft: 'rgba(37,99,235,0.16)',
  },
  emerald: {
    label: 'Emerald',
    primary: '#10B981',
    primaryHover: '#059669',
    primarySoft: 'rgba(16,185,129,0.16)',
  },
  amber: {
    label: 'Amber',
    primary: '#F59E0B',
    primaryHover: '#D97706',
    primarySoft: 'rgba(245,158,11,0.16)',
  },
  crimson: {
    label: 'Crimson',
    primary: '#E11D48',
    primaryHover: '#BE123C',
    primarySoft: 'rgba(225,29,72,0.16)',
  },
};

export function getColorsWithAccent(mode: 'dark' | 'amoled' | 'light', accent: AccentColor = 'rose'): ColorTokens {
  const base = colorModes[mode];
  const palette = ACCENT_PALETTES[accent] ?? ACCENT_PALETTES.rose;
  return {
    ...base,
    primary: palette.primary,
    primaryHover: palette.primaryHover,
    primarySoft: palette.primarySoft,
    ring: palette.primary,
  };
}

export const colorModes = { dark: darkColors, amoled: amoledColors, light: lightColors } as const;

export const brand = {
  roseLight: '#D76A93',
  rose: '#9B3E64',
  roseDeep: '#6E2946',
  ink: '#0B0B0B',
  border: '#27272A',
  foreground: '#FAFAFA',
} as const;

export function hexToChannels(hex: string): string {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;
  const int = Number.parseInt(value, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `${r} ${g} ${b}`;
}
