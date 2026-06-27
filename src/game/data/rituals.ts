import type { ClickUpgradeDef } from '@/game/data/upgrades';

export type ClickUpgradeKind = ClickUpgradeDef['kind'];

export interface RitualDef {
  id: string;
  displayName: string;
  description: string;
  unlockEssence: number;
  cooldownMs: number;
  durationMs: number;
  effect: 'instantEssence' | 'epsMult' | 'clickMult';
  magnitude: number;
  icon: string;
}

export const RITUALS: RitualDef[] = [
  {
    id: 'transmutar',
    displayName: 'Transmutar',
    description: 'Converte o ar em essência.',
    unlockEssence: 1_000,
    cooldownMs: 30_000,
    durationMs: 0,
    effect: 'instantEssence',
    magnitude: 30,
    icon: 'IconWand',
  },
  {
    id: 'catalisar',
    displayName: 'Catalisar',
    description: 'Acelera todas as reações.',
    unlockEssence: 100_000,
    cooldownMs: 120_000,
    durationMs: 30_000,
    effect: 'epsMult',
    magnitude: 3,
    icon: 'IconBolt',
  },
  {
    id: 'midas',
    displayName: 'Mão de Midas',
    description: 'Cada toque vale ouro.',
    unlockEssence: 10_000_000,
    cooldownMs: 180_000,
    durationMs: 20_000,
    effect: 'clickMult',
    magnitude: 10,
    icon: 'IconHandStop',
  },
];
