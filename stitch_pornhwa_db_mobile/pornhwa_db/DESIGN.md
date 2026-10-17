---
name: Pornhwa DB
colors:
  surface: '#181214'
  surface-dim: '#181214'
  surface-bright: '#40373a'
  surface-container-lowest: '#130c0f'
  surface-container-low: '#211a1c'
  surface-container: '#251e20'
  surface-container-high: '#30282a'
  surface-container-highest: '#3b3335'
  on-surface: '#eddfe2'
  on-surface-variant: '#d9c0c6'
  inverse-surface: '#eddfe2'
  inverse-on-surface: '#362e31'
  outline: '#a18b91'
  outline-variant: '#544247'
  surface-tint: '#ffb0ca'
  primary: '#ffb0ca'
  on-primary: '#600c35'
  primary-container: '#9b3e64'
  on-primary-container: '#ffccdb'
  inverse-primary: '#9b3e64'
  secondary: '#e2bdc7'
  on-secondary: '#422a31'
  secondary-container: '#5a3f48'
  on-secondary-container: '#d0acb6'
  tertiary: '#e2bae4'
  on-tertiary: '#432647'
  tertiary-container: '#745378'
  on-tertiary-container: '#f5cbf6'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffd9e3'
  primary-fixed-dim: '#ffb0ca'
  on-primary-fixed: '#3e001f'
  on-primary-fixed-variant: '#7d264c'
  secondary-fixed: '#ffd9e3'
  secondary-fixed-dim: '#e2bdc7'
  on-secondary-fixed: '#2a151c'
  on-secondary-fixed-variant: '#5a3f48'
  tertiary-fixed: '#fed6ff'
  tertiary-fixed-dim: '#e2bae4'
  on-tertiary-fixed: '#2c1031'
  on-tertiary-fixed-variant: '#5b3c5f'
  background: '#181214'
  on-background: '#eddfe2'
  surface-variant: '#3b3335'
typography:
  display:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
  headline-lg:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: 2rem
  headline-md:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '700'
    lineHeight: 1.75rem
  headline-sm:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.5rem
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  caption:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.125rem
  overline:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 0.75rem
  gutter-mobile: 0.75rem
  gutter-tablet: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
---

# Pornhwa DB — Mobile Design System

## Concept
Dark-first, image-led catalogue and reading-library app for a manga/webtoon database. AMOLED pure-black base so 2:3 cover art is the hero and chrome stays quiet. Sticky glass header, pill filters, cover grids, bottom tab bar with badges.

## Palette (AMOLED dark — primary)
- background: #000000
- surface: #0b0b0b
- card / elevated: #141414
- border / divider: #27272a
- foreground: #fafafa
- muted foreground: #a1a1aa
- primary / accent: #9b3e64 (rose)
- primary hover: #903c5f
- primary soft: rgba(155,62,100,0.14)
- on-primary: #ffffff
- destructive: #dc2626
- success: #059669 / warning: #d97706 / info: #2563eb
- chart: pink #db2777, violet #7c3aed, blue #2563eb, green #059669, amber #d97706

## Status chips
- Completed: bg #dcfce7, text #15803d
- On Going: bg rgba(155,62,100,0.14), text #9b3e64
- Hiatus: bg #fef3c7, text #b45309

## Typography
- Family: Inter (headline + body + labels)
- display 28/700, h1 24/700, h2 20/700, h3 16/600, body 16/400, caption 13/400, overline 12/600 uppercase

## Shape & spacing
- radius: sm 6, md 12 (cards/chips), lg 16, xl 24, pills full
- spacing scale 4/8/12/16/24/32
- cover cards: 2:3 portrait aspect, 12px radius, grid gap 12-16
- sticky header: translucent glass (rgba(0,0,0,0.6)) with backdrop blur + 1px #27272a border

## Components
- CoverCard: 2:3 image, blurhash placeholder, corner badge, status chip, star rating, title (2 lines), +N tag chips
- PillChip filter row (On device / status / tags) — outline when inactive, rose fill when active
- Bottom tab bar: 5 items, icon + label, active = rose icon + soft pill, numeric badge support
- Floating action button (Continue / +1 chapter) in rose
- Segmented control, Sheet (filters), RatingStars, ProgressBar, Skeleton cards, EmptyState, Toast

## Style notes
- Reference: shadcn rose palette + Kotatsu AMOLED material shell
- Image-led: 2:3 covers, generous negative space, quiet chrome
- Placeholder cover art only — abstract/neutral, no explicit imagery
- No third-party ads or promo popups