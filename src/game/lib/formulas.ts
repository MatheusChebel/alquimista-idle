import { GENERATORS } from '@/game/data/generators';

export const COST_GROWTH = 1.15;

export function nextCost(baseCost: number, owned: number): number {
  return Math.ceil(baseCost * Math.pow(COST_GROWTH, owned));
}

export function bulkCost(baseCost: number, owned: number, amount: number): number {
  const start = baseCost * Math.pow(COST_GROWTH, owned);
  return Math.ceil((start * (Math.pow(COST_GROWTH, amount) - 1)) / (COST_GROWTH - 1));
}

export function computeEps(
  owned: Record<string, number>,
  genMultipliers: Record<string, number>,
  globalMult: number,
): number {
  let base = 0;
  for (const g of GENERATORS) {
    const qty = owned[g.id] ?? 0;
    const mult = genMultipliers[g.id] ?? 1;
    base += qty * g.baseEps * mult;
  }
  return base * globalMult;
}

const SUFFIXES = ['', ' mil', ' mi', ' bi', ' tri', ' qa', ' qi'];

export function formatNumber(n: number): string {
  if (n < 1000) return Math.floor(n).toString();
  const tier = Math.floor(Math.log10(n) / 3);
  const scaled = n / Math.pow(1000, tier);
  const suffix = SUFFIXES[tier] ?? `e${tier * 3}`;
  return `${scaled.toFixed(scaled < 10 ? 2 : scaled < 100 ? 1 : 0)}${suffix}`;
}
