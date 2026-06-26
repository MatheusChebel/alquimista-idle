import { useMemo } from 'react';

import { getPhaseForQuintessence, getPhaseTheme } from '@/constants/theme';
import { useGameStore } from '@/game/store/gameStore';

/** Paleta visual conforme quintessência total ganha (Magnum Opus). */
export function usePhaseTheme() {
  const quintessenceEarned = useGameStore((state) => state.quintessenceEarned);

  return useMemo(() => {
    const phase = getPhaseForQuintessence(quintessenceEarned);
    return getPhaseTheme(phase);
  }, [quintessenceEarned]);
}
