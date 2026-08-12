import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { BrandHeader } from '@/components/BrandHeader';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ARTICLE_METAS } from '@/constants/education';
import { colors, fonts, radii, spacing } from '@/constants/theme';

export default function LearnScreen() {
  const { t } = useTranslation();

  return (
    <Screen>
      <BrandHeader compact />
      <SectionHeader
        eyebrow={t('learn.eyebrow')}
        title={t('learn.title')}
        subtitle={t('learn.subtitle')}
      />

      {ARTICLE_METAS.map((article) => (
        <Pressable
          key={article.id}
          onPress={() => router.push(`/article/${article.id}`)}
          style={({ pressed }) => [styles.item, pressed && styles.pressed]}
        >
          <Text style={styles.minutes}>{t('learn.minutes', { count: article.minutes })}</Text>
          <Text style={styles.title}>{t(`articles.${article.id}.title`)}</Text>
          <Text style={styles.summary}>{t(`articles.${article.id}.summary`)}</Text>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  pressed: { opacity: 0.9 },
  minutes: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.orange,
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  summary: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkMuted,
  },
});
