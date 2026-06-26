export const PRESTIGE_ESSENCE_DIVISOR = 1e12;

export function calculatePrestigeGain(
  totalEssenceEarned: number,
  currentPrestigePoints: number,
): number {
  const total = Math.floor(Math.pow(totalEssenceEarned / PRESTIGE_ESSENCE_DIVISOR, 1 / 3));
  return Math.max(0, total - currentPrestigePoints);
}

export function canPrestige(totalEssenceEarned: number, currentPrestigePoints: number): boolean {
  return calculatePrestigeGain(totalEssenceEarned, currentPrestigePoints) >= 1;
}

export function getPrestigeMult(prestigePoints: number): number {
  return 1 + 0.01 * prestigePoints;
}
