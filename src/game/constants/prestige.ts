export const PRESTIGE_GOLD_THRESHOLD = 1_000_000;
export const PRESTIGE_BONUS_PER_POINT = 0.25;

export function getPrestigeMultiplier(prestigePoints: number): number {
  return 1 + prestigePoints * PRESTIGE_BONUS_PER_POINT;
}

export function calculatePrestigeReward(gold: number): number {
  if (gold < PRESTIGE_GOLD_THRESHOLD) return 0;
  return Math.floor(Math.sqrt(gold / PRESTIGE_GOLD_THRESHOLD));
}

export function canPrestige(gold: number): boolean {
  return gold >= PRESTIGE_GOLD_THRESHOLD;
}
