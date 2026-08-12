import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { SqueezeVisual } from '@/components/SqueezeVisual';
import { Button } from '@/components/ui/Button';
import { totalTargetReps } from '@/constants/plans';
import { colors, fonts, spacing } from '@/constants/theme';
import { useAppState } from '@/context/AppState';
import { buildSessionSteps } from '@/lib/session';
import { playCue, playStepCue } from '@/lib/sound';

export default function ExerciseScreen() {
  const { t } = useTranslation();
  const { plan, settings, addSession } = useAppState();
  const steps = useMemo(() => buildSessionSteps(plan, t), [plan, t]);
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(steps[0]?.seconds ?? 0);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const startedAt = useRef(Date.now());
  const step = steps[index];

  useEffect(() => {
    if (!step || finished || paused) return;

    setSecondsLeft(step.seconds);

    if (settings.hapticsEnabled && step.phase === 'squeeze') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (settings.soundEnabled) {
      playStepCue(settings.soundPack, step);
    }
  }, [
    index,
    step,
    finished,
    paused,
    settings.hapticsEnabled,
    settings.soundEnabled,
    settings.soundPack,
  ]);

  useEffect(() => {
    if (!step || finished || paused) return;

    const timer = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          clearInterval(timer);
          const next = index + 1;
          if (next >= steps.length) {
            setFinished(true);
            const durationSeconds = Math.round((Date.now() - startedAt.current) / 1000);
            void addSession({
              id: `session-${Date.now()}`,
              planId: plan.id,
              completedAt: new Date().toISOString(),
              durationSeconds,
              completedReps: totalTargetReps(plan),
              targetReps: totalTargetReps(plan),
            });
            if (settings.hapticsEnabled) {
              void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            if (settings.soundEnabled) {
              void playCue(settings.soundPack, 'complete');
            }
            return 0;
          }
          setIndex(next);
          return steps[next].seconds;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    index,
    step,
    finished,
    paused,
    steps,
    addSession,
    plan,
    settings.hapticsEnabled,
    settings.soundEnabled,
    settings.soundPack,
  ]);

  const progress = step ? 1 - secondsLeft / Math.max(step.seconds, 1) : 1;

  if (finished) {
    return (
      <LinearGradient colors={[colors.bg, colors.bgDeep]} style={styles.flex}>
        <SafeAreaView style={styles.finish}>
          <Text style={styles.finishEyebrow}>{t('exercise.niceWork')}</Text>
          <Text style={styles.finishTitle}>{t('exercise.sessionComplete')}</Text>
          <Text style={styles.finishBody}>{t('exercise.finishBody')}</Text>
          <Button label={t('common.done')} onPress={() => router.back()} />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!step) {
    return null;
  }

  return (
    <LinearGradient colors={[colors.bg, colors.tealSoft]} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.topAction}>{t('common.close')}</Text>
          </Pressable>
          <Text style={styles.topMeta}>
            {step.blockLabel}
            {step.repTotal > 0 ? ` · ${step.repIndex}/${step.repTotal}` : ''}
          </Text>
          <Pressable onPress={() => setPaused((value) => !value)} hitSlop={12}>
            <Text style={styles.topAction}>
              {paused ? t('common.resume') : t('common.pause')}
            </Text>
          </Pressable>
        </View>

        <View style={styles.center}>
          <SqueezeVisual
            phase={step.phase}
            secondsLeft={secondsLeft}
            cue={step.cue}
            progress={progress}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  topBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topAction: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.tealDeep,
    minWidth: 64,
  },
  topMeta: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.inkMuted,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  finish: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  finishEyebrow: {
    fontFamily: fonts.bodyMedium,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.orange,
  },
  finishTitle: {
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.ink,
  },
  finishBody: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.inkMuted,
    marginBottom: spacing.md,
  },
});
