import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { LANGUAGE_OPTIONS, LANGUAGE_SHORT_CODES } from '@/constants/languages';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useAppState } from '@/context/AppState';
import { resolveLanguage } from '@/i18n';

/**
 * Compact language control for the clinic lockup — current code, tap for the list.
 */
export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { settings, updateSettings } = useAppState();
  const [open, setOpen] = useState(false);
  const shortCode = LANGUAGE_SHORT_CODES[resolveLanguage(settings.language)];
  const currentLabel = t(
    `settings.${LANGUAGE_OPTIONS.find((option) => option.value === settings.language)?.labelKey ?? 'languageSystem'}`,
  );

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t('settings.language')}, ${currentLabel}`}
        accessibilityHint={t('settings.languageHint')}
        onPress={() => setOpen(true)}
        hitSlop={8}
        style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}
      >
        <Ionicons name="globe-outline" size={16} color={colors.tealDeep} />
        <Text style={styles.triggerCode}>{shortCode}</Text>
        <Ionicons name="chevron-down" size={14} color={colors.tealDeep} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <View style={styles.sheet}>
            <Text style={styles.title}>{t('settings.language')}</Text>
            {LANGUAGE_OPTIONS.map((option) => {
              const selected = settings.language === option.value;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    void updateSettings({ language: option.value });
                    setOpen(false);
                  }}
                  style={[styles.option, selected && styles.optionSelected]}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                    {t(`settings.${option.labelKey}`)}
                  </Text>
                  {selected ? (
                    <Ionicons name="checkmark" size={20} color={colors.tealDeep} />
                  ) : null}
                </Pressable>
              );
            })}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
              onPress={() => setOpen(false)}
              style={styles.close}
            >
              <Text style={styles.closeText}>{t('common.close')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 36,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  triggerPressed: {
    opacity: 0.85,
  },
  triggerCode: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 0.4,
    color: colors.tealDeep,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-start',
    paddingTop: 72,
    paddingHorizontal: spacing.lg,
  },
  sheet: {
    alignSelf: 'flex-end',
    width: '100%',
    maxWidth: 320,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.ink,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  option: {
    minHeight: 48,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionSelected: {
    backgroundColor: colors.tealSoft,
  },
  optionText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    color: colors.inkMuted,
  },
  optionTextSelected: {
    fontFamily: fonts.bodyBold,
    color: colors.tealDeep,
  },
  close: {
    marginTop: spacing.sm,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.teal,
  },
});
