# Nevuela: Design Tokens, Aurora / Nebula

Nevuela's visual language is **Aurora/Nebula**: deep indigo-violet neutrals (a night sky) paired
with an emerald-green brand accent (the aurora), with a supporting palette of nebula violet,
magenta, cyan, and gold for charts and secondary accents.

This is an original, first-party token system. Every value below is defined once in
`src/style.css` and consumed by components exclusively through semantic Tailwind utilities
(`bg-brand`, `text-status-error`, `rounded-sm`, …). Components never reference raw hex/oklch
values directly.

## Typography

- **Family:** `Inter, "Helvetica Neue", Helvetica, Arial, sans-serif`.
- **Weights in use:** 400 (body), 500 (medium), 600 (semibold: buttons, headings, labels), 700
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
| `--radius-sm` | 6px | **default**: buttons, inputs, badges, chips |
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

## Dark theme

Dark mode is a real, WCAG AA-verified theme (not a placeholder inversion), toggled by applying a
`.dark` class to an ancestor element: `@custom-variant dark (&:is(.dark *))` in `src/style.css`.
In Storybook, use the light/dark toggle in the toolbar (`@storybook/addon-themes`). Every value
below was chosen with an OKLCH contrast calculator against WCAG AA (4.5:1 text, 3:1 UI
components/graphics), not by eye.

### The fill/text split

`--brand` and the status colors are used in two roles that pull in opposite directions on a dark
background:

- **Fill**: a solid background with `--on-accent` (white) text on top (buttons, checkboxes,
  selected calendar days). This wants a **darker**, more saturated shade so white text stays
  readable on it.
- **Bare text/icon, and any other unfilled graphic**: the color used directly as `text-*`,
  `border-*` or `ring-*`, with no fill behind it (tab labels, toolbar/breadcrumb links, form error
  text, metric deltas, the invalid-state outline on an input, a sparkline stroke). This wants a
  **lighter** shade so it reads against the dark page background. Borders belong here, not with
  fills: an invalid input's red outline is the *only* signal that the field is in error, which
  makes it a non-text graphic needing 3:1 under WCAG 1.4.11, and the fill shade only reaches
  ~2.9:1 on `--surface`.

No single emerald or red shade satisfies both at once: a shade light enough to read as text on
`--bg`/`--surface` is too light for white text to read on top of it as a fill, and vice versa (the
best achievable single-token compromise tops out around ~4:1, short of AA). So `--brand` and
`--status-error` (the only status color also used as a fill, via the `destructive` Button variant)
each get a second, lighter shade, `--brand-fg` / `--status-error-fg`, for the bare-text role.
Components use `text-brand-fg` / `text-status-error-fg` / `border-status-error-fg` /
`ring-status-error-fg` for text, icons, outlines and strokes, never the plain `text-brand` /
`border-status-error` (those stay reserved for `bg-*` fills, and for dots, which sit on a filled
chip). This includes text sitting on the `*-subtle` wash (badges, selected menu items); the `-fg`
shade is tuned to read on both the page background _and_ the subtle wash.

`active`/`warning`/`info`/`off` are never used as a fill with `--on-accent` text, so they don't
have this conflict: their `-fg` token is just an alias of the base color (in both themes). The
alias still has to be **re-declared inside `.dark`**, not merely inherited: CSS substitutes a
`var()` inside a custom property at the element that *declares* it, so a `:root`-only
`--status-active-fg: var(--status-active)` bakes in the light value and no `.dark` ancestor can
ever change it. The same rule applies to every shadcn/Reka bridge alias (`--background`,
`--primary`, `--border`, …), which is why `src/style.css` repeats the whole bridge block inside
`.dark`. Anything added to the `:root` alias list has to be added there too. Light
mode never needs this split at all: light mode's fill and bare-text roles both contrast against
the *same* background family (white), so one shade already works for both. The conflict is
dark-mode-specific.

`--status-off` intentionally stays under AA in both themes (mirrors `--fg-muted`), matching the
existing light-theme treatment of "inactive" as a deliberately de-emphasized state. WCAG doesn't
require contrast minimums for disabled/inactive UI.

### Dark palette

