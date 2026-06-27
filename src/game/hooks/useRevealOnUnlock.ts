import React, { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export function useRevealOnUnlock(justUnlocked: boolean) {
  const p = useSharedValue(justUnlocked ? 0 : 1);

  useEffect(() => {
    if (justUnlocked) {
      p.value = withSequence(withTiming(1, { duration: 420, easing: Easing.out(Easing.back(1.4)) }));
    }
  }, [justUnlocked, p]);

  return useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ scale: 0.8 + p.value * 0.2 }, { rotateY: `${(1 - p.value) * 90}deg` }],
  }));
}
