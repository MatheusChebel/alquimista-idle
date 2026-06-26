import { getPermanentBonuses } from '@/game/data/quintessence';
import {
  computeClickFrenzyMult,
  computeClickValue,
  computeGenMultipliers,
  getGlobalMult,
  pruneActiveEffects,
} from '@/game/lib/economy';
import { computeEps } from '@/game/lib/formulas';
import type { GameStore } from '@/game/types/game';

export function getEconomyContext(state: GameStore, now = Date.now()) {
  const activeEffects = pruneActiveEffects(state.activeEffects, now);
  const genMultipliers = computeGenMultipliers(state.boughtUpgrades);
  const perm = getPermanentBonuses(state.boughtPermNodes);
  const globalMult = getGlobalMult(
    state.unlockedAchievements,
    activeEffects,
    state.prestigePoints,
    now,
  );
  const eps = computeEps(state.owned, genMultipliers, globalMult);
  const clickValue =
    computeClickValue(state.boughtClickUpgrades, eps, perm.clickMult) *
    computeClickFrenzyMult(activeEffects, now);

  return { activeEffects, eps, clickValue, globalMult, genMultipliers, perm };
}
