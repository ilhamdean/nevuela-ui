# Nevuela — Design Tokens: Aurora / Nebula

Nevuela's visual language is **Aurora/Nebula**: deep indigo-violet neutrals (a night sky) paired
with an emerald-green brand accent (the aurora), with a supporting palette of nebula violet,
magenta, cyan, and gold for charts and secondary accents.

This is an original, first-party token system — every value below is defined once in
`src/style.css` and consumed by components exclusively through semantic Tailwind utilities
(`bg-brand`, `text-status-error`, `rounded-sm`, …). Components never reference raw hex/oklch
values directly.

## Typography

- **Family:** `Inter, "Helvetica Neue", Helvetica, Arial, sans-serif`.
- **Weights in use:** 400 (body), 500 (medium), 600 (semibold — buttons, headings, labels), 700
  (occasional page titles).
- **Type scale** (size → line-height; body 16px is the default):

  | Token | Size | Line height | Use |
  | --- | --- | --- | --- |
  | `--text-2xs` | 11px / 0.6875rem | 16px | tiny meta labels |
  | `--text-xs` | 12px / 0.75rem | 18px | captions, table meta |
  | `--text-sm` | 14px / 0.875rem | 21px (1.5) | secondary text, dense tables |
  | `--text-base` | 16px / 1rem | 24px (1.5) | **body default** |
  | `--text-lg` | 18px / 1.125rem | 27px (1.5) | card titles, subheads |
  | `--text-xl` | 20px / 1.25rem | 28px | section headings |
  | `--text-2xl` | 24px / 1.5rem | 32px | page titles |
  | `--text-3xl` | 30px / 1.875rem | 36px | hero numbers |

  Line-height rhythm is a consistent **1.5** for text sizes.

## Color

All colors are defined as `oklch()` (Tailwind v4 is oklch-native). Hex shown for readability.

### Brand (aurora emerald)

| Token | oklch | hex | Notes |
| --- | --- | --- | --- |
| `--color-brand` | `oklch(0.47 0.15 155)` | `#0d7a4f` | primary action, selected borders, links |
| `--color-brand-hover` | `oklch(0.42 0.14 155)` | ~`#0b6a44` | hover (darker) |
| `--color-brand-active` | `oklch(0.37 0.13 155)` | ~`#0a5a3a` | pressed |
| `--color-brand-subtle` | `oklch(0.95 0.045 155)` | `#e2f6ea` | info/selected background wash |
| `--color-link` | `oklch(0.46 0.13 170)` | ~`#0f7268` | inline links (teal-leaning) |

### Neutrals (violet-tinted; foreground is a deep indigo, not pure black)

| Token | oklch | hex | Use |
| --- | --- | --- | --- |
| `--color-surface` | `oklch(1 0 0)` | `#ffffff` | cards, menus, inputs |
| `--color-bg` | `oklch(0.978 0.004 275)` | `#f7f7f9` | app/page background |
| `--color-bg-subtle` | `oklch(0.953 0.006 275)` | `#eeeef1` | zebra rows, wells |
| `--color-border` | `oklch(0.895 0.012 275)` | `#d8d8de` | default borders/dividers |
| `--color-border-strong` | `oklch(0.82 0.02 275)` | ~`#c0c0c9` | hover/emphasis borders |
| `--color-fg-muted` | `oklch(0.65 0.02 270)` | `#8f8f9c` | placeholders, disabled, icons |
| `--color-fg-subtle` | `oklch(0.19 0.045 280 / 0.6)` | indigo @60% | secondary text |
| `--color-fg` | `oklch(0.19 0.045 280)` | `#150f2e` | primary text |

### Status

Each status has a **solid** (text/icon/dot) and a **subtle** (tinted background) value. `active`
sits in its own green hue, distinct from the brand emerald, so status and primary actions never
read as the same signal; `info` reuses the nebula-blue slot the brand color vacated.

| Status | Solid | hex | Subtle bg | Meaning |
| --- | --- | --- | --- | --- |
| `active` / success | `oklch(0.5 0.14 142)` | `#127a3e` | `oklch(0.96 0.035 145)` → `#e2f8e9` | running, healthy |
| `warning` | `oklch(0.55 0.15 75)` | ~`#93650f` | `oklch(0.96 0.045 80)` | needs attention |
| `error` / danger | `oklch(0.55 0.21 25)` | ~`#c22f27` | `oklch(0.95 0.035 25)` | failed, destructive |
| `off` / neutral | `oklch(0.65 0.02 270)` | `#8f8f9c` | `oklch(0.953 0.006 275)` | powered off, inactive |
| `info` | `oklch(0.5 0.19 265)` | `#3a4fd6` | `oklch(0.95 0.03 265)` | informational (nebula indigo) |

### Chart series

Ordered categorical ramp spanning the Aurora/Nebula family: `emerald #0d7a4f`,
`nebula violet ~#7c4fd1`, `aurora cyan ~#1c8fa8`, `nebula magenta ~#c2419c`,
`star gold ~#c98a1f`, `deep nebula blue ~#3a4fd6`. Exposed as `--color-chart-1 … --color-chart-6`.

## Radius

| Token | Value | Use |
| --- | --- | --- |
| `--radius-sm` | 6px | **default** — buttons, inputs, badges, chips |
| `--radius-md` | 8px | slightly larger controls |
| `--radius-lg` | 10px | grouped controls |
| `--radius-xl` | 12px | cards, panels |
| `--radius-2xl` | 16px | modals, large surfaces |
| `--radius-full` | 9999px | pills, avatars, status dots |

## Spacing (4px base unit)

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64`. Card padding is typically **16–24px**; section gaps
**16–24px**.

## Elevation / shadow

Two-layer shadows tinted with the indigo foreground:

- `--shadow-sm`: `0 1px 2px oklch(0.19 0.045 280 / 0.16), 0 1px 3px oklch(0.19 0.045 280 / 0.2)`
- `--shadow-md` (popovers/dropdowns): scaled `0 2px 4px / 0 4px 8px` at similar tint
- `--shadow-lg` (modals): `0 8px 16px / 0 12px 24px` at ~0.12–0.14 tint

## Component metrics

- **Button**: sizes `sm 32 / md 40 / lg 48` px, radius 6px, weight 600. **Primary**: white text on
  `--brand`. **Secondary/outline**: white bg, brand text, **2px** brand border (so height matches
  primary regardless of variant).
- **Input / Select**: heights `sm 32 / md 40 / lg 48` px, radius 6px, `1px` border in
  `--color-border`, white bg (disabled → `--color-bg`). **Textarea**: radius 6px, `8px 16px`
  padding.
- **Selected RadioCard**: white bg, **2px** brand border, radius 6px.

---

_See `src/style.css` for the implemented `:root` token block, the `@theme` scale mappings, and the
shadcn/Reka bridge variables (`--primary`, `--border`, `--radius`, …) that re-point the primitive
layer onto these Nevuela tokens. Dark theme is scaffolded (`.dark`) but intentionally untuned for
v1 (light-only)._
