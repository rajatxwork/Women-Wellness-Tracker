---
name: design-tokens
description: Use before writing or reviewing any UI code (components, pages, CSS) in this repo that touches color, radius, shadow, or font. Documents the actual CSS color tokens in src/app/globals.css and the flat, warm, black-accented visual language the app was redesigned around (see reference-images/mobile-ui-inspiration/).
---

# Design tokens

All color, radius, shadow, and font tokens live in `src/app/globals.css` as CSS
custom properties, re-exposed to Tailwind via `@theme inline`. Never hardcode
a hex value or introduce a new color in a component — use an existing token
class (`bg-*`, `text-*`, `border-*`) or add the token to `globals.css` first.
Recharts components can't read CSS vars, so `src/components/charts.tsx` keeps
its own hex constants in sync with these tokens by hand — update both places
together.

Dark mode is not just the light palette inverted — `body` gets an extra
dark-mode-only ambient radial-gradient wash (plum/terracotta/water at low
opacity, see the `:root[data-theme="dark"] body, .dark body` rule) so it
reads as colorful rather than a flat near-black canvas. Keep that if you
touch dark mode; don't collapse it back to a flat single color.

## Brand imagery

`src/lib/brand-assets.ts` holds URLs for generated brand imagery (logo mark,
hero background patterns, cycle-phase icons, empty-state illustration) —
Recraft V4.1 vector generations via the Higgsfield MCP, matched to these
exact token hex values. They're referenced by URL (Higgsfield's CDN), not
vendored into `/public`, because the sandbox this was built in blocks
outbound fetches to that CDN — confirmed for both `curl` and a Playwright
browser (`net::ERR_TUNNEL_CONNECTION_FAILED`), so the actual image content
was never visually verified end-to-end, only that the layout degrades
gracefully to the fallback background color when an image fails to load. If
you regenerate or need to self-host these, download each URL in
`brand-assets.ts` and swap the constant for a local `/brand/...` path.

## The visual language

The app was redesigned to match a set of mobile-UI references (flat, warm,
editorial), not the generic "AI app" look (soft purple gradients, frosted
glassmorphism, one repeated accent hue). Concretely:

- **Flat surfaces, no blur.** `.card-soft` is a solid `--color-surface` panel
  with a hairline border and a soft shadow — no `backdrop-filter`, no
  translucency. Don't reintroduce `backdrop-blur` or glow/gradient orbs
  (the old `auth-shell.tsx` had three blurred color blobs; it's now a single
  flat color band).
- **Real serif headlines.** `.font-serif-display` maps to Fraunces (a real
  serif), used for page/section headings via `--font-serif`. Body copy uses
  Inter via `--font-sans`. Don't reach for a generic sans for a "headline" —
  that was the previous bug (the token was literally named `--font-serif`
  but pointed at Manrope, a sans font).
- **Solid black as the confident neutral accent**, not another pastel.
  `Button`'s `primary` variant is `bg-ink text-cream`; the bottom nav
  (`BottomNav` in `nav.tsx`) is a floating solid-`ink` pill with the active
  icon inverted into a `cream` circle; the active `PillTabs` option and the
  active `Sidebar` link are the same `bg-ink text-cream` treatment. Reach for
  this, not a pastel token, for primary calls to action and "this is the
  selected/active one" states.
- **Each accent color is distinct and true to its name**, used for one
  semantic role rather than one hue reused everywhere at different
  opacities. Pick the token by role, not by "whatever's already used
  nearby":

| Token | Light hex | Role |
|---|---|---|
| `--color-terracotta` / `-deep` | `#d96b44` / `#b8502f` | primary link/highlight color, workout |
| `--color-blush` / `-deep` | `#fbd0d6` / `#d1546c` | cycle/period, default `PageHeading` accent |
| `--color-sage` / `-deep` | `#8fdda8` / `#2fae72` | nutrition, positive/settings |
| `--color-plum` | `#a87ce0` | library, rest days, habits |
| `--color-gold` | `#ffc670` | energy/highlight callouts |
| `--color-water` | `#5ec2f5` | hydration, cardio, progress |

  All of these are honestly named now — `terracotta` renders clay-orange,
  `blush` renders soft pink. (They didn't always: earlier in this project
  `terracotta`/`blush`/`cream` were purple/lavender hex values wearing warm
  names. If you see that mismatch again — a token's rendered color not
  matching its name — that's a regression, not a re-introduction of a past
  "feature.")
- **Neutrals are warm, not cool-tinted.** `cream`/`surface`/`ink`/`border`
  all sit on a warm ivory-to-brown-black scale (`#fbf8f1` → `#201c16` in
  light mode), not a blue- or purple-tinted gray scale.
- **Rounded-full pills** for tabs, nav, chips, day-selectors — not just
  `rounded-2xl` cards. `PillTabs` and both nav components already do this;
  match it for any new selector-style control.

Reference screenshots this direction was built from live in
`reference-images/mobile-ui-inspiration/` (gitignored, local only).

## Other non-color tokens

- Fonts: `--font-serif` (Fraunces, via `.font-serif-display` — headings) and `--font-sans` (Inter — body).
- Radius: `--radius-organic` (2rem), `--radius-organic-sm` (1.25rem).
- Shadows: `--shadow-soft`, `--shadow-softer` — warm near-black tinted (`rgba(32, 26, 16, ...)`) in light mode, black-tinted in dark mode. Not purple-tinted.

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
