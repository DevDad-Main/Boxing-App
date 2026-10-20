/**
 * LessonScreen — individual academy lesson detail.
 *
 * Shows instructions, common mistakes, safety considerations, and an
 * attributed external demonstration link. Sample / demonstration data only.
 */
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { colors, spacing, borderRadius } from '@/lib/theme';

type Lesson = {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string;
  commonMistakes: string[];
  safetyConsiderations: string;
  recommendedPracticeMinutes: number;
  demonstrationUrl?: string;
  demonstrationSource?: string;
  sourceUrl?: string;
  editorialStatus: 'draft' | 'pending_review' | 'published' | 'rejected';
};

const SAMPLE_LESSONS: Record<string, Lesson> = {
  jab: {
    id: 'jab',
    slug: 'jab',
    title: 'The Jab',
    category: 'Punching Fundamentals',
    difficulty: 'beginner',
    instructions:
      'From your stance, extend your lead hand straight forward, rotating the fist so the palm faces down at impact. Snap it back to guard immediately. Keep your rear hand up to protect your chin.',
    commonMistakes: [
      'Dropping the rear hand while punching',
      'Pushing the punch instead of snapping it',
      'Not returning to guard quickly enough',
    ],
    safetyConsiderations:
      'Warm up your wrists and shoulders first. Stop if you feel sharp joint pain.',
    recommendedPracticeMinutes: 10,
    demonstrationSource: 'England Boxing',
    editorialStatus: 'published',
  },
  cross: {
    id: 'cross',
    slug: 'cross',
    title: 'The Cross',
    category: 'Punching Fundamentals',
    difficulty: 'beginner',
    instructions:
      'From your stance, rotate your hips and rear foot, extending your rear hand straight forward. Keep your lead hand glued to your chin. Return to guard immediately after impact.',
    commonMistakes: [
      'Leaning forward instead of rotating',
      'Dropping the lead hand',
      'Not pivoting the rear foot',
    ],
    safetyConsiderations:
      'Practice slowly at first to build correct hip rotation. Avoid over-extending your elbow.',
    recommendedPracticeMinutes: 10,
    demonstrationSource: 'England Boxing',
    editorialStatus: 'published',
  },
  stance: {
    id: 'stance',
    slug: 'stance',
    title: 'Boxing Stance & Balance',
    category: 'Foundations',
    difficulty: 'beginner',
    instructions:
      'Stand with feet shoulder-width apart, lead foot forward, rear foot at a 45-degree angle. Knees slightly bent, weight on the balls of your feet. Hands up protecting the chin, elbows tucked.',
    commonMistakes: [
      'Feet too close together (unstable)',
      'Weight on heels instead of balls of feet',
      'Hands drifting away from the face',
    ],
    safetyConsiderations:
      'Ensure you have clear space around you. Wear supportive shoes.',
    recommendedPracticeMinutes: 5,
    demonstrationSource: 'USA Boxing',
    editorialStatus: 'published',
  },
};

interface LessonScreenProps {
  lessonId: string;
  onBack: () => void;
  onPractise: () => void;
}

export function LessonScreen({ lessonId, onBack, onPractise }: LessonScreenProps) {
  const lesson = SAMPLE_LESSONS[lessonId];

  if (!lesson) {
    return (
      <Box bg="obsidian" flex={1} p={24} style={{ backgroundColor: colors.obsidian }}>
        <Text variant="heading" style={{ color: colors.textPrimary }}>
          Lesson not found
        </Text>
        <Button variant="ghost" onPress={onBack}>
          <Text variant="body" style={{ color: colors.textPrimary }}>Back</Text>
        </Button>
      </Box>
    );
  }

  return (
    <Box bg="obsidian" flex={1} p={20} style={{ backgroundColor: colors.obsidian }}>
      <Box style={{ marginBottom: 16 }}>
        <Text variant="caption" style={{ color: colors.lime, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
          {lesson.category}
        </Text>
        <Text variant="heading" style={{ color: colors.textPrimary, marginBottom: 8 }}>
          {lesson.title}
        </Text>
        <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Box style={{ backgroundColor: colors.limeAlpha, paddingHorizontal: 8, paddingVertical: 4, borderRadius: borderRadius.sm }}>
            <Text variant="caption" style={{ color: colors.limeDark, fontWeight: '600' as const }}>
              {lesson.difficulty}
            </Text>
          </Box>
          <Text variant="caption" style={{ color: colors.textSecondary }}>
            ~{lesson.recommendedPracticeMinutes} min practice
          </Text>
          <Text variant="caption" style={{ color: colors.textMuted }}>
            • {lesson.editorialStatus}
          </Text>
        </Box>
      </Box>

      <Box style={{ marginBottom: 16, backgroundColor: colors.graphite, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, padding: spacing.lg }}>
        <Text variant="heading-sm" style={{ color: colors.textPrimary, marginBottom: 8 }}>
          How to do it
        </Text>
        <Text variant="body" style={{ color: colors.textSecondary, lineHeight: 22, marginBottom: 12 }}>
          {lesson.instructions}
        </Text>
      </Box>

      <Box style={{ marginBottom: 16, backgroundColor: colors.graphite, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, padding: spacing.lg }}>
        <Text variant="heading-sm" style={{ color: colors.textPrimary, marginBottom: 8 }}>
          Common mistakes
        </Text>
        {lesson.commonMistakes.map((mistake, i) => (
          <Box key={i} style={{ marginBottom: 8, paddingLeft: 12, borderLeftWidth: 2, borderLeftColor: colors.border }}>
            <Text variant="body" style={{ color: colors.textSecondary }}>
              {mistake}
            </Text>
          </Box>
        ))}
      </Box>

      <Box style={{ marginBottom: 16, backgroundColor: colors.graphite, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, padding: spacing.lg }}>
        <Text variant="heading-sm" style={{ color: colors.textPrimary, marginBottom: 8 }}>
          Safety
        </Text>
        <Text variant="body" style={{ color: colors.textSecondary, lineHeight: 22 }}>
          {lesson.safetyConsiderations}
        </Text>
      </Box>

      <Button variant="primary" onPress={onPractise} style={{ width: '100%', marginBottom: 12 }}>
        <Text variant="body" style={{ color: colors.obsidian }}>Start practising</Text>
      </Button>
      <Button variant="ghost" onPress={onBack} style={{ width: '100%' }}>
        <Text variant="body" style={{ color: colors.textPrimary }}>Back to academy</Text>
      </Button>

      {lesson.demonstrationSource && (
        <Box style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border }}>
          <Text variant="caption" style={{ color: colors.textMuted }}>
            Demonstration: {lesson.demonstrationSource}
          </Text>
          {lesson.sourceUrl && (
            <Button variant="ghost" onPress={() => {}} style={{ marginTop: 8, paddingHorizontal: 10, paddingVertical: 6 }}>
              <Text variant="caption" style={{ color: colors.lime }}>
                View external source (opens in browser)
              </Text>
            </Button>
          )}
        </Box>
      )}

      <Box style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border }}>
        <Text variant="caption" style={{ color: colors.textMuted, textAlign: 'center' }}>
          Sample demonstration data only. Not real coaching content.
        </Text>
      </Box>
    </Box>
  );
}
