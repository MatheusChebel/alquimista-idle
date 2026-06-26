import { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { BASE } from '@/constants/theme';
import { useReducedMotion } from '@/game/hooks/useReducedMotion';
import { useGameStore } from '@/game/store/gameStore';

const PARTICLE_COUNT = 10;

function SmokeParticle({ index, width }: { index: number; width: number }) {
  const reducedMotion = useReducedMotion();
  const drift = useSharedValue(0);
  const fade = useSharedValue(0.15);

  const left = useMemo(() => width * (0.15 + (index % 5) * 0.14), [index, width]);
  const size = 18 + (index % 4) * 8;

  useEffect(() => {
    if (reducedMotion) return;
    const delay = index * 400;
    drift.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-80 - index * 6, { duration: 4200 + index * 200, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 0 }),
        ),
        -1,
        false,
      ),
    );
    fade.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.28, { duration: 2100 }),
          withTiming(0.08, { duration: 2100 }),
        ),
        -1,
        true,
      ),
    );
  }, [reducedMotion, index, drift, fade]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: drift.value }],
    opacity: fade.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        style,
        {
          left,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: BASE.textMuted,
        },
      ]}
    />
  );
}

/** Fumaça sutil quando o Athanor está ativo (seção 8). */
export function AthanorSmoke() {
  const { width, height } = useWindowDimensions();
  const athanorOwned = useGameStore((s) => s.owned.athanor ?? 0);

  if (athanorOwned < 1) return null;

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { height }]}>
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
        <SmokeParticle key={i} index={i} width={width} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    bottom: 120,
  },
});
