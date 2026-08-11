import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { estimateSessionSeconds, totalTargetReps } from '@/constants/plans';
import { brand, colors, fonts, spacing } from '@/constants/theme';
import { useAppState } from '@/context/AppState';

export default function HomeScreen() {
  const { ready, settings, plan, sessionsToday } = useAppState();
  const minutes = Math.max(1, Math.round(estimateSessionSeconds(plan) / 60));

  useEffect(() => {
    if (ready && !settings.onboardingComplete) {
      router.push('/onboarding');
    }
  }, [ready, settings.onboardingComplete]);

  if (!ready) {
    return (
      <Screen scroll={false}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading {brand.appName}…</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        eyebrow={settings.clinicName || brand.defaultClinicName}
        title={brand.appName}
        subtitle={
          settings.displayName
            ? `Welcome back, ${settings.displayName}. Ready for today’s practice?`
            : brand.tagline
        }
      />

      <Panel style={styles.heroPanel}>
        <View style={styles.brandBar} />
        <Text style={styles.heroKicker}>Today</Text>
        <Text style={styles.heroTitle}>
          {sessionsToday}/{plan.sessionsPerDay} sessions complete
        </Text>
        <Text style={styles.heroBody}>
          About {minutes} min · {totalTargetReps(plan)} squeezes · {plan.name}
        </Text>
        <Button
          label="Start session"
          variant="accent"
          onPress={() => router.push('/exercise')}
          style={styles.cta}
        />
        <Button
          label="Adjust plan"
          variant="secondary"
          onPress={() => router.push('/plan')}
        />
      </Panel>

      <View style={styles.tips}>
        <Text style={styles.tipTitle}>Before you begin</Text>
        <Text style={styles.tipBody}>
          Soften your jaw and shoulders. Breathe normally. Squeeze upward and inward,
          then fully release during rest.
        </Text>
      </View>
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
  heroBody: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkMuted,
    marginBottom: spacing.lg,
  },
  cta: { marginBottom: spacing.sm },
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
});
