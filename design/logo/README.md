# Pornhwa DB — Logo

Custom wordmark and marks designed for the mobile client.

## Concept
A **folded-scroll "P"** — the stem is a webtoon/manhwa panel strip, the bowl curls like a
page peeling back, the three dark slots read as stacked panels, and the rose node at the
lower right is a **database dot**. Together: "scrolling panels + database".

## Files
| File | Use |
| --- | --- |
| `pornhwa-db-mark.svg` | App icon / primary mark (light-on-dark, rose gradient) |
| `pornhwa-db-mark-mono.svg` | Single-colour mark (`#FAFAFA`) for tints, favicons, loaders |
| `pornhwa-db-lockup.svg` | Horizontal lockup (mark + "Pornhwa DATABASE") |

## Colors
| Token | Value |
| --- | --- |
| Rose (primary) | `#9B3E64` |
| Rose light | `#D76A93` |
| Rose deep | `#6E2946` |
| Ink (icon bg) | `#0B0B0B` |
| Border | `#27272A` |
| Foreground | `#FAFAFA` |

## Clear space & sizes
- Keep clear space equal to **25% of the mark width** on all sides.
- App icon: **1024×1024** master (squircle radius = 22% of width).
- In-app mark: **28px** in headers, **64–96px** on onboarding/auth.

## React Native usage
```tsx
import { SvgXml } from 'react-native-svg';
import { readFileSync } from 'fs';
// or convert to a react-native-svg component with `npx svgr`
```

> Note: Stitch cannot receive uploaded assets, so the prompts in
> `../SCREEN_PROMPTS.md` describe this mark in words. The SVGs here are the real
> assets to ship in the app.
