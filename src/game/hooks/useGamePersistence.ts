import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { loadGame, saveGame } from '@/game/lib/persistence';
import { useGameStore } from '@/game/store/gameStore';

const SAVE_INTERVAL_MS = 5_000;
const OFFLINE_CAP_MS = 8 * 60 * 60 * 1000;
const OFFLINE_MODAL_MIN_MS = 30_000;

export type OfflineWelcomeData = {
  essenceGained: number;
  secondsAway: number;
};

function persistCurrentGame() {
  const state = useGameStore.getState();
  void saveGame({
    essence: state.essence,
    owned: state.owned,
    boughtUpgrades: state.boughtUpgrades,
    boughtClickUpgrades: state.boughtClickUpgrades,
    boughtPermNodes: state.boughtPermNodes,
    unlockedAchievements: state.unlockedAchievements,
    activeEffects: state.activeEffects,
    activeRitualEffects: state.activeRitualEffects,
    ritualCooldowns: state.ritualCooldowns,
    ritualsLaunched: state.ritualsLaunched,
    totalClicks: state.totalClicks,
    totalEssenceEarned: state.totalEssenceEarned,
    conjunctionsClicked: state.conjunctionsClicked,
    frenzyActivations: state.frenzyActivations,
    ghostClicksPerSec: state.ghostClicksPerSec,
    quintessence: state.quintessence,
    quintessenceEarned: state.quintessenceEarned,
    prestigePoints: state.prestigePoints,
    quintRewardsClaimed: state.quintRewardsClaimed,
    masteryClaimed: state.masteryClaimed,
    collectionBonusesClaimed: state.collectionBonusesClaimed,
    trialsCompleted: state.trialsCompleted,
    runStartedAt: state.runStartedAt,
  });
}

export function useGamePersistence() {
  const [isReady, setIsReady] = useState(false);
  const [offlineWelcome, setOfflineWelcome] = useState<OfflineWelcomeData | null>(null);
  const pendingOfflineRef = useRef<OfflineWelcomeData | null>(null);

  useEffect(() => {
    let mounted = true;
    let saveInterval: ReturnType<typeof setInterval> | undefined;

    async function boot() {
      const saved = await loadGame();

      if (!mounted) return;

      if (saved) {
        const essenceBefore = saved.essence;
        useGameStore.getState().hydrate(saved);

        const delta = Math.min(Date.now() - saved.lastTick, OFFLINE_CAP_MS);
        if (delta > 0) {
          useGameStore.getState().tick(delta);
        }

        const essenceAfter = useGameStore.getState().essence;
        const gained = Math.max(0, essenceAfter - essenceBefore);
        if (delta >= OFFLINE_MODAL_MIN_MS && gained > 0) {
          pendingOfflineRef.current = { essenceGained: gained, secondsAway: delta / 1000 };
        }
      }

      setIsReady(true);
      saveInterval = setInterval(persistCurrentGame, SAVE_INTERVAL_MS);
    }

    const appStateSubscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        persistCurrentGame();
      }
    });

    void boot();

    return () => {
      mounted = false;
      clearInterval(saveInterval);
      appStateSubscription.remove();
    };
  }, []);

  /** Mostra o modal offline só depois que a UI principal montou. */
  useEffect(() => {
    if (!isReady || !pendingOfflineRef.current) return;
    const pending = pendingOfflineRef.current;
    pendingOfflineRef.current = null;
    const frame = requestAnimationFrame(() => {
      setOfflineWelcome(pending);
    });
    return () => cancelAnimationFrame(frame);
  }, [isReady]);

  return {
    isReady,
    offlineWelcome,
    dismissOfflineWelcome: () => setOfflineWelcome(null),
  };
}
