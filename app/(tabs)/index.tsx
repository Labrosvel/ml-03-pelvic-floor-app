import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

import { BrandHeader } from '@/components/BrandHeader';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  displayBlockLabel,
  displayPlanName,
  estimateSessionSeconds,
  planBreakSeconds,
  type ExercisePlan,
} from '@/constants/plans';
import { brand, colors, fonts, spacing } from '@/constants/theme';
import { useAppState } from '@/context/AppState';
import { getHomePracticeStatus } from '@/lib/homePractice';

type SessionOutlineRow =
  | { type: 'block'; key: string; label: string; hold: number; rest: number; reps: number }
  | { type: 'break'; key: string; seconds: number };

function buildSessionOutline(plan: ExercisePlan, t: TFunction): SessionOutlineRow[] {
  const rows: SessionOutlineRow[] = [];
  const breakSeconds = planBreakSeconds(plan);
  let slowDone = false;
  let breakIndex = 0;

  for (const block of plan.blocks) {
    if (block.repetitions <= 0) continue;

    if (block.kind === 'quick' && slowDone) {
      if (breakSeconds > 0) {
        rows.push({
          type: 'break',
          key: `break-${breakIndex}`,
          seconds: breakSeconds,
        });
        breakIndex += 1;
      }
      slowDone = false;
    }

    rows.push({
      type: 'block',
      key: block.id,
      label: displayBlockLabel(block, t),
      hold: block.squeezeSeconds,
      rest: block.restSeconds,
      reps: block.repetitions,
    });

    if (block.kind === 'slow') {
      slowDone = true;
    }
  }

  return rows;
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const { ready, settings, plan, sessionsToday } = useAppState();
  const minutes = Math.max(1, Math.round(estimateSessionSeconds(plan) / 60));
  const planName = displayPlanName(plan, t);
  const required = Math.max(0, Math.floor(Number(plan.sessionsPerDay)) || 0);
  const outline = useMemo(() => buildSessionOutline(plan, t), [plan, t]);
  const practice = getHomePracticeStatus({
    sessionsToday,
    sessionsPerDay: plan.sessionsPerDay,
    remindersEnabled: settings.reminders.enabled,
    times: settings.reminders.times,
  });
  const dayComplete = practice.kind === 'complete';

  useEffect(() => {
    if (ready && !settings.onboardingComplete) {
      router.push('/onboarding');
    }
  }, [ready, settings.onboardingComplete]);

  if (!ready) {
    return (
      <Screen scroll={false}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>
            {t('home.loading', { appName: brand.appName })}
          </Text>
        </View>
      </Screen>
    );
  }

  const reminderLine =
    practice.kind === 'complete'
      ? t('home.dayComplete')
      : practice.kind === 'reminders-off'
        ? t('home.remindersOff')
        : practice.kind === 'scheduled'
          ? t('home.nextPractice', { time: practice.time })
          : t('home.noMoreTimes');

  return (
    <Screen>
      <BrandHeader />
      <SectionHeader
        eyebrow={settings.clinicName || t('brand.defaultClinicName')}
        title={brand.appName}
        subtitle={
          settings.displayName
            ? t('home.welcomeBack', { name: settings.displayName })
            : t('brand.tagline')
        }
      />

      <Panel style={styles.heroPanel}>
        <View style={styles.brandBar} />
        <Text style={styles.heroKicker}>{t('home.today')}</Text>
        <Text style={styles.heroTitle}>
          {dayComplete
            ? t('home.doneForToday')
            : t('home.sessionsComplete', {
                done: sessionsToday,
                total: required,
              })}
        </Text>
        {dayComplete ? (
          <Text style={styles.heroCount}>
            {t('home.sessionsComplete', {
              done: sessionsToday,
              total: required,
            })}
          </Text>
        ) : null}

        <View style={styles.outline}>
          <Text style={styles.outlineLabel}>{t('home.oneSession')}</Text>
          {outline.map((row) =>
            row.type === 'break' ? (
              <Text key={row.key} style={styles.breakLine}>
                {t('home.breakDetail', { seconds: row.seconds })}
              </Text>
            ) : (
              <View key={row.key} style={styles.blockRow}>
                <Text style={styles.blockLabel}>{row.label}</Text>
                <Text style={styles.blockDetail}>
                  {t('home.blockDetail', {
                    hold: row.hold,
                    rest: row.rest,
                    reps: row.reps,
                  })}
                </Text>
              </View>
            ),
          )}
          <Text style={styles.minutes}>{t('home.aboutMinutes', { minutes })}</Text>
          <Text style={styles.planName}>{planName}</Text>
        </View>

        <Text style={[styles.reminder, practice.kind === 'complete' && styles.reminderComplete]}>
          {reminderLine}
        </Text>

        {dayComplete ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/progress')}
            style={({ pressed }) => [styles.textLink, pressed && styles.pressed]}
          >
            <Text style={styles.progressLink}>{t('home.seeProgress')}</Text>
          </Pressable>
        ) : (
          <Button
            label={t('home.startSession')}
            variant="accent"
            onPress={() => router.push('/exercise')}
          />
        )}
      </Panel>

      <View style={styles.tips}>
        <Text style={styles.tipTitle}>{t('home.beforeTitle')}</Text>
        <Text style={styles.tipBody}>{t('home.beforeBody')}</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/plan')}
        style={({ pressed }) => [styles.clinicLinkWrap, pressed && styles.pressed]}
      >
        <Text style={styles.clinicLink}>{t('home.adjustPlan')}</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontFamily: fonts.body, color: colors.inkMuted },
  heroPanel: {
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  brandBar: {
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.teal,
    marginBottom: spacing.md,
    alignSelf: 'stretch',
  },
  heroKicker: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.orange,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 34,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  heroCount: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
    color: colors.inkMuted,
    marginBottom: spacing.sm,
  },
  outline: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  outlineLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.inkMuted,
    marginBottom: spacing.xs,
  },
  blockRow: {
    gap: 2,
  },
  blockLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.ink,
  },
  blockDetail: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkMuted,
  },
  breakLine: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkMuted,
  },
  minutes: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 22,
    color: colors.tealDeep,
    marginTop: spacing.xs,
  },
  planName: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkSoft,
  },
  reminder: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 24,
    color: colors.tealDeep,
    marginBottom: spacing.md,
  },
  reminderComplete: {
    color: colors.ink,
  },
  textLink: {
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  progressLink: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.teal,
  },
  tips: {
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  tipTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.ink,
  },
  tipBody: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
    color: colors.inkMuted,
  },
  clinicLinkWrap: {
    alignSelf: 'flex-start',
    minHeight: 44,
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  clinicLink: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkSoft,
  },
  pressed: { opacity: 0.7 },
});
