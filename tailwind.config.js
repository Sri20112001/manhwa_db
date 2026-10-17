/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        elevated: 'rgb(var(--elevated) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'primary-hover': 'rgb(var(--primary-hover) / <alpha-value>)',
        'primary-soft': 'var(--primary-soft)',
        'on-primary': 'rgb(var(--on-primary) / <alpha-value>)',
        destructive: 'rgb(var(--destructive) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        info: 'rgb(var(--info) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        status: {
          ongoing: {
            bg: 'var(--status-ongoing-bg)',
            text: 'rgb(var(--status-ongoing-text) / <alpha-value>)',
          },
          completed: {
            bg: 'rgb(var(--status-completed-bg) / <alpha-value>)',
            text: 'rgb(var(--status-completed-text) / <alpha-value>)',
          },
          hiatus: {
            bg: 'rgb(var(--status-hiatus-bg) / <alpha-value>)',
            text: 'rgb(var(--status-hiatus-text) / <alpha-value>)',
          },
        },
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        pill: '999px',
      },
      fontSize: {
        display: ['28px', { lineHeight: '36px' }],
        h1: ['24px', { lineHeight: '32px' }],
        h2: ['20px', { lineHeight: '28px' }],
        h3: ['16px', { lineHeight: '24px' }],
        body: ['16px', { lineHeight: '24px' }],
        caption: ['13px', { lineHeight: '18px' }],
        overline: ['12px', { lineHeight: '16px', letterSpacing: '0.6px' }],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
      },
      fontFamily: {
        sans: ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
      },
    },
  },
  plugins: [],
};
