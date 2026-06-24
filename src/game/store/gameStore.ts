import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { INITIAL_UPGRADE_LEVELS, UPGRADES } from '@/game/constants/upgrades';
import {
  calculatePrestigeReward,
  canPrestige,
} from '@/game/constants/prestige';
import type { GameStore, UpgradeId } from '@/game/types/game';
import { computeStats, getUpgradeCost } from '@/game/utils/calculations';

const createInitialState = () => ({
  gold: 0,
  totalGoldEarned: 0,
  upgradeLevels: { ...INITIAL_UPGRADE_LEVELS },
  prestigePoints: 0,
  lastTickAt: Date.now(),
});

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      click: () => {
        const { upgradeLevels, prestigePoints } = get();
        const { clickPower } = computeStats(upgradeLevels, prestigePoints);

        set((state) => ({
          gold: state.gold + clickPower,
          totalGoldEarned: state.totalGoldEarned + clickPower,
        }));
      },

      buyUpgrade: (id: UpgradeId) => {
        const state = get();
        const upgrade = UPGRADES.find((item) => item.id === id);

        if (!upgrade) return false;

        const level = state.upgradeLevels[id];
        const cost = getUpgradeCost(upgrade, level);

        if (state.gold < cost) return false;

        set({
          gold: state.gold - cost,
          upgradeLevels: {
            ...state.upgradeLevels,
            [id]: level + 1,
          },
        });

        return true;
      },

      prestige: () => {
        const { gold, prestigePoints } = get();

        if (!canPrestige(gold)) return false;

        const earnedPoints = calculatePrestigeReward(gold);

        set({
          gold: 0,
          upgradeLevels: { ...INITIAL_UPGRADE_LEVELS },
          prestigePoints: prestigePoints + earnedPoints,
          lastTickAt: Date.now(),
        });

        return true;
      },

      tick: (deltaSeconds: number) => {
        const { upgradeLevels, prestigePoints } = get();
        const { goldPerSecond } = computeStats(upgradeLevels, prestigePoints);
        const earned = goldPerSecond * deltaSeconds;

        if (earned <= 0) {
          set({ lastTickAt: Date.now() });
          return;
        }

        set((state) => ({
          gold: state.gold + earned,
          totalGoldEarned: state.totalGoldEarned + earned,
          lastTickAt: Date.now(),
        }));
      },

      applyOfflineProgress: () => {
        const { lastTickAt, upgradeLevels, prestigePoints, gold, totalGoldEarned } = get();
        const now = Date.now();
        const elapsedSeconds = Math.max(0, (now - lastTickAt) / 1000);

        if (elapsedSeconds <= 1) {
          set({ lastTickAt: now });
          return;
        }

        const { goldPerSecond } = computeStats(upgradeLevels, prestigePoints);
        const earned = goldPerSecond * elapsedSeconds;

        set({
          gold: gold + earned,
          totalGoldEarned: totalGoldEarned + earned,
          lastTickAt: now,
        });
      },

      resetSave: () => {
        set(createInitialState());
      },
    }),
    {
      name: 'alchemy-idle-save',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        gold: state.gold,
        totalGoldEarned: state.totalGoldEarned,
        upgradeLevels: state.upgradeLevels,
        prestigePoints: state.prestigePoints,
        lastTickAt: state.lastTickAt,
      }),
    },
  ),
);

export function selectGameStats(state: GameStore) {
  return computeStats(state.upgradeLevels, state.prestigePoints);
}
