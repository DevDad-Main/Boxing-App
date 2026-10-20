/**
 * StatTile — a compact statistic display used on the progress dashboard.
 * Large lime/ivory number with a muted label underneath.
 */
import { StyleProp, ViewStyle } from 'react-native';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { colors, borderRadius, spacing } from '@/lib/theme';

interface StatTileProps {
  value: string | number;
  label: string;
  accent?: 'lime' | 'ivory' | 'muted';
  style?: StyleProp<ViewStyle>;
}

const accentColors: Record<'lime' | 'ivory' | 'muted', string> = {
  lime: colors.lime,
  ivory: colors.textPrimary,
  muted: colors.textSecondary,
};

export function StatTile({ value, label, accent = 'lime', style }: StatTileProps) {
  return (
    <Box
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        ...style,
      }}
    >
      <Text variant="stat" style={{ color: accentColors[accent] }}>
        {value}
      </Text>
      <Text variant="caption" style={{ marginTop: spacing.xs }}>
        {label}
      </Text>
    </Box>
  );
}


