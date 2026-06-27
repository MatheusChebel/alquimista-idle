import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {
  BASE,
  Motion,
  PHASE_DISPLAY_NAMES,
  getPhaseForQuintessence,
  type Phase,
} from '@/constants/theme';
import { gameText } from '@/game/lib/typography';
import { useReducedMotion } from '@/game/hooks/useReducedMotion';
import { usePhaseTheme } from '@/game/hooks/usePhaseTheme';
import { useGameStore } from '@/game/store/gameStore';

export function PhaseTransitionOverlay() {
  const reducedMotion = useReducedMotion();
  const theme = usePhaseTheme();
  const quintessenceEarned = useGameStore((s) => s.quintessenceEarned);
  const phase = getPhaseForQuintessence(quintessenceEarned);
  const prevPhase = useRef<Phase>(phase);
  const [visible, setVisible] = useState(false);
  const [shownPhase, setShownPhase] = useState<Phase>(phase);
  const opacity = useSharedValue(0);
  const flash = useSharedValue(0);

  useEffect(() => {
    if (prevPhase.current === phase) return;
    const from = prevPhase.current;
    prevPhase.current = phase;

    if (from === phase) return;

    setShownPhase(phase);
    setVisible(true);

    if (reducedMotion) {
      const timer = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(timer);
    }

    flash.value = 0;
    opacity.value = 0;
    flash.value = withSequence(
      withTiming(1, { duration: Motion.phaseTransitionMs * 0.35, easing: Easing.out(Easing.cubic) }),
      withTiming(0, { duration: Motion.phaseTransitionMs * 0.65, easing: Easing.in(Easing.cubic) }),
    );
    opacity.value = withSequence(
      withTiming(1, { duration: Motion.phaseTransitionMs * 0.25 }),
      withTiming(1, { duration: Motion.phaseTransitionMs * 0.35 }),
      withTiming(0, { duration: Motion.phaseTransitionMs * 0.4 }, () => {
        runOnJS(setVisible)(false);
      }),
    );
  }, [phase, reducedMotion, flash, opacity]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flash.value * 0.55,
  }));

  if (!visible) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: theme.accent },
          flashStyle,
        ]}
      />
      <Animated.View style={[styles.center, overlayStyle]}>
        <Text style={[gameText.tabTitle, { color: BASE.textPrimary }]}>
          {PHASE_DISPLAY_NAMES[shownPhase]}
        </Text>
        <Text style={[gameText.flavor, { color: BASE.textMuted, marginTop: 8 }]}>
          A Grande Obra avança
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 11, 23, 0.72)',
  },
});
