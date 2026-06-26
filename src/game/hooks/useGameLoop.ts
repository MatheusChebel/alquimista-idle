import { useEffect } from 'react';

import { useGameStore } from '@/game/store/gameStore';

const TICK_INTERVAL_MS = 500;

export function useGameLoop(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const intervalId = setInterval(() => {
      useGameStore.getState().tick(TICK_INTERVAL_MS);
    }, TICK_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [enabled]);
}
