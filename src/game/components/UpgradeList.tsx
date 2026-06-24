import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { UPGRADES } from '@/game/constants/upgrades';
import { UpgradeCard } from '@/game/components/UpgradeCard';
import { useGameStore } from '@/game/store/gameStore';
import type { UpgradeId } from '@/game/types/game';
import { getUpgradeCost } from '@/game/utils/calculations';

export function UpgradeList() {
  const gold = useGameStore((state) => state.gold);
  const upgradeLevels = useGameStore((state) => state.upgradeLevels);
  const buyUpgrade = useGameStore((state) => state.buyUpgrade);

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold" style={styles.title}>
        Upgrades
      </ThemedText>
      {UPGRADES.map((upgrade) => {
        const level = upgradeLevels[upgrade.id as UpgradeId];
        const cost = getUpgradeCost(upgrade, level);

        return (
          <UpgradeCard
            key={upgrade.id}
            upgrade={upgrade}
            level={level}
            cost={cost}
            canAfford={gold >= cost}
            onBuy={() => buyUpgrade(upgrade.id)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.five,
  },
  title: {
    color: '#D4AF37',
    marginBottom: Spacing.one,
  },
});
