import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useGameStore } from '@/game/store/gameStore';

export function AlchemyCauldron() {
  const click = useGameStore((state) => state.click);
  const [pressed, setPressed] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Transmutar metal em ouro"
        onPress={click}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={[styles.cauldron, pressed && styles.cauldronPressed]}>
        <ThemedText style={styles.emoji}>⚗️</ThemedText>
        <ThemedText type="smallBold" style={styles.label}>
          Toque para transmutar
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingVertical: Spacing.four,
  },
  cauldron: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A1B3D',
    borderWidth: 4,
    borderColor: '#D4AF37',
    gap: Spacing.two,
    shadowColor: '#D4AF37',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  cauldronPressed: {
    transform: [{ scale: 0.95 }],
    backgroundColor: '#3D2858',
  },
  emoji: {
    fontSize: 72,
    lineHeight: 80,
  },
  label: {
    color: '#F5E6B8',
  },
});
