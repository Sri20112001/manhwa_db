# BUILD INSTRUCTIONS — Pornhwa DB Mobile

> **You are an AI coding agent. Your job is to build the complete mobile application described
> in this document, from an empty folder to a working release build.**
> Work **milestone by milestone** (M0 → M5). Do not skip ahead. After each milestone, run the
> app and verify its exit criteria before continuing. If something is ambiguous, prefer the
> decisions in this document over your own; only ask the user when a decision is genuinely absent.

---

## 1. OBJECTIVE

Build **Pornhwa DB Mobile**: a dark-first, image-led catalogue + reading-library client for the
**Pornhwa DB API** (`https://pornhwadb.com/api/v1`). The app lets a user authenticate with a
personal API key, browse a manhwa/webtoon catalogue, search, view series & character details,
manage a reading library with offline support, browse/social lists & activity, view profile &
stats, and write reviews/ratings.

The app is styled from an existing **Stitch design export**. A custom **logo** already exists as
SVG. Both are provided in this workspace and are the visual source of truth.

---

## 2. HARD CONSTRAINTS & NON-GOALS

- **Target:** Expo **SDK 54**, managed workflow, **TypeScript**, **expo-router**.
- **HTTP:** **axios** (do NOT use bare `fetch` for app data).
- **Styling:** **NativeWind v4** (+ Tailwind) only. No inline hex colors in components.
- **State:** **Zustand for all client/UI/session/draft state.**
- **Architecture:** strictly separate **API / LOGIC / UI** layers (see §5).
- **Offline:** persisted query cache + persisted write queue are required.
- **Types:** generated with **openapi-typescript** from the live spec.
- **NON-GOALS (do not implement):**
  - ❌ No Kotatsu, no manga scraper/parser integration, no external sources. The app is
    **pornhwadb-only** and uses the documented REST API exclusively.
  - ❌ No age-verification / age-gate screen.
  - ❌ No NSFW blur toggle or blur anywhere.
  - ❌ No ads, no upsell/promo popups, no third-party trackers.
  - ❌ No web-platform support; mobile (iOS + Android) only.

---

## 3. WORKSPACE & INPUTS

- **Create the project at:** `D:\Pugal.Sri Ganesh\Programs\Test\pornhwa-db-mobile\`
- **Design reference (layout/interaction source):**
  `D:\Pugal.Sri Ganesh\Programs\Test\stitch_pornhwa_db_mobile\`
  - Each screen folder contains `code.html` (Tailwind HTML mockup) and `screen.png`.
  - `stitch_pornhwa_db_mobile\pornhwa_db\DESIGN.md` = the design system notes.
- **Canonical design tokens:** `D:\Pugal.Sri Ganesh\Programs\Test\design\tokens.json`
- **Logo (ship these):** `D:\Pugal.Sri Ganesh\Programs\Test\design\logo\`
  - `pornhwa-db-mark.svg` (primary), `pornhwa-db-mark-mono.svg`, `pornhwa-db-lockup.svg`, `README.md`
- **Screen prompts (original intent):** `D:\Pugal.Sri Ganesh\Programs\Test\design\SCREEN_PROMPTS.md`
- **API spec:** `https://pornhwadb.com/openapi.yaml` (OpenAPI 3.0.3, v1.3.0)

### IMPORTANT — reading the design export
The Stitch HTML is built on **Material-3 tokens**, which **differ** from our canonical AMOLED
tokens. **`design/tokens.json` is authoritative for color.** Use the Stitch HTML only for **layout,
spacing, component composition, and interaction**. Apply this mapping everywhere:

| Stitch class (M3) | App semantic token |
|---|---|
| `bg-background` `#181214` | `bg-background` → `#000000` |
| `surface-container-low` `#211a1c` | `bg-surface` → `#0B0B0B` |
| `surface-container` `#251e20` / `surface-container-high` `#30282a` | `bg-card` `#141414` / `bg-elevated` `#1C1C1F` |
| `outline-variant` `#544247` | `border-border` → `#27272A` |
| `on-surface` `#eddfe2` | `text-foreground` → `#FAFAFA` |
| `on-surface-variant` `#d9c0c6` | `text-muted` → `#A1A1AA` |
| `primary-container` `#9b3e64` | `bg-primary` → `#9B3E64` |
| `primary` `#ffb0ca` | `text-primary-accent` |
| `error` `#ffb4ab` | `text-destructive` → `#DC2626` |
| `Material Symbols` icons | **Lucide** (`lucide-react-native`), ~1.75 stroke |
| remote `lh3.googleusercontent.com` artwork | discard → real covers via `expo-image` |

