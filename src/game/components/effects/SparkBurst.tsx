import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { usePhaseTheme } from '@/game/hooks/usePhaseTheme';

const RAY_COUNT = 4;

type SparkBurstProps = {
  trigger: number;
};

function SparkRay({ angle, trigger }: { angle: number; trigger: number }) {
  const theme = usePhaseTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
  }, [trigger, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ rotate: `${angle}deg` }, { scaleY: 0.4 + progress.value }],
  }));

  return (
    <Animated.View style={[styles.ray, style, { backgroundColor: theme.glow }]} />
  );
}

/** Burst mínimo na Conjunção — 4 raios, sem pool. */
export function SparkBurst({ trigger }: SparkBurstProps) {
  if (trigger === 0) return null;

  return (
    <Animated.View pointerEvents="none" style={styles.burst}>
      {Array.from({ length: RAY_COUNT }, (_, i) => (
        <SparkRay key={i} angle={(360 / RAY_COUNT) * i} trigger={trigger} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  burst: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ray: {
    position: 'absolute',
    width: 2,
    height: 22,
    borderRadius: 1,
    transformOrigin: 'center bottom',
  },
});
