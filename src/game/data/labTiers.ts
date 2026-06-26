import { PHASE, BASE, type Phase } from '@/constants/theme';

export const MAX_SHELF_SPRITES = 6;

export function visualTier(owned: number): 0 | 1 | 2 | 3 | 4 | 5 {
  if (owned <= 0) return 0;
  if (owned < 5) return 1;
  if (owned < 25) return 2;
  if (owned < 50) return 3;
  if (owned < 100) return 4;
  return 5;
}

const TIER_TOKEN: Record<number, 'essence' | 'accent' | 'gold'> = {
  1: 'essence',
  2: 'essence',
  3: 'accent',
  4: 'gold',
  5: 'gold',
};

export function tierTint(tier: number, phase: Phase): string {
  const tok = TIER_TOKEN[tier] ?? 'essence';
  if (tok === 'gold') return BASE.gold;
  return tok === 'accent' ? PHASE[phase].accent : PHASE[phase].essence;
}
