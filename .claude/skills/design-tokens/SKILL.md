---
name: design-tokens
description: Use before writing or reviewing any UI code (components, pages, CSS) in this repo that touches color, radius, shadow, or font. Documents the actual CSS color tokens in src/app/globals.css, the no-purple pink/gold/white gradient brand system, and the flat black-accented visual language the app was redesigned around (see reference-images/).
---

# Design tokens

All color, radius, shadow, and font tokens live in `src/app/globals.css` as CSS
custom properties, re-exposed to Tailwind via `@theme inline`. Never hardcode
a hex value or introduce a new color in a component — use an existing token
class (`bg-*`, `text-*`, `border-*`) or add the token to `globals.css` first.
Recharts components can't read CSS vars, so `src/components/charts.tsx` keeps
its own hex constants in sync with these tokens by hand — update both places
together.

## Brand lockup and italic headings

`src/components/brand-lockup.tsx` (`BrandLockup`) is the flower + "Selene"
wordmark + tagline lockup — the wordmark is set in Instrument Serif
*italic*, whole word, not mixed within itself. Used large (`size="lg"`) as
a hero element on the dashboard and auth screens; don't confuse this with
the small `logoMark` + plain-upright "Selene" text pairing already in
`nav.tsx`'s sidebar/mobile header, which stays small and upright on
purpose (it's a nav-rail label, not a brand moment) — don't blow that one
up too or swap it to italic without being asked.

Elsewhere, the typographic voice is upright Instrument Serif with a
**single word inside a heading** switched to italic for emphasis — not the
whole heading, and not applied to every heading on every page. Established
examples: the cycle page's "Your *cycle*" and the dashboard greeting's
"Hi, *{name}*". Use `<em className="italic">word</em>` for this (not a
whole-heading `italic` class). Keep it to headings where one word is
naturally the emotional/personal focus (a page's subject, a person's
name) — resist italicizing every page title just for consistency; the
instruction behind this pattern was explicitly "use it tastefully."

**Never put a `dark:brightness-*`/`dark:saturate-*`/`dark:contrast-*` filter
on `BRAND_ASSETS.logoMark` or `flowerBackground`.** This was tried once (to
stop the flower's pastel colors reading as washed-out against a dark
background) and reverted after it broke `AuthShell`: `dark:*` utilities key
off the `.dark` class on `<html>`, which is completely independent of the
`.force-light` CSS-variable override below — so the filter kept firing
inside the forced-light auth screens (where `.dark` is still present even
though the colors are forced light) and blew the logo out to a washed
ghost-white blob. Explicit standing instruction since: the logo renders
exactly as the source file, everywhere, in both themes, no filters, no
adjustments — full stop.

`AuthShell` forces light mode via the `.force-light` class in
`globals.css` regardless of the visitor's OS/system theme — auth screens
have no theme toggle and are a first-impression branding moment, so they
never go dark, even if the rest of the app does for that same visitor.
Don't remove `.force-light` from `AuthShell`'s root thinking it's dead
code; it's the fix for a real "why is my login page black" complaint. But
remember it only overrides the color token *values* — it does not remove
the `.dark` class itself, so any `dark:` Tailwind variant (filters,
otherwise) still matches inside it. That mismatch is exactly what caused
the logo bug above; keep it in mind before adding any other `dark:` utility
inside `AuthShell`.

## No purple, ever

This is an explicit, standing product rule, not a one-time cleanup: **no hue
in the purple/violet family anywhere in this app.** There used to be a
`--color-plum` token; it's gone, renamed and recolored to `--color-rose`
(`#c2577a`, a deep dusty rose — solidly in the pink/red family). If you need
a fourth accent alongside terracotta/sage/gold, reach for `rose`, not a new
purple. Grep for `plum` or `purple` before considering a color change done.

## Core brand colors: white, pink gradient, gold

The dominant visual identity — hero panels, the auth screen band, the
dashboard/cycle hero, and the `card-soft` top-edge wash — is a soft grainy
gradient from pink through cream to warm gold, drawn from
`reference-images/background/`. Two CSS gradient custom properties carry
this:

- `--gradient-hero`: `linear-gradient(165deg, #ffd6e2 0%, #fff1e0 55%, #fffaf2 100%)` — pink → cream, for calmer panels.
- `--gradient-glow`: `radial-gradient(circle at 50% 20%, #ffe9b8 0%, #ffd2de 48%, #fff9f1 100%)` — gold-centered radial glow, for the cycle hero.

**Always use the CSS gradient as the real, load-bearing background** (via
`style={{ backgroundImage: 'var(--gradient-hero)' }}` or layered under a
generated image — see below). Don't replace it with a flat solid color; the
gradient *is* the brand now, not a decorative extra.

`.card-soft` bakes a subtle version of this in: a light blush tint at the
top of every card fading to flat `--color-surface` by ~55% down, done with
`color-mix()` so it auto-adapts to dark mode. Keep it subtle — this app's
own author flagged legibility as a priority when this was introduced, so
don't deepen the tint or extend it further down a card without checking
text contrast stays fine.

Functional/semantic accents (`sage` = nutrition, `water` = hydration/cardio,
`terracotta` = workout/primary links, `gold` = energy, `rose` = library/rest)
still exist for category differentiation and are not being folded into the
pink/gold brand wash — those serve a real "which category is this" UX
purpose independent of the overall brand identity.

## Brand imagery

`src/lib/brand-assets.ts` holds URLs for generated brand imagery — a logo
mark, an empty-state illustration, four cycle-phase icons (Recraft V4.1,
vector), and four grain-gradient background photos matching the core brand
gradient (`gpt_image_2_5`) — all via the Higgsfield MCP. They're referenced
by URL (Higgsfield's CDN), not vendored into `/public`, because the sandbox
this was built in blocks outbound fetches to that CDN — confirmed for both
`curl` and a Playwright browser (`net::ERR_TUNNEL_CONNECTION_FAILED`), so the
actual image content was never visually verified end-to-end from this
sandbox. If you regenerate or need to self-host these, download each URL in
`brand-assets.ts` and swap the constant for a local `/brand/...` path.

Because of that unverifiable-image risk, every place a generated background
image is used layers it *on top of* the CSS gradient in the same
`background-image` value — `url(...), var(--gradient-hero)` — so the CSS
gradient is what actually renders if the image never loads. Never use a
generated background image without that CSS gradient fallback underneath it.

**Exception — the flower mark is local, not remote.** `BRAND_ASSETS.logoMark`
(`/brand/flower-mark-icon.png`) and `flowerBackground`
(`/brand/flower-mark-bg.webp`) are real files in `public/brand/`, not
external URLs — a Midjourney image supplied directly in chat, with its
white background removed locally via a Pillow script (not Higgsfield's
`remove_background`, which needs the image already in Higgsfield's media
pipeline; this image never was). Read `public/brand/` via git history for
the exact extraction approach if redoing this for another image: naive
"alpha from distance-to-white, then unpremultiply" corrupts colors when the
source has pastel/light content that's legitimately part of the subject
(as this flower's pale center glow was) — treat that as a real risk on any
similar cutout, not a one-off bug. Because these are local files, they're
the one part of brand imagery that *was* visually verified in this sandbox
(Playwright screenshot, composited against multiple background colors to
confirm the cutout).

The flower source image is 2000×1506 (ratio ≈1.33:1, not square). Never
size it with equal fixed height/width classes (e.g. `h-7 w-7`) — that
silently stretches it. Use a fixed height with `w-auto` (small icon use,
see `nav.tsx`) or `object-contain` within a fixed box (see the cycle page's
badge, which swaps between this and square phase icons in the same slot).

## The visual language

The app was redesigned to match a set of mobile-UI references (flat, warm,
editorial, premium pink/gold gradients), not the generic "AI app" look (blue
or purple gradients, frosted glassmorphism, one repeated accent hue).
Concretely:

- **No purple.** See above — this is the rule most likely to regress.
- **Flat surfaces, no blur.** `.card-soft` has a hairline border and a soft
  shadow — no `backdrop-filter`, no translucency. Don't reintroduce
  `backdrop-blur` or glow/gradient orbs as decorative blobs (the old
  `auth-shell.tsx` briefly had three blurred color blobs; that pattern is
  gone — the current gradient band is a real brand element, not a blob).
- **Real serif headlines, self-hosted.** `.font-serif-display` maps to
  Instrument Serif (the header/hero typeface) via `--font-serif`. Body copy
  is Cygre Book via `--font-sans`. Both are self-hosted licensed `.ttf`
  files in `src/app/fonts/` (not pulled from Google Fonts or any CDN),
  loaded with `next/font/local` in `layout.tsx` — this was a deliberate
  switch off Google Fonts once real font files were available, so don't
  reintroduce a `next/font/google` import for either of these. Instrument
  Serif ships only a 400 weight — never set `font-weight` above 400 on it,
  the browser will fake-bold instead of rendering a real cut. Cygre Book is
  also a single weight ("Book"); `font-medium`/`font-semibold` on body text
  render as browser-synthesized bold, which is an accepted tradeoff (only
  the Book weight was supplied) rather than a bug to fix.
- **Solid black as the confident neutral accent**, not another pastel.
  `Button`'s `primary` variant is `bg-ink text-cream`; the bottom nav
  (`BottomNav` in `nav.tsx`) is a floating solid-`ink` pill with the active
  icon inverted into a `cream` circle; the active `PillTabs` option and the
  active `Sidebar` link are the same `bg-ink text-cream` treatment. Reach for
  this, not a pastel token, for primary calls to action and "this is the
  selected/active one" states.
- **Each functional accent color is distinct and true to its name**, used
  for one semantic role rather than one hue reused everywhere at different
  opacities:

| Token | Light hex | Role |
|---|---|---|
| `--color-terracotta` / `-deep` | `#d96b44` / `#b8502f` | primary link/highlight color, workout |
| `--color-blush` / `-deep` | `#fbd0d6` / `#d1546c` | cycle/period, core brand gradient, default `PageHeading` accent |
| `--color-sage` / `-deep` | `#8fdda8` / `#2fae72` | nutrition, positive/settings |
| `--color-rose` | `#c2577a` | library, rest days, habits — replaces the old purple `plum` token |
| `--color-gold` | `#ffc670` | energy/highlight callouts, core brand gradient |
| `--color-water` | `#5ec2f5` | hydration, cardio, progress |

  All of these are honestly named — `terracotta` renders clay-orange,
  `blush` renders soft pink, `rose` renders pink, not purple. If a token's
  rendered color ever stops matching its name, that's a regression.
- **Neutrals are warm, not cool-tinted.** `cream`/`surface`/`ink`/`border`
  all sit on a warm ivory-to-brown-black scale (`#fbf8f1` → `#201c16` in
  light mode), not a blue- or purple-tinted gray scale.
- **Rounded-full pills** for tabs, nav, chips, day-selectors — not just
  `rounded-2xl` cards.

Dark mode is not the light palette inverted — `body` gets an extra
dark-mode-only ambient radial-gradient wash (blush/gold/rose at low opacity,
see `:root[data-theme="dark"] body, .dark body`) so large surfaces read as
colorful rather than a flat near-black canvas. Keep that if you touch dark
mode; don't collapse it back to a flat single color, and keep it in the
pink/gold/rose family, not the old terracotta/water/plum mix.

Reference screenshots this direction was built from live in
`reference-images/` — `mobile-ui-inspiration/` (flat editorial UI patterns),
`cycle-reference/` (cycle-tracker layout), and `background/` (the grain
gradients the core brand colors are drawn from).

## Other non-color tokens

- Fonts: `--font-serif` (Instrument Serif, via `.font-serif-display` — headings, weight 400 only) and `--font-sans` (Cygre Book — body, weight 400/"Book" only). Both self-hosted from `src/app/fonts/`, see above.
- Radius: `--radius-organic` (2rem), `--radius-organic-sm` (1.25rem).
- Shadows: `--shadow-soft`, `--shadow-softer` — warm near-black tinted (`rgba(32, 26, 16, ...)`) in light mode, black-tinted in dark mode.

## Usage frequency (as of this writing, `src/components` + `src/app`)

Most-used: `text-ink` (137), `text-ink-soft` (108), `text-ink-faint` (94),
`border-border` (89), `text-terracotta-deep` (67), `bg-surface-soft` (49),
`bg-cream-soft` (29), `border-terracotta` (26), `bg-surface` (23),
`bg-terracotta` (21), `bg-sage-deep` (16), `bg-blush` (11).

`ink`/`ink-soft`/`ink-faint` are the text-color scale (dark→light emphasis).
`surface`/`surface-soft` are card/panel backgrounds; `cream`/`cream-soft` are
page backgrounds. Both light and dark variants are always defined together —
when adding a new token, add it to both the `:root` block and the
`:root[data-theme="dark"], .dark` block, plus the `@theme inline` mapping.
