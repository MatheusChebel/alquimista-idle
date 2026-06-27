import { useEffect, useRef } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { playSfx } from '@/game/audio/audio';

/** Flash rápido ao subir de nível visual (Parte D). */
export function useTierFlash(tier: number) {
  const prevTier = useRef(tier);
  const flash = useSharedValue(0);

  useEffect(() => {
    if (tier > prevTier.current) {
      playSfx('sorte');
      flash.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 320 }),
      );
    }
    prevTier.current = tier;
  }, [tier, flash]);

  return useAnimatedStyle(() => ({
    opacity: flash.value * 0.45,
  }));
}
