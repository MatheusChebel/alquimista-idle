import { UPGRADES } from '@/game/constants/upgrades';
import { getPrestigeMultiplier } from '@/game/constants/prestige';
import type { GameStats, UpgradeDefinition, UpgradeLevels } from '@/game/types/game';

export function getUpgradeCost(upgrade: UpgradeDefinition, level: number): number {
  return Math.floor(upgrade.baseCost * upgrade.costMultiplier ** level);
}

export function computeStats(
  upgradeLevels: UpgradeLevels,
  prestigePoints: number,
): GameStats {
  let clickPower = 1;
  let goldPerSecond = 0;
  let incomeMultiplier = 1;

  for (const upgrade of UPGRADES) {
    const level = upgradeLevels[upgrade.id];

    if (upgrade.type === 'click') {
      clickPower += level * upgrade.valuePerLevel;
    } else if (upgrade.type === 'passive') {
      goldPerSecond += level * upgrade.valuePerLevel;
    } else if (upgrade.type === 'multiplier') {
      incomeMultiplier += level * upgrade.valuePerLevel;
    }
  }

  const prestigeMultiplier = getPrestigeMultiplier(prestigePoints);
  const totalMultiplier = incomeMultiplier * prestigeMultiplier;

  return {
    clickPower: clickPower * totalMultiplier,
    goldPerSecond: goldPerSecond * totalMultiplier,
    incomeMultiplier,
    prestigeMultiplier,
    totalMultiplier,
  };
}
