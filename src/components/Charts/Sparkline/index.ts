export { default as Sparkline } from './Sparkline.vue'

/**
 * Line color for `Sparkline`. `'auto'` compares the last value to the first
 * value in `data` (rising -> `--status-active`, falling -> `--status-error`,
 * flat -> `--status-off`); the others force that tone regardless of trend.
 */
export type SparklineTone = 'auto' | 'brand' | 'positive' | 'negative' | 'neutral'
