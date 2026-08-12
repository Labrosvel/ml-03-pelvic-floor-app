import { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { Screen } from '@/components/ui/Screen';
import { DEFAULT_PLAN, ExercisePlan } from '@/constants/plans';
import { colors, fonts, spacing } from '@/constants/theme';
import { useAppState } from '@/context/AppState';

type NumberFields = {
  sessionsPerDay: string;
  slowSqueeze: string;
  slowRest: string;
  slowReps: string;
  quickSqueeze: string;
  quickRest: string;
  quickReps: string;
};

function planToFields(plan: ExercisePlan): NumberFields {
  const slow = plan.blocks.find((block) => block.id === 'slow') ?? plan.blocks[0];
  const quick = plan.blocks.find((block) => block.id === 'quick') ?? plan.blocks[1];

  return {
    sessionsPerDay: String(plan.sessionsPerDay),
    slowSqueeze: String(slow?.squeezeSeconds ?? 8),
    slowRest: String(slow?.restSeconds ?? 8),
    slowReps: String(slow?.repetitions ?? 8),
    quickSqueeze: String(quick?.squeezeSeconds ?? 1),
    quickRest: String(quick?.restSeconds ?? 1),
    quickReps: String(quick?.repetitions ?? 10),
  };
}

function parsePositiveInt(value: string, label: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    Alert.alert('Missing value', `Please enter a number for ${label}.`);
    return null;
  }
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed <= 0) {
    Alert.alert('Invalid value', `${label} must be a whole number greater than 0.`);
    return null;
  }
  return parsed;
}

export default function PlanScreen() {
  const { plan, updatePlan } = useAppState();
  const [name, setName] = useState(plan.name);
  const [fields, setFields] = useState<NumberFields>(() => planToFields(plan));

  const setField = (key: keyof NumberFields, value: string) => {
    // Allow digits only while typing; empty string is allowed so values can be cleared/amended.
    if (value !== '' && !/^\d+$/.test(value)) return;
    setFields((current) => ({ ...current, [key]: value }));
  };

  const starterFields = useMemo(() => planToFields(DEFAULT_PLAN), []);

  return (
    <Screen>
      <Text style={styles.intro}>
        Physiotherapist mode: tailor squeeze times and repetitions for each patient.
      </Text>

      <Panel style={styles.block}>
        <Text style={styles.label}>Plan name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Field
          label="Sessions per day"
          value={fields.sessionsPerDay}
          onChange={(value) => setField('sessionsPerDay', value)}
        />
      </Panel>

      <Panel style={styles.block}>
        <Text style={styles.sectionTitle}>Slow squeezes</Text>
        <Field
          label="Squeeze (sec)"
          value={fields.slowSqueeze}
          onChange={(value) => setField('slowSqueeze', value)}
        />
        <Field
          label="Rest (sec)"
          value={fields.slowRest}
          onChange={(value) => setField('slowRest', value)}
        />
        <Field
          label="Repetitions"
          value={fields.slowReps}
          onChange={(value) => setField('slowReps', value)}
        />
      </Panel>

      <Panel style={styles.block}>
        <Text style={styles.sectionTitle}>Quick squeezes</Text>
        <Field
          label="Squeeze (sec)"
          value={fields.quickSqueeze}
          onChange={(value) => setField('quickSqueeze', value)}
        />
        <Field
          label="Rest (sec)"
          value={fields.quickRest}
          onChange={(value) => setField('quickRest', value)}
        />
        <Field
          label="Repetitions"
          value={fields.quickReps}
          onChange={(value) => setField('quickReps', value)}
        />
      </Panel>

      <Button
        label="Save plan"
        onPress={async () => {
          const sessionsPerDay = parsePositiveInt(fields.sessionsPerDay, 'Sessions per day');
          const slowSqueeze = parsePositiveInt(fields.slowSqueeze, 'Slow squeeze (sec)');
          const slowRest = parsePositiveInt(fields.slowRest, 'Slow rest (sec)');
          const slowReps = parsePositiveInt(fields.slowReps, 'Slow repetitions');
          const quickSqueeze = parsePositiveInt(fields.quickSqueeze, 'Quick squeeze (sec)');
          const quickRest = parsePositiveInt(fields.quickRest, 'Quick rest (sec)');
          const quickReps = parsePositiveInt(fields.quickReps, 'Quick repetitions');

          if (
            sessionsPerDay == null ||
            slowSqueeze == null ||
            slowRest == null ||
            slowReps == null ||
            quickSqueeze == null ||
            quickRest == null ||
            quickReps == null
          ) {
            return;
          }

          const nextPlan: ExercisePlan = {
            ...plan,
            name: name.trim() || plan.name,
            sessionsPerDay,
            blocks: [
              {
                id: 'slow',
                label: 'Slow squeezes',
                kind: 'slow',
                squeezeSeconds: slowSqueeze,
                restSeconds: slowRest,
                repetitions: slowReps,
              },
              {
                id: 'quick',
                label: 'Quick squeezes',
                kind: 'quick',
                squeezeSeconds: quickSqueeze,
                restSeconds: quickRest,
                repetitions: quickReps,
              },
            ],
          };

          await updatePlan(nextPlan);
          Alert.alert('Saved', 'Exercise plan updated on this device.');
        }}
      />
      <Button
        label="Restore starter plan"
        variant="secondary"
        style={styles.spaced}
        onPress={() => {
          setName(DEFAULT_PLAN.name);
          setFields(starterFields);
        }}
      />
    </Screen>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={value}
        onChangeText={onChange}
        placeholder="0"
        placeholderTextColor={colors.inkSoft}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkMuted,
    marginBottom: spacing.lg,
  },
  block: { marginBottom: spacing.md },
  sectionTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 17,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  field: { marginBottom: spacing.xs },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.inkMuted,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
    backgroundColor: colors.bg,
  },
  spaced: { marginTop: spacing.sm },
});
