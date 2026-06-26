import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { BASE } from '@/constants/theme';

export function LuckyPopup({ amountLabel, onDone }: { amountLabel: string; onDone: () => void }) {
  const s = useSharedValue(0.6);
  const o = useSharedValue(0);

  React.useEffect(() => {
    s.value = withSequence(withTiming(1.05, { duration: 180 }), withTiming(1, { duration: 120 }));
    o.value = withSequence(
      withTiming(1, { duration: 160 }),
      withTiming(1, { duration: 1000 }),
      withTiming(0, { duration: 300 }),
    );
    const t = setTimeout(onDone, 1600);
    return () => clearTimeout(t);
  }, [onDone, o, s]);

  const st = useAnimatedStyle(() => ({
    opacity: o.value,
    transform: [{ scale: s.value }],
  }));

  return (
    <Animated.View pointerEvents="none" style={[styles.box, st]}>
      <Text style={styles.title}>✦ SORTE! ✦</Text>
      <Text style={styles.amount}>+{amountLabel} essência</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    alignSelf: 'center',
    top: '38%',
    backgroundColor: '#1A1606',
    borderColor: BASE.gold,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    zIndex: 200,
  },
  title: {
    fontSize: 15,
    letterSpacing: 2,
    color: '#FFE08A',
    fontFamily: 'Cinzel_700Bold',
    marginBottom: 3,
  },
  amount: {
    fontSize: 20,
    color: BASE.textPrimary,
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontVariant: ['tabular-nums'],
  },
});
