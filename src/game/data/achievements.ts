import type { GameState } from '@/game/types/game';

export interface AchievementDef {
  id: string;
  displayName: string;
  description: string;
  grantsGhostClicks?: number;
  check: (state: GameState) => boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_destilar',
    displayName: 'Primeira Destilação',
    description: 'Destile pela primeira vez.',
    check: (s) => s.totalClicks >= 1,
  },
  {
    id: 'alembic_1',
    displayName: 'Primeiro Alambique',
    description: 'Possua 1 Alambique.',
    check: (s) => (s.owned.alembic ?? 0) >= 1,
  },
  {
    id: 'alembic_10',
    displayName: 'Destilador Dedicado',
    description: 'Possua 10 Alambiques.',
    check: (s) => (s.owned.alembic ?? 0) >= 10,
  },
  {
    id: 'cauldron_50',
    displayName: 'Mestre do Caldeirão',
    description: 'Possua 50 Caldeirões.',
    check: (s) => (s.owned.cauldron ?? 0) >= 50,
  },
  {
    id: 'essence_1k',
    displayName: 'Mil Gotas',
    description: 'Acumule 1 mil de essência total.',
    check: (s) => s.totalEssenceEarned >= 1_000,
  },
  {
    id: 'essence_1m',
    displayName: 'Mar de Essência',
    description: 'Acumule 1 mi de essência total.',
    check: (s) => s.totalEssenceEarned >= 1_000_000,
  },
  {
    id: 'first_transmutation',
    displayName: 'Primeira Transmutação',
    description: 'Compre uma transmutação.',
    check: (s) => Object.keys(s.boughtUpgrades).length >= 1,
  },
  {
    id: 'first_conjunction',
    displayName: 'Olho no Céu',
    description: 'Clique na primeira Conjunção Astral.',
    check: (s) => s.conjunctionsClicked >= 1,
  },
  {
    id: 'conjunction_5',
    displayName: 'Astrólogo',
    description: 'Colete 5 Conjunções.',
    check: (s) => s.conjunctionsClicked >= 5,
  },
  {
    id: 'frenzy_once',
    displayName: 'Frenesi Alquímico',
    description: 'Ative um Frenesi.',
    check: (s) => s.frenzyActivations >= 1,
  },
  {
    id: 'athanor_1',
    displayName: 'Forno Aceso',
    description: 'Possua 1 Athanor.',
    check: (s) => (s.owned.athanor ?? 0) >= 1,
  },
  {
    id: 'tree_1',
    displayName: 'Raiz Filosofal',
    description: 'Possua 1 Árvore Filosofal.',
    check: (s) => (s.owned.tree ?? 0) >= 1,
  },
  {
    id: 'click_upgrade_3',
    displayName: 'Dedos Ágeis',
    description: 'Compre 3 upgrades de clique.',
    check: (s) => Object.keys(s.boughtClickUpgrades).length >= 3,
  },
  {
    id: 'ghost_hand',
    displayName: 'Mão Fantasma',
    description: 'Desbloqueie o auto-clique.',
    grantsGhostClicks: 1,
    check: (s) => s.totalEssenceEarned >= 50_000,
  },
  {
    id: 'seal_10',
    displayName: 'Selo do Alquimista X',
    description: 'Desbloqueie 10 conquistas.',
    check: (s) => Object.keys(s.unlockedAchievements).length >= 10,
  },
];
