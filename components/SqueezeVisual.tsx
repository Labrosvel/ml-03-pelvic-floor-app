import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors, fonts, spacing } from '@/constants/theme';
import { ExercisePhase } from '@/constants/plans';

type Props = {
  phase: ExercisePhase;
  secondsLeft: number;
  cue: string;
  progress: number; // 0..1 within current phase
};

export function SqueezeVisual({ phase, secondsLeft, cue, progress }: Props) {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0.2);

  useEffect(() => {
    if (phase === 'squeeze') {
      scale.value = withTiming(1.18, { duration: 450, easing: Easing.out(Easing.cubic) });
      glow.value = withTiming(0.55, { duration: 450 });
    } else if (phase === 'rest') {
      scale.value = withTiming(0.92, { duration: 450, easing: Easing.out(Easing.cubic) });
      glow.value = withTiming(0.15, { duration: 450 });
    } else {
      scale.value = withTiming(1, { duration: 400 });
      glow.value = withTiming(0.25, { duration: 400 });
    }
  }, [phase, glow, scale]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: glow.value,
  }));

  const phaseLabel =
    phase === 'squeeze' ? 'Squeeze' : phase === 'rest' ? 'Rest' : phase === 'prepare' ? 'Get ready' : 'Done';

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.ring, ringStyle]}>
        <View style={styles.inner}>
          <Text style={styles.phase}>{phaseLabel}</Text>
          <Text style={styles.seconds}>{Math.max(0, secondsLeft)}</Text>
          <Text style={styles.unit}>sec</Text>
        </View>
        <View style={[styles.progressArc, { opacity: 0.35 + progress * 0.65 }]} />
      </Animated.View>
      <Text style={styles.cue}>{cue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  ring: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.tealSoft,
    borderWidth: 10,
    borderColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.teal,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  inner: {
    alignItems: 'center',
  },
  phase: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.tealDeep,
  },
  seconds: {
    fontFamily: fonts.displayBold,
    fontSize: 72,
    lineHeight: 80,
    color: colors.ink,
  },
  unit: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.inkMuted,
  },
  progressArc: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: colors.orange,
  },
  cue: {
    fontFamily: fonts.body,
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'center',
    color: colors.inkMuted,
    paddingHorizontal: spacing.md,
  },
});
