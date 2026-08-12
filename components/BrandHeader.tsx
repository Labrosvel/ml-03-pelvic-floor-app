import { Image, StyleSheet, Text, View } from 'react-native';

import { brand, colors, fonts, spacing } from '@/constants/theme';

/**
 * Standard clinic lockup: logo mark + Physiospecialists wordmark.
 * Mark sits on a dark circle so the logo’s black negative space stays correct
 * on the light app background.
 */
export function BrandHeader() {
  return (
    <View
      style={styles.wrap}
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
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    marginBottom: spacing.lg,
  },
  markWell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mark: {
    width: 34,
    height: 34,
  },
  name: {
    flexShrink: 1,
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    letterSpacing: 0.15,
    color: colors.tealDeep,
  },
});