Also: the export uses `darkMode: "class"` and `html.dark`. We instead drive theme from
`design/tokens.json` maps (light/dark/amoled) applied through NativeWind `vars()`.

---

## 4. TECH STACK (exact)

Create with:
```
npx create-expo-app@latest pornhwa-db-mobile --template expo-template-blank-typescript
```

Runtime deps (install with `npx expo install` where an Expo config exists, else `npm i`):
- `expo` (SDK 54), `expo-router`, `expo-secure-store`, `expo-image`, `expo-font`,
  `expo-constants`, `expo-linking`, `expo-status-bar`, `expo-haptics`
- `react-native`, `react`, `react-native-safe-area-context`, `react-native-screens`,
  `react-native-svg`, `react-native-reanimated`, `react-native-gesture-handler`
- `@react-native-async-storage/async-storage`
- `@shopify/flash-list`
- `axios`
- `@tanstack/react-query`, `@tanstack/react-query-persist-client`,
  `@tanstack/query-async-storage-persister`
- `zustand`
- `nativewind`, `tailwindcss`
- `lucide-react-native`
- `date-fns`
- `zod`, `react-hook-form`, `@hookform/resolvers`

Dev deps:
- `openapi-typescript`, `typescript`, `eslint`, `prettier`

Config files to author:
- `babel.config.js` (add `nativewind/babel`), `metro.config.js` (`withNativeWind`),
  `tailwind.config.js`, `global.css`, `tsconfig.json` (path alias `@/* → src/*`),
  `app.config.ts`, `.env.example`, `.eslintrc`, `.prettierrc`.

Environment:
- `EXPO_PUBLIC_API_BASE_URL=https://pornhwadb.com/api/v1` (in `.env`, documented in `.env.example`).
- The **API key is NEVER bundled**. It is entered by the user at runtime and stored in
  `expo-secure-store`.

---

## 5. ARCHITECTURE — THREE PILLARS (mandatory)

**Dependency rule:** `ui → logic → api → shared`. Never the reverse.
- `api` = transport + schema + endpoint functions. **No React, no state.**
- `logic` = Zustand stores, TanStack Query hooks, mappers, use-cases. **No JSX/components.**
- `ui` = components + screen views + theme. **Presentational only** (consumes hooks/props).
- `shared` = framework-agnostic utils/constants/types usable by `api` and `logic`.

`app/` (expo-router) is **routing only**: each route file renders a view from `ui/screens/*`
and wires hooks from `logic/hooks/*`. No business logic in routes.

### Folder structure (create exactly)

