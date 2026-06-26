import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';

import { EVENT_MAX_MS, EVENT_MIN_MS } from '@/game/data/events';
import { getPermanentBonuses } from '@/game/data/quintessence';
import { Motion } from '@/constants/theme';
import { useGameStore } from '@/game/store/gameStore';

export type AstralSpawn = {
  id: number;
  x: number;
  y: number;
};

const PADDING = 48;

export function useAstralEvents(enabled: boolean) {
  const [spawn, setSpawn] = useState<AstralSpawn | null>(null);
  const spawnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const despawnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boughtPermNodes = useGameStore((state) => state.boughtPermNodes);

  const eventIntervalMult = getPermanentBonuses(boughtPermNodes).eventIntervalMult;

  const clearTimers = useCallback(() => {
    if (spawnTimer.current) clearTimeout(spawnTimer.current);
    if (despawnTimer.current) clearTimeout(despawnTimer.current);
    spawnTimer.current = null;
    despawnTimer.current = null;
  }, []);

  const scheduleNext = useCallback(() => {
    if (!enabled) return;

    const delay =
      (EVENT_MIN_MS + Math.random() * (EVENT_MAX_MS - EVENT_MIN_MS)) * eventIntervalMult;

    spawnTimer.current = setTimeout(() => {
      const { width, height } = Dimensions.get('window');
      const x = PADDING + Math.random() * (width - PADDING * 2);
      const y = PADDING + Math.random() * (height * 0.55);

      setSpawn({ id: Date.now(), x, y });

      despawnTimer.current = setTimeout(() => {
        setSpawn(null);
        scheduleNext();
      }, Motion.eventDespawnMs);
    }, delay);
  }, [enabled, eventIntervalMult]);

  const dismiss = useCallback(() => {
    setSpawn(null);
    clearTimers();
    scheduleNext();
  }, [clearTimers, scheduleNext]);

  useEffect(() => {
    if (!enabled) {
      clearTimers();
      setSpawn(null);
      return;
    }

    scheduleNext();
    return clearTimers;
  }, [enabled, scheduleNext, clearTimers]);

  return { spawn, dismiss };
}
