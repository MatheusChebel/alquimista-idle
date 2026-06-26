import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { BASE, TouchTarget } from '@/constants/theme';
import { SparkBurst } from '@/game/components/effects/SparkBurst';
import { ConjunctionSymbol } from '@/game/components/icons/ConjunctionSymbol';
import { useAstralEvents } from '@/game/hooks/useAstralEvents';
import { usePhaseTheme } from '@/game/hooks/usePhaseTheme';
import { playChime, playShimmer } from '@/game/lib/audio/audioEngine';
import { hapticAstral } from '@/game/lib/haptics';
import { useGameStore } from '@/game/store/gameStore';

type AstralConjunctionProps = {
  enabled: boolean;
};

export function AstralConjunction({ enabled }: AstralConjunctionProps) {
  const theme = usePhaseTheme();
  const { spawn, dismiss } = useAstralEvents(enabled);
  const triggerAstralEvent = useGameStore((state) => state.triggerAstralEvent);

  const scale = useSharedValue(0);
  const [sparkTrigger, setSparkTrigger] = useState(0);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!spawn) return;

    scale.value = withSequence(
      withSpring(1.08, { damping: 10, stiffness: 140 }),
      withSpring(1, { damping: 12, stiffness: 160 }),
    );
    playShimmer();
  }, [spawn, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: 0.95,
  }));

  const handlePress = () => {
    hapticAstral();
    playChime();
    setSparkTrigger((n) => n + 1);
    setFlash(true);
    setTimeout(() => setFlash(false), 180);
    triggerAstralEvent();
    dismiss();
  };

  if (!spawn) return null;

  const symbolVariant = spawn.id % 4;

  return (
    <>
      {flash ? <View pointerEvents="none" style={styles.flash} /> : null}
      <Animated.View
        pointerEvents="box-none"
        style={[styles.spawnLayer, { left: spawn.x - 28, top: spawn.y - 28 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Conjunção Astral"
          onPress={handlePress}
          style={[
            styles.hitArea,
            {
              borderColor: theme.glow,
              shadowColor: theme.glow,
              minWidth: TouchTarget.min,
              minHeight: TouchTarget.min,
            },
          ]}>
          <SparkBurst trigger={sparkTrigger} />
          <Animated.View style={animatedStyle}>
            <ConjunctionSymbol variant={symbolVariant} color={theme.accent} glow={theme.glow} />
          </Animated.View>
        </Pressable>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  spawnLayer: {
    position: 'absolute',
    zIndex: 100,
  },
  hitArea: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BASE.bgElevated,
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
    overflow: 'visible',
  },
  flash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#FFFFFF',
    opacity: 0.35,
    zIndex: 99,
  },
});
