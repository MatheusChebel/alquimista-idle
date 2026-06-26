import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { BASE } from '@/constants/theme';
import { ICONS } from '@/game/components/Sigil';
import { MAX_SHELF_SPRITES } from '@/game/data/labTiers';

type GlyphComponent = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

function AmbientSprite({
  Glyph,
  color,
  animated,
}: {
  Glyph: GlyphComponent;
  color: string;
  animated: boolean;
}) {
  const y = useSharedValue(0);

  React.useEffect(() => {
    if (animated) {
      y.value = withRepeat(
        withTiming(-3, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      );
    } else {
      y.value = 0;
    }
  }, [animated, y]);

  const st = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <Animated.View style={st}>
      <Glyph size={16} color={color} strokeWidth={1.8} />
    </Animated.View>
  );
}

export function StationShelf({
  id,
  owned,
  tint,
  animated,
}: {
  id: string;
  owned: number;
  tint: string;
  animated: boolean;
}) {
  const Glyph = ICONS[id];
  if (!Glyph) return null;

  const shown = Math.min(owned, MAX_SHELF_SPRITES);
  const extra = owned - shown;

  return (
    <View style={styles.shelf}>
      {Array.from({ length: shown }).map((_, i) =>
        i === 0 ? (
          <AmbientSprite key={i} Glyph={Glyph} color={tint} animated={animated} />
        ) : (
          <Glyph key={i} size={16} color={tint} strokeWidth={1.8} />
        ),
      )}
      {extra > 0 && <Text style={styles.extra}>+{extra}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  shelf: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: BASE.bgDeep,
    borderRadius: 9,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  extra: {
    fontSize: 11,
    color: BASE.textMuted,
    marginLeft: 3,
    fontFamily: 'SpaceGrotesk_500Medium',
  },
});
