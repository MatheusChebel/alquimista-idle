import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { UpgradeDefinition } from '@/game/types/game';
import { formatGold } from '@/game/utils/formatGold';

type UpgradeCardProps = {
  upgrade: UpgradeDefinition;
  level: number;
  cost: number;
  canAfford: boolean;
  onBuy: () => void;
};

export function UpgradeCard({ upgrade, level, cost, canAfford, onBuy }: UpgradeCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={!canAfford}
      onPress={onBuy}
      style={[styles.card, canAfford ? styles.cardEnabled : styles.cardDisabled]}>
      <View style={styles.header}>
        <ThemedText style={styles.emoji}>{upgrade.emoji}</ThemedText>
        <View style={styles.info}>
          <ThemedText type="smallBold">{upgrade.name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {upgrade.description}
          </ThemedText>
        </View>
        <ThemedText type="smallBold" style={styles.level}>
          Nv. {level}
        </ThemedText>
      </View>
      <ThemedText type="small" style={[styles.cost, canAfford ? styles.costEnabled : styles.costDisabled]}>
        🪙 {formatGold(cost)}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.two,
    borderWidth: 1,
  },
  cardEnabled: {
    backgroundColor: '#241734',
    borderColor: '#D4AF37',
  },
  cardDisabled: {
    backgroundColor: '#1A1224',
    borderColor: '#3A2E4A',
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  emoji: {
    fontSize: 28,
    lineHeight: 32,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  level: {
    color: '#D4AF37',
  },
  cost: {
    alignSelf: 'flex-end',
  },
  costEnabled: {
    color: '#D4AF37',
  },
  costDisabled: {
    color: '#8A7A9A',
  },
});
