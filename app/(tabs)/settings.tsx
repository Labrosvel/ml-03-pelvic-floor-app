import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { BrandHeader } from '@/components/BrandHeader';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SOUND_PACKS, type SoundPackId } from '@/constants/sounds';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { WEB_BUILD_ID } from '@/constants/buildInfo';
import { isEmailJsConfigured } from '@/constants/notifications';
import { useAppState } from '@/context/AppState';
import { AppLanguage } from '@/i18n/types';
import { sendPhysioDailyCompleteEmail } from '@/lib/notifyPhysio';
import { areRemindersSupported, parseTime } from '@/lib/reminders';
import { previewSoundPack } from '@/lib/sound';

const LANGUAGE_OPTIONS: {
  value: AppLanguage;
  labelKey: 'languageSystem' | 'languageEn' | 'languageEl';
}[] = [
  { value: 'system', labelKey: 'languageSystem' },
  { value: 'en', labelKey: 'languageEn' },
  { value: 'el', labelKey: 'languageEl' },
];

const SOUND_PACK_LABEL_KEYS: Record<SoundPackId, 'soundPackGentle' | 'soundPackChime' | 'soundPackClick'> =
  {
    gentle: 'soundPackGentle',
    chime: 'soundPackChime',
    click: 'soundPackClick',
  };

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => hour);
const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, index) => index * 5);

function padTimePart(value: number): string {
  return String(value).padStart(2, '0');
}

function formatReminderTime(hour: number, minute: number): string {
  return `${padTimePart(hour)}:${padTimePart(minute)}`;
}

