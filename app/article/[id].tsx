import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Screen } from '@/components/ui/Screen';
import { getArticleMeta } from '@/constants/education';
import { colors, fonts, spacing } from '@/constants/theme';

export default function ArticleScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const articleId = String(id);
  const article = getArticleMeta(articleId);

  if (!article) {
    return (
      <Screen>
        <Text style={styles.missing}>{t('learn.missing')}</Text>
      </Screen>
    );
  }

  const body = t(`articles.${article.id}.body`, { returnObjects: true });
  const paragraphs = Array.isArray(body) ? body : [String(body)];

  return (
    <Screen>
      <Text style={styles.minutes}>{t('learn.minutesRead', { count: article.minutes })}</Text>
      <Text style={styles.title}>{t(`articles.${article.id}.title`)}</Text>
      {paragraphs.map((paragraph) => (
        <Text key={String(paragraph)} style={styles.paragraph}>
          {String(paragraph)}
        </Text>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  minutes: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.orange,
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 38,
    color: colors.ink,
    marginBottom: spacing.lg,
  },
  paragraph: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 26,
    color: colors.inkMuted,
    marginBottom: spacing.md,
  },
  missing: {
    fontFamily: fonts.body,
    color: colors.inkMuted,
  },
});