| Token | oklch | hex | Notes |
| --- | --- | --- | --- |
| `--surface` | `oklch(0.22 0.026 280)` | `#181927` | cards, menus, inputs |
| `--bg` | `oklch(0.15 0.028 280)` | `#090a17` | app/page background |
| `--bg-subtle` | `oklch(0.19 0.028 280)` | `#111220` | zebra rows, wells |
| `--border-c` | `oklch(0.32 0.02 280)` | `#31323d` | default borders, a soft hairline by design, same ~1.3:1 informal separation the light theme's own border already uses, not a 3:1 AA border |
| `--border-strong` | `oklch(0.44 0.018 280)` | `#50525d` | hover/emphasis borders |
| `--fg` | `oklch(0.97 0.005 275)` | `#f4f5f9` | primary text, 18:1 on `--bg` |
| `--fg-muted` | `oklch(0.72 0.018 270)` | `#a0a4b0` | placeholders, disabled, icons — 7–8:1 |
| `--brand` (fill) | `oklch(0.5 0.16 155)` | `#007c36` | 5.3:1 white-on-it; 3.2–3.7:1 vs bg/surface (borders) |
| `--brand-hover` | `oklch(0.46 0.16 155)` | `#00702b` | darkens on hover, same direction as light theme |
| `--brand-active` | `oklch(0.42 0.16 155)` | `#00641f` | |
| `--brand-subtle` | `oklch(0.27 0.06 155)` | `#062f19` | wash bg for highlighted/selected rows |
| `--brand-fg` (text) | `oklch(0.67 0.16 155)` | `#19b168` | 6–7:1 vs bg/surface; 5.3:1 on `--brand-subtle` |
| `--link` | `oklch(0.68 0.12 170)` | `#32b08d` | 6–7:1 vs bg/surface |
| `--status-active` | `oklch(0.66 0.15 142)` | `#56a84e` | 6–7:1; alias role (no separate fill shade) |
| `--status-warning` | `oklch(0.7 0.15 75)` | `#d48e00` | 6–7:1 |
| `--status-error` (fill) | `oklch(0.52 0.19 25)` | `#be222a` | 6.1:1 white-on-it; ~2.9:1 vs `--surface`, so fills only, outlines/strokes use `-fg` |
| `--status-error-fg` (text) | `oklch(0.7 0.17 25)` | `#f66d67` | 6–7:1 vs bg/surface; 5.4:1 on its subtle |
| `--status-info` | `oklch(0.68 0.15 265)` | `#6a94f4` | 6–7:1 |
| `--status-off` | `oklch(0.72 0.018 270)` | `#a0a4b0` | = `--fg-muted`; under AA by design |
| `--chart-1…6` | brightened ~0.06–0.14 L from light | — | light-theme chart values fall as low as ~2.8:1 on a dark surface (non-text objects need 3:1 per WCAG 1.4.11); dark values sit at 5–7:1 |

Every `*-subtle` status background got its own dark value too (not just an opacity trick).
`--status-info-subtle` in particular was entirely missing from earlier dark scaffolding and had to
be added.

Elevation shadows also get dark-specific values: the light theme's indigo-tinted `--shadow-*` is
nearly the same lightness as a dark surface and reads as almost invisible there, so `.dark`
overrides them with a higher-opacity near-black shadow instead.

Overriding the `--shadow-*` custom property is not enough on its own, though. Tailwind resolves
each shadow at *build* time so it can splice a `var(--tw-shadow-color, …)` slot into every layer
for the `shadow-<color>` modifier, so the emitted `.shadow-md` carries the light literal
and never reads `var(--shadow-md)`. What actually repaints elevated surfaces is a matching set of
`.shadow-*:where(.dark *)` rules at the bottom of `src/style.css` that re-declare `--tw-shadow`.
The `.dark` custom properties stay as the readable source of truth (and still work for anyone
writing `box-shadow: var(--shadow-md)` by hand); the two have to be kept in sync.

---

_See `src/style.css` for the implemented `:root` token block, the `@theme` scale mappings, and the
shadcn/Reka bridge variables (`--primary`, `--border`, `--radius`, …) that re-point the primitive
layer onto these Nevuela tokens._