```
pornhwa-db-mobile/
├── app/
│   ├── _layout.tsx
│   ├── +not-found.tsx
│   ├── (auth)/onboarding.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── browse.tsx
│   │   ├── search.tsx
│   │   ├── library.tsx
│   │   └── profile.tsx
│   ├── pornhwa/[slug].tsx
│   ├── character/[id].tsx
│   ├── reader/[slug].tsx
│   ├── lists/index.tsx
│   ├── lists/new.tsx
│   ├── lists/[username]/[slug].tsx
│   ├── activity.tsx
│   ├── notifications.tsx
│   ├── stats.tsx
│   ├── settings.tsx
│   ├── review/[identifier].tsx
│   ├── filters.tsx
│   └── u/[uid].tsx
├── src/
│   ├── api/
│   │   ├── client.ts
│   │   ├── envelope.ts
│   │   ├── errors.ts
│   │   ├── throttle.ts
│   │   ├── cache.ts
│   │   ├── schema.d.ts
│   │   └── endpoints/{meta,health,catalogue,discover,tags,search,characters,creators,lists,tracking,users,activity,stats,reviews}.ts
│   ├── logic/
│   │   ├── store/{index,auth.slice,settings.slice,browseFilters.slice,search.slice,libraryUi.slice,listEditor.slice,reviewEditor.slice,readerPrefs.slice,notifications.slice,toast.slice}.ts
│   │   ├── query/{keys,client,persistence,mutations.queue}.ts
│   │   ├── hooks/{useDiscover,useBrowse,useSearch,useSeries,useCharacter,useChapters,useLibrary,useTrackingMutations,useLists,useListEditor,useProfile,useActivity,useStats,useReviewEditor,useValidateKey}.ts
│   │   ├── mappers/{pornhwa,chapter,character,list,activity,profile,stats}.ts
│   │   └── usecases/{connectAccount,queueTrackingWrite,resolveSearch}.ts
│   ├── ui/
│   │   ├── theme/{tokens,vars,ThemeProvider}.tsx
│   │   ├── components/
│   │   │   ├── primitives/{Button,Input,Sheet,Segmented,Chip,Slider,Switch,Avatar,Badge,Tabs,Divider,IconButton}.tsx
│   │   │   ├── cover/{CoverCard,CoverGrid,CoverThumb,Collage}.tsx
│   │   │   ├── layout/{Screen,GlassHeader,SectionHeader,ScrollRow,Row}.tsx
│   │   │   ├── feedback/{Skeleton,EmptyState,ErrorState,Toast,Spinner}.tsx
│   │   │   ├── brand/{LogoMark,LogoLockup}.tsx
│   │   │   └── domain/{StatusChip,RatingStars,ProgressBar,RankChip,ChapterRow,TrackingRow,ActivityRow,StatTile}.tsx
│   │   ├── screens/{onboarding,discover,browse,search,series,character,reader,library,lists,profile,activity,notifications,stats,settings,review}/
│   │   └── icons.ts
│   ├── shared/
│   │   ├── lib/{secure,storage,format,images,rateLimit,result}.ts
│   │   ├── constants/{config,query,status,caps}.ts
│   │   └── types/{models,filters}.ts
│   └── ...
├── assets/{logo,fonts,images}/
├── global.css
├── tailwind.config.js
├── babel.config.js
├── metro.config.js
├── tsconfig.json
├── app.config.ts
├── .env.example
└── package.json
```

---

## 6. API REFERENCE (must implement exactly)

**Base:** `https://pornhwadb.com/api/v1`
**Auth header:** `X-API-Key: <key>`
**Scopes:** `catalogue:read`, `library:read`, `library:write`
**Public (no key):** `GET /`, `GET /health`

### Response envelopes
- `Paginated<T>` → `{ data: T[], pagination, requestId }`
- `Single<T>` → `{ data: T, requestId }`
- `SearchResult` → nested `{ pornhwa: [...], characters: [...] }` with **independent pagination**
- `pagination` fields: `page, limit, total, totalPages, hasMore, nextUrl, prevUrl, firstUrl, lastUrl, truncated`

### Caps / limits
- `limit` ≤ **100** (default 20); `page` ≤ **1000** (`/search` ≤ **100**)
- `/pornhwa/batch` ≤ **50** ids; `/discover/random` count ≤ **10**
- Reads ≈ **100 req/min**; Writes **30/min** AND **500/hr** → `429 MUTATION_RATE_LIMITED` with `Retry-After`

### Caching
- Send `If-None-Match` with stored `ETag`; handle **304** as cache-hit.
- Respect `Cache-Control` (e.g. `private, max-age=60`).
- `/me/tracking` is `no-store` → always refetch when online.

### Endpoints (group by module)
- **meta:** `GET /`
- **health:** `GET /health`
- **catalogue:** `GET /pornhwa`, `GET /pornhwa/{slug}`, `GET /pornhwa/batch`,
  `GET /pornhwa/{slug}/chapters`, `GET /pornhwa/{slug}/characters`,
  `GET /pornhwa/{slug}/ratings`, `GET /pornhwa/{slug}/reviews`, `GET /pornhwa/{slug}/similar`
- **discover:** `GET /discover/trending`, `/discover/top-rated`, `/discover/recently-updated`,
  `/discover/new`, `/discover/random`
