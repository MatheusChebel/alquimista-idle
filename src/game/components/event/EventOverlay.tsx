import { memo, useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { EVENT_VISUALS, type TimedEventId } from '@/game/data/eventVisuals';
import { pruneActiveEffects } from '@/game/lib/economy';
import { useGameStore } from '@/game/store/gameStore';

export const EventOverlay = memo(function EventOverlay() {
  const activeEffects = useGameStore((s) => s.activeEffects);

  const activeKind = useMemo(() => {
    const now = Date.now();
    const effects = pruneActiveEffects(activeEffects, now);
    if (effects.some((e) => e.kind === 'frenzy' || e.kind === 'clickFrenzy')) {
      return 'frenzy' as TimedEventId;
    }
    if (effects.some((e) => e.kind === 'eclipse')) {
      return 'eclipse' as TimedEventId;
    }
    return null;
  }, [activeEffects]);

  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!activeKind) {
      opacity.value = withTiming(0, { duration: 300 });
      return;
    }

    const base = activeKind === 'eclipse' ? 0.12 : 0.06;
    opacity.value = withTiming(base, { duration: 400 });

    if (activeKind === 'frenzy') {
      opacity.value = withRepeat(withTiming(0.09, { duration: 1200 }), -1, true);
    }
  }, [activeKind, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!activeKind) return null;

  const color = EVENT_VISUALS[activeKind].color;

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { backgroundColor: color }, style]}
    />
  );
});
