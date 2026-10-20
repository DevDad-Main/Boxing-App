/**
 * AcademyScreen — Boxing Academy curriculum browser.
 *
 * Displays skill categories (Foundations, Punching, Footwork, Defence,
 * Combinations & Tactics) with lessons. Uses clearly labelled sample
 * / demonstration data only — no real coaching content claimed.
 */
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { colors, borderRadius } from '@/lib/theme';
import { Card } from '@/components/ui/Card';

type Category = {
  key: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lessonCount: number;
  icon: string;
};

const CATEGORIES: Category[] = [
  {
    key: 'foundations',
    title: 'Foundations',
    description: 'Stance, guard, balance, and basic movement.',
    difficulty: 'beginner',
    lessonCount: 7,
    icon: '◆',
  },
  {
    key: 'punching_fundamentals',
    title: 'Punching Fundamentals',
    description: 'Jab, cross, hooks, uppercuts, and combinations.',
    difficulty: 'beginner',
    lessonCount: 8,
    icon: '⚑',
  },
  {
    key: 'footwork',
    title: 'Footwork',
    description: 'Advancing, retreating, pivots, and angle exits.',
    difficulty: 'beginner',
    lessonCount: 6,
    icon: '◐',
  },
  {
    key: 'defence',
    title: 'Defence',
    description: 'Slips, rolls, ducking, guard-based defence.',
    difficulty: 'intermediate',
    lessonCount: 7,
    icon: '◌',
  },
  {
    key: 'combinations_tactics',
    title: 'Combinations & Tactics',
    description: 'Entry, exit, feints, and defensive transitions.',
    difficulty: 'intermediate',
    lessonCount: 6,
    icon: '✦',
  },
];

interface AcademyScreenProps {
  onLessonPress: (lessonId: string) => void;
}

export function AcademyScreen({ onLessonPress }: AcademyScreenProps) {
  return (
    <Box bg="obsidian" flex={1} p={20} style={{ backgroundColor: colors.obsidian }}>
      <Text variant="heading" style={{ color: colors.textPrimary, marginBottom: 8 }}>
        Boxing Academy
      </Text>
      <Text variant="body-muted" style={{ color: colors.textSecondary, marginBottom: 20 }}>
        Structured curriculum. Sample data only — not real coaching content.
      </Text>

      {CATEGORIES.map((cat) => (
        <Card
          key={cat.key}
          accent={cat.difficulty === 'beginner'}
          style={{ marginBottom: 16, backgroundColor: colors.graphite }}
        >
          <Box style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <Box style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text variant="body-muted" style={{ fontSize: 24, marginRight: 10 }}>
                {cat.icon}
              </Text>
              <Text variant="heading-sm" style={{ color: colors.textPrimary }}>
                {cat.title}
              </Text>
            </Box>
            <Box style={{ backgroundColor: colors.limeAlpha, paddingHorizontal: 8, paddingVertical: 4, borderRadius: borderRadius.sm }}>
              <Text variant="caption" style={{ color: colors.limeDark, fontWeight: '600' as const }}>
                {cat.difficulty}
              </Text>
            </Box>
          </Box>
          <Text variant="body" style={{ color: colors.textSecondary, marginBottom: 12, lineHeight: 22 }}>
            {cat.description}
          </Text>
          <Box style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="caption" style={{ color: colors.textMuted }}>
              {cat.lessonCount} lessons
            </Text>
            <Button variant="ghost" onPress={() => onLessonPress(cat.key)} style={{ paddingHorizontal: 14, paddingVertical: 6 }}>
              <Text variant="body" style={{ color: colors.textPrimary }}>Open</Text>
            </Button>
          </Box>
        </Card>
      ))}

      <Box style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border }}>
        <Text variant="caption" style={{ color: colors.textMuted, textAlign: 'center' }}>
          Demonstration data only. Real lessons require cleared media sources and editorial review.
        </Text>
      </Box>
    </Box>
  );
}
