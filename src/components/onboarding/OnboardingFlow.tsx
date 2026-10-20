/**
 * OnboardingFlow — multi-step onboarding wizard.
 *
 * Collects only useful information:
 * - Experience level
 * - Primary goals
 * - Available training days
 * - Typical session duration
 * - Training location & equipment
 * - Preferred intensity
 * - Movement limitations / exercises to avoid
 *
 * Manages step state internally. On completion, calls onComplete.
 */
import { TextInput } from 'react-native';
import { useState } from 'react';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { colors, spacing } from '@/lib/theme';
import { ProgressBar } from '@/components/ui/ProgressBar';

type Step =
  | 'welcome'
  | 'experience'
  | 'goals'
  | 'availability'
  | 'equipment'
  | 'intensity'
  | 'limitations'
  | 'complete';

const STEPS: Step[] = [
  'welcome',
  'experience',
  'goals',
  'availability',
  'equipment',
  'intensity',
  'limitations',
  'complete',
];

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  trainingDaysPerWeek: number;
  typicalSessionMinutes: number;
  trainingLocation: 'home' | 'gym' | 'outdoor' | 'mixed';
  availableEquipment: string[];
  preferredIntensity: 'low' | 'moderate' | 'high';
  movementLimitations: string;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    experienceLevel: 'beginner',
    goals: [],
    trainingDaysPerWeek: 3,
    typicalSessionMinutes: 30,
    trainingLocation: 'home',
    availableEquipment: [],
    preferredIntensity: 'moderate',
    movementLimitations: '',
  });

  const step = STEPS[stepIndex];
  const progress = ((stepIndex) / (STEPS.length - 1)) * 100;

  return (
    <Box bg="obsidian" flex={1} p={24}>
      <Box style={{ marginBottom: spacing.lg }}>
        <Text variant="label" style={{ color: colors.textSecondary }}>
          Step {stepIndex + 1} of {STEPS.length}
        </Text>
        <ProgressBar value={progress} showLabel height={6} style={{ marginTop: 6 }} />
      </Box>

      {step === 'welcome' && <WelcomeStep onNext={() => setStepIndex(1)} />}
      {step === 'experience' && (
        <ExperienceStep
          value={data.experienceLevel}
          onChange={(v) => setData({ ...data, experienceLevel: v })}
          onNext={() => setStepIndex(2)}
          onBack={() => setStepIndex(0)}
        />
      )}
      {step === 'goals' && (
        <GoalsStep
          value={data.goals}
          onChange={(v) => setData({ ...data, goals: v })}
          onNext={() => setStepIndex(3)}
          onBack={() => setStepIndex(1)}
        />
      )}
      {step === 'availability' && (
        <AvailabilityStep
          days={data.trainingDaysPerWeek}
          minutes={data.typicalSessionMinutes}
          onDaysChange={(v) => setData({ ...data, trainingDaysPerWeek: v })}
          onMinutesChange={(v) => setData({ ...data, typicalSessionMinutes: v })}
          onNext={() => setStepIndex(4)}
          onBack={() => setStepIndex(2)}
        />
      )}
      {step === 'equipment' && (
        <EquipmentStep
          location={data.trainingLocation}
          equipment={data.availableEquipment}
          onLocationChange={(v) => setData({ ...data, trainingLocation: v })}
          onEquipmentChange={(v) => setData({ ...data, availableEquipment: v })}
          onNext={() => setStepIndex(5)}
          onBack={() => setStepIndex(3)}
        />
      )}
      {step === 'intensity' && (
        <IntensityStep
          value={data.preferredIntensity}
          onChange={(v) => setData({ ...data, preferredIntensity: v })}
          onNext={() => setStepIndex(6)}
          onBack={() => setStepIndex(4)}
        />
      )}
      {step === 'limitations' && (
        <LimitationsStep
          value={data.movementLimitations}
          onChange={(v) => setData({ ...data, movementLimitations: v })}
          onNext={() => onComplete(data)}
          onBack={() => setStepIndex(5)}
        />
      )}
      {step === 'complete' && <CompleteStep onFinish={onComplete} data={data} />}
    </Box>
  );
}

