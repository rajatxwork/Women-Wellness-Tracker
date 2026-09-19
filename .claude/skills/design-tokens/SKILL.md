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
- **Real serif headlines.** `.font-serif-display` maps to Fraunces (a real
  serif), used for page/section headings via `--font-serif`. Body copy uses
  Inter via `--font-sans`.
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

- Fonts: `--font-serif` (Fraunces, via `.font-serif-display` — headings) and `--font-sans` (Inter — body).
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
