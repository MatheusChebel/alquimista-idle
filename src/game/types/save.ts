import type { ActiveEffect } from '@/game/types/game';

export interface SavedGame {
  essence: number;
  owned: Record<string, number>;
  boughtUpgrades: Record<string, true>;
  boughtClickUpgrades: Record<string, true>;
  boughtPermNodes: Record<string, true>;
  unlockedAchievements: Record<string, true>;
  activeEffects: ActiveEffect[];
  totalClicks: number;
  totalEssenceEarned: number;
  conjunctionsClicked: number;
  frenzyActivations: number;
  ghostClicksPerSec: number;
  quintessence: number;
  quintessenceEarned: number;
  prestigePoints: number;
  lastTick: number;
}
