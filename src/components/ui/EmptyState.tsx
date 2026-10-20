/**
 * EmptyState — a helpful empty state with a heading, muted body text,
 * and an optional primary action. Used throughout the app where no
 * data is available yet.
 */
import { StyleProp, ViewStyle } from 'react-native';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { spacing } from '@/lib/theme';

interface EmptyStateProps {
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  return (
    <Box
      style={{
        alignItems: 'center',
        paddingVertical: spacing.xxl,
        paddingHorizontal: spacing.lg,
        ...style,
      }}
    >
      <Text variant="heading-sm" style={{ textAlign: 'center', marginBottom: spacing.sm }}>
        {title}
      </Text>
      {body && (
        <Text variant="body-muted" style={{ textAlign: 'center', marginBottom: spacing.lg }}>
          {body}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" onPress={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
