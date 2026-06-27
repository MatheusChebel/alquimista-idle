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

export type ClickUpgradeKind = 'flatMult' | 'epsPercent' | 'perInstrument' | 'perInstrumentMult';

export interface ClickUpgradeDef {
  id: string;
  displayName: string;
  cost: number;
  kind: ClickUpgradeKind;
  value: number;
}

export const CLICK_UPGRADES: ClickUpgradeDef[] = [
  { id: 'click1', displayName: 'Dedos de Mercúrio', cost: 100, kind: 'flatMult', value: 2 },
  { id: 'click2', displayName: 'Luvas Alquímicas', cost: 500, kind: 'flatMult', value: 2 },
  { id: 'click3', displayName: 'Toque Reverso', cost: 10_000, kind: 'flatMult', value: 2 },
  { id: 'click4', displayName: 'Ressonância Etérea', cost: 100_000, kind: 'epsPercent', value: 0.01 },
  { id: 'click5', displayName: 'Ressonância Maior', cost: 2_000_000, kind: 'epsPercent', value: 0.03 },
  { id: 'click6', displayName: 'Ressonância Suprema', cost: 50_000_000, kind: 'epsPercent', value: 0.1 },
  { id: 'click7', displayName: 'Dedos Etéreos', cost: 1_000_000_000, kind: 'epsPercent', value: 0.2 },
  { id: 'click8', displayName: 'Toque dos Mil Frascos', cost: 5_000_000_000, kind: 'perInstrument', value: 0.1 },
  { id: 'click9', displayName: 'Toque dos Milhões', cost: 50_000_000_000, kind: 'perInstrumentMult', value: 5 },
  { id: 'click10', displayName: 'Catalisador de Toque', cost: 200_000_000_000, kind: 'flatMult', value: 2 },
  { id: 'click11', displayName: 'Ressonância Absoluta', cost: 1_000_000_000_000, kind: 'epsPercent', value: 0.3 },
  { id: 'click12', displayName: 'Toque Filosofal', cost: 5_000_000_000_000, kind: 'perInstrumentMult', value: 10 },
];
