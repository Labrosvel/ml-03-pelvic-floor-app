import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { getArticle } from '@/constants/education';
import { colors, fonts, spacing } from '@/constants/theme';

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const article = getArticle(String(id));

  if (!article) {
    return (
      <Screen>
        <Text style={styles.missing}>Article not found.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.minutes}>{article.minutes} min read</Text>
      <Text style={styles.title}>{article.title}</Text>
      {article.body.map((paragraph) => (
        <Text key={paragraph} style={styles.paragraph}>
          {paragraph}
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
    color: colors.sandWarm,
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
