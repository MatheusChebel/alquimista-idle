import { getPermanentBonuses } from '@/game/data/quintessence';
import {
  computeClickFrenzyMult,
  computeClickValue,
  computeGenMultipliers,
  computeRitualClickMult,
  getGlobalMult,
  pruneActiveEffects,
  pruneRitualEffects,
} from '@/game/lib/economy';
import { computeEps } from '@/game/lib/formulas';
import type { GameStore } from '@/game/types/game';

export function getEconomyContext(state: GameStore, now = Date.now()) {
  const activeEffects = pruneActiveEffects(state.activeEffects, now);
  const activeRitualEffects = pruneRitualEffects(state.activeRitualEffects, now);
  const genMultipliers = computeGenMultipliers(state.boughtUpgrades);
  const perm = getPermanentBonuses(state.boughtPermNodes);
  const globalMult = getGlobalMult(
    state.unlockedAchievements,
    activeEffects,
    state.prestigePoints,
    activeRitualEffects,
    now,
  );
  const eps = computeEps(state.owned, genMultipliers, globalMult);
  const clickValue =
    computeClickValue(state.boughtClickUpgrades, eps, state.owned, perm.clickMult) *
    computeClickFrenzyMult(activeEffects, now) *
    computeRitualClickMult(activeRitualEffects, now);

  return {
    activeEffects,
    activeRitualEffects,
    eps,
    clickValue,
    globalMult,
    genMultipliers,
    perm,
  };
}