- **tags:** `GET /tags`, `/tags/{type}`, `/tags/available`
- **search:** `GET /search`, `GET /chapters/search`; `GET /chapters/tags`, `/chapters/tag/{tag}`
- **characters:** `GET /characters`, `GET /characters/{id}`, `GET /chapters/{id}`,
  `GET /character-ratings/{characterId}`, `GET /character-reviews/{characterId}`
- **creators:** `GET /creators`, `GET /creators/{id}`
- **lists:** `GET /lists`, `GET /lists/{username}/{slug}` + create/update/delete (write)
- **tracking:** `GET /me/tracking`, `GET /me/tracking/{identifier}` (+ `PUT`/`DELETE`),
  `PUT /me/tracking/{identifier}/rating`, `PUT/DELETE /me/tracking/{identifier}/favorite`,
  `POST /me/tracking/{identifier}/actions/mark-completed`,
  `POST /me/tracking/{identifier}/actions/start-rereading`,
  `POST /me/tracking/{identifier}/actions/increment-chapter`
- **users:** `GET /me`, `/me/ratings`, `/me/favorites`,
  `GET /u/{uid}/profile`, `/ratings`, `/reviews`, `/character-ratings`, `/character-reviews`,
  `/tracking`, `/lists`, `/contributions`, `/followers`, `/following`
- **activity:** `GET /activity`
- **stats:** `GET /stats`, `GET /stats/leaderboard`
- **reviews:** `POST/PATCH/DELETE /reviews`, `POST/DELETE /ratings`

### API layer implementation rules
- `client.ts`: `axios.create({ baseURL, timeout: 15000 })`.
  - **Request interceptor:** inject `X-API-Key` (read once from SecureStore, cached in memory);
    attach `If-None-Match` from the ETag store.
  - **Response interceptor:** unwrap envelopes; store new `ETag`; on **304** return the cached
    payload; on **429** throw `RateLimitError` carrying `Retry-After`; on **401** throw
    `AuthError` (the app clears the key and returns to onboarding); otherwise normalize to
    `ApiError`.
- `throttle.ts`: token buckets — reads 100/min; writes 30/min and 500/hr. All write endpoints
  pass through `shared/lib/rateLimit.ts`. On 429, back off using `Retry-After`.
- `endpoints/*`: thin typed functions returning DTOs (typed from `schema.d.ts`). No state.
- `envelope.ts`: discriminated-union helpers to distinguish `Paginated` / `Single` / `SearchResult`.

---

## 7. LOGIC LAYER

### Zustand (all client state) — root store + slices
Single root store composed of slices, persisted with `persist` + AsyncStorage:
- `auth` — `hasKey`, `uid`, `scopes`, `isValidating`
- `settings` — `themeMode: 'dark'|'amoled'|'light'`, `textSize`, `cacheSize`, misc prefs
- `browseFilters` — status/orientation/tags/ratingRange/yearRange/chapterRange/sort draft
- `search` — `query`, `segment: 'series'|'characters'`, `recentSearches[]`
- `libraryUi` — `activeStatusTab`, `sort`, `viewMode`
- `listEditor` — create/edit list draft (title, description, item ids, visibility)
- `reviewEditor` — review text + rating draft per identifier
- `readerPrefs` — reading prefs (e.g. last position, list/grid)
- `notifications` — read/unread state for the updates tray
- `toast` — transient toast queue

> Server entities stay in **TanStack Query** (correct tool). Mutating actions live in slices and
> call query mutations from `logic/query`.

### Query layer
- `query/keys.ts` — one query-key factory for every domain (single source of truth).
- `query/client.ts` — `QueryClient` + `PersistQueryClientProvider` with AsyncStorage persister
  (offline cache). Set sensible `staleTime`/`gcTime` per domain in `shared/constants/query.ts`.
- Infinite queries for catalogue/search/lists.
- `query/mutations.queue.ts` — a **persisted FIFO write queue** with replay + exponential
  backoff; respects write caps; used by tracking/review/rating/list mutations (optimistic UI).

### Mappers & use-cases
- `mappers/*` convert API DTOs → `shared/types/models.ts` domain models (keep UI decoupled).
- `usecases/connectAccount.ts` — validate key via `/health`, persist to SecureStore, hydrate store,
  navigate into `(tabs)`.
