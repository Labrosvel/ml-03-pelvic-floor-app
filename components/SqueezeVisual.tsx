import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { colors, fonts, radii, spacing } from '@/constants/theme';
import { ExercisePhase } from '@/constants/plans';

type Props = {
  phase: ExercisePhase;
  secondsLeft: number;
  cue: string;
  progress: number; // 0..1 within current phase
  repIndex?: number;
  repTotal?: number;
  /** When both are set, show a squeeze|rest cycle strip for this block. */
  squeezeSeconds?: number;
  restSeconds?: number;
};

const RING_SIZE = 248;
const RING_STROKE = 14;
const INNER_SIZE = RING_SIZE - RING_STROKE * 2;

function phaseAccent(phase: ExercisePhase) {
  if (phase === 'squeeze') return colors.orange;
  if (phase === 'rest') return colors.teal;
  if (phase === 'done') return colors.success;
  return colors.tealDeep;
}

function phaseSoft(phase: ExercisePhase) {
  if (phase === 'squeeze') return colors.orangeSoft;
  if (phase === 'rest') return colors.tealSoft;
  return colors.bgDeep;
}

function RingProgress({
  progress,
  color,
  trackColor,
  phaseKey,
}: {
  progress: number;
  color: string;
  trackColor: string;
  phaseKey: string;
}) {
  const animated = useSharedValue(0);
  const half = RING_SIZE / 2;

  useEffect(() => {
    // Snap back at the start of each phase so the wheel restarts cleanly.
    if (progress <= 0.02) {
      animated.value = 0;
    }
    animated.value = withTiming(Math.min(1, Math.max(0, progress)), {
      duration: 900,
      easing: Easing.linear,
    });
  }, [progress, phaseKey, animated]);

  const rightStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${Math.min(animated.value * 2, 1) * 180 - 180}deg` }],
  }));

  const leftStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${Math.max(animated.value * 2 - 1, 0) * 180 - 180}deg` }],
  }));

  return (
    <View style={[styles.ringTrack, { backgroundColor: trackColor }]}>
      <View style={[styles.halfClip, { left: half }]}>
        <Animated.View style={[styles.spinner, { left: -half }, rightStyle]}>
          <View style={[styles.halfFill, { left: half, backgroundColor: color }]} />
        </Animated.View>
      </View>
      <View style={[styles.halfClip, { left: 0 }]}>
        <Animated.View style={[styles.spinner, { left: 0 }, leftStyle]}>
          <View style={[styles.halfFill, { left: 0, backgroundColor: color }]} />
        </Animated.View>
      </View>
    </View>
  );
}

function CycleStrip({
  phase,
  phaseProgress,
  squeezeSeconds,
  restSeconds,
}: {
  phase: ExercisePhase;
  phaseProgress: number;
  squeezeSeconds: number;
  restSeconds: number;
}) {
  const { t } = useTranslation();
  const total = Math.max(1, squeezeSeconds + restSeconds);
  const squeezeShare = squeezeSeconds / total;
  const cycleProgress =
    phase === 'squeeze'
      ? phaseProgress * squeezeShare
      : phase === 'rest'
        ? squeezeShare + phaseProgress * (1 - squeezeShare)
        : 0;

  const marker = useSharedValue(cycleProgress);
  const trackWidth = useSharedValue(280);

  useEffect(() => {
    if (phase === 'squeeze' && phaseProgress <= 0.02) {
      marker.value = 0;
    }
    marker.value = withTiming(cycleProgress, { duration: 900, easing: Easing.linear });
  }, [cycleProgress, phase, phaseProgress, marker]);

  const markerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: marker.value * trackWidth.value - 2 }],
  }));

  if (phase !== 'squeeze' && phase !== 'rest') {
    return null;
  }

  return (
    <View style={styles.cycleWrap} accessibilityRole="progressbar">
      <View style={styles.cycleLabels}>
        <Text style={[styles.cycleLabel, { color: colors.orange }]}>{t('phase.squeeze')}</Text>
        <Text style={[styles.cycleLabel, { color: colors.teal }]}>{t('phase.rest')}</Text>
      </View>
      <View
        style={styles.cycleTrack}
        onLayout={(event) => {
          trackWidth.value = event.nativeEvent.layout.width;
        }}
      >
        <View style={[styles.cycleSqueeze, { flex: squeezeSeconds }]} />
        <View style={[styles.cycleRest, { flex: Math.max(1, restSeconds) }]} />
        <Animated.View style={[styles.cycleMarker, markerStyle]} />
      </View>
    </View>
  );
}

