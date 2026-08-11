import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { brand, colors, fonts, spacing } from '@/constants/theme';
import { useAppState } from '@/context/AppState';

export default function OnboardingScreen() {
  const { settings, updateSettings } = useAppState();
  const [clinicName, setClinicName] = useState(settings.clinicName);
  const [displayName, setDisplayName] = useState(settings.displayName);

  return (
    <Screen scroll={false} contentStyle={styles.content}>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>Welcome</Text>
        <Text style={styles.title}>{brand.appName}</Text>
        <Text style={styles.body}>
          A calm companion for pelvic floor practice. Built so patients can follow a
          physiotherapist-guided plan at home — and so you can preview the experience in
          Expo Go before store release.
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Clinic / physiotherapist name</Text>
        <TextInput
          style={styles.input}
          value={clinicName}
          onChangeText={setClinicName}
          placeholder="Your mother's clinic name"
          placeholderTextColor={colors.inkSoft}
        />
        <Text style={styles.label}>Patient first name (optional)</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="e.g. Anna"
          placeholderTextColor={colors.inkSoft}
        />
      </View>

      <Button
        label="Continue"
        variant="accent"
        onPress={async () => {
          await updateSettings({
            clinicName: clinicName.trim() || brand.defaultClinicName,
            displayName: displayName.trim(),
            onboardingComplete: true,
          });
          router.back();
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  copy: { gap: spacing.sm },
  eyebrow: {
    fontFamily: fonts.bodyMedium,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: colors.orange,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 40,
    color: colors.tealDeep,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.inkMuted,
  },
  form: { gap: spacing.xs },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.inkMuted,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
    backgroundColor: colors.surface,
  },
});
