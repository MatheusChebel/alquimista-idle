import { useReducedMotion } from '@/game/hooks/useReducedMotion';

/** Modo calmo: sem loops ambientes (seção 17.7 + Reduzir Movimento). */
export function useCalmMode(): boolean {
  return useReducedMotion();
}
