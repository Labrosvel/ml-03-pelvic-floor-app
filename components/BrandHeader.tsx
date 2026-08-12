import { Image, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { brand, colors, fonts, spacing } from '@/constants/theme';

/**
 * Product + parent clinic hierarchy (common for clinic-affiliated apps):
 * PelviGuide leads on the left; Physiospecialists mark sits top-right as affiliation.
 */
export function BrandHeader() {
  const { t } = useTranslation();

  return (
    <View
      style={styles.wrap}
      accessibilityRole="header"
      accessibilityLabel={`${brand.appName}, ${t('brand.fromClinic', { clinic: brand.clinicName })}`}
    >
      <View style={styles.product}>
        <Text style={styles.appName} numberOfLines={1}>
          {brand.appName}
        </Text>
        <Text style={styles.affiliation} numberOfLines={1}>
          {t('brand.fromClinic', { clinic: brand.clinicName })}
        </Text>
      </View>
      <View
        style={styles.markWell}
        accessibilityLabel={brand.clinicName}
        accessible
      >
        <Image
          source={require('../assets/images/physiospecialists-mark.png')}
          style={styles.mark}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
          accessible={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  product: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  appName: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 32,
    color: colors.tealDeep,
  },
  affiliation: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.inkMuted,
  },
  markWell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mark: {
    width: 36,
    height: 36,
  },
});
