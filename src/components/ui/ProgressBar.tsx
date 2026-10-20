/**
 * ProgressBar — a horizontal progress indicator.
 * Lime fill on a muted track. Shows percentage when `showLabel` is true.
 */
import { StyleProp, ViewStyle } from 'react-native';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { colors, spacing } from '@/lib/theme';

interface ProgressBarProps {
  value: number; // 0–100
  showLabel?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({ value, showLabel = false, height = 8, style }: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), 100);
  const track: ViewStyle = {
    backgroundColor: colors.border,
    height,
    borderRadius: 4,
    overflow: 'hidden',
  };
  const fill: ViewStyle = {
    backgroundColor: colors.lime,
    height,
    width: `${clamped}%`,
    borderRadius: 4,
  };

  return (
    <Box style={{ ...style }}>
      <Box style={track}>
        <Box style={fill} />
      </Box>
      {showLabel && (
        <Text variant="caption" style={{ marginTop: spacing.xs, textAlign: 'right' }}>
          {Math.round(clamped)}%
        </Text>
      )}
    </Box>
  );
}
