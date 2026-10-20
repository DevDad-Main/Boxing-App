/**
 * Button — primary interactive element with four variants.
 * - primary: lime fill, obsidian text (most important actions)
 * - secondary: graphite fill, ivory text
 * - ghost: transparent, ivory text (minimal actions)
 * - danger: red fill, ivory text (destructive actions)
 */
import { Pressable, PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { colors, borderRadius, spacing } from '@/lib/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends PressableProps {
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, { bg: string; text: string; disabledBg: string }> = {
  primary: { bg: colors.lime, text: colors.obsidian, disabledBg: colors.textMuted },
  secondary: { bg: colors.graphite, text: colors.textPrimary, disabledBg: colors.textMuted },
  ghost: { bg: 'transparent', text: colors.textPrimary, disabledBg: colors.textMuted },
  danger: { bg: colors.danger, text: colors.textPrimary, disabledBg: colors.textMuted },
};

export function Button({
  children,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  ...rest
}: ButtonProps) {
  const v = variantStyles[variant];
  const base: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: disabled ? v.disabledBg : v.bg,
  };

  return (
    <Pressable disabled={disabled || loading} style={[base, style]} {...rest}>
      <Box
        p={spacing.md}
        px={spacing.lg}
        style={{ borderRadius: borderRadius.md, backgroundColor: disabled ? v.disabledBg : v.bg }}
      >
        <Text
          variant="label"
          style={{
            color: disabled ? colors.textMuted : v.text,
            fontWeight: '600' as const,
          } as TextStyle}
        >
          {loading ? 'Loading…' : children}
        </Text>
      </Box>
    </Pressable>
  );
}
