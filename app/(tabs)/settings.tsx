import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { BrandHeader } from '@/components/BrandHeader';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SOUND_PACKS, type SoundPackId } from '@/constants/sounds';
import { colors, fonts, spacing } from '@/constants/theme';
import { WEB_BUILD_ID } from '@/constants/buildInfo';
import { useAppState } from '@/context/AppState';
import { AppLanguage } from '@/i18n/types';
import { areRemindersSupported } from '@/lib/reminders';
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

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { settings, updateSettings, resetAll } = useAppState();

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
                ? settings.reminders.times.join(' · ')
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
