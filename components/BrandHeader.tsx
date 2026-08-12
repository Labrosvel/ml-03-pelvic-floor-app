import { Image, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { brand, colors, fonts, spacing } from '@/constants/theme';

type Props = {
  /** Compact header for secondary screens; default is the full lockup. */
  compact?: boolean;
};

/**
 * Clinic brand lockup: mark + Physiospecialists wordmark.
 * Logo mark sits on a dark badge so intentional black negative space stays correct
 * on the light app background (same treatment as the clinic site).
 */
export function BrandHeader({ compact = false }: Props) {
  const { t } = useTranslation();

  return (
    <View
      style={[styles.wrap, compact && styles.wrapCompact]}
      accessibilityRole="header"
      accessibilityLabel={`${brand.clinicName}, ${brand.appName}`}
    >
      <View style={[styles.markBadge, compact && styles.markBadgeCompact]}>
        <Image
          source={require('../assets/images/physiospecialists-mark.png')}
          style={[styles.mark, compact && styles.markCompact]}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
          accessible={false}
        />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.name, compact && styles.nameCompact]} numberOfLines={1}>
          {brand.clinicName}
        </Text>
        {!compact ? (
          <Text style={styles.product} numberOfLines={1}>
            {t('brand.productLine', { appName: brand.appName })}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  wrapCompact: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  markBadge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#0B0B0B',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  markBadgeCompact: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  mark: {
    width: 40,
    height: 40,
  },
  markCompact: {
    width: 30,
    height: 30,
  },
  copy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  name: {
    fontFamily: fonts.bodyBold,
    fontSize: 20,
    letterSpacing: 0.2,
    color: colors.tealDeep,
  },
  nameCompact: {
    fontSize: 17,
  },
  product: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.inkMuted,
  },
});