- `usecases/queueTrackingWrite.ts` — enqueue a tracking write with optimistic update.
- `usecases/resolveSearch.ts` — fan out `/search` series+characters with independent pagination.

---

## 8. UI LAYER

### Theme
- Port `design/tokens.json` → `ui/theme/tokens.ts`.
- `ui/theme/vars.ts` maps tokens to CSS variables for `light`, `dark`, `amoled`.
- `global.css` defines `:root`, `.dark`, `.amoled` variable blocks.
- `tailwind.config.js` maps **semantic** names to those variables:
  `background, surface, card, elevated, border, foreground, muted, primary, primary-hover,
  primary-soft, on-primary, destructive, success, warning, info, ring, status-{ongoing,completed,hiatus}`.
- `ThemeProvider` switches mode using NativeWind `vars()`; default = **dark/amoled**.
- **No raw hex in components** — only semantic classes (e.g. `bg-background text-foreground
  bg-primary border-border`).

### Design tokens (canonical)
```
Dark/AMOLED: bg #000000, surface #0B0B0B, card #141414, elevated #1C1C1F, border #27272A,
             fg #FAFAFA, muted #A1A1AA, primary #9B3E64, primaryHover #903C5F,
             primarySoft rgba(155,62,100,0.14), onPrimary #FFFFFF, destructive #DC2626,
             success #059669, warning #D97706, info #2563EB
Light: bg #FAF1F3, surface #FFF7F9, card #FFFAFB, elevated #F0E0E5, border #E2CDD4,
       fg #422D38, muted #795568, primary #9B3E64
Status chips: ongoing = primarySoft/#9B3E64; completed = #DCFCE7/#15803D; hiatus = #FEF3C7/#B45309
Radius: sm 6, md 12, lg 16, xl 24, pill 999
Space: 4/8/12/16/24/32
Type: Inter — display 28/700, h1 24/700, h2 20/700, h3 16/600, body 16/400,
      caption 13/400, overline 12/600 (0.6 letterSpacing)
Cover: 2:3, radius 12, gap 12; placeholder = blurhash (neutral rose/grey, never explicit art)
Icons: Lucide, stroke 1.75, sizes nav 26 / action 22 / inline 18
```

### Component inventory (build these)
- **primitives:** Button, Input, Sheet, Segmented, Chip/PillChip, Slider (dual-handle), Switch,
  Avatar, Badge, Tabs, Divider, IconButton
- **cover:** CoverCard (2:3, status chip overlay, corner badge, 2-line title, creator line,
  rose stars + count, tag chips), CoverGrid, CoverThumb, Collage (2×2)
- **layout:** Screen, GlassHeader (translucent `rgba(0,0,0,0.6)` + backdrop blur + 1px bottom
  border), SectionHeader (bold title + circular chevron IconButton — no "View all" text),
  ScrollRow, Row
- **feedback:** Skeleton (shimmer on card), EmptyState (glyph only), ErrorState, Toast, Spinner
- **brand:** LogoMark, LogoLockup (render the provided SVGs via `react-native-svg`)
- **domain:** StatusChip, RatingStars, ProgressBar, RankChip, ChapterRow, TrackingRow,
  ActivityRow, StatTile

### UI rules
- **Icon-first / icon-only**: bottom tab bar = 5 **icons only**, no text labels. Section headers
  use a circular chevron icon button. Trailing actions are icon buttons.
- Accessibility labels live in **code** (`accessibilityLabel`), never as visible text.
- Glass sticky headers on all scroll screens.
- Never render explicit/suggestive artwork; only blurhash placeholders and real remote covers.

---

## 9. ROUTES ↔ SCREENS ↔ ENDPOINTS

