---
name: design-tokens
description: Use before writing or reviewing any UI code (components, pages, CSS) in this repo that touches color, radius, shadow, or font. Documents the actual CSS color tokens in src/app/globals.css and flags a naming trap — several tokens are named after warm/earthy colors but render as purple/violet.
---

# Design tokens

All color, radius, shadow, and font tokens live in `src/app/globals.css` as CSS
custom properties, re-exposed to Tailwind via `@theme inline`. Never hardcode
a hex value or introduce a new color in a component — use an existing token
class (`bg-*`, `text-*`, `border-*`) or add the token to `globals.css` first.

## The naming trap: these are not the colors their names say

The token names describe a warm/earthy palette (terracotta, blush, cream,
sage), but the actual hex values for `terracotta` and `blush` are **purple /
violet**, not clay-orange or pink. Don't infer a token's rendered color from
its name — check the hex below, or render it, before using it.

| Token | Light hex | What the name suggests | What it actually is |
|---|---|---|---|
| `--color-terracotta` | `#6c5ce8` | burnt orange / clay | **purple/indigo** |
| `--color-terracotta-deep` | `#5642d6` | deeper burnt orange | **deeper purple** |
| `--color-blush` | `#ddccf7` | soft pink | **light lavender** |
| `--color-blush-deep` | `#c3a8ef` | deeper pink | **deeper lavender** |
| `--color-cream` | `#f4f2fb` | warm off-white | pale lavender-white (has a cool/purple cast) |
| `--color-cream-soft` | `#eae6f7` | warm off-white | pale lavender-white |
| `--color-sage` | `#6be0ac` | muted green | actually green, name matches |
| `--color-sage-deep` | `#33c78b` | deeper muted green | actually green, name matches |
| `--color-plum` | `#b17ae8` | plum/purple | purple, name matches |
| `--color-gold` | `#ffb26b` | gold/amber | actually gold, name matches |
| `--color-water` | `#55b6f2` | blue | actually blue, name matches |

Dark mode (`:root[data-theme="dark"], .dark`) shifts these further toward
saturated purple (e.g. `--color-terracotta: #8b7bff`).

**Practical implication:** `text-terracotta-deep` is the single most-used
accent color in this codebase (67 uses) and every one of those is rendering
purple, not terracotta/orange. If you're asked to add an "orange" or
"terracotta-colored" accent, do not reach for `terracotta-deep` — it will
render purple. Either use `--color-gold` (the one token that actually is
warm/amber) or ask whether the token itself should be renamed/recolored.

If you're asked to fix or discuss "the purple problem" in this app: this
mismatch — CSS variables named for a warm palette but implemented in
violet/lavender hex values — is very likely what's being referred to. The
fix is one of:
1. Rename the tokens to match reality (`terracotta` → `violet`/`indigo`, `blush` → `lavender`), updating every `bg-terracotta*`/`text-terracotta*`/`border-terracotta*`/`bg-blush*` usage across the codebase, or
2. Recolor the hex values to actually be terracotta/blush, which changes the app's visual identity everywhere those tokens are used (very high blast radius: 67+ call sites for `terracotta-deep` alone).
Don't do either silently — this is a product decision, confirm with the user before a repo-wide rename or recolor.

## Other non-color tokens

- Fonts: `--font-serif` (Manrope, via `.font-serif-display` utility — headings) and `--font-sans` (Inter — body).
- Radius: `--radius-organic` (2rem), `--radius-organic-sm` (1.25rem).
- Shadows: `--shadow-soft`, `--shadow-softer` (both purple-tinted via `rgba(58, 42, 120, ...)` in light mode, black-tinted in dark mode).
- `.card-soft` utility: the standard frosted-glass card treatment (`--glass-bg` + `--glass-border` + blur). Prefer this over hand-rolling a card background.

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
