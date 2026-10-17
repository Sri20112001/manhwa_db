# Pornhwa DB Mobile — Stitch screen prompts

Paste, in Stitch, with:
- **Project:** `Pornhwa DB Mobile` (`projects/2147885941899389447`)
- **Design system:** `Pornhwa DB AMOLED Rose` (`assets/17063748964261639105`)
- **Device:** `MOBILE`

Each prompt = **SHARED STYLE** + **LOGO** + **ICON-ONLY** + the screen block.
Build the first three once and reuse them verbatim.

> Note: Stitch cannot receive uploaded image assets, so the logo is described in words.
> The real vector files live in `design/logo/` and are what you ship in the app.

---

## SHARED STYLE (prepend to every prompt)

```
APP STYLE — "Pornhwa DB", a manga/webtoon database + reading-library app.
- Pure AMOLED background #000000. Intermediate surface #0B0B0B. Cards/panels #141414. Fine 1px borders #27272A (use borders, not shadows).
- Text: primary #FAFAFA, muted #A1A1AA. Single accent rose #9B3E64 (soft fill rgba(155,62,100,0.14), hover #903C5F). Status colors: Ongoing = rose soft; Completed = bg #DCFCE7 / text #15803D; Hiatus = bg #FEF3C7 / text #B45309.
- Font Inter throughout. Display 28, H1 24, H2 20, H3 16/600, body 16, caption 13.
- Radius: cards & chips 12px, sheets 24px, pills full.
- Sticky header: translucent glass rgba(0,0,0,0.6) with backdrop blur + 1px bottom border #27272A.
- Covers are 2:3 portrait, 12px radius, blurhash placeholder, 1px #27272A hairline.
- Placeholder cover art = neutral abstract gradients in muted rose/grey only. NO explicit, suggestive, or identifiable artwork.
- Quiet chrome, generous negative space. No ads, no upsell/promo popups, no age gate, no NSFW blur.
```

## LOGO (prepend to every prompt)

```
BRAND MARK — draw the custom "Pornhwa DB" mark exactly as follows: a #0B0B0B rounded-square (squircle) icon containing an abstract folded-scroll letter "P" in a rose gradient (#D76A93 → #9B3E64 → #6E2946): a thick vertical stem with a semicircular bowl curling to the right, three dark panel slots inside the bowl, and a small rose "database node" dot at the lower right. Use it at 28px in headers and 64-96px on auth/empty states. Never replace it with plain text.
```

## ICON-ONLY (prepend to every prompt)

```
UI MUST BE ICON-FIRST — do NOT rely on text labels:
- Bottom navigation: 5 large icons ONLY (Home, Browse/Search-catalogue, Search, Library, Profile). Active icon = rose #9B3E64 inside a soft rose pill; inactive = #A1A1AA. Numeric badge supported on Library. NO text labels under icons.
- Section headers: bold title on the left; a circular icon button (chevron-forward) on the right instead of a "View all" text link.
- Trailing actions, filters, sort, share, bookmark, favorite, rate = icon buttons.
- Use a Lucide-style stroke icon set at ~1.75px stroke. Provide accessibility labels only in code, not as visible text.
```

---

## 1. API Key Onboarding  ✅ generated
*(regenerate to add the logo mark)*

```
SCREEN: Auth / API key onboarding.
- Vertically centered content.
- BRAND MARK at 96px, then the wordmark "Pornhwa DB".
- H1 "Connect your account". Muted subtext: "Paste your API key to sync your reading library."
- Masked API key input: #141414, 12px radius, 1px #27272A border, monospace placeholder "phdb_live_................................", trailing eye icon toggle, rose focus ring.
- Full-width primary button rose #9B3E64 "Validate & continue" with a trailing arrow icon.
- Row of three scope chips below: "catalogue:read", "library:read", "library:write" (outline, muted, leading check/shield icon).
- Footer: muted underlined link "Get a key" with an external-link icon, and a tiny footnote.
- Top sticky glass header with a back icon only.
```

## 2. Home / Discover  ✅ generated

