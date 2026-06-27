import { useEffect } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

/** Micro-animação de respiração — pausa quando `animated` é false (Parte D/G). */
export function useStationIdle(animated: boolean) {
  const bob = useSharedValue(0);

  useEffect(() => {
    if (!animated) {
      bob.value = withTiming(0, { duration: 120 });
      return;
    }
    bob.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [animated, bob]);

  return useAnimatedStyle(() => ({
    transform: [{ translateY: bob.value * -2 }],
  }));
}
