import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ARTICLES } from '@/constants/education';
import { colors, fonts, radii, spacing } from '@/constants/theme';

export default function LearnScreen() {
  return (
    <Screen>
      <SectionHeader
        eyebrow="Education"
        title="Learn"
        subtitle="Short guides to support technique and confidence."
      />

      {ARTICLES.map((article) => (
        <Pressable
          key={article.id}
          onPress={() => router.push(`/article/${article.id}`)}
          style={({ pressed }) => [styles.item, pressed && styles.pressed]}
        >
          <Text style={styles.minutes}>{article.minutes} min</Text>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.summary}>{article.summary}</Text>
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
