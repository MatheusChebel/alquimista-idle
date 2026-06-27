import { useMemo } from 'react';

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
import { getPrestigeMult } from '@/game/lib/prestige';
import { useGameStore } from '@/game/store/gameStore';

export function useGenMultipliers() {
  const boughtUpgrades = useGameStore((state) => state.boughtUpgrades);

  return useMemo(() => computeGenMultipliers(boughtUpgrades), [boughtUpgrades]);
}

export function useGameEps() {
  const owned = useGameStore((state) => state.owned);
  const boughtUpgrades = useGameStore((state) => state.boughtUpgrades);
  const unlockedAchievements = useGameStore((state) => state.unlockedAchievements);
  const activeEffects = useGameStore((state) => state.activeEffects);
  const activeRitualEffects = useGameStore((state) => state.activeRitualEffects);
  const prestigePoints = useGameStore((state) => state.prestigePoints);

  return useMemo(() => {
    const genMultipliers = computeGenMultipliers(boughtUpgrades);
    const pruned = pruneActiveEffects(activeEffects);
    const rituals = pruneRitualEffects(activeRitualEffects);
    const globalMult = getGlobalMult(unlockedAchievements, pruned, prestigePoints, rituals);
    return computeEps(owned, genMultipliers, globalMult);
  }, [owned, boughtUpgrades, unlockedAchievements, activeEffects, activeRitualEffects, prestigePoints]);
}

export function useClickValue() {
  const boughtClickUpgrades = useGameStore((state) => state.boughtClickUpgrades);
  const boughtPermNodes = useGameStore((state) => state.boughtPermNodes);
  const unlockedAchievements = useGameStore((state) => state.unlockedAchievements);
  const activeEffects = useGameStore((state) => state.activeEffects);
  const activeRitualEffects = useGameStore((state) => state.activeRitualEffects);
  const prestigePoints = useGameStore((state) => state.prestigePoints);
  const owned = useGameStore((state) => state.owned);
  const boughtUpgrades = useGameStore((state) => state.boughtUpgrades);

  return useMemo(() => {
    const genMultipliers = computeGenMultipliers(boughtUpgrades);
    const pruned = pruneActiveEffects(activeEffects);
    const rituals = pruneRitualEffects(activeRitualEffects);
    const globalMult = getGlobalMult(unlockedAchievements, pruned, prestigePoints, rituals);
    const eps = computeEps(owned, genMultipliers, globalMult);
    const perm = getPermanentBonuses(boughtPermNodes);
    const base = computeClickValue(boughtClickUpgrades, eps, owned, perm.clickMult);
    return base * computeClickFrenzyMult(pruned) * computeRitualClickMult(rituals);
  }, [
    boughtClickUpgrades,
    boughtPermNodes,
    unlockedAchievements,
    activeEffects,
    activeRitualEffects,
    prestigePoints,
    owned,
    boughtUpgrades,
  ]);
}

export function useSealMult() {
  const unlockedAchievements = useGameStore((state) => state.unlockedAchievements);
  const prestigePoints = useGameStore((state) => state.prestigePoints);

  return useMemo(() => {
    return getGlobalMult(unlockedAchievements, [], prestigePoints);
  }, [unlockedAchievements, prestigePoints]);
}

export function usePrestigeMult() {
  const prestigePoints = useGameStore((state) => state.prestigePoints);
  return useMemo(() => getPrestigeMult(prestigePoints), [prestigePoints]);
}
