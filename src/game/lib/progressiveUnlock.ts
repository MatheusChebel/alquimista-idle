import { GENERATORS } from '@/game/data/generators';

/** Instrumentos desbloqueados + o próximo como teaser (seção 8.3b). */
export function getProgressiveGenerators(owned: Record<string, number>) {
  const visible: typeof GENERATORS = [];

  for (let i = 0; i < GENERATORS.length; i++) {
    const gen = GENERATORS[i];
    const count = owned[gen.id] ?? 0;
    const prevOwned = i === 0 ? 1 : (owned[GENERATORS[i - 1].id] ?? 0);

    if (i === 0 || count > 0 || prevOwned > 0) {
      visible.push(gen);
      if (count === 0 && i > 0) break;
    }
  }

  return visible;
}

export function isGeneratorTeaser(generatorId: string, owned: Record<string, number>): boolean {
  const index = GENERATORS.findIndex((g) => g.id === generatorId);
  if (index <= 0) return false;
  return (owned[generatorId] ?? 0) === 0;
}

export function generatorTeaserHint(generatorId: string): string {
  const index = GENERATORS.findIndex((g) => g.id === generatorId);
  if (index <= 0) return '';
  const prev = GENERATORS[index - 1];
  return `Desbloqueia ao ter 1 ${prev.displayName}`;
}
