import { memo, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { gameText } from '@/game/lib/typography';

type ClickFloatProps = {
  label: string;
  trigger: number;
};

/**
 * Um único +N reutilizado — reinicia no trigger, sem montar/desmontar lista.
 * Sem runOnJS / setState no fim da animação (seção 17.3).
 */
export const ClickFloat = memo(function ClickFloat({ label, trigger }: ClickFloatProps) {
  const y = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (trigger <= 0) return;
    cancelAnimation(y);
    cancelAnimation(opacity);
    y.value = 0;
    opacity.value = 1;
    y.value = withTiming(-56, { duration: 850, easing: Easing.out(Easing.quad) });
    opacity.value = withTiming(0, { duration: 850, easing: Easing.out(Easing.quad) });
  }, [trigger, label, opacity, y]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
    opacity: opacity.value,
  }));

  if (trigger <= 0) return null;

  return (
    <Animated.Text style={[gameText.generatorName, styles.float, style]} pointerEvents="none">
      {label}
    </Animated.Text>
  );
});

const styles = StyleSheet.create({
  float: {
    position: 'absolute',
    top: '36%',
    alignSelf: 'center',
    color: '#F5C542',
    fontSize: 20,
    fontStyle: 'italic',
    zIndex: 2,
  },
});
