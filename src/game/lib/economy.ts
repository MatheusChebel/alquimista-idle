import { GENERATORS } from '@/game/data/generators';
import { CLICK_UPGRADES } from '@/game/data/upgrades';
import type { AstralEventDef } from '@/game/data/events';
import type { ActiveEffect, ActiveRitualEffect } from '@/game/types/game';
import { getPrestigeMult } from '@/game/lib/prestige';

const BASE_CLICK = 1;
const SEAL_MULT_PER_ACHIEVEMENT = 1.02;

export function totalInstruments(owned: Record<string, number>): number {
  return Object.values(owned).reduce((sum, n) => sum + n, 0);
}

export function computeGenMultipliers(boughtUpgrades: Record<string, true>): Record<string, number> {
  const multipliers: Record<string, number> = {};

  for (const generator of GENERATORS) {
    const purchased = Object.keys(boughtUpgrades).filter((id) =>
      id.startsWith(`${generator.id}_`),
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
  owned: Record<string, number>,
  permanentClickMult = 1,
): number {
  let flatMult = 1;
  let epsPercentSum = 0;
  let perInstrumentBase = 0;
  let perInstrumentMult = 1;

  for (const upgrade of CLICK_UPGRADES) {
    if (!boughtClickUpgrades[upgrade.id]) continue;

    if (upgrade.kind === 'flatMult') {
      flatMult *= upgrade.value;
    } else if (upgrade.kind === 'epsPercent') {
      epsPercentSum += upgrade.value;
    } else if (upgrade.kind === 'perInstrument') {
      perInstrumentBase += upgrade.value;
    } else if (upgrade.kind === 'perInstrumentMult') {
      perInstrumentMult *= upgrade.value;
    }
  }

  const instruments = totalInstruments(owned);
  const base =
    BASE_CLICK * flatMult +
    perInstrumentBase * instruments * perInstrumentMult +
    epsPercentSum * eps;

  return base * permanentClickMult;
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

export function pruneRitualEffects(effects: ActiveRitualEffect[], now = Date.now()): ActiveRitualEffect[] {
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

export function computeRitualEpsMult(effects: ActiveRitualEffect[], now = Date.now()): number {
  let mult = 1;
  for (const effect of effects) {
    if (effect.endsAt <= now) continue;
    if (effect.effect === 'epsMult') mult *= effect.magnitude;
  }
  return mult;
}

export function computeRitualClickMult(effects: ActiveRitualEffect[], now = Date.now()): number {
  let mult = 1;
  for (const effect of effects) {
    if (effect.endsAt <= now) continue;
    if (effect.effect === 'clickMult') mult *= effect.magnitude;
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
  ritualEffects: ActiveRitualEffect[] = [],
  now = Date.now(),
): number {
  return (
    computeSealMult(unlockedAchievements) *
    computeEventGlobalMult(activeEffects, now) *
    computeRitualEpsMult(ritualEffects, now) *
    getPrestigeMult(prestigePoints)
  );
}
