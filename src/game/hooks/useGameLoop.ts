import { useEffect } from 'react';

import { useGameStore } from '@/game/store/gameStore';

const TICK_INTERVAL_MS = 100;

export function useGameLoop() {
  const tick = useGameStore((state) => state.tick);

  useEffect(() => {
    const intervalId = setInterval(() => {
      tick(TICK_INTERVAL_MS / 1000);
    }, TICK_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [tick]);
}
