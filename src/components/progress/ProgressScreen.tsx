/**
 * ProgressScreen — Progress & Statistics dashboard.
 *
 * Shows real statistics: sessions completed, training minutes, weekly
 * consistency, skills demonstrated, etc. Sample / demonstration data only.
 * Includes weekly / monthly / all-time time filters.
 */
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { colors, spacing, borderRadius } from '@/lib/theme';
import { StatTile } from '@/components/ui/StatTile';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { useState } from 'react';

interface ProgressScreenProps {}

export function ProgressScreen(_props: ProgressScreenProps) {
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');

  const stats = [
    { value: '12', label: 'Sessions this week', accent: 'lime' },
    { value: '145', label: 'Training minutes', accent: 'lime' },
    { value: '3', label: 'Skills demonstrated', accent: 'lime' },
    { value: '6', label: 'Completed rounds', accent: 'lime' },
  ];

  return (
    <Box bg="obsidian" flex={1} p={20} style={{ backgroundColor: colors.obsidian }}>
      <Text variant="heading" style={{ color: colors.textPrimary, marginBottom: 8 }}>
        Progress
      </Text>
      <Text variant="body-muted" style={{ color: colors.textSecondary, marginBottom: 16 }}>
        Sample data only — not real training data.
      </Text>

      <Box style={{ flexDirection: 'row', marginBottom: 20 }}>
        {['weekly', 'monthly', 'all-time'].map((filter) => (
          <Button
            key={filter}
            variant={timeFilter === filter ? 'primary' : 'ghost'}
            onPress={() => setTimeFilter(filter as any)}
            style={{
              marginRight: 8,
              paddingVertical: 8,
              paddingHorizontal: 14,
              backgroundColor: timeFilter === filter ? colors.lime : 'transparent',
              borderRadius: borderRadius.full,
            }}
          >
            <Text variant="caption" style={{ color: timeFilter === filter ? colors.obsidian : colors.textPrimary, fontWeight: '600' as const }}>
              {filter}
            </Text>
          </Button>
        ))}
      </Box>

      <Box style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
        {stats.map((s) => (
          <StatTile
            key={s.label}
            value={s.value}
            label={s.label}
            accent={s.accent as 'lime'}
            style={{ flex: 1, minWidth: 160, marginRight: 12, marginBottom: 12 }}
          />
        ))}
      </Box>

      <Box style={{ marginBottom: 16, backgroundColor: colors.graphite, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, padding: spacing.lg }}>
        <Text variant="heading-sm" style={{ color: colors.textPrimary, marginBottom: 12 }}>
          Weekly consistency
        </Text>
        <ProgressBar value={65} showLabel height={10} />
      </Box>

      <Box style={{ marginBottom: 16, backgroundColor: colors.graphite, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, padding: spacing.lg }}>
        <Text variant="heading-sm" style={{ color: colors.textPrimary, marginBottom: 12 }}>
          Skills currently practising
        </Text>
        <Text variant="body-muted" style={{ color: colors.textSecondary, marginBottom: 8 }}>
          Jab • Cross • Stance & balance
        </Text>
        <ProgressBar value={40} showLabel height={10} />
      </Box>

      <EmptyState
        title="Recent training history"
        body="No sessions yet. Complete your first workout to see history here."
        actionLabel="Start training"
        onAction={() => {}}
      />
    </Box>
  );
}
