import { useMemo, useRef, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { Screen, useScreenFieldFocus } from '@/components/ui/Screen';
import { createDefaultPlan, ExercisePlan } from '@/constants/plans';
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

export default function PlanScreen() {
  const { t } = useTranslation();
  const { plan, updatePlan } = useAppState();
  const [name, setName] = useState(plan.name);
  const [fields, setFields] = useState<NumberFields>(() => planToFields(plan));

  const setField = (key: keyof NumberFields, value: string) => {
    // Allow digits only while typing; empty string is allowed so values can be cleared/amended.
    if (value !== '' && !/^\d+$/.test(value)) return;
    setFields((current) => ({ ...current, [key]: value }));
  };

  const starterPlan = useMemo(() => createDefaultPlan(t), [t]);
  const starterFields = useMemo(() => planToFields(starterPlan), [starterPlan]);
  const insets = useSafeAreaInsets();
  const keyboardVerticalOffset =
    insets.top + (Platform.OS === 'ios' ? 44 : Platform.OS === 'android' ? 56 : 0);

  const parsePositiveInt = (value: string, label: string): number | null => {
    const trimmed = value.trim();
    if (!trimmed) {
      Alert.alert(t('plan.missingTitle'), t('plan.missingBody', { label }));
      return null;
    }
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed <= 0) {
      Alert.alert(t('plan.invalidTitle'), t('plan.invalidBody', { label }));
      return null;
    }
    return parsed;
  };

  return (
    <Screen keyboardVerticalOffset={keyboardVerticalOffset}>
      <Text style={styles.intro}>{t('plan.intro')}</Text>

      <Panel style={styles.block}>
        <Text style={styles.label}>{t('plan.planName')}</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Field
          label={t('plan.sessionsPerDay')}
          value={fields.sessionsPerDay}
          onChange={(value) => setField('sessionsPerDay', value)}
        />
      </Panel>

      <Panel style={styles.block}>
        <Text style={styles.sectionTitle}>{t('plan.slowSqueezes')}</Text>
        <Field
          label={t('plan.squeezeSec')}
          value={fields.slowSqueeze}
          onChange={(value) => setField('slowSqueeze', value)}
        />
        <Field
          label={t('plan.restSec')}
          value={fields.slowRest}
          onChange={(value) => setField('slowRest', value)}
        />
        <Field
          label={t('plan.repetitions')}
          value={fields.slowReps}
          onChange={(value) => setField('slowReps', value)}
        />
      </Panel>

      <Panel style={styles.block}>
        <Text style={styles.sectionTitle}>{t('plan.quickSqueezes')}</Text>
        <Field
          label={t('plan.squeezeSec')}
          value={fields.quickSqueeze}
          onChange={(value) => setField('quickSqueeze', value)}
        />
        <Field
          label={t('plan.restSec')}
          value={fields.quickRest}
          onChange={(value) => setField('quickRest', value)}
        />
        <Field
          label={t('plan.repetitions')}
          value={fields.quickReps}
          onChange={(value) => setField('quickReps', value)}
        />
      </Panel>

      <Button
        label={t('plan.savePlan')}
        onPress={async () => {
          const sessionsPerDay = parsePositiveInt(
            fields.sessionsPerDay,
            t('plan.fieldSessionsPerDay'),
          );
          const slowSqueeze = parsePositiveInt(fields.slowSqueeze, t('plan.fieldSlowSqueeze'));
          const slowRest = parsePositiveInt(fields.slowRest, t('plan.fieldSlowRest'));
          const slowReps = parsePositiveInt(fields.slowReps, t('plan.fieldSlowReps'));
          const quickSqueeze = parsePositiveInt(fields.quickSqueeze, t('plan.fieldQuickSqueeze'));
          const quickRest = parsePositiveInt(fields.quickRest, t('plan.fieldQuickRest'));
          const quickReps = parsePositiveInt(fields.quickReps, t('plan.fieldQuickReps'));

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
                label: t('plan.slowSqueezes'),
                kind: 'slow',
                squeezeSeconds: slowSqueeze,
                restSeconds: slowRest,
                repetitions: slowReps,
              },
              {
                id: 'quick',
                label: t('plan.quickSqueezes'),
                kind: 'quick',
                squeezeSeconds: quickSqueeze,
                restSeconds: quickRest,
                repetitions: quickReps,
              },
            ],
          };

          await updatePlan(nextPlan);
          Alert.alert(t('plan.savedTitle'), t('plan.savedBody'));
        }}
      />
      <Button
        label={t('plan.restoreStarter')}
        variant="secondary"
        style={styles.spaced}
        onPress={() => {
          setName(starterPlan.name);
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
  const scrollFieldIntoView = useScreenFieldFocus();
  const fieldRef = useRef<View>(null);

  return (
    <View ref={fieldRef} style={styles.field} collapsable={false}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={value}
        onChangeText={onChange}
        placeholder="0"
        placeholderTextColor={colors.inkSoft}
        onFocus={() => {
          requestAnimationFrame(() => scrollFieldIntoView(fieldRef.current));
          setTimeout(() => scrollFieldIntoView(fieldRef.current), 120);
        }}
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
