import { Image, StyleSheet, Text, View } from 'react-native';

import { brand, colors, fonts, spacing } from '@/constants/theme';

type Props = {
  /** Align the clinic lockup to the end (default) or stretch as a full brand row. */
  align?: 'end' | 'start';
};

/**
 * Parent-clinic lockup: Physiospecialists mark + name.
 * Placed top-right on content screens so page titles keep the product hierarchy.
 */
export function BrandHeader({ align = 'end' }: Props) {
  return (
    <View
      style={[styles.wrap, align === 'start' ? styles.alignStart : styles.alignEnd]}
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
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  alignEnd: {
    alignSelf: 'flex-end',
    maxWidth: '100%',
  },
  alignStart: {
    alignSelf: 'stretch',
  },
  markWell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000000',
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