| Route | Screen | Endpoints |
|---|---|---|
| `(auth)/onboarding` | API Key Onboarding | `GET /health` (validate) |
| `(tabs)/index` | Home / Discover | `/discover/trending·top-rated·recently-updated·new·random` |
| `(tabs)/browse` | Browse catalogue | `/pornhwa`, `/tags`, `/tags/available` |
| `filters` (modal) | Filter bottom sheet | `/tags/{type}` (options) |
| `(tabs)/search` | Search | `/search`, `/chapters/search` |
| `pornhwa/[slug]` | Series detail | `/pornhwa/{slug}`, `/chapters`, `/characters`, `/ratings`, `/reviews`, `/similar`, `/creators/{id}` |
| `character/[id]` | Character detail | `/characters/{id}`, `/character-ratings|reviews/{id}` |
| `reader/[slug]` | Reader / chapter list | `/pornhwa/{slug}/chapters`, `/chapters/{id}`, `/chapters/tags` |
| `(tabs)/library` | Library | `/me/tracking` + tracking mutations |
| `lists/index` | Public lists | `/lists` |
| `lists/new` | Create custom list | `POST /lists` |
| `lists/[username]/[slug]` | List detail | `/lists/{username}/{slug}` + like/save |
| `u/[uid]` | Public profile | `/u/{uid}/*` |
| `(tabs)/profile` | My profile / entry | `/me`, `/me/ratings`, `/me/favorites` |
| `activity` | Activity feed | `/activity` |
| `notifications` | Updates tray | `/activity` (derived) |
| `stats` | Stats & leaderboard | `/stats`, `/stats/leaderboard` |
| `settings` | Settings | `/`, `/health` |
| `review/[identifier]` | Write/edit review & rating | `/reviews`, `/ratings`, `/me/tracking/{id}/rating` |

### Screen build notes (from the Stitch export)
- **Onboarding:** centered brand mark 96px + "Pornhwa DB" wordmark; H1 "Connect your account";
  masked API-key input (monospace `phdb_live_…`, eye toggle, rose focus ring); primary
  "Validate & continue"; three scope chips; "Get a key" footer link.
- **Home/Discover:** glass header (logo 28px; search + notifications icons); genre pill row;
  stacked horizontal carousels — "Top rated", "Trending now", "Fresh arrivals",
  "Recently updated", "Random picks" (shuffle icon) — each with SectionHeader.
- **Browse:** search field + filter icon; pill filters (On Going/Completed/Hiatus/Yaoi/Yuri) +
  Sort chip; 2-column grid of CoverCards; skeleton cards at the end.
- **Filter sheet:** #141414 panel, 24px top corners, drag handle; Status pills; Orientation
  segmented (Any/Yaoi/Yuri); Tags wrap + Any/All toggle; Rating / Release-year / Chapters
  dual-range sliders; sticky footer Cancel + Apply.
- **Search:** search field with clear + Cancel; segmented Series|Characters; recent-search chips;
  series rows + character rows.
- **Series detail:** collapsing blurred backdrop + scrim; sharp 2:3 cover thumb; title + status
  chip + "2021 · 191 chapters" + rose stars; floating back/share/bookmark; action row
  (track-status, +1 chapter, favorite, rate); tabs Info|Characters|Chapters|Reviews|Similar;
  Info = synopsis/creators/tags/links; sticky "Add to library".
- **Character detail:** hero circular portrait + name + "Appears in …" + alt-name chips + stars +
  Rate pill; Tags; About; Reviews cards; "View series" row.
- **Library:** glass header + search/sort/grid-list icons; scrollable status tabs
  (Reading|Plan|Completed|On Hold|Dropped|Re-reading); rows = 64×96 thumb, title, creator,
  progress bar + "Ch 12 / 191", status chip, priority flag, kebab; swipe reveal (+1/rate);
  numeric badge on tab.
- **Reader:** glass header (back, series title, bookmark, sliders); "Continue reading" FAB;
  segmented Chapters|Scenes; chapter rows (number chip, "12 – 15", description, tags, chevron);
  scenes = 3-col thumbs with chapter badge.
- **Lists browse:** header + search; filter chips Trending|New|Most liked; full-width cards with
  2×2 collage, title, description, likes/layers counts, owner avatar.
- **List detail:** collapsing collage header + scrim; title, owner, counts, collaborative chip;
  ordered rows (position chip, thumb, title, note, status, chevron); sticky Like + Save.
- **Profile:** avatar with rose ring, username, "Member since …", bio; stat row
  (Following/Followers/Contributions); follow/share/message icons; tabs
  Tracking|Reviews|Ratings|Lists|Contributions; tracking = 2-col compact grid.