```
SCREEN: Home / Discover (top-level tab).
- Sticky glass header: BRAND MARK 28px on the left; icon buttons on the right (search, notifications with a dot badge).
- Horizontal scroll of genre pill chips (Action, Harem, Romance, Fantasy, Drama, College): outline #27272A, muted text; one active = rose fill.
- Stacked horizontal carousels, each ~3.5 cards wide, each with a section header (bold title + circular chevron icon button):
  "Top rated", "Trending now", "Fresh arrivals", "Recently updated", and "Random picks" (header includes a shuffle icon button).
- CoverCard: 2:3 cover; overlaid top-left status chip; small corner badge; below = rose star "★ 4.7" + muted count "(68)"; 2-line bold white title; 2 small muted tag chips.
- Bottom nav: 5 icons only (see ICON-ONLY), Home active.
```

## 3. Browse catalogue  ⏳ generating

```
SCREEN: Browse catalogue (2-column grid).
- Sticky glass header: rounded search field (#141414, placeholder "Search title, creator, or character...") with a trailing sliders/filter icon button in rose.
- Row of pill filter chips (On Going, Completed, Hiatus, Yaoi, Yuri) with the first active in rose; a trailing "Sort" chip with a chevron icon (icon + short word is fine here).
- 2-column grid, 12px gutters. CoverCard: 2:3 cover, status chip overlay, corner badge, 2-line title, muted creator line, rose star row + 2 tag chips.
- 2 skeleton cards at the bottom (shimmer bars on #141414).
- Bottom nav: Browse active.
```

## 4. Filter bottom sheet

```
SCREEN: Filter bottom sheet over a dimmed backdrop (rgba(0,0,0,0.6)) showing a blurred cover grid behind.
- Panel: #141414, 24px top corners, 1px #27272A border, drag handle.
- Header: "Filters" (bold) left; a "reset" icon button (rotate-ccw) on the right.
- "Status": pill chips (On Going, Completed, Hiatus), one active rose.
- "Orientation": segmented control Any / Yaoi / Yuri.
- "Tags" with an Any/All segmented toggle on the right and a wrap of tag chips (Action, Harem, Romance, Fantasy, Drama, Milf, College, Revenge, Netori, Office); several active in rose soft.
- "Rating": dual-handle range slider labelled "0.0 – 5.0" (rose).
- "Release year": dual-handle range slider "1995 – 2026".
- "Chapters": dual-handle range slider.
- Sticky footer: secondary outline "Cancel" + primary rose "Apply filters".
```

## 5. Search  ✅ generated

```
SCREEN: Search results.
- Sticky header: rounded search field with an active query and a clear (x) icon; "Cancel" text button.
- Segmented control: Series (active, rose) | Characters.
- "Recent searches" row of small chips with x icons.
- Results list — Series rows: 2:3 thumbnail, bold title, muted "by Creator", rose star + count, 2 tag chips.
- Characters section: section label + rows with a circular avatar, character name, muted "from Series Title".
- Bottom nav: Search active.
```

## 6. Series detail

```
SCREEN: Series detail.
- Collapsing header: blurred 2:3 cover backdrop with a dark gradient scrim; sharp cover thumbnail (2:3, 12px) bottom-left; to the right the title (24px bold, 2 lines), a row with status chip + muted "2021 · 191 chapters" + rose "★ 3.5 (53)".
- Floating icon buttons top-left (back) and top-right (share, bookmark).
- Action row of icon buttons on #141414 pills: track-status (list icon with a tiny chevron), "+1 chapter" (plus-square), favorite (heart, rose when active), rate (star).
- Tab bar: Info | Characters | Chapters | Reviews | Similar — Info active with a rose underline.
- Info tab: "Synopsis" heading + 3 lines muted text + rose "Read more"; "Creators" list; "Tags" wrap of rose-soft chips; "Links" external-link rows.
- Sticky bottom primary rose button "Add to library" (bookmark-plus icon).
```

## 7. Character detail

```
SCREEN: Character detail.
- Sticky glass header: back icon + bookmark icon.
- Hero: large circular character portrait (abstract placeholder), name (24px bold), muted "Appears in Secret Class", a row of alternative-name chips, rose star rating "★ 4.4 (12)" with a "Rate" pill.
- "Tags" wrap of rose-soft chips (Main, Female, Milf, College).
- "About": 3 lines of muted body text.
- "Reviews": 2 cards on #141414 (12px) — circular avatar, username, rose stars, 2-3 lines text, muted timestamp.
- Bottom: a "View series" row with a chevron icon.
```

## 8. Library

