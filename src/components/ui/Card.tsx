/**
 * Card — a graphite surface container with a subtle border.
 * Default radius is modest (not excessive). Optional left-border accent
 * in lime marks active / selected items. Supports onPress for tap interaction.
 */
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import { Box } from '@/components/ui/Box';
import { colors, borderRadius, spacing } from '@/lib/theme';

interface CardProps extends PressableProps {
  accent?: boolean;
  padding?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function Card({ children, accent = false, padding = spacing.lg, style, onPress, ...rest }: CardProps) {
  const base: ViewStyle = {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding,
    ...(accent && { borderLeftWidth: 4, borderLeftColor: colors.lime }),
  };

  return (
    <Pressable onPress={onPress} style={[base, style]} {...rest}>
      <Box>{children}</Box>
    </Pressable>
  );
}
