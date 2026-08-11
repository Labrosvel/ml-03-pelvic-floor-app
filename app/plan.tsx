import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { Screen } from '@/components/ui/Screen';
import { DEFAULT_PLAN, ExercisePlan } from '@/constants/plans';
import { colors, fonts, spacing } from '@/constants/theme';
import { useAppState } from '@/context/AppState';

function numberOr(value: string, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default function PlanScreen() {
  const { plan, updatePlan } = useAppState();
  const [draft, setDraft] = useState<ExercisePlan>(plan);

  const slow = draft.blocks.find((block) => block.id === 'slow') ?? draft.blocks[0];
  const quick = draft.blocks.find((block) => block.id === 'quick') ?? draft.blocks[1];

  const updateBlock = (
    blockId: string,
    patch: Partial<(typeof draft.blocks)[number]>,
  ) => {
    setDraft((current) => ({
      ...current,
      blocks: current.blocks.map((block) =>
        block.id === blockId ? { ...block, ...patch } : block,
      ),
    }));
  };

  return (
    <Screen>
      <Text style={styles.intro}>
        Physiotherapist mode: tailor squeeze times and repetitions for each patient.
      </Text>

      <Panel style={styles.block}>
        <Text style={styles.label}>Plan name</Text>
        <TextInput
          style={styles.input}
          value={draft.name}
          onChangeText={(name) => setDraft((current) => ({ ...current, name }))}
        />

        <Text style={styles.label}>Sessions per day</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={String(draft.sessionsPerDay)}
          onChangeText={(value) =>
            setDraft((current) => ({
              ...current,
              sessionsPerDay: numberOr(value, current.sessionsPerDay),
            }))
          }
        />
      </Panel>

      {slow ? (
        <Panel style={styles.block}>
          <Text style={styles.sectionTitle}>Slow squeezes</Text>
          <Field
            label="Squeeze (sec)"
            value={String(slow.squeezeSeconds)}
            onChange={(value) =>
              updateBlock(slow.id, { squeezeSeconds: numberOr(value, slow.squeezeSeconds) })
            }
          />
          <Field
            label="Rest (sec)"
            value={String(slow.restSeconds)}
            onChange={(value) =>
              updateBlock(slow.id, { restSeconds: numberOr(value, slow.restSeconds) })
            }
          />
          <Field
            label="Repetitions"
            value={String(slow.repetitions)}
            onChange={(value) =>
              updateBlock(slow.id, { repetitions: numberOr(value, slow.repetitions) })
            }
          />
        </Panel>
      ) : null}

      {quick ? (
        <Panel style={styles.block}>
          <Text style={styles.sectionTitle}>Quick squeezes</Text>
          <Field
            label="Squeeze (sec)"
            value={String(quick.squeezeSeconds)}
            onChange={(value) =>
              updateBlock(quick.id, { squeezeSeconds: numberOr(value, quick.squeezeSeconds) })
            }
          />
          <Field
            label="Rest (sec)"
            value={String(quick.restSeconds)}
            onChange={(value) =>
              updateBlock(quick.id, { restSeconds: numberOr(value, quick.restSeconds) })
            }
          />
          <Field
            label="Repetitions"
            value={String(quick.repetitions)}
            onChange={(value) =>
              updateBlock(quick.id, { repetitions: numberOr(value, quick.repetitions) })
            }
          />
        </Panel>
      ) : null}

      <Button
        label="Save plan"
        onPress={async () => {
          await updatePlan(draft);
          Alert.alert('Saved', 'Exercise plan updated on this device.');
        }}
      />
      <Button
        label="Restore starter plan"
        variant="secondary"
        style={styles.spaced}
        onPress={() => setDraft(DEFAULT_PLAN)}
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
