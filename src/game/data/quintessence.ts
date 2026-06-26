export type QuintessenceEffect = 'legacy' | 'blessedStart' | 'allSeeingEye' | 'goldenHands';

export interface QuintessenceNodeDef {
  id: string;
  displayName: string;
  description: string;
  cost: number;
  effect: QuintessenceEffect;
  value: number;
}

export const QUINTESSENCE_NODES: QuintessenceNodeDef[] = [
  {
    id: 'legacy',
    displayName: 'Legado',
    description: 'Mantém 10% da essência entre resets.',
    cost: 10,
    effect: 'legacy',
    value: 0.1,
  },
  {
    id: 'blessed_start',
    displayName: 'Começo Abençoado',
    description: '+100 essência ao prestigiar.',
    cost: 25,
    effect: 'blessedStart',
    value: 100,
  },
  {
    id: 'all_seeing',
    displayName: 'Olho que Tudo Vê',
    description: 'Conjunções Astrais 30% mais frequentes.',
    cost: 50,
    effect: 'allSeeingEye',
    value: 0.7,
  },
  {
    id: 'golden_hands',
    displayName: 'Mãos Douradas',
    description: 'Clique permanente ×2.',
    cost: 100,
    effect: 'goldenHands',
    value: 2,
  },
];

export interface PermanentBonuses {
  legacyPercent: number;
  startingEssence: number;
  eventIntervalMult: number;
  clickMult: number;
}

export function getPermanentBonuses(
  boughtPermNodes: Record<string, true>,
): PermanentBonuses {
  const bonuses: PermanentBonuses = {
    legacyPercent: 0,
    startingEssence: 0,
    eventIntervalMult: 1,
    clickMult: 1,
  };

  for (const node of QUINTESSENCE_NODES) {
    if (!boughtPermNodes[node.id]) continue;

    switch (node.effect) {
      case 'legacy':
        bonuses.legacyPercent = node.value;
        break;
      case 'blessedStart':
        bonuses.startingEssence += node.value;
        break;
      case 'allSeeingEye':
        bonuses.eventIntervalMult *= node.value;
        break;
      case 'goldenHands':
        bonuses.clickMult *= node.value;
        break;
    }
  }

  return bonuses;
}
