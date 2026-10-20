import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with Tailwind deduplication.
 * Works with both Tailwind classes (web) and plain style objects (native).
 */
export function cn(...inputs: Array<string | object | undefined | null | false>): string {
  return twMerge(clsx(inputs.filter(Boolean)));
}