function ReminderTimeField({
  label,
  value,
  onCommit,
}: {
  label: string;
  value: string;
  onCommit: (next: string) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const initial = parseTime(value) ?? { hour: 9, minute: 0 };
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);

  useEffect(() => {
    if (!open) return;
    const next = parseTime(value) ?? { hour: 9, minute: 0 };
    setHour(next.hour);
    setMinute(next.minute);
  }, [open, value]);

  const minuteOptions = useMemo(() => {
    if (MINUTE_OPTIONS.includes(minute)) return MINUTE_OPTIONS;
    return [...MINUTE_OPTIONS, minute].sort((a, b) => a - b);
  }, [minute]);

  return (
    <View style={styles.reminderField}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${value}`}
        onPress={() => setOpen(true)}
        style={styles.timeTrigger}
      >
        <Text style={styles.timeTriggerValue}>{value}</Text>
        <Text style={styles.timeTriggerHint}>{t('settings.reminderPickHint')}</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.pickerOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <View style={styles.pickerSheet}>
            <Text style={styles.pickerTitle}>{label}</Text>
            <Text style={styles.pickerPreview}>{formatReminderTime(hour, minute)}</Text>

            <View style={styles.pickerColumns}>
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerColumnLabel}>{t('settings.reminderHour')}</Text>
                <ScrollView
                  style={styles.pickerScroll}
                  contentContainerStyle={styles.pickerScrollContent}
                  showsVerticalScrollIndicator
                >
                  {HOUR_OPTIONS.map((option) => {
                    const selected = option === hour;
                    return (
                      <Pressable
                        key={`hour-${option}`}
                        onPress={() => setHour(option)}
                        style={[styles.pickerOption, selected && styles.pickerOptionSelected]}
                      >
                        <Text
                          style={[
                            styles.pickerOptionText,
                            selected && styles.pickerOptionTextSelected,
                          ]}
                        >
                          {padTimePart(option)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              <View style={styles.pickerColumn}>
                <Text style={styles.pickerColumnLabel}>{t('settings.reminderMinute')}</Text>
                <ScrollView
                  style={styles.pickerScroll}
                  contentContainerStyle={styles.pickerScrollContent}
                  showsVerticalScrollIndicator
                >
                  {minuteOptions.map((option) => {
                    const selected = option === minute;
                    return (
                      <Pressable
                        key={`minute-${option}`}
                        onPress={() => setMinute(option)}
                        style={[styles.pickerOption, selected && styles.pickerOptionSelected]}
                      >
                        <Text
                          style={[
                            styles.pickerOptionText,
                            selected && styles.pickerOptionTextSelected,
                          ]}
                        >
                          {padTimePart(option)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            <Button
              label={t('common.done')}
              onPress={() => {
                const next = formatReminderTime(hour, minute);
                if (next !== value) onCommit(next);
                setOpen(false);
              }}
            />
            <Button
              label={t('common.cancel')}
              variant="ghost"
              style={styles.pickerCancel}
              onPress={() => setOpen(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { settings, plan, updateSettings, resetAll } = useAppState();
  const emailConfigured = isEmailJsConfigured();
  const reminderTimes = settings.reminders.times;

  async function sendTestAlert() {
    if (!emailConfigured) {
      Alert.alert(t('settings.testAlertFailedTitle'), t('settings.emailNotConfigured'));
      return;
    }
    if (!settings.physioNotifyEmail.trim()) {
      Alert.alert(t('settings.testAlertFailedTitle'), t('settings.testAlertMissingEmail'));
      return;
    }
    const patientName = settings.displayName.trim() || t('settings.testAlertSamplePatient');
    const result = await sendPhysioDailyCompleteEmail(
      {
        physioEmail: settings.physioNotifyEmail,
        patientName,
        clinicName: settings.clinicName,
        planName: plan.name,
        sessionsCompleted: plan.sessionsPerDay,
        sessionsRequired: plan.sessionsPerDay,
        completedDate: new Date().toLocaleDateString('en-GB', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      },
      { skipDailyLimit: true },
    );
    if (result.sent) {
      Alert.alert(t('settings.testAlertSentTitle'), t('settings.testAlertSentBody'));
    } else if (result.reason === 'email_not_configured') {
      Alert.alert(t('settings.testAlertFailedTitle'), t('settings.emailNotConfigured'));
    } else if (result.reason === 'missing_physio_email') {
      Alert.alert(t('settings.testAlertFailedTitle'), t('settings.testAlertMissingEmail'));
    } else {
      Alert.alert(
        t('settings.testAlertFailedTitle'),
        result.detail
          ? t('settings.testAlertFailedDetail', { detail: result.detail })
          : t('settings.testAlertFailedBody'),
      );
    }
  }

  function updateReminderTime(index: number, nextTime: string) {
    const times = reminderTimes.map((time, timeIndex) => (timeIndex === index ? nextTime : time));
    void updateSettings({
      reminders: {
        ...settings.reminders,
        times,
      },
    });
  }

  return (
    <Screen>
      <BrandHeader />
      <SectionHeader
        title={t('settings.title')}
        subtitle={t('settings.subtitle')}
      />

      <Panel style={styles.block}>
        <Text style={styles.label}>{t('settings.clinicName')}</Text>
        <TextInput
          value={settings.clinicName}
          onChangeText={(clinicName) => void updateSettings({ clinicName })}
          placeholder={t('settings.clinicPlaceholder')}
          placeholderTextColor={colors.inkSoft}
          style={styles.input}
        />

        <Text style={styles.label}>{t('settings.yourName')}</Text>
        <TextInput
          value={settings.displayName}
          onChangeText={(displayName) => void updateSettings({ displayName })}
          placeholder={t('settings.yourNamePlaceholder')}
          placeholderTextColor={colors.inkSoft}
          style={styles.input}
        />
        <Text style={styles.hint}>{t('settings.yourNameHint')}</Text>

        <Text style={styles.label}>{t('settings.physioNotifyEmail')}</Text>
        <TextInput
          value={settings.physioNotifyEmail}
          onChangeText={(physioNotifyEmail) => void updateSettings({ physioNotifyEmail })}
          placeholder={t('settings.physioNotifyEmailPlaceholder')}
          placeholderTextColor={colors.inkSoft}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          style={styles.input}
        />
        <Text style={styles.hint}>{t('settings.physioNotifyEmailHint')}</Text>

        {!emailConfigured ? (
          <Text style={styles.warning}>{t('settings.emailNotConfigured')}</Text>
        ) : null}

        <Button
          label={t('settings.testAlert')}
          variant="secondary"
          onPress={() => void sendTestAlert()}
          style={styles.testAlertButton}
        />
      </Panel>

      <Panel style={styles.block}>
        <Text style={styles.rowTitle}>{t('settings.language')}</Text>
        <View style={styles.languageRow}>
          {LANGUAGE_OPTIONS.map((option) => {
            const selected = settings.language === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => void updateSettings({ language: option.value })}
                style={[styles.languageChip, selected && styles.languageChipSelected]}
              >
                <Text
                  style={[styles.languageChipText, selected && styles.languageChipTextSelected]}
                >
                  {t(`settings.${option.labelKey}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Panel>

      <Panel style={styles.block}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>{t('settings.reminders')}</Text>
            <Text style={styles.rowBody}>
              {areRemindersSupported()
                ? t('settings.remindersHint', { count: plan.sessionsPerDay })
                : t('settings.remindersExpoGo')}
            </Text>
          </View>
          <Switch
            value={areRemindersSupported() ? settings.reminders.enabled : false}
            disabled={!areRemindersSupported()}
            onValueChange={(enabled) => {
              void updateSettings({
                reminders: { ...settings.reminders, enabled },
              });
            }}
            trackColor={{ true: colors.teal, false: colors.border }}
          />
        </View>

        <View style={styles.reminderTimes}>
          {reminderTimes.map((time, index) => (
            <ReminderTimeField
              key={`reminder-${index}`}
              label={t('settings.reminderTime', { n: index + 1 })}
              value={time}
              onCommit={(next) => updateReminderTime(index, next)}
            />
          ))}
          <Text style={styles.hint}>{t('settings.remindersSyncHint')}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowTitle}>{t('settings.haptics')}</Text>
          <Switch
            value={settings.hapticsEnabled}
            onValueChange={(hapticsEnabled) => void updateSettings({ hapticsEnabled })}
            trackColor={{ true: colors.teal, false: colors.border }}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>{t('settings.sound')}</Text>
            <Text style={styles.rowBody}>{t('settings.soundHint')}</Text>
          </View>
          <Switch
            value={settings.soundEnabled}
            onValueChange={(soundEnabled) => void updateSettings({ soundEnabled })}
            trackColor={{ true: colors.teal, false: colors.border }}
          />
        </View>

        {settings.soundEnabled ? (
          <View style={styles.soundPackBlock}>
            <Text style={styles.rowTitle}>{t('settings.soundPack')}</Text>
            <Text style={styles.rowBody}>{t('settings.soundPackHint')}</Text>
            <View style={styles.languageRow}>
              {SOUND_PACKS.map((pack) => {
                const selected = settings.soundPack === pack;
                return (
                  <Pressable
                    key={pack}
                    onPress={() => {
                      void updateSettings({ soundPack: pack });
                      previewSoundPack(pack);
                    }}
                    style={[styles.languageChip, selected && styles.languageChipSelected]}
                  >
                    <Text
                      style={[
                        styles.languageChipText,
                        selected && styles.languageChipTextSelected,
                      ]}
                    >
                      {t(`settings.${SOUND_PACK_LABEL_KEYS[pack]}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}
      </Panel>

      <Button label={t('settings.editPlan')} onPress={() => router.push('/plan')} />
      <Button
        label={t('settings.replayWelcome')}
        variant="secondary"
        style={styles.spaced}
        onPress={() => router.push('/onboarding')}
      />
      <Button
        label={t('settings.resetData')}
        variant="ghost"
        onPress={() => {
          Alert.alert(t('settings.resetTitle'), t('settings.resetBody'), [
            { text: t('common.cancel'), style: 'cancel' },
            {
              text: t('common.reset'),
              style: 'destructive',
              onPress: () => void resetAll(),
            },
          ]);
        }}
      />

      <Button
        label={t('settings.privacyPolicy')}
        variant="ghost"
        onPress={() => router.push('/privacy')}
      />

      <Text style={styles.disclaimer}>{t('settings.disclaimer')}</Text>
      <Text style={styles.buildId}>{t('settings.webBuild', { id: WEB_BUILD_ID })}</Text>
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
  hint: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.inkSoft,
    marginTop: spacing.xs,
  },
  warning: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.orange,
    marginTop: spacing.sm,
  },
  testAlertButton: {
    marginTop: spacing.md,
  },
  languageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  languageChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bg,
  },
  languageChipSelected: {
    borderColor: colors.teal,
    backgroundColor: colors.tealSoft,
  },
  languageChipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.inkMuted,
  },
  languageChipTextSelected: {
    color: colors.tealDeep,
    fontFamily: fonts.bodyBold,
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
  reminderTimes: {
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    marginBottom: spacing.xs,
  },
  reminderField: {
    marginBottom: spacing.xs,
  },
  timeTrigger: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    backgroundColor: colors.bg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  timeTriggerValue: {
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    color: colors.ink,
  },
  timeTriggerHint: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.teal,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    maxHeight: '85%',
  },
  pickerTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    color: colors.ink,
  },
  pickerPreview: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.tealDeep,
  },
  pickerColumns: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  pickerColumn: {
    flex: 1,
  },
  pickerColumnLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.inkMuted,
    marginBottom: spacing.sm,
  },
  pickerScroll: {
    maxHeight: 220,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.bg,
  },
  pickerScrollContent: {
    padding: spacing.xs,
  },
  pickerOption: {
    minHeight: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  pickerOptionSelected: {
    backgroundColor: colors.tealSoft,
  },
  pickerOptionText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 18,
    color: colors.inkMuted,
  },
  pickerOptionTextSelected: {
    fontFamily: fonts.bodyBold,
    color: colors.tealDeep,
  },
  pickerCancel: {
    marginTop: spacing.xs,
  },
  spaced: { marginTop: spacing.sm, marginBottom: spacing.sm },
  soundPackBlock: {
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    marginTop: spacing.xs,
  },
  disclaimer: {
    marginTop: spacing.lg,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    color: colors.inkSoft,
  },
  buildId: {
    marginTop: spacing.sm,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkSoft,
  },
});
