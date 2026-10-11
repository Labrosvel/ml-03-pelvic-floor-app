import { Image, StyleSheet, Text, View } from 'react-native';

import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { brand, colors, fonts, spacing } from '@/constants/theme';

/**
 * Parent-clinic lockup + compact language control, top-right on every screen.
 */
export function BrandHeader() {
  return (
    <View style={styles.wrap}>
      <View
        style={styles.lockup}
        accessibilityRole="header"
        accessibilityLabel={brand.clinicName}
      >
        <View style={styles.markWell}>
          <Image
            source={require('../assets/images/physiospecialists-mark.png')}
            style={styles.mark}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
            accessible={false}
          />
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {brand.clinicName}
        </Text>
      </View>
      <LanguageSwitcher />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    maxWidth: '100%',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  lockup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: spacing.sm,
  },
  markWell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mark: {
    width: 30,
    height: 30,
  },
  name: {
    flexShrink: 1,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    letterSpacing: 0.1,
    color: colors.tealDeep,
  },
});
