/**
 * LibraryScreen — Exercise Library browser.
 *
 * Searchable, filterable list of exercises organised by training objective.
 * Sample / demonstration data only.
 */
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { colors, borderRadius } from '@/lib/theme';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { useState } from 'react';
import { TextInput } from 'react-native';

type Exercise = {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  durationSeconds?: number;
};

const EXERCISES: Exercise[] = [
  { id: 'squat', title: 'Bodyweight Squat', category: 'Strength', difficulty: 'beginner', equipment: ['none'], durationSeconds: 60 },
  { id: 'pushup', title: 'Push-up', category: 'Strength', difficulty: 'beginner', equipment: ['none'], durationSeconds: 45 },
  { id: 'lunge', title: 'Reverse Lunge', category: 'Strength', difficulty: 'beginner', equipment: ['none'], durationSeconds: 60 },
  { id: 'plank', title: 'Plank', category: 'Core Stability', difficulty: 'beginner', equipment: ['none'], durationSeconds: 60 },
  { id: 'lateral-shuffle', title: 'Lateral Shuffle', category: 'Foot Speed', difficulty: 'beginner', equipment: ['none'], durationSeconds: 60 },
  { id: 'line-hop', title: 'Line Hop (low-impact)', category: 'Explosive Power', difficulty: 'intermediate', equipment: ['none'], durationSeconds: 45 },
  { id: 'shadowbox', title: 'Shadowboxing Round', category: 'Conditioning', difficulty: 'beginner', equipment: ['none'], durationSeconds: 180 },
  { id: 'hip-mobility', title: 'Hip Mobility', category: 'Mobility', difficulty: 'beginner', equipment: ['none'], durationSeconds: 90 },
];

const CATEGORIES = ['All', 'Strength', 'Core Stability', 'Foot Speed', 'Explosive Power', 'Conditioning', 'Mobility'];

interface LibraryScreenProps {
  onExercisePress: (exerciseId: string) => void;
}

export function LibraryScreen({ onExercisePress }: LibraryScreenProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filtered = EXERCISES.filter((ex) => {
    const matchesSearch = ex.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || ex.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <Box bg="obsidian" flex={1} p={20} style={{ backgroundColor: colors.obsidian }}>
      <Text variant="heading" style={{ color: colors.textPrimary, marginBottom: 8 }}>
        Exercise Library
      </Text>
      <Text variant="body-muted" style={{ color: colors.textSecondary, marginBottom: 16 }}>
        Sample data only — not real coaching content.
      </Text>

      <Box style={{ marginBottom: 16, backgroundColor: colors.graphite, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
        <Text variant="caption" style={{ color: colors.textMuted, marginRight: 8 }}>Search</Text>
        <Box style={{ flex: 1 }}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search exercises…"
            placeholderTextColor={colors.textMuted}
            style={{ color: colors.textPrimary, paddingVertical: 6 }}
          />
        </Box>
      </Box>

      <Box style={{ flexDirection: 'row', marginBottom: 16 }}>
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'primary' : 'ghost'}
            onPress={() => setSelectedCategory(cat)}
            style={{ marginRight: 8, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: selectedCategory === cat ? colors.lime : 'transparent', borderRadius: borderRadius.full }}
          >
            <Text variant="caption" style={{ color: selectedCategory === cat ? colors.obsidian : colors.textPrimary, fontWeight: '600' as const }}>
              {cat}
            </Text>
          </Button>
        ))}
      </Box>

      {filtered.length === 0 ? (
        <EmptyState title="No exercises found" body="Try adjusting your search or filter." />
      ) : (
        filtered.map((ex) => (
          <Card
            key={ex.id}
            style={{ marginBottom: 12, backgroundColor: colors.graphite }}
          >
            <Box style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Text variant="heading-sm" style={{ color: colors.textPrimary, marginBottom: 2 }}>
                  {ex.title}
                </Text>
                <Text variant="caption" style={{ color: colors.textSecondary }}>
                  {ex.category} • {ex.difficulty}
                </Text>
              </Box>
              <Button variant="ghost" onPress={() => onExercisePress(ex.id)} style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
                <Text variant="body" style={{ color: colors.textPrimary }}>Open</Text>
              </Button>
            </Box>
          </Card>
        ))
      )}

      <Box style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border }}>
        <Text variant="caption" style={{ color: colors.textMuted, textAlign: 'center' }}>
          Demonstration data only. Real exercises require authorised demonstrations.
        </Text>
      </Box>
    </Box>
  );
}
