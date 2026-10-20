/**
 * Card — a graphite surface container with a subtle border.
 * Default radius is modest (not excessive). Optional left-border accent
 * in lime marks active / selected items.
 */
import { ViewProps, StyleProp, ViewStyle } from 'react-native';
import { Box } from '@/components/ui/Box';
import { colors, borderRadius, spacing } from '@/lib/theme';

interface CardProps extends ViewProps {
  accent?: boolean;
  padding?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function Card({ children, accent = false, padding = spacing.lg, style, ...rest }: CardProps) {
  const base: ViewStyle = {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding,
    ...(accent && { borderLeftWidth: 4, borderLeftColor: colors.lime }),
  };

  return <Box {...rest} style={[base, style]}>{children}</Box>;
}
