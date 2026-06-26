import { useEffect, useState } from 'react';

import { useGameStore } from '@/game/store/gameStore';

/** Atualiza boolean ~4×/seg (seção 17.4) — evita re-render a cada tick. */
export function useThrottledAffordable(cost: number, intervalMs = 250): boolean {
  const [affordable, setAffordable] = useState(() => useGameStore.getState().essence >= cost);

  useEffect(() => {
    const tick = () => {
      const next = useGameStore.getState().essence >= cost;
      setAffordable((prev) => (prev === next ? prev : next));
    };
    tick();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [cost, intervalMs]);

  return affordable;
}
