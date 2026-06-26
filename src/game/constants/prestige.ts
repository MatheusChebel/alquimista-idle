export const PRESTIGE_ESSENCE_THRESHOLD = 1_000_000;
export const PRESTIGE_BONUS_PER_POINT = 0.25;

export function getPrestigeMultiplier(prestigePoints: number): number {
  return 1 + prestigePoints * PRESTIGE_BONUS_PER_POINT;
}

export function calculatePrestigeReward(essence: number): number {
  if (essence < PRESTIGE_ESSENCE_THRESHOLD) return 0;
  return Math.floor(Math.sqrt(essence / PRESTIGE_ESSENCE_THRESHOLD));
}

export function canPrestige(essence: number): boolean {
  return essence >= PRESTIGE_ESSENCE_THRESHOLD;
}
