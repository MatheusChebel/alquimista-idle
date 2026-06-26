import { memo, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BASE, SPACE } from '@/constants/theme';
import { QuickBuyCard } from '@/game/components/QuickBuyCard';
import { CLICK_UPGRADES, UPGRADES } from '@/game/data/upgrades';
import { GENERATORS } from '@/game/data/generators';
import { usePhaseTheme } from '@/game/hooks/usePhaseTheme';
import { useThrottledAffordable } from '@/game/hooks/useThrottledAffordable';
import { getUpgradeCost } from '@/game/lib/economy';
import { formatNumber, nextCost } from '@/game/lib/formulas';
import { hapticPurchase } from '@/game/lib/haptics';
import { gameText } from '@/game/lib/typography';
import { useGameStore } from '@/game/store/gameStore';
import { ringColorForCategory } from '@/game/components/icons/ItemIcon';

type QuickItem = {
  key: string;
  label: string;
  cost: number;
  iconId: string;
  category: 'generator' | 'click' | 'mystic';
  onBuy: () => void;
};

function QuickBuyTile({ item }: { item: QuickItem }) {
  const theme = usePhaseTheme();
  const canAfford = useThrottledAffordable(item.cost);
  const ringColor = ringColorForCategory(item.category, theme.essence);

  const handleBuy = () => {
    if (!canAfford) return;
    hapticPurchase();
    item.onBuy();
  };

  return (
    <QuickBuyCard
      id={item.iconId}
      name={item.label}
      cost={formatNumber(item.cost)}
      affordable={canAfford}
      ringColor={ringColor}
      onBuy={handleBuy}
    />
  );
}

export const QuickBuyCarousel = memo(function QuickBuyCarousel() {
  const owned = useGameStore((s) => s.owned);
  const boughtUpgrades = useGameStore((s) => s.boughtUpgrades);
  const boughtClickUpgrades = useGameStore((s) => s.boughtClickUpgrades);
  const buyGenerator = useGameStore((s) => s.buyGenerator);
  const buyUpgrade = useGameStore((s) => s.buyUpgrade);
  const buyClickUpgrade = useGameStore((s) => s.buyClickUpgrade);

  const [essenceSnap, setEssenceSnap] = useState(() => useGameStore.getState().essence);

  useEffect(() => {
    let active = true;
    const tick = () => {
      if (!active) return;
      setEssenceSnap(useGameStore.getState().essence);
    };
    tick();
    const id = setInterval(tick, 300);
    const unsub = useGameStore.subscribe(tick);
    return () => {
      active = false;
      clearInterval(id);
      unsub();
    };
  }, []);

  const items = useMemo(() => {
    const list: (QuickItem & { affordable: boolean })[] = [];

    for (const gen of GENERATORS) {
      const count = owned[gen.id] ?? 0;
      const cost = nextCost(gen.baseCost, count);
      list.push({
        key: `gen-${gen.id}`,
        label: gen.displayName,
        cost,
        iconId: gen.id,
        category: 'generator',
        affordable: essenceSnap >= cost,
        onBuy: () => buyGenerator(gen.id),
      });
    }

    for (const up of UPGRADES) {
      if (boughtUpgrades[up.id]) continue;
      if ((owned[up.generatorId] ?? 0) < up.unlockAt) continue;
      const cost = getUpgradeCost(up.generatorId, up.costMult);
      list.push({
        key: `up-${up.id}`,
        label: up.displayName,
        cost,
        iconId: up.generatorId,
        category: 'generator',
        affordable: essenceSnap >= cost,
        onBuy: () => buyUpgrade(up.id),
      });
    }

    for (const cu of CLICK_UPGRADES) {
      if (boughtClickUpgrades[cu.id]) continue;
      list.push({
        key: `click-${cu.id}`,
        label: cu.displayName,
        cost: cu.cost,
        iconId: cu.id,
        category: 'click',
        affordable: essenceSnap >= cu.cost,
        onBuy: () => buyClickUpgrade(cu.id),
      });
    }

    return list
      .filter((i) => i.affordable)
      .sort((a, b) => a.cost - b.cost)
      .slice(0, 4)
      .map(({ affordable: _a, ...rest }) => rest);
  }, [
    boughtClickUpgrades,
    boughtUpgrades,
    buyClickUpgrade,
    buyGenerator,
    buyUpgrade,
    essenceSnap,
    owned,
  ]);

  if (items.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={[gameText.labelSmall, styles.eyebrow, { color: BASE.gold }]}>COMPRA RÁPIDA</Text>
        <Text style={[gameText.labelSmall, styles.slideHint, { color: BASE.textFaint }]}>‹ deslize ›</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.map((item) => (
          <QuickBuyTile key={item.key} item={item} />
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    gap: SPACE.sm,
    paddingBottom: SPACE.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACE.lg,
  },
  eyebrow: {
    letterSpacing: 1.2,
  },
  slideHint: {
    textTransform: 'none',
    letterSpacing: 0,
    fontSize: 11,
  },
  row: {
    paddingHorizontal: SPACE.lg,
    gap: SPACE.sm,
  },
});
