import { GENERATORS } from '@/game/data/generators';
import { CLICK_UPGRADES, UPGRADES } from '@/game/data/upgrades';
import type { AstralEventDef } from '@/game/data/events';
import type { ActiveEffect } from '@/game/types/game';
import { getPrestigeMult } from '@/game/lib/prestige';

const BASE_CLICK = 1;
const SEAL_MULT_PER_ACHIEVEMENT = 1.02;

export function computeGenMultipliers(boughtUpgrades: Record<string, true>): Record<string, number> {
  const multipliers: Record<string, number> = {};

  for (const generator of GENERATORS) {
    const purchased = UPGRADES.filter(
      (upgrade) => upgrade.generatorId === generator.id && boughtUpgrades[upgrade.id],
    ).length;

    if (purchased > 0) {
      multipliers[generator.id] = Math.pow(2, purchased);
    }
  }

  return multipliers;
}

export function computeClickValue(
  boughtClickUpgrades: Record<string, true>,
  eps: number,
  permanentClickMult = 1,
): number {
  let flatMult = 1;
  let epsPercentSum = 0;

  for (const upgrade of CLICK_UPGRADES) {
    if (!boughtClickUpgrades[upgrade.id]) continue;

    if (upgrade.kind === 'flatMult') {
      flatMult *= upgrade.value;
    } else {
      epsPercentSum += upgrade.value;
    }
  }

  return (BASE_CLICK * flatMult + epsPercentSum * eps) * permanentClickMult;
}

export function getUpgradeCost(generatorId: string, costMult: number): number {
  const generator = GENERATORS.find((item) => item.id === generatorId);
  if (!generator) return 0;
  return generator.baseCost * costMult;
}

export function computeSealMult(unlockedAchievements: Record<string, true>): number {
  const count = Object.keys(unlockedAchievements).length;
  return Math.pow(SEAL_MULT_PER_ACHIEVEMENT, count);
}

export function pruneActiveEffects(effects: ActiveEffect[], now = Date.now()): ActiveEffect[] {
  return effects.filter((effect) => effect.endsAt > now);
}

export function computeEventGlobalMult(effects: ActiveEffect[], now = Date.now()): number {
  let mult = 1;
  for (const effect of effects) {
    if (effect.endsAt <= now) continue;
    if (effect.kind === 'frenzy') mult *= 7;
    if (effect.kind === 'eclipse') mult *= 0.5;
  }
  return mult;
}

export function computeClickFrenzyMult(effects: ActiveEffect[], now = Date.now()): number {
  let mult = 1;
  for (const effect of effects) {
    if (effect.endsAt <= now) continue;
    if (effect.kind === 'clickFrenzy') mult *= 777;
  }
  return mult;
}

export function pickAstralEvent(events: AstralEventDef[]): AstralEventDef {
  const totalWeight = events.reduce((sum, event) => sum + event.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const event of events) {
    roll -= event.weight;
    if (roll <= 0) return event;
  }

  return events[events.length - 1];
}

export function getGlobalMult(
  unlockedAchievements: Record<string, true>,
  activeEffects: ActiveEffect[],
  prestigePoints: number,
  now = Date.now(),
): number {
  return (
    computeSealMult(unlockedAchievements) *
    computeEventGlobalMult(activeEffects, now) *
    getPrestigeMult(prestigePoints)
  );
}
