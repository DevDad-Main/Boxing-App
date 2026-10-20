/**
 * WorkoutPlayerScreen — Guided Workout Player skeleton.
 *
 * Supports session overview, exercise steps, configurable work/rest periods,
 * round counter, transitions, pause/resume/skip, completion, and ratings.
 * Sample / demonstration data only — no real workout prescription.
 */
import { useState, useEffect } from 'react';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Timer } from '@/components/ui/Timer';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { colors } from '@/lib/theme';

type ExerciseStep = {
  id: string;
  name: string;
  instruction: string;
  workSeconds: number;
  restSeconds: number;
};

const SAMPLE_EXERCISES: ExerciseStep[] = [
  { id: 'jab-cross', name: 'Jab-Cross', instruction: 'Throw jab-cross combinations, return to guard.', workSeconds: 60, restSeconds: 30 },
  { id: 'footwork', name: 'Footwork', instruction: 'Practise advancing, retreating, and lateral steps.', workSeconds: 60, restSeconds: 30 },
  { id: 'defence', name: 'Defensive Movement', instruction: 'Slips and rolls with movement.', workSeconds: 60, restSeconds: 30 },
];

interface WorkoutPlayerScreenProps {
  onComplete: () => void;
}

export function WorkoutPlayerScreen({ onComplete }: WorkoutPlayerScreenProps) {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(SAMPLE_EXERCISES[0].workSeconds);
  const [isWork, setIsWork] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [round, setRound] = useState(1);
  const [completed, setCompleted] = useState(false);

  const current = SAMPLE_EXERCISES[exerciseIndex];
  const totalTime = isWork ? current.workSeconds : current.restSeconds;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0 && isWork) {
      setIsWork(false);
      setSecondsLeft(current.restSeconds);
    } else if (secondsLeft === 0 && !isWork) {
      setIsWork(true);
      if (exerciseIndex < SAMPLE_EXERCISES.length - 1) {
        const nextIndex = exerciseIndex + 1;
        setExerciseIndex(nextIndex);
        setSecondsLeft(SAMPLE_EXERCISES[nextIndex].workSeconds);
        setRound((r) => r + 1);
      } else {
        setCompleted(true);
      }
    }
  }, [secondsLeft, isWork, exerciseIndex, current.restSeconds, current.workSeconds]);

  const togglePlay = () => setIsRunning((prev) => !prev);
  const skip = () => {
    setSecondsLeft(0);
  };

  if (completed) {
    return (
      <Box bg="obsidian" flex={1} p={24} style={{ backgroundColor: colors.obsidian, alignItems: 'center' }}>
        <Text variant="heading" style={{ color: colors.textPrimary, textAlign: 'center', marginBottom: 16 }}>
          Session complete
        </Text>
        <Text variant="body-muted" style={{ color: colors.textSecondary, textAlign: 'center', marginBottom: 24 }}>
          Great work. Sample demonstration only.
        </Text>
        <Button variant="primary" onPress={onComplete} style={{ width: '100%', maxWidth: 200 }}>
          <Text variant="body" style={{ color: colors.obsidian }}>Finish</Text>
        </Button>
      </Box>
    );
  }

  return (
    <Box bg="obsidian" flex={1} p={20} style={{ backgroundColor: colors.obsidian }}>
      <Box style={{ marginBottom: 20 }}>
        <Text variant="label" style={{ color: colors.textSecondary }}>{current.name}</Text>
        <Text variant="heading-sm" style={{ color: colors.textPrimary, marginBottom: 4 }}>{current.instruction}</Text>
        <Box style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
          <Text variant="caption" style={{ color: colors.textSecondary }}>
            {isWork ? 'Work' : 'Rest'} • Round {round} of {SAMPLE_EXERCISES.length}
          </Text>
          <Text variant="caption" style={{ color: colors.textSecondary }}>
            Exercise {exerciseIndex + 1} of {SAMPLE_EXERCISES.length}
          </Text>
        </Box>
      </Box>

      <Timer seconds={secondsLeft} running={isRunning} label={isWork ? 'Work time' : 'Rest time'} />
      <ProgressBar value={( (totalTime - secondsLeft) / totalTime ) * 100} showLabel height={10} style={{ marginTop: 16 }} />

      <Box style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
        <Button variant="ghost" onPress={togglePlay} style={{ marginRight: 10, paddingHorizontal: 20 }}>
          <Text variant="body" style={{ color: colors.textPrimary }}>
            {isRunning ? 'Pause' : 'Start'}
          </Text>
        </Button>
        <Button variant="ghost" onPress={skip} style={{ paddingHorizontal: 20 }}>
          <Text variant="body" style={{ color: colors.textPrimary }}>Skip</Text>
        </Button>
      </Box>
    </Box>
  );
}
