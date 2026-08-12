import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { BrandHeader } from '@/components/BrandHeader';
import { Panel } from '@/components/ui/Panel';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { displayPlanName } from '@/constants/plans';
import { colors, fonts, spacing } from '@/constants/theme';
import { useAppState } from '@/context/AppState';

function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ProgressScreen() {
  const { t, i18n } = useTranslation();
  const { sessions, sessionsToday, plan } = useAppState();
  const last7 = sessions.filter((session) => {
    const age = Date.now() - new Date(session.completedAt).getTime();
    return age <= 7 * 24 * 60 * 60 * 1000;
  }).length;
  const locale = i18n.language === 'el' ? 'el-GR' : 'en-GB';
  const planName = displayPlanName(plan, t);

  return (
    <Screen>
      <BrandHeader />
      <SectionHeader
        eyebrow={t('progress.eyebrow')}
        title={t('progress.title')}
        subtitle={t('progress.subtitle')}
      />

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{sessionsToday}</Text>
          <Text style={styles.statLabel}>{t('progress.today')}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{last7}</Text>
          <Text style={styles.statLabel}>{t('progress.last7Days')}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{sessions.length}</Text>
          <Text style={styles.statLabel}>{t('progress.allTime')}</Text>
        </View>
      </View>

      <Text style={styles.listTitle}>{t('progress.recentSessions')}</Text>
      {sessions.length === 0 ? (
        <Panel>
          <Text style={styles.empty}>
            {t('progress.empty', { plan: planName.toLowerCase() })}
          </Text>
        </Panel>
      ) : (
        sessions.slice(0, 20).map((session) => (
          <Panel key={session.id} style={styles.row}>
            <Text style={styles.rowTitle}>{formatDate(session.completedAt, locale)}</Text>
            <Text style={styles.rowBody}>
              {t('progress.sessionMeta', {
                completed: session.completedReps,
                target: session.targetReps,
                minutes: Math.round(session.durationSeconds / 60) || 1,
              })}
            </Text>
          </Panel>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.tealDeep,
  },
  statLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkMuted,
    marginTop: 2,
  },
  listTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  row: {
    marginBottom: spacing.sm,
    paddingVertical: spacing.md,
  },
  rowTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    color: colors.ink,
  },
  rowBody: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.inkMuted,
    marginTop: 4,
  },
  empty: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkMuted,
  },
});
