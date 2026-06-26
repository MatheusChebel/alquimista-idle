import { GENERATORS } from './generators';

export interface UpgradeDef {
  id: string;
  displayName: string;
  generatorId: string;
  unlockAt: number;
  costMult: number;
  effect: 2;
}

const TIERS = [
  { suffix: 'I', unlockAt: 1, costMult: 10 },
  { suffix: 'II', unlockAt: 5, costMult: 50 },
  { suffix: 'III', unlockAt: 25, costMult: 500 },
  { suffix: 'IV', unlockAt: 50, costMult: 50_000 },
  { suffix: 'V', unlockAt: 100, costMult: 5_000_000 },
];

export const UPGRADES: UpgradeDef[] = GENERATORS.flatMap((g) =>
  TIERS.map((t) => ({
    id: `${g.id}_${t.suffix}`,
    displayName: `${g.displayName} ${t.suffix}`,
    generatorId: g.id,
    unlockAt: t.unlockAt,
    costMult: t.costMult,
    effect: 2 as const,
  })),
);

export interface ClickUpgradeDef {
  id: string;
  displayName: string;
  cost: number;
  kind: 'flatMult' | 'epsPercent';
  value: number;
}

export const CLICK_UPGRADES: ClickUpgradeDef[] = [
  { id: 'click1', displayName: 'Dedos de Mercúrio', cost: 100, kind: 'flatMult', value: 2 },
  { id: 'click2', displayName: 'Luvas Alquímicas', cost: 500, kind: 'flatMult', value: 2 },
  { id: 'click3', displayName: 'Toque Reverso', cost: 10_000, kind: 'flatMult', value: 2 },
  { id: 'click4', displayName: 'Ressonância Etérea', cost: 100_000, kind: 'epsPercent', value: 0.01 },
  { id: 'click5', displayName: 'Ressonância Maior', cost: 2_000_000, kind: 'epsPercent', value: 0.03 },
  { id: 'click6', displayName: 'Ressonância Suprema', cost: 50_000_000, kind: 'epsPercent', value: 0.1 },
];
