/**
 * Timer — a large monospace time display used in the Guided Workout Player.
 * Lime when running, muted when paused. Accessible pause / skip / resume
 * controls are expected to be provided by the parent player.
 */
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { colors } from '@/lib/theme';

interface TimerProps {
  seconds: number;
  running?: boolean;
  label?: string;
}

export function Timer({ seconds, running = false, label }: TimerProps) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const time = `${m}:${s.toString().padStart(2, '0')}`;

  return (
    <Box style={{ alignItems: 'center' }}>
      {label && (
        <Text variant="caption" style={{ marginBottom: 4 }}>
          {label}
        </Text>
      )}
      <Text
        variant="stat"
        style={{ color: running ? colors.lime : colors.textSecondary }}
      >
        {time}
      </Text>
    </Box>
  );
}
