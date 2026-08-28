import { onScopeDispose, ref, type Ref } from 'vue'

/**
 * Reactive access to the design tokens (`--brand`, `--chart-1`, …) as they
 * currently resolve in the DOM.
 *
 * Components that hand colors to a canvas renderer (ECharts) or to an SVG
 * `stroke`/`fill` attribute can't use Tailwind utilities — they have to read
 * the custom property with `getComputedStyle`. That read is a plain DOM query
 * with no reactive dependency of its own, so a `computed()` wrapped around it
 * caches on first evaluation and never re-runs: an app that toggles its theme
 * at runtime (adding/removing `.dark` without remounting) would leave every
 * chart painted in the old palette.
 *
 * `useThemeTokens` closes that gap. `token()` takes a dependency on both the
 * element ref it reads from and a version counter bumped whenever a `dark`
 * class is added to or removed from any element in the document, so computeds
 * built on it invalidate on a theme swap.
 */

const DARK_CLASS = 'dark'

/** Bumped on every observed `.dark` add/remove; the reactive dep for `token()`. */
const themeVersion = ref(0)

let observer: MutationObserver | null = null
let observerRefs = 0

const hasDarkClass = (classAttr: string | null): boolean =>
  classAttr != null && classAttr.split(/\s+/).includes(DARK_CLASS)

function retainObserver() {
  observerRefs += 1
  if (observer || typeof window === 'undefined' || observerRefs !== 1) return

  // Watching the whole subtree (not just <html>) because the theme class is
  // documented as living on *an ancestor* — an app may scope `.dark` to a
  // panel. Filtering to the `class` attribute keeps the callback cheap, and
  // comparing against `oldValue` means unrelated class churn (Vue re-renders,
  // state classes) is discarded without touching the ref.
  observer = new MutationObserver((records) => {
    for (const record of records) {
      const target = record.target as Element
      if (hasDarkClass(target.getAttribute('class')) !== hasDarkClass(record.oldValue)) {
        themeVersion.value += 1
        return
      }
    }
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
    attributeOldValue: true,
    subtree: true,
  })
}

function releaseObserver() {
  observerRefs -= 1
  if (observerRefs > 0) return
  observerRefs = 0
  observer?.disconnect()
  observer = null
}

/**
 * @param el Element to resolve tokens against — pass the component's own root
 *   so a `.dark` on any ancestor is honored. Before mount (and outside the
 *   DOM) it falls back to `<html>`; populating the ref re-triggers `token()`.
 */
export function useThemeTokens(el: Ref<Element | null | undefined>) {
  retainObserver()
  onScopeDispose(releaseObserver)

  /** Current value of `name`, or `fallback` if it's unset or there's no DOM. */
  function token(name: string, fallback: string): string {
    // Touch both reactive sources before any early return, so a caller's
    // `computed()` subscribes to them even on the first (pre-mount / SSR) pass.
    void themeVersion.value
    const target = el.value

    if (typeof window === 'undefined') return fallback
    const style = getComputedStyle(target ?? document.documentElement)
    return style.getPropertyValue(name).trim() || fallback
  }

  return { token }
}
