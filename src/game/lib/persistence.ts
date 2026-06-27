import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SavedGame } from '@/game/types/save';

const SAVE_KEY = 'save';

export type { SavedGame };

export async function saveGame(state: Omit<SavedGame, 'lastTick'>): Promise<void> {
  const payload: SavedGame = {
    ...state,
    lastTick: Date.now(),
  };
  await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(payload));
}

export async function clearSavedGame(): Promise<void> {
  await AsyncStorage.removeItem(SAVE_KEY);
}

export async function loadGame(): Promise<SavedGame | null> {
  const raw = await AsyncStorage.getItem(SAVE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<SavedGame>;
    return {
      essence: parsed.essence ?? 0,
      owned: parsed.owned ?? {},
      boughtUpgrades: parsed.boughtUpgrades ?? {},
      boughtClickUpgrades: parsed.boughtClickUpgrades ?? {},
      boughtPermNodes: parsed.boughtPermNodes ?? {},
      unlockedAchievements: parsed.unlockedAchievements ?? {},
      activeEffects: parsed.activeEffects ?? [],
      totalClicks: parsed.totalClicks ?? 0,
      totalEssenceEarned: parsed.totalEssenceEarned ?? 0,
      conjunctionsClicked: parsed.conjunctionsClicked ?? 0,
      frenzyActivations: parsed.frenzyActivations ?? 0,
      ghostClicksPerSec: parsed.ghostClicksPerSec ?? 0,
      quintessence: parsed.quintessence ?? 0,
      quintessenceEarned: parsed.quintessenceEarned ?? 0,
      prestigePoints: parsed.prestigePoints ?? 0,
      quintRewardsClaimed: parsed.quintRewardsClaimed ?? {},
      masteryClaimed: parsed.masteryClaimed ?? {},
      collectionBonusesClaimed: parsed.collectionBonusesClaimed ?? {},
      trialsCompleted: parsed.trialsCompleted ?? {},
      ritualsLaunched: parsed.ritualsLaunched ?? 0,
      ritualCooldowns: parsed.ritualCooldowns ?? {},
      activeRitualEffects: parsed.activeRitualEffects ?? [],
      runStartedAt: parsed.runStartedAt ?? Date.now(),
      lastTick: parsed.lastTick ?? Date.now(),
    };
  } catch {
    return null;
  }
}