export function SqueezeVisual({
  phase,
  secondsLeft,
  cue,
  progress,
  repIndex = 0,
  repTotal = 0,
  squeezeSeconds,
  restSeconds,
}: Props) {
  const { t } = useTranslation();
  const accent = phaseAccent(phase);
  const soft = phaseSoft(phase);
  const fill = useSharedValue(phase === 'rest' ? 1 : 0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (phase === 'squeeze') {
      fill.value = withTiming(Math.min(1, Math.max(0, progress)), {
        duration: 900,
        easing: Easing.linear,
      });
      pulse.value = withTiming(1.04, { duration: 450, easing: Easing.out(Easing.cubic) });
    } else if (phase === 'rest') {
      // Drain as rest progresses — release is as important as the squeeze.
      fill.value = withTiming(1 - Math.min(1, Math.max(0, progress)), {
        duration: 900,
        easing: Easing.linear,
      });
      pulse.value = withTiming(0.96, { duration: 450, easing: Easing.out(Easing.cubic) });
    } else if (phase === 'prepare') {
      fill.value = withTiming(0.22, { duration: 500 });
      pulse.value = withTiming(1, { duration: 400 });
    } else {
      fill.value = withTiming(1, { duration: 500 });
      pulse.value = withTiming(1, { duration: 400 });
    }
  }, [phase, progress, fill, pulse]);

  useEffect(() => {
    if (phase === 'squeeze' && progress <= 0.02) {
      fill.value = 0;
    }
    if (phase === 'rest' && progress <= 0.02) {
      fill.value = 1;
    }
  }, [phase, progress, fill]);

  const fillStyle = useAnimatedStyle(() => ({
    height: interpolate(fill.value, [0, 1], [0, INNER_SIZE]),
  }));

  const coreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const phaseLabel =
    phase === 'squeeze'
      ? t('phase.squeeze')
      : phase === 'rest'
        ? t('phase.rest')
        : phase === 'prepare'
          ? t('phase.prepare')
          : t('phase.done');

  const showReps = repTotal > 0 && (phase === 'squeeze' || phase === 'rest');
  const showCycle =
    typeof squeezeSeconds === 'number' &&
    typeof restSeconds === 'number' &&
    squeezeSeconds > 0 &&
    (phase === 'squeeze' || phase === 'rest');

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.ringShell, coreStyle]}>
        <RingProgress
          progress={progress}
          color={accent}
          trackColor={colors.border}
          phaseKey={phase}
        />
        <View style={[styles.inner, { backgroundColor: colors.surface }]}>
          <Animated.View style={[styles.fill, { backgroundColor: soft }, fillStyle]} />
          <View style={styles.innerContent}>
            <Text style={[styles.phase, { color: accent }]}>{phaseLabel}</Text>
            <Text style={styles.seconds}>{Math.max(0, secondsLeft)}</Text>
            <Text style={styles.unit}>{t('common.sec')}</Text>
            {showReps ? (
              <Text style={styles.reps}>
                {t('exercise.repOf', { current: repIndex, total: repTotal })}
              </Text>
            ) : null}
          </View>
        </View>
      </Animated.View>

      {showCycle ? (
        <CycleStrip
          phase={phase}
          phaseProgress={progress}
          squeezeSeconds={squeezeSeconds}
          restSeconds={restSeconds}
        />
      ) : null}

      <Text style={styles.cue}>{cue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing.lg,
    width: '100%',
  },
  ringShell: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringTrack: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    overflow: 'hidden',
  },
  halfClip: {
    position: 'absolute',
    top: 0,
    width: RING_SIZE / 2,
    height: RING_SIZE,
    overflow: 'hidden',
  },
  spinner: {
    position: 'absolute',
    top: 0,
    width: RING_SIZE,
    height: RING_SIZE,
  },
  halfFill: {
    position: 'absolute',
    top: 0,
    width: RING_SIZE / 2,
    height: RING_SIZE,
  },
  inner: {
    width: INNER_SIZE,
    height: INNER_SIZE,
    borderRadius: INNER_SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  innerContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  phase: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  seconds: {
    fontFamily: fonts.displayBold,
    fontSize: 68,
    lineHeight: 76,
    color: colors.ink,
  },
  unit: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.inkMuted,
  },
  reps: {
    marginTop: spacing.xs,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.inkSoft,
  },
  cycleWrap: {
    width: '100%',
    maxWidth: 280,
    gap: spacing.sm,
  },
  cycleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cycleLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  cycleTrack: {
    height: 12,
    borderRadius: radii.pill,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: colors.border,
    position: 'relative',
  },
  cycleSqueeze: {
    backgroundColor: colors.orange,
  },
  cycleRest: {
    backgroundColor: colors.teal,
  },
  cycleMarker: {
    position: 'absolute',
    top: -3,
    left: 0,
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: colors.ink,
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
