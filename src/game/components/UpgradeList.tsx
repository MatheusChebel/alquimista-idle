import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BASE, Spacing } from '@/constants/theme';
import { CLICK_UPGRADES, UPGRADES } from '@/game/data/upgrades';
import { playSfx } from '@/game/audio/audio';
import { UpgradeRow } from '@/game/components/UpgradeRow';
import { TwoColumnGrid } from '@/game/components/ui/TwoColumnGrid';
import { getUpgradeCost } from '@/game/lib/economy';
import { useGameStore } from '@/game/store/gameStore';

export function TransmutationList() {
  const owned = useGameStore((state) => state.owned);
  const boughtUpgrades = useGameStore((state) => state.boughtUpgrades);
  const buyUpgrade = useGameStore((state) => state.buyUpgrade);

  const visible = UPGRADES.filter((upgrade) => !boughtUpgrades[upgrade.id]);
  const useGrid = visible.length >= 4;

  return (
    <View style={styles.container}>
      {visible.length === 0 ? (
        <ThemedText type="small" style={{ color: BASE.textMuted, fontStyle: 'italic' }}>
          Todas as transmutações visíveis foram compradas.
        </ThemedText>
      ) : (
        <TwoColumnGrid minItems={4}>
          {visible.map((upgrade) => {
            const unlocked = (owned[upgrade.generatorId] ?? 0) >= upgrade.unlockAt;
            const cost = getUpgradeCost(upgrade.generatorId, upgrade.costMult);

            if (!unlocked) {
              return (
                <UpgradeRow
                  key={upgrade.id}
                  displayName={upgrade.displayName}
                  description={`Requer ${upgrade.unlockAt} unidades`}
                  cost={cost}
                  locked
                  compact={useGrid}
                  iconId={upgrade.id}
                  iconKind="transmutation"
                  onBuy={() => {}}
                />
              );
            }

            return (
              <UpgradeRow
                key={upgrade.id}
                displayName={upgrade.displayName}
                description="Dobra a produção deste Instrumento"
                cost={cost}
                compact={useGrid}
                iconId={upgrade.id}
                iconKind="transmutation"
                onBuy={() => {
                  if (buyUpgrade(upgrade.id)) playSfx('comprarUpgrade');
                }}
              />
            );
          })}
        </TwoColumnGrid>
      )}
    </View>
  );
}

export function ClickUpgradeList() {
  const boughtClickUpgrades = useGameStore((state) => state.boughtClickUpgrades);
  const buyClickUpgrade = useGameStore((state) => state.buyClickUpgrade);

  const available = CLICK_UPGRADES.filter((upgrade) => !boughtClickUpgrades[upgrade.id]);
  const useGrid = available.length >= 4;

  return (
    <View style={styles.container}>
      {available.length === 0 ? (
        <ThemedText type="small" style={{ color: BASE.textMuted, fontStyle: 'italic' }}>
          Todos os upgrades de clique foram comprados.
        </ThemedText>
      ) : (
        <TwoColumnGrid minItems={4}>
          {available.map((upgrade) => (
            <UpgradeRow
              key={upgrade.id}
              displayName={upgrade.displayName}
              description={
                upgrade.kind === 'flatMult'
                  ? `Multiplica o clique por ${upgrade.value}`
                  : upgrade.kind === 'epsPercent'
                    ? `Clique vale +${upgrade.value * 100}% do EPS atual`
                    : upgrade.kind === 'perInstrument'
                      ? `+${upgrade.value} por Instrumento possuído`
                      : `Multiplica bônus por Instrumento ×${upgrade.value}`
              }
              cost={upgrade.cost}
              compact={useGrid}
              iconId={upgrade.id}
              iconKind="click"
              onBuy={() => buyClickUpgrade(upgrade.id)}
            />
          ))}
        </TwoColumnGrid>
      )}
    </View>
  );
}

/** @deprecated use TransmutationList or ClickUpgradeList */
export function UpgradeList() {
  return (
    <View style={styles.container}>
      <TransmutationList />
      <ClickUpgradeList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
});