// ---- Step components ----

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <Box style={{ alignItems: 'center' }}>
      <Text variant="heading" style={{ color: colors.textPrimary, textAlign: 'center', marginBottom: 16 }}>
        Welcome to Boxing
      </Text>
      <Text variant="body" style={{ color: colors.textSecondary, textAlign: 'center', marginBottom: 24, lineHeight: 24 }}>
        Let's set up your training profile. We'll ask a few questions to recommend
        the right starting point — no medical details required.
      </Text>
      <Button variant="primary" onPress={onNext} style={{ width: '100%', maxWidth: 200 }}>
        Get started
      </Button>
    </Box>
  );
}

function ExperienceStep({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: OnboardingData['experienceLevel'];
  onChange: (v: OnboardingData['experienceLevel']) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const options: Array<{ key: OnboardingData['experienceLevel']; label: string; desc: string }> = [
    { key: 'beginner', label: 'Beginner', desc: 'No boxing experience. Start with foundations.' },
    { key: 'intermediate', label: 'Intermediate', desc: 'Some experience. Working on combinations and footwork.' },
    { key: 'advanced', label: 'Advanced', desc: 'Comfortable with technique. Refining and conditioning.' },
  ];

  return (
    <Box>
      <Text variant="heading-sm" style={{ color: colors.textPrimary, marginBottom: 8 }}>
        What's your experience level?
      </Text>
      <Text variant="body-muted" style={{ color: colors.textSecondary, marginBottom: 20 }}>
        This helps us set an appropriate starting difficulty.
      </Text>
      <Box style={{ marginBottom: 24 }}>
        {options.map((o) => (
          <Button
            key={o.key}
            variant={value === o.key ? 'primary' : 'ghost'}
            onPress={() => onChange(o.key)}
            style={{
              width: '100%',
              alignItems: 'flex-start',
              backgroundColor: value === o.key ? colors.lime : 'transparent',
              marginBottom: 10,
              borderRadius: 10,
            }}
          >
            <Text variant="body" style={{ color: value === o.key ? colors.obsidian : colors.textPrimary }}>
              {o.label}
            </Text>
            <Text variant="caption" style={{ color: value === o.key ? colors.obsidian : colors.textSecondary, marginTop: 2 }}>
              {o.desc}
            </Text>
          </Button>
        ))}
      </Box>
      <Box style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button variant="ghost" onPress={onBack} style={{ paddingHorizontal: 16 }}>
          <Text variant="body" style={{ color: colors.textSecondary }}>
            Back
          </Text>
        </Button>
        <Button variant="primary" onPress={onNext} disabled={!value}>
          <Text variant="body" style={{ color: colors.obsidian }}>Continue</Text>
        </Button>
      </Box>
    </Box>
  );
}

function GoalsStep({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const options = [
    'Learn boxing fundamentals',
    'Improve fitness',
    'Build strength',
    'Improve footwork',
    'Stress relief',
  ];

  const toggle = (goal: string) => {
    onChange(value.includes(goal) ? value.filter((g) => g !== goal) : [...value, goal]);
  };

  return (
    <Box>
      <Text variant="heading-sm" style={{ color: colors.textPrimary, marginBottom: 8 }}>
        What are your primary goals?
      </Text>
      <Text variant="body-muted" style={{ color: colors.textSecondary, marginBottom: 20 }}>
        Select all that apply. You can change these later.
      </Text>
      <Box style={{ marginBottom: 24 }}>
        {options.map((g) => (
          <Button
            key={g}
            variant={value.includes(g) ? 'primary' : 'ghost'}
            onPress={() => toggle(g)}
            style={{
              width: '100%',
              alignItems: 'flex-start',
              backgroundColor: value.includes(g) ? colors.lime : 'transparent',
              marginBottom: 10,
              borderRadius: 10,
            }}
          >
            <Text variant="body" style={{ color: value.includes(g) ? colors.obsidian : colors.textPrimary }}>
              {g}
            </Text>
          </Button>
        ))}
      </Box>
      <Box style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button variant="ghost" onPress={onBack} style={{ paddingHorizontal: 16 }}>
          <Text variant="body" style={{ color: colors.textSecondary }}>Back</Text>
        </Button>
        <Button variant="primary" onPress={onNext} disabled={value.length === 0}>
          <Text variant="body" style={{ color: colors.obsidian }}>Continue</Text>
        </Button>
      </Box>
    </Box>
  );
}

function AvailabilityStep({
  days,
  minutes,
  onDaysChange,
  onMinutesChange,
  onNext,
  onBack,
}: {
  days: number;
  minutes: number;
  onDaysChange: (v: number) => void;
  onMinutesChange: (v: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <Box>
      <Text variant="heading-sm" style={{ color: colors.textPrimary, marginBottom: 8 }}>
        How often can you train?
      </Text>
      <Text variant="body-muted" style={{ color: colors.textSecondary, marginBottom: 16 }}>
        Training days per week
      </Text>
      <Box style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <Button variant="ghost" onPress={() => onDaysChange(Math.max(1, days - 1))} style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
          <Text variant="body" style={{ color: colors.textSecondary }}>-</Text>
        </Button>
        <Text variant="stat" style={{ color: colors.lime, marginHorizontal: 12 }}>
          {days}
        </Text>
        <Button variant="ghost" onPress={() => onDaysChange(Math.min(7, days + 1))} style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
          <Text variant="body" style={{ color: colors.textSecondary }}>+</Text>
        </Button>
        <Text variant="body-muted" style={{ color: colors.textSecondary, marginLeft: 12 }}>days</Text>
      </Box>
      <Box style={{ marginBottom: 24 }}>
        <Text variant="label" style={{ color: colors.textSecondary }}>Typical session duration</Text>
        <Box style={{ flexDirection: 'row', marginTop: 8 }}>
          {['15', '30', '45', '60'].map((m) => (
            <Button
              key={m}
              variant={minutes === parseInt(m) ? 'primary' : 'ghost'}
              onPress={() => onMinutesChange(parseInt(m))}
              style={{ marginRight: 8, paddingVertical: 8, paddingHorizontal: 12 }}
            >
              <Text variant="body" style={{ color: minutes === parseInt(m) ? colors.obsidian : colors.textPrimary }}>
                {m} min
              </Text>
            </Button>
          ))}
        </Box>
      </Box>
      <Box style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button variant="ghost" onPress={onBack} style={{ paddingHorizontal: 16 }}>
          <Text variant="body" style={{ color: colors.textSecondary }}>Back</Text>
        </Button>
        <Button variant="primary" onPress={onNext}>
          <Text variant="body" style={{ color: colors.obsidian }}>Continue</Text>
        </Button>
      </Box>
    </Box>
  );
}

function EquipmentStep({
  location,
  equipment,
  onLocationChange,
  onEquipmentChange,
  onNext,
  onBack,
}: {
  location: OnboardingData['trainingLocation'];
  equipment: string[];
  onLocationChange: (v: OnboardingData['trainingLocation']) => void;
  onEquipmentChange: (v: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const locations: { key: OnboardingData['trainingLocation']; label: string }[] = [
    { key: 'home', label: 'Home' },
    { key: 'gym', label: 'Gym' },
    { key: 'outdoor', label: 'Outdoor' },
    { key: 'mixed', label: 'Mixed' },
  ];
  const equipmentOptions = ['none', 'jump_rope', 'dumbbells', 'mirror', 'heavy_bag', 'mat'];

  const toggleEquip = (e: string) => {
    onEquipmentChange(equipment.includes(e) ? equipment.filter((x) => x !== e) : [...equipment, e]);
  };

  return (
    <Box>
      <Text variant="heading-sm" style={{ color: colors.textPrimary, marginBottom: 8 }}>
        Where do you train?
      </Text>
      <Box style={{ marginBottom: 20 }}>
        {locations.map((l) => (
          <Button
            key={l.key}
            variant={location === l.key ? 'primary' : 'ghost'}
            onPress={() => onLocationChange(l.key)}
            style={{
              width: '100%',
              alignItems: 'flex-start',
              backgroundColor: location === l.key ? colors.lime : 'transparent',
              marginBottom: 8,
              borderRadius: 10,
            }}
          >
            <Text variant="body" style={{ color: location === l.key ? colors.obsidian : colors.textPrimary }}>
              {l.label}
            </Text>
          </Button>
        ))}
      </Box>
      <Text variant="heading-sm" style={{ color: colors.textPrimary, marginBottom: 8, marginTop: 16 }}>
        Available equipment
      </Text>
      <Text variant="body-muted" style={{ color: colors.textSecondary, marginBottom: 12 }}>
        Select all you have. "None" is fine — bodyweight only.
      </Text>
      <Box style={{ marginBottom: 24 }}>
        {equipmentOptions.map((e) => (
          <Button
            key={e}
            variant={equipment.includes(e) ? 'primary' : 'ghost'}
            onPress={() => toggleEquip(e)}
            style={{
              width: '100%',
              alignItems: 'flex-start',
              backgroundColor: equipment.includes(e) ? colors.lime : 'transparent',
              marginBottom: 8,
              borderRadius: 10,
            }}
          >
            <Text variant="body" style={{ color: equipment.includes(e) ? colors.obsidian : colors.textPrimary }}>
              {e.replace('_', ' ')}
            </Text>
          </Button>
        ))}
      </Box>
      <Box style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button variant="ghost" onPress={onBack} style={{ paddingHorizontal: 16 }}>
          <Text variant="body" style={{ color: colors.textSecondary }}>Back</Text>
        </Button>
        <Button variant="primary" onPress={onNext}>
          <Text variant="body" style={{ color: colors.obsidian }}>Continue</Text>
        </Button>
      </Box>
    </Box>
  );
}

function IntensityStep({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: OnboardingData['preferredIntensity'];
  onChange: (v: OnboardingData['preferredIntensity']) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const options: { key: OnboardingData['preferredIntensity']; label: string; desc: string }[] = [
    { key: 'low', label: 'Low', desc: 'Gentle, recovery-focused' },
    { key: 'moderate', label: 'Moderate', desc: 'Steady progress, sustainable' },
    { key: 'high', label: 'High', desc: 'Challenging, condition-focused' },
  ];

  return (
    <Box>
      <Text variant="heading-sm" style={{ color: colors.textPrimary, marginBottom: 8 }}>
        Preferred training intensity
      </Text>
      <Box style={{ marginBottom: 24 }}>
        {options.map((o) => (
          <Button
            key={o.key}
            variant={value === o.key ? 'primary' : 'ghost'}
            onPress={() => onChange(o.key)}
            style={{
              width: '100%',
              alignItems: 'flex-start',
              backgroundColor: value === o.key ? colors.lime : 'transparent',
              marginBottom: 10,
              borderRadius: 10,
            }}
          >
            <Text variant="body" style={{ color: value === o.key ? colors.obsidian : colors.textPrimary }}>
              {o.label}
            </Text>
            <Text variant="caption" style={{ color: value === o.key ? colors.obsidian : colors.textSecondary, marginTop: 2 }}>
              {o.desc}
            </Text>
          </Button>
        ))}
      </Box>
      <Box style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button variant="ghost" onPress={onBack} style={{ paddingHorizontal: 16 }}>
          <Text variant="body" style={{ color: colors.textSecondary }}>Back</Text>
        </Button>
        <Button variant="primary" onPress={onNext}>
          <Text variant="body" style={{ color: colors.obsidian }}>Continue</Text>
        </Button>
      </Box>
    </Box>
  );
}

function LimitationsStep({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <Box>
      <Text variant="heading-sm" style={{ color: colors.textPrimary, marginBottom: 8 }}>
        Any movement limitations?
      </Text>
      <Text variant="body-muted" style={{ color: colors.textSecondary, marginBottom: 12 }}>
        Tell us about any injuries or exercises to avoid. No medical details required.
      </Text>
      <TextInput
        style={{
          backgroundColor: colors.graphite,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          color: colors.textPrimary,
          padding: 12,
          minHeight: 80,
        }}
        value={value}
        onChangeText={onChange}
        placeholder="e.g. avoid jumping, wrist discomfort, none"
        placeholderTextColor={colors.textMuted}
        multiline
      />
      <Box style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
        <Button variant="ghost" onPress={onBack} style={{ paddingHorizontal: 16 }}>
          <Text variant="body" style={{ color: colors.textSecondary }}>Back</Text>
        </Button>
        <Button variant="primary" onPress={onNext}>
          <Text variant="body" style={{ color: colors.obsidian }}>Continue</Text>
        </Button>
      </Box>
    </Box>
  );
}

function CompleteStep({
  data,
  onFinish,
}: {
  data: OnboardingData;
  onFinish: (d: OnboardingData) => void;
}) {
  return (
    <Box style={{ alignItems: 'center' }}>
      <Text variant="heading" style={{ color: colors.textPrimary, textAlign: 'center', marginBottom: 16 }}>
        You're all set
      </Text>
      <Text variant="body-muted" style={{ color: colors.textSecondary, textAlign: 'center', marginBottom: 24 }}>
        Based on your profile, we'll recommend a starting programme.
      </Text>
      <Button variant="primary" onPress={() => onFinish(data)} style={{ width: '100%', maxWidth: 200 }}>
        Start training
      </Button>
    </Box>
  );
}
