import { StyleSheet, Text, View } from 'react-native';

import { Panel } from '@/components/ui/Panel';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { colors, fonts, spacing } from '@/constants/theme';
import { useAppState } from '@/context/AppState';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ProgressScreen() {
  const { sessions, sessionsToday, plan } = useAppState();
  const last7 = sessions.filter((session) => {
    const age = Date.now() - new Date(session.completedAt).getTime();
    return age <= 7 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <Screen>
      <SectionHeader
        eyebrow="History"
        title="Progress"
        subtitle="A simple record you can share with your physiotherapist."
      />

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{sessionsToday}</Text>
          <Text style={styles.statLabel}>Today</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{last7}</Text>
          <Text style={styles.statLabel}>Last 7 days</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{sessions.length}</Text>
          <Text style={styles.statLabel}>All time</Text>
        </View>
      </View>

      <Text style={styles.listTitle}>Recent sessions</Text>
      {sessions.length === 0 ? (
        <Panel>
          <Text style={styles.empty}>
            No sessions yet. Complete your first {plan.name.toLowerCase()} session from Home.
          </Text>
        </Panel>
      ) : (
        sessions.slice(0, 20).map((session) => (
          <Panel key={session.id} style={styles.row}>
            <Text style={styles.rowTitle}>{formatDate(session.completedAt)}</Text>
            <Text style={styles.rowBody}>
              {session.completedReps}/{session.targetReps} reps ·{' '}
              {Math.round(session.durationSeconds / 60) || 1} min
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
