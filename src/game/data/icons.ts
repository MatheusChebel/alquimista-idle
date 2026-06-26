export type IconCategory = 'generator' | 'click' | 'mystic';

/** Categorias de anel — KIT_VISUAL_CURSOR.md §7 (Aparelhos = Essência; Toque/Místico = dourado). */
export type IconRef = {
  category: IconCategory;
};

export const ICONS: Record<string, IconRef> = {
  alembic: { category: 'generator' },
  cauldron: { category: 'generator' },
  athanor: { category: 'generator' },
  homunculus: { category: 'generator' },
  herbgarden: { category: 'generator' },
  crucible: { category: 'generator' },
  familiar: { category: 'generator' },
  portal: { category: 'generator' },
  tree: { category: 'generator' },
  click1: { category: 'click' },
  click2: { category: 'click' },
  click3: { category: 'click' },
  click4: { category: 'click' },
  click5: { category: 'click' },
  click6: { category: 'click' },
  essence: { category: 'mystic' },
  magnumopus: { category: 'mystic' },
  conjunction: { category: 'mystic' },
};

export function iconColorForCategory(
  category: IconCategory,
  essenceColor: string,
  accentColor: string,
): string {
  if (category === 'click') return '#F5C542';
  if (category === 'mystic') return accentColor;
  return essenceColor;
}
