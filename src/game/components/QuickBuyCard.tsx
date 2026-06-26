import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { BASE, RADIUS } from '@/constants/theme';
import { ItemIcon } from '@/game/components/Sigil';

const BASE_ESSENCE = '#46E5C4';

export function QuickBuyCard({
  id,
  name,
  cost,
  affordable,
  ringColor = BASE_ESSENCE,
  onBuy,
}: {
  id: string;
  name: string;
  cost: string;
  affordable: boolean;
  ringColor?: string;
  onBuy: () => void;
}) {
  return (
    <Pressable
      onPress={onBuy}
      style={[
        styles.card,
        {
          borderColor: affordable ? BASE.gold : BASE.borderHair,
          borderWidth: affordable ? 1.5 : StyleSheet.hairlineWidth,
        },
      ]}>
      <ItemIcon id={id} ringColor={ringColor} size={42} />
      <Text style={styles.name}>{name}</Text>
      <View style={[styles.pill, affordable ? styles.pillGold : styles.pillGhost]}>
        <Text style={[styles.cost, { color: affordable ? BASE.goldInk : BASE.danger }]}>{cost} ✦</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth: 84,
    backgroundColor: BASE.bgSurface,
    borderRadius: RADIUS.card,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 6,
  },
  name: { fontSize: 12, color: BASE.textPrimary, fontFamily: 'CormorantGaramond_600SemiBold' },
  pill: { borderRadius: 8, paddingVertical: 3, paddingHorizontal: 9 },
  pillGold: { backgroundColor: BASE.gold },
  pillGhost: { borderWidth: StyleSheet.hairlineWidth, borderColor: BASE.borderHair },
  cost: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'SpaceGrotesk_500Medium',
    fontVariant: ['tabular-nums'],
  },
});
