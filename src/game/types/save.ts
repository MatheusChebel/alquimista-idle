import type { ActiveEffect, ActiveRitualEffect } from '@/game/types/game';

export interface SavedGame {
  essence: number;
  owned: Record<string, number>;
  boughtUpgrades: Record<string, true>;
  boughtClickUpgrades: Record<string, true>;
  boughtPermNodes: Record<string, true>;
  unlockedAchievements: Record<string, true>;
  activeEffects: ActiveEffect[];
  activeRitualEffects: ActiveRitualEffect[];
  ritualCooldowns: Record<string, number>;
  ritualsLaunched: number;
  totalClicks: number;
  totalEssenceEarned: number;
  conjunctionsClicked: number;
  frenzyActivations: number;
  ghostClicksPerSec: number;
  quintessence: number;
  quintessenceEarned: number;
  prestigePoints: number;
  quintRewardsClaimed: Record<string, true>;
  masteryClaimed: Record<string, true>;
  collectionBonusesClaimed: Record<string, true>;
  trialsCompleted: Record<string, true>;
  runStartedAt: number;
  lastTick: number;
}
