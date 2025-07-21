import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * @param value - The value to be fixed.
 * @param precision - The number of decimal places to keep.
 * @returns The fixed value.
 */
export function toFixed(value: number, precision: number = 2) {
  return Number(value.toFixed(precision))
}
