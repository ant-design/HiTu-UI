/**
 * angle calculate
 */

export function number2angle(x: number) {
  return 180 * x / Math.PI;
}

export function angle2number(angle: number) {
  return (angle * Math.PI) / 180;
}