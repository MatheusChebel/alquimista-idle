import { memo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BASE, TouchTarget } from '@/constants/theme';
import { Potion } from '@/game/components/Potion';
import { ClickFloat } from '@/game/components/potion/ClickFloat';
import { useCalmMode } from '@/game/hooks/useCalmMode';
import { getEconomyContext } from '@/game/lib/economyRuntime';
import { formatNumber } from '@/game/lib/formulas';
import { playSfx } from '@/game/audio/audio';
import { gameText } from '@/game/lib/typography';
import { useGameStore } from '@/game/store/gameStore';

const POTION_ESSENCE = '#46E5C4';
const POTION_GLOW = '#7CFFE3';

/** Poção do kit visual + um único +N por clique. */
export const LivingPotion = memo(function LivingPotion() {
  const calm = useCalmMode();
  const [float, setFloat] = useState({ trigger: 0, label: '' });

  const handlePress = () => {
    const { clickValue } = getEconomyContext(useGameStore.getState());
    const label = `+${formatNumber(clickValue)}`;

    useGameStore.getState().click();
    playSfx('destilar');

    if (!calm) {
      setFloat((prev) => ({ trigger: prev.trigger + 1, label }));
    }
  };

  return (
    <View style={styles.wrap}>
      {!calm ? <ClickFloat label={float.label} trigger={float.trigger} /> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Destilar essência"
        onPress={handlePress}
        style={({ pressed }) => [styles.hit, pressed && styles.pressed]}>
        <Potion size={172} essence={POTION_ESSENCE} glow={POTION_GLOW} gold={BASE.gold} />
      </Pressable>
      <Text style={[gameText.labelSmall, styles.hint, { color: BASE.textMuted }]}>
        Tocar para transmutar
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    minHeight: TouchTarget.cauldron + 80,
  },
  hit: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: TouchTarget.cauldron + 40,
    minHeight: TouchTarget.cauldron + 40,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.94 }],
  },
  hint: {
    marginTop: 4,
    textTransform: 'none',
    letterSpacing: 0.5,
  },
});
