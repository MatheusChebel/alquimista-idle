import type { UpgradeDefinition, UpgradeLevels } from '@/game/types/game';

export const UPGRADES: UpgradeDefinition[] = [
  {
    id: 'touch',
    name: 'Toque Refinado',
    description: '+1 ouro por clique por nível',
    emoji: '✋',
    baseCost: 15,
    costMultiplier: 1.12,
    type: 'click',
    valuePerLevel: 1,
  },
  {
    id: 'furnace',
    name: 'Fornalha Pequena',
    description: '+1 ouro/s por nível',
    emoji: '🔥',
    baseCost: 50,
    costMultiplier: 1.15,
    type: 'passive',
    valuePerLevel: 1,
  },
  {
    id: 'retort',
    name: 'Retorta de Cobre',
    description: '+5 ouro/s por nível',
    emoji: '⚗️',
    baseCost: 200,
    costMultiplier: 1.18,
    type: 'passive',
    valuePerLevel: 5,
  },
  {
    id: 'cinnabar',
    name: 'Cinábrio Líquido',
    description: '+25 ouro/s por nível',
    emoji: '🧪',
    baseCost: 1_000,
    costMultiplier: 1.2,
    type: 'passive',
    valuePerLevel: 25,
  },
  {
    id: 'stone',
    name: 'Fragmento da Pedra',
    description: '+10% de renda total por nível',
    emoji: '💎',
    baseCost: 5_000,
    costMultiplier: 1.25,
    type: 'multiplier',
    valuePerLevel: 0.1,
  },
];

export const INITIAL_UPGRADE_LEVELS: UpgradeLevels = {
  touch: 0,
  furnace: 0,
  retort: 0,
  cinnabar: 0,
  stone: 0,
};
