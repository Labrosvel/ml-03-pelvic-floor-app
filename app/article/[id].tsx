import { useLocalSearchParams } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Screen } from '@/components/ui/Screen';
import { getArticleMeta } from '@/constants/education';
import { colors, fonts, radii, spacing } from '@/constants/theme';

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
  const imageLabel = t(`articles.${article.id}.imageLabel`, { defaultValue: '' });
  const imageCredit = t(`articles.${article.id}.imageCredit`, { defaultValue: '' });

  return (
    <Screen>
      <Text style={styles.minutes}>{t('learn.minutesRead', { count: article.minutes })}</Text>
      <Text style={styles.title}>{t(`articles.${article.id}.title`)}</Text>
      {article.image ? (
        <View style={styles.figure}>
          {/*
            Wrap Image in an aspect-ratio box. On web, Image with width:'100%' can
            expand to intrinsic height (letterboxing with resizeMode contain).
          */}
          <View style={styles.imageFrame}>
            <Image
              source={article.image}
              style={styles.image}
              resizeMode="contain"
              accessibilityRole="image"
              accessibilityLabel={imageLabel || undefined}
            />
          </View>
          {imageCredit ? <Text style={styles.credit}>{imageCredit}</Text> : null}
        </View>
      ) : null}
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
  figure: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  imageFrame: {
    width: '100%',
    aspectRatio: 1400 / 1020,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  credit: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.inkSoft,
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
