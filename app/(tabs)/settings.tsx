import { router } from 'expo-router';
import { Alert, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { brand, colors, fonts, spacing } from '@/constants/theme';
import { useAppState } from '@/context/AppState';
import { syncReminders } from '@/lib/reminders';

export default function SettingsScreen() {
  const { settings, updateSettings, resetAll } = useAppState();

  return (
    <Screen>
      <SectionHeader
        eyebrow={brand.appName}
        title="Settings"
        subtitle="Customise for your clinic and patients. Data stays on this device for now."
      />

      <Panel style={styles.block}>
        <Text style={styles.label}>Clinic name</Text>
        <TextInput
          value={settings.clinicName}
          onChangeText={(clinicName) => void updateSettings({ clinicName })}
          placeholder="e.g. Maria Papadopoulos Physio"
          placeholderTextColor={colors.inkSoft}
          style={styles.input}
        />

        <Text style={styles.label}>Your name (optional)</Text>
        <TextInput
          value={settings.displayName}
          onChangeText={(displayName) => void updateSettings({ displayName })}
          placeholder="Patient first name"
          placeholderTextColor={colors.inkSoft}
          style={styles.input}
        />
      </Panel>

      <Panel style={styles.block}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Reminders</Text>
            <Text style={styles.rowBody}>
              {settings.reminders.times.join(' · ')}
            </Text>
          </View>
          <Switch
            value={settings.reminders.enabled}
            onValueChange={async (enabled) => {
              const reminders = { ...settings.reminders, enabled };
              await updateSettings({ reminders });
              await syncReminders(reminders);
            }}
            trackColor={{ true: colors.teal, false: colors.border }}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.rowTitle}>Haptics</Text>
          <Switch
            value={settings.hapticsEnabled}
            onValueChange={(hapticsEnabled) => void updateSettings({ hapticsEnabled })}
            trackColor={{ true: colors.teal, false: colors.border }}
          />
        </View>
      </Panel>

      <Button label="Edit exercise plan" onPress={() => router.push('/plan')} />
      <Button
        label="Replay welcome"
        variant="secondary"
        style={styles.spaced}
        onPress={() => router.push('/onboarding')}
      />
      <Button
        label="Reset local data"
        variant="ghost"
        onPress={() => {
          Alert.alert(
            'Reset all data?',
            'This clears plan customisations, settings, and session history on this device.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Reset',
                style: 'destructive',
                onPress: () => void resetAll(),
              },
            ],
          );
        }}
      />

      <Text style={styles.disclaimer}>
        PelviGuide supports home practice between physiotherapy appointments. It is not a
        substitute for clinical assessment and is not affiliated with Squeezy or any other
        commercial pelvic health app.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: spacing.md },
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  rowText: { flex: 1, paddingRight: spacing.md },
  rowTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.ink,
  },
  rowBody: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkMuted,
    marginTop: 2,
  },
  spaced: { marginTop: spacing.sm, marginBottom: spacing.sm },
  disclaimer: {
    marginTop: spacing.lg,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    color: colors.inkSoft,
  },
});