```
SCREEN: My Library (tracking list).
- Sticky glass header: title "Library" + icon buttons (search, sort, grid/list toggle).
- Segmented status tabs: Reading | Plan | Completed | On Hold | Dropped | Re-reading — horizontally scrollable, active = rose underline.
- Rows: 2:3 cover thumbnail (64x96) left; bold title; muted creator; a linear progress bar with "Ch 12 / 191" caption in rose; a status chip; a priority flag icon; trailing overflow (kebab) icon.
- Swipe affordance hint on one row (+1 chapter / rate icons revealed).
- An empty-state variant note at the bottom (no text label needed — glyph only).
- Bottom nav: Library active with a numeric badge.
```

## 9. Reader / Scene list

```
SCREEN: Reader / chapters & scenes.
- Sticky glass header: back icon, series title (single line, ellipsized), icon buttons for bookmark and settings (sliders).
- A "Continue reading" floating action button (play icon + "Continue") rose, bottom-right.
- Segmented control: Chapters | Scenes.
- Chapters list: rows with a big chapter number chip (rose soft), a range like "12 – 15", a muted description line, and 2-3 tag chips; a trailing chevron.
- Scenes grid variant: 3-column small 2:3 thumbnails with a corner chapter badge.
- Bottom nav: Library active.
```

## 10. Lists browse

```
SCREEN: Public lists.
- Sticky glass header: title "Lists" + search icon.
- Filter chips row: Trending | New | Most liked.
- Cards (full width, #141414, 12px radius): a 2x2 collage of four 2:3 covers on the left; on the right a bold title, a muted 2-line description, a row with like count (heart icon) + item count (layers icon), and the owner avatar + username. A small "public/private" lock icon where relevant.
```

## 11. List detail

```
SCREEN: A single public list.
- Collapsing header: 2x2 cover collage backdrop + scrim; title (24px bold), owner avatar + username, muted counts with heart icon + layers icon, a "collaborative" users icon chip.
- Sticky icon buttons: back, share, bookmark.
- Ordered item rows: a position number chip, 2:3 thumbnail, bold title, a muted note line ("My note…"), a status chip, trailing chevron.
- Sticky bottom row: primary rose "Like list" (heart icon) + secondary outline "Save".
```

## 12. Profile

```
SCREEN: Public user profile.
- Header: large circular avatar with a rose ring, username (H2), a muted "Member since 2021" line, a row of bio text (2 lines).
- Stat row: three tiles — Following / Followers / Contributions (big number + muted caption).
- Icon action row: follow (user-plus, rose when active), share, message.
- Tab bar: Tracking | Reviews | Ratings | Lists | Contributions (scrollable, rose underline active).
- Tracking tab: a 2-column compact cover grid with a small status chip on each.
```

## 13. Activity feed

```
SCREEN: Global activity feed.
- Sticky glass header: title "Activity" + a filter icon button.
- Reverse-chronological feed. Each row: circular actor avatar (32px) with a small type badge overlapping (star = rating, pencil = review, bookmark = status change, layers = list), the actor name in bold followed by muted action text, a muted relative timestamp, and a trailing small 2:3 target cover thumbnail with a hairline border.
- Group double rows with thin #27272A dividers.
```

## 14. Settings

```
SCREEN: Settings.
- Sticky glass header: title "Settings" + back icon only.
- Grouped sections as #141414 rounded cards with 1px #27272A borders and leading icons:
  "Account" — avatar, username, muted uid, chevron.
  "Appearance" — segmented Dark | AMOLED | Light, a text-size stepper.
  "API key" — masked key, key icon, a "revoke" icon button.
  "Cache" — current size + a clear (trash) icon button.
  "About" — version, GitHub icon link, external-link rows for Privacy and Terms.
- Note: NO NSFW toggle anywhere.
- Bottom nav: Profile active.
```

## 15. Stats / Leaderboard

```
SCREEN: Stats & leaderboard.
- Sticky glass header: title "Stats" + a period dropdown (icon + short label).
- Top: four stat tiles in a 2x2 grid (#141414, 12px) each with a small icon (book, users, star, layers), a big number, and a muted caption.
- "Leaderboard": ranked rows — a rank number chip (top 3 in rose), circular avatar, username, a muted contributions line, and a rose value on the right.
- A simple rose bar/line chart area below (no 3D, flat).
- Bottom nav: Profile active.
```
