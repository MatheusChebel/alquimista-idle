import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { selectGameStats, useGameStore } from '@/game/store/gameStore';
import { formatGold } from '@/game/utils/formatGold';

export function GoldHeader() {
  const gold = useGameStore((state) => state.gold);
  const prestigePoints = useGameStore((state) => state.prestigePoints);
  const stats = useGameStore(selectGameStats);

  return (
    <View style={styles.container}>
      <ThemedText type="small" themeColor="textSecondary">
        Laboratório do Alquimista
      </ThemedText>
      <ThemedText style={styles.goldValue}>🪙 {formatGold(gold)}</ThemedText>
      <View style={styles.metaRow}>
        <ThemedText type="small" themeColor="textSecondary">
          +{formatGold(stats.goldPerSecond)}/s
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Clique: {formatGold(stats.clickPower)}
        </ThemedText>
        {prestigePoints > 0 ? (
          <ThemedText type="small" themeColor="textSecondary">
            ✨ {prestigePoints} prestígio
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  goldValue: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '700',
    color: '#D4AF37',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.two,
  },
});
