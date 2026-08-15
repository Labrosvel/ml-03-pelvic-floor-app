import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Screen } from '@/components/ui/Screen';
import { colors, fonts, spacing } from '@/constants/theme';

const SECTIONS = [
  'intro',
  'data',
  'permissions',
  'sharing',
  'retention',
  'children',
  'health',
  'contact',
  'changes',
] as const;

export default function PrivacyScreen() {
  const { t } = useTranslation();

  return (
    <Screen>
      <Text style={styles.title}>{t('privacy.title')}</Text>
      <Text style={styles.updated}>{t('privacy.updated')}</Text>

      {SECTIONS.map((key) => (
        <View key={key} style={styles.block}>
          <Text style={styles.heading}>{t(`privacy.${key}Title`)}</Text>
          <Text style={styles.body}>{t(`privacy.${key}Body`)}</Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  updated: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkMuted,
    marginBottom: spacing.lg,
  },
  block: {
    marginBottom: spacing.lg,
  },
  heading: {
    fontFamily: fonts.bodyBold,
    fontSize: 17,
    color: colors.tealDeep,
    marginBottom: spacing.xs,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink,
  },
});