- **Activity:** header + filter icon; reverse-chronological rows (actor avatar 32px + type badge,
  bold name + muted action, relative time, trailing 2:3 target thumb).
- **Notifications:** updates tray built from `/activity` + `notifications` store read-state.
- **Settings:** grouped #141414 cards — Account, Appearance (Dark|AMOLED|Light + text-size
  stepper), API key (masked + revoke), Cache (size + clear), About. **No NSFW toggle.**
- **Stats:** period dropdown; 4 stat tiles (2×2); leaderboard rows (rank chip, avatar, username,
  contributions, rose value); flat rose bar/line chart.

---

## 10. CONVENTIONS

- **TypeScript strict**; no `any` in app code (use `unknown` + narrowing). Type all API DTOs from
  `schema.d.ts`, and map to domain models.
- **Naming:** components `PascalCase.tsx`; hooks `useThing.ts`; stores `*.slice.ts`; utils
  `camelCase.ts`.
- **Imports:** use `@/` alias (`@/api/...`, `@/logic/...`, `@/ui/...`, `@/shared/...`).
- **No comments** unless a non-obvious "why" needs explaining.
- **Formatting:** Prettier; ESLint clean before each milestone is done.
- **Error/empty/loading** states for every data surface (Skeleton, EmptyState, ErrorState).
- **Accessibility:** every icon button gets `accessibilityLabel` + `accessibilityRole`.
- Do not introduce a library that is not listed in §4 without asking.

---

## 11. MILESTONES (build in order; verify exit criteria)

**M0 — Foundation**
Setup Expo 54 project, NativeWind, expo-router, Inter fonts, logo, axios client + interceptors +
throttle + ETag, theme system, `openapi-typescript` codegen, root providers, Zustand root store,
and the onboarding flow via `connectAccount` (`/health`).
*Exit:* app boots → onboarding; a valid key unlocks `(tabs)`; theme (dark/amoled/light) switches;
`npm run lint` + `tsc --noEmit` clean.

**M1 — Catalogue (read-only)**
Discover (5 carousels), Browse grid, Filter sheet, Search (Series/Characters), Series detail,
Character detail. FlashList + expo-image + skeletons/empty/error.
*Exit:* all catalogue screens navigate and render live API data; empty/error states verified.

**M2 — Library & offline**
Library screen, tracking mutations (status/track, favorite, rate, +1 chapter, actions),
persisted write queue with backoff, ETag revalidation, tab badge.
*Exit:* toggling offline then performing a tracking action queues it and replays on reconnect.

**M3 — Social**
Lists (browse/detail/create), Profile, Activity feed, Notifications tray, Stats/Leaderboard.
*Exit:* all listed screens functional with live data.

**M4 — Authoring**
Write/edit review + rating flow (react-hook-form + zod, optimistic + queued writes).
*Exit:* create/edit/delete review and rating; reflected in library & series detail.

**M5 — Settings & polish**
Settings screen, a11y pass (icon-only labels), performance pass (FlashList tuning, image cache),
offline cache hardening, EAS release build config.
*Exit:* release build succeeds; Lighthouse-equivalent manual perf check passes; no console errors.

---

## 12. ACCEPTANCE CRITERIA (done = all true)

1. Project builds and runs on iOS + Android (Expo SDK 54), no red-box errors.
2. Onboarding validates a real key against `/health` and stores it in SecureStore.
3. Every route in §9 renders its screen with live API data and has loading/empty/error states.
4. Reads and writes respect the documented caps; 429 handling with `Retry-After` backoff works.
5. Offline: catalogue/library readable from cache; queued writes replay on reconnect.
6. Theme supports dark, amoled, light; no raw hex in components; tokens from `tokens.json`.
7. Three-pillar separation holds: `api` has no React; `logic` has no JSX; routes are thin.
8. Zustand owns all client state; server state lives in TanStack Query.
9. No Kotatsu/scraper code anywhere; no age gate; no NSFW blur; no ads.
10. `lint` and `tsc --noEmit` pass.

---

## 13. START

Begin with **M0**. Scaffold the project at `pornhwa-db-mobile\`, install §4 deps, author the
config files, port the tokens + logo, run `openapi-typescript`, then implement the API layer and
onboarding. Report progress at each milestone exit with the commands you ran to verify.
