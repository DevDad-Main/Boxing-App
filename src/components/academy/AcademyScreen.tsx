/**
 * AcademyScreen — Boxing Academy curriculum browser.
 *
 * Displays skill categories (Foundations, Punching, Footwork, Defence,
 * Combinations & Tactics) with lessons. Click a category to see its lessons,
 * then click a lesson to see its detail.
 * Uses clearly labelled sample / demonstration data only — no real coaching
 * content claimed.
 */
import { useState } from 'react';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { colors, borderRadius } from '@/lib/theme';
import { Card } from '@/components/ui/Card';
import { LessonScreen } from './LessonScreen';

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

type Lesson = {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
};

const CATEGORY_LESSONS: Record<string, Lesson[]> = {
  foundations: [
    { id: 'stance', title: 'Boxing Stance & Balance', difficulty: 'beginner' },
    { id: 'guard', title: 'Guard & Defensive Posture', difficulty: 'beginner' },
    { id: 'basic-movement', title: 'Basic Movement', difficulty: 'beginner' },
    { id: 'steps', title: 'Forward & Backward Steps', difficulty: 'beginner' },
    { id: 'lateral', title: 'Lateral Movement', difficulty: 'beginner' },
    { id: 'distance', title: 'Basic Distance Awareness', difficulty: 'beginner' },
    { id: 'return-stance', title: 'Returning to Balanced Stance', difficulty: 'beginner' },
  ],
  punching_fundamentals: [
    { id: 'jab', title: 'The Jab', difficulty: 'beginner' },
    { id: 'cross', title: 'The Cross', difficulty: 'beginner' },
    { id: 'lead-hook', title: 'Lead Hook', difficulty: 'intermediate' },
    { id: 'rear-hook', title: 'Rear Hook', difficulty: 'intermediate' },
    { id: 'lead-uppercut', title: 'Lead Uppercut', difficulty: 'intermediate' },
    { id: 'rear-uppercut', title: 'Rear Uppercut', difficulty: 'intermediate' },
    { id: 'combinations', title: 'Controlled Combinations', difficulty: 'beginner' },
    { id: 'recovery', title: 'Recovery to Guard', difficulty: 'beginner' },
  ],
  footwork: [
    { id: 'advancing', title: 'Advancing & Retreating', difficulty: 'beginner' },
    { id: 'lateral-movement', title: 'Lateral Movement', difficulty: 'beginner' },
    { id: 'pivots', title: 'Pivots', difficulty: 'intermediate' },
    { id: 'angle-exits', title: 'Angle Exits', difficulty: 'intermediate' },
    { id: 'stance-integrity', title: 'Stance Integrity', difficulty: 'beginner' },
    { id: 'movement-punching', title: 'Movement with Punching', difficulty: 'intermediate' },
  ],
  defence: [
    { id: 'slips', title: 'Slips', difficulty: 'intermediate' },
    { id: 'rolls', title: 'Rolls', difficulty: 'intermediate' },
    { id: 'ducking', title: 'Controlled Ducking', difficulty: 'intermediate' },
    { id: 'guard-defence', title: 'Guard-based Defence', difficulty: 'beginner' },
    { id: 'distance-management', title: 'Distance Management', difficulty: 'beginner' },
    { id: 'repositioning', title: 'Defensive Repositioning', difficulty: 'intermediate' },
    { id: 'basic-counters', title: 'Basic Counters', difficulty: 'intermediate' },
  ],
  combinations_tactics: [
    { id: 'simple-combos', title: 'Simple Combinations', difficulty: 'beginner' },
    { id: 'rhythm', title: 'Rhythm & Timing', difficulty: 'intermediate' },
    { id: 'feints', title: 'Feints', difficulty: 'intermediate' },
    { id: 'entry-exit', title: 'Controlled Entry & Exit', difficulty: 'intermediate' },
    { id: 'defensive-transitions', title: 'Defensive Transitions', difficulty: 'intermediate' },
    { id: 'complex-combos', title: 'Complex Combinations', difficulty: 'advanced' },
  ],
};

interface AcademyScreenProps {}

export function AcademyScreen(_props: AcademyScreenProps) {
  const [view, setView] = useState<'categories' | 'lessons' | 'lesson'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Lesson detail view
  if (view === 'lesson' && selectedLesson) {
    return (
      <Box bg="obsidian" flex={1} p={20} style={{ backgroundColor: colors.obsidian }}>
        <Box style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Button
            variant="ghost"
            onPress={() => { setView('lessons'); setSelectedLesson(null); }}
            style={{ paddingHorizontal: 10, paddingVertical: 6, marginRight: 10 }}
          >
            <Text variant="body" style={{ color: colors.textPrimary }}>← Back</Text>
          </Button>
          <Text variant="heading-sm" style={{ color: colors.textPrimary }}>
            {selectedLesson.title}
          </Text>
        </Box>
        <LessonScreen
          lessonId={selectedLesson.id}
          onBack={() => { setView('lessons'); setSelectedLesson(null); }}
          onPractise={() => {
            // TODO: navigate to workout player for this lesson
          }}
        />
      </Box>
    );
  }

  // Lessons list view
  if (view === 'lessons' && selectedCategory) {
    return (
      <Box bg="obsidian" flex={1} p={20} style={{ backgroundColor: colors.obsidian }}>
        <Box style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Button
            variant="ghost"
            onPress={() => { setView('categories'); setSelectedCategory(null); }}
            style={{ paddingHorizontal: 10, paddingVertical: 6, marginRight: 10 }}
          >
            <Text variant="body" style={{ color: colors.textPrimary }}>← Back</Text>
          </Button>
          <Text variant="heading-sm" style={{ color: colors.textPrimary }}>
            {selectedCategory.title}
          </Text>
        </Box>
        <Text variant="body-muted" style={{ color: colors.textSecondary, marginBottom: 16 }}>
          {selectedCategory.description}
        </Text>

        {CATEGORY_LESSONS[selectedCategory.key].map((lesson) => (
          <Card
            key={lesson.id}
            style={{ marginBottom: 12, backgroundColor: colors.graphite }}
            onPress={() => setSelectedLesson(lesson)}
          >
            <Box style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Text variant="heading-sm" style={{ color: colors.textPrimary, marginBottom: 2 }}>
                  {lesson.title}
                </Text>
                <Text variant="caption" style={{ color: colors.textSecondary }}>
                  {lesson.difficulty}
                </Text>
              </Box>
              <Button variant="ghost" onPress={() => setSelectedLesson(lesson)} style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
                <Text variant="body" style={{ color: colors.lime }}>Open</Text>
              </Button>
            </Box>
          </Card>
        ))}

        <Box style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border }}>
          <Text variant="caption" style={{ color: colors.textMuted, textAlign: 'center' }}>
            Sample demonstration data only. Real lessons require cleared media sources and editorial review.
          </Text>
        </Box>
      </Box>
    );
  }

  // Categories view (default)
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
          onPress={() => { setSelectedCategory(cat); setView('lessons'); }}
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
            <Text variant="caption" style={{ color: colors.lime, fontWeight: '600' as const }}>
              Open category
            </Text>
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
