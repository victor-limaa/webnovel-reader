export function clampStepValue(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Number(value.toFixed(2))));
}
