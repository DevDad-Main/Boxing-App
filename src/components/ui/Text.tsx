/**
 * Text — the base typography component.
 * Supports semantic variants and accessible contrast by default.
 */
import { Text as RNText, TextProps as RNTextProps, StyleProp, TextStyle } from 'react-native';
import { colors, fontSize, fontWeight, lineHeight } from '@/lib/theme';

type TextVariant = 'body' | 'body-muted' | 'heading' | 'heading-sm' | 'stat' | 'caption' | 'label';

const variantStyles: Record<TextVariant, TextStyle> = {
  body: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.md * lineHeight.normal,
  },
  'body-muted': {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.md * lineHeight.normal,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxl * lineHeight.tight,
  },
  'heading-sm': {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xl * lineHeight.tight,
  },
  stat: {
    color: colors.lime,
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxxl * lineHeight.tight,
    fontFamily: 'monospace',
  },
  caption: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  label: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.sm * lineHeight.normal,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
};

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  className?: string;
  style?: StyleProp<TextStyle>;
}

export function Text({ children, variant = 'body', className, style, ...rest }: TextProps) {
  return (
    <RNText {...rest} style={[variantStyles[variant], style]}>
      {children}
    </RNText>
  );
}
