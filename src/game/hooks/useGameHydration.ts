import { useEffect, useState } from 'react';

import { useGameStore } from '@/game/store/gameStore';

export function useGameHydration() {
  const [isReady, setIsReady] = useState(useGameStore.persist.hasHydrated());

  useEffect(() => {
    if (useGameStore.persist.hasHydrated()) {
      useGameStore.getState().applyOfflineProgress();
      setIsReady(true);
      return;
    }

    const unsubscribe = useGameStore.persist.onFinishHydration(() => {
      useGameStore.getState().applyOfflineProgress();
      setIsReady(true);
    });

    void useGameStore.persist.rehydrate();

    return unsubscribe;
  }, []);

  return isReady;
}
