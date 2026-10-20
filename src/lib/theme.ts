/**
 * Design system tokens for the Boxing training platform.
 *
 * Palette (dark-first, premium athletic):
 * - Obsidian    #151817  — backgrounds, app shell, modal backdrops
 * - Graphite    #252A28  — cards, elevated surfaces, secondary containers
 * - Athletic Lime #C8F169 — primary actions, active states, progression indicators
 * - Warm Ivory  #F3F1E9  — primary text on dark, headings
 * - Muted greys for secondary information
 */

export const colors = {
  // Brand
  obsidian: '#151817',
  graphite: '#252A28',
  lime: '#C8F169',
  ivory: '#F3F1E9',

  // Semantic (dark-mode defaults)
  background: '#151817',
  surface: '#252A28',
  surfaceHover: '#323A36',

  textPrimary: '#F3F1E9',
  textSecondary: '#8A948F',
  textMuted: '#5B665F',

  border: '#3A423E',

  // Accents / status
  limeDark: '#7E9B2E',
  danger: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',

  // Alpha overlays (for pressed states, etc.)
  overlay: 'rgba(0, 0, 0, 0.4)',
  limeAlpha: 'rgba(200, 241, 105, 0.15)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  headline: 40,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

// Breakpoints (for responsive web layouts). Values in dp / CSS pixels.
export const breakpoints = {
  sm: 640,
  md: 1024,
  lg: 1280,
} as const;

export type ThemeColors = typeof colors;
