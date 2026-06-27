import { GENERATORS } from '@/game/data/generators';
import { PHASE_MILESTONES } from '@/constants/theme';
import { visualTier } from '@/game/data/labTiers';
import type { GameState } from '@/game/types/game';

export interface AchievementDef {
  id: string;
  displayName: string;
  checkLabel: string;
  quintReward: number;
  check: (state: GameState) => boolean;
}

function hasOneOfEachInstrument(owned: Record<string, number>): boolean {
  return GENERATORS.every((g) => (owned[g.id] ?? 0) >= 1);
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'firstdrop',
    displayName: 'Primeira Gota',
    checkLabel: '1 toque',
    quintReward: 1,
    check: (s) => s.totalClicks >= 1,
  },
  {
    id: 'click100',
    displayName: 'Mãos Inquietas',
    checkLabel: '100 toques',
    quintReward: 1,
    check: (s) => s.totalClicks >= 100,
  },
  {
    id: 'ess1k',
    displayName: 'Aprendiz',
    checkLabel: '1.000 de essência (total)',
    quintReward: 1,
    check: (s) => s.totalEssenceEarned >= 1_000,
  },
  {
    id: 'ess1m',
    displayName: 'Boticário',
    checkLabel: '1.000.000 de essência (total)',
    quintReward: 2,
    check: (s) => s.totalEssenceEarned >= 1_000_000,
  },
  {
    id: 'cauldron10',
    displayName: 'Fervura',
    checkLabel: '10 Caldeirões',
    quintReward: 2,
    check: (s) => (s.owned.cauldron ?? 0) >= 10,
  },
  {
    id: 'cauldron50',
    displayName: 'Caldeiraria',
    checkLabel: '50 Caldeirões',
    quintReward: 3,
    check: (s) => (s.owned.cauldron ?? 0) >= 50,
  },
  {
    id: 'oneofeach',
    displayName: 'Colecionador',
    checkLabel: '1 de cada Instrumento',
    quintReward: 5,
    check: (s) => hasOneOfEachInstrument(s.owned),
  },
  {
    id: 'firstritual',
    displayName: 'Primeiro Feitiço',
    checkLabel: 'lançar 1 Ritual',
    quintReward: 2,
    check: (s) => s.ritualsLaunched >= 1,
  },
  {
    id: 'firstevent',
    displayName: 'Sob os Astros',
    checkLabel: 'coletar 1 Conjunção',
    quintReward: 2,
    check: (s) => s.conjunctionsClicked >= 1,
  },
  {
    id: 'firstopus',
    displayName: 'A Grande Obra Começa',
    checkLabel: '1ª Magnum Opus',
    quintReward: 5,
    check: (s) => s.prestigePoints >= 1,
  },
  {
    id: 'tier5any',
    displayName: 'Mestria',
    checkLabel: 'levar 1 Instrumento ao Nível 5',
    quintReward: 5,
    check: (s) => GENERATORS.some((g) => visualTier(s.owned[g.id] ?? 0) >= 5),
  },
  {
    id: 'allnigredo',
    displayName: 'Fim do Nigredo',
    checkLabel: 'alcançar a fase Albedo',
    quintReward: 10,
    check: (s) => s.quintessenceEarned >= PHASE_MILESTONES.albedo,
  },
];
