import { create } from 'zustand';

import { ACHIEVEMENTS } from '@/game/data/achievements';
import { ASTRAL_EVENTS } from '@/game/data/events';
import { GENERATORS } from '@/game/data/generators';
import { getPermanentBonuses, QUINTESSENCE_NODES } from '@/game/data/quintessence';
import { CLICK_UPGRADES, UPGRADES } from '@/game/data/upgrades';
import { getUpgradeCost, pickAstralEvent, pruneActiveEffects } from '@/game/lib/economy';
import { getEconomyContext } from '@/game/lib/economyRuntime';
import { formatNumber, nextCost } from '@/game/lib/formulas';
import { calculatePrestigeGain } from '@/game/lib/prestige';
import type { GameStore } from '@/game/types/game';

let lastAchievementCheckAt = 0;
let pendingClicks = 0;
let clickFlushTimer: ReturnType<typeof setTimeout> | null = null;

const CLICK_FLUSH_MS = 80;
const ACHIEVEMENT_CHECK_MS = 1500;

const createInitialState = () => ({
  essence: 0,
  owned: {} as Record<string, number>,
  boughtUpgrades: {} as Record<string, true>,
  boughtClickUpgrades: {} as Record<string, true>,
  boughtPermNodes: {} as Record<string, true>,
  unlockedAchievements: {} as Record<string, true>,
  activeEffects: [],
  totalClicks: 0,
  totalEssenceEarned: 0,
  conjunctionsClicked: 0,
  frenzyActivations: 0,
  ghostClicksPerSec: 0,
  quintessence: 0,
  quintessenceEarned: 0,
  prestigePoints: 0,
  lastTick: Date.now(),
  lastEventBanner: null as string | null,
  luckyPopup: null as string | null,
  achievementToast: null as string | null,
  magnumOpusOpen: false,
});

function checkAchievements(state: GameStore): Partial<GameStore> {
  if (Object.keys(state.unlockedAchievements).length >= ACHIEVEMENTS.length) {
    return {};
  }

  const updates: Partial<GameStore> = {};
  let ghostClicksPerSec = state.ghostClicksPerSec;
  const unlockedAchievements = { ...state.unlockedAchievements };
  let newestAchievement: string | null = null;

  for (const achievement of ACHIEVEMENTS) {
    if (unlockedAchievements[achievement.id]) continue;

    const snapshot = { ...state, ...updates, unlockedAchievements, ghostClicksPerSec };
    if (!achievement.check(snapshot)) continue;

    unlockedAchievements[achievement.id] = true;
    newestAchievement = achievement.displayName;
    if (achievement.grantsGhostClicks) {
      ghostClicksPerSec += achievement.grantsGhostClicks;
    }
  }

  updates.unlockedAchievements = unlockedAchievements;
  updates.ghostClicksPerSec = ghostClicksPerSec;
  if (newestAchievement) {
    updates.achievementToast = newestAchievement;
  }
  return updates;
}

function addEssence(state: GameStore, amount: number): Partial<GameStore> {
  if (amount <= 0) return {};
  return {
    essence: state.essence + amount,
    totalEssenceEarned: state.totalEssenceEarned + amount,
  };
}

function shouldRunAchievementCheck(now: number): boolean {
  if (now - lastAchievementCheckAt < ACHIEVEMENT_CHECK_MS) return false;
  lastAchievementCheckAt = now;
  return true;
}

function flushPendingClicks(
  set: (partial: Partial<GameStore>) => void,
  get: () => GameStore,
) {
  clickFlushTimer = null;
  const count = pendingClicks;
  pendingClicks = 0;
  if (count <= 0) return;

  const state = get();
  const now = Date.now();
  const { activeEffects, clickValue } = getEconomyContext(state, now);
  const gained = clickValue * count;
  const nextEssence = state.essence + gained;
  const nextTotal = state.totalEssenceEarned + gained;
  const nextClicks = state.totalClicks + count;

  const update: Partial<GameStore> = {
    essence: nextEssence,
    totalEssenceEarned: nextTotal,
    totalClicks: nextClicks,
    activeEffects,
    lastTick: now,
  };

  if (shouldRunAchievementCheck(now)) {
    Object.assign(
      update,
      checkAchievements({
        ...state,
        essence: nextEssence,
        totalClicks: nextClicks,
        totalEssenceEarned: nextTotal,
      }),
    );
  }

  set(update);
}

function flushPendingClicksNow(
  set: (partial: Partial<GameStore>) => void,
  get: () => GameStore,
) {
  if (clickFlushTimer) {
    clearTimeout(clickFlushTimer);
    clickFlushTimer = null;
  }
  flushPendingClicks(set, get);
}

function scheduleClickFlush(
  set: (partial: Partial<GameStore>) => void,
  get: () => GameStore,
) {
  if (clickFlushTimer) return;
  clickFlushTimer = setTimeout(() => flushPendingClicks(set, get), CLICK_FLUSH_MS);
}

export const useGameStore = create<GameStore>()((set, get) => ({
  ...createInitialState(),

  click: () => {
    pendingClicks += 1;
    scheduleClickFlush(set, get);
  },

  buyGenerator: (id: string) => {
    flushPendingClicksNow(set, get);
    const generator = GENERATORS.find((item) => item.id === id);
    if (!generator) return;

    const state = get();
    const owned = state.owned[id] ?? 0;
    const cost = nextCost(generator.baseCost, owned);
    if (state.essence < cost) return;

    const nextState = {
      ...state,
      essence: state.essence - cost,
      owned: { ...state.owned, [id]: owned + 1 },
      lastTick: Date.now(),
    };

    set({ ...nextState, ...checkAchievements(nextState) });
  },

  buyUpgrade: (id: string) => {
    flushPendingClicksNow(set, get);
    const upgrade = UPGRADES.find((item) => item.id === id);
    if (!upgrade) return;

    const state = get();
    if (state.boughtUpgrades[id]) return;

    const ownedCount = state.owned[upgrade.generatorId] ?? 0;
    if (ownedCount < upgrade.unlockAt) return;

    const cost = getUpgradeCost(upgrade.generatorId, upgrade.costMult);
    if (state.essence < cost) return;

    const nextState = {
      ...state,
      essence: state.essence - cost,
      boughtUpgrades: { ...state.boughtUpgrades, [id]: true as const },
      lastTick: Date.now(),
    };

    set({ ...nextState, ...checkAchievements(nextState) });
  },

  buyClickUpgrade: (id: string) => {
    flushPendingClicksNow(set, get);
    const upgrade = CLICK_UPGRADES.find((item) => item.id === id);
    if (!upgrade) return;

    const state = get();
    if (state.boughtClickUpgrades[id]) return;
    if (state.essence < upgrade.cost) return;

    const nextState = {
      ...state,
      essence: state.essence - upgrade.cost,
      boughtClickUpgrades: { ...state.boughtClickUpgrades, [id]: true as const },
      lastTick: Date.now(),
    };

    set({ ...nextState, ...checkAchievements(nextState) });
  },

  buyQuintessenceNode: (id: string) => {
    const node = QUINTESSENCE_NODES.find((item) => item.id === id);
    if (!node) return;

    const state = get();
    if (state.boughtPermNodes[id]) return;
    if (state.quintessence < node.cost) return;

    set({
      quintessence: state.quintessence - node.cost,
      boughtPermNodes: { ...state.boughtPermNodes, [id]: true as const },
    });
  },

  prestige: () => {
    flushPendingClicksNow(set, get);
    const state = get();
    const gained = calculatePrestigeGain(state.totalEssenceEarned, state.prestigePoints);
    if (gained < 1) return false;

    const perm = getPermanentBonuses(state.boughtPermNodes);
    const keptEssence = state.essence * perm.legacyPercent;
    const startEssence = perm.startingEssence + keptEssence;

    set({
      essence: startEssence,
      owned: {},
      boughtUpgrades: {},
      boughtClickUpgrades: {},
      activeEffects: [],
      lastEventBanner: null,
      luckyPopup: null,
      prestigePoints: state.prestigePoints + gained,
      quintessence: state.quintessence + gained,
      quintessenceEarned: state.quintessenceEarned + gained,
      lastTick: Date.now(),
    });

    return true;
  },

  triggerAstralEvent: () => {
    const state = get();
    const now = Date.now();
    const event = pickAstralEvent(ASTRAL_EVENTS);
    const { activeEffects, eps } = getEconomyContext(state, now);

    let essence = state.essence;
    let totalEssenceEarned = state.totalEssenceEarned;
    let frenzyActivations = state.frenzyActivations;
    const nextEffects = [...activeEffects];

    let luckyPopup: string | null = null;

    if (event.apply === 'lucky') {
      const instant = Math.min(essence * event.magnitude, eps * 900 * event.magnitude);
      essence += instant;
      totalEssenceEarned += instant;
      luckyPopup = formatNumber(instant);
    } else if (event.apply === 'frenzy') {
      frenzyActivations += 1;
      nextEffects.push({
        id: `${event.id}-${now}`,
        kind: 'frenzy',
        endsAt: now + event.durationMs,
      });
    } else if (event.apply === 'clickFrenzy') {
      nextEffects.push({
        id: `${event.id}-${now}`,
        kind: 'clickFrenzy',
        endsAt: now + event.durationMs,
      });
    } else if (event.apply === 'eclipse') {
      nextEffects.push({
        id: `${event.id}-${now}`,
        kind: 'eclipse',
        endsAt: now + event.durationMs,
      });
    }

    const baseUpdate = {
      essence,
      totalEssenceEarned,
      conjunctionsClicked: state.conjunctionsClicked + 1,
      frenzyActivations,
      activeEffects: nextEffects,
      luckyPopup,
      lastTick: now,
    };

    set({
      ...baseUpdate,
      ...checkAchievements({ ...state, ...baseUpdate }),
    });

    return event.displayName;
  },

  clearEventBanner: () => set({ lastEventBanner: null }),
  clearLuckyPopup: () => set({ luckyPopup: null }),
  clearAchievementToast: () => set({ achievementToast: null }),

  openMagnumOpus: () => set({ magnumOpusOpen: true }),

  closeMagnumOpus: () => set({ magnumOpusOpen: false }),

  tick: (deltaMs: number) => {
    if (pendingClicks > 0) {
      flushPendingClicksNow(set, get);
    }

    const state = get();
    const now = Date.now();
    const { activeEffects, eps, clickValue } = getEconomyContext(state, now);

    const effectsChanged = activeEffects.length !== state.activeEffects.length;
    const passive = eps * (deltaMs / 1000);
    const ghost = clickValue * state.ghostClicksPerSec * (deltaMs / 1000);
    const earned = passive + ghost;

    if (earned <= 0 && !effectsChanged) return;

    const newEssence = state.essence + earned;
    const newTotal = state.totalEssenceEarned + earned;

    const update: Partial<GameStore> = {
      ...addEssence(state, earned),
      lastTick: now,
    };

    if (effectsChanged) {
      update.activeEffects = activeEffects;
    }

    if (shouldRunAchievementCheck(now)) {
      set({
        ...update,
        ...checkAchievements({
          ...state,
          essence: newEssence,
          totalEssenceEarned: newTotal,
          activeEffects: effectsChanged ? activeEffects : state.activeEffects,
        }),
      });
      return;
    }

    set(update);
  },

  hydrate: (saved) => {
    set((state) => ({
      essence: saved.essence ?? state.essence,
      owned: saved.owned ?? state.owned,
      boughtUpgrades: saved.boughtUpgrades ?? state.boughtUpgrades,
      boughtClickUpgrades: saved.boughtClickUpgrades ?? state.boughtClickUpgrades,
      boughtPermNodes: saved.boughtPermNodes ?? state.boughtPermNodes,
      unlockedAchievements: saved.unlockedAchievements ?? state.unlockedAchievements,
      activeEffects: saved.activeEffects ?? state.activeEffects,
      totalClicks: saved.totalClicks ?? state.totalClicks,
      totalEssenceEarned: saved.totalEssenceEarned ?? state.totalEssenceEarned,
      conjunctionsClicked: saved.conjunctionsClicked ?? state.conjunctionsClicked,
      frenzyActivations: saved.frenzyActivations ?? state.frenzyActivations,
      ghostClicksPerSec: saved.ghostClicksPerSec ?? state.ghostClicksPerSec,
      quintessence: saved.quintessence ?? state.quintessence,
      quintessenceEarned: saved.quintessenceEarned ?? state.quintessenceEarned,
      prestigePoints: saved.prestigePoints ?? state.prestigePoints,
      lastTick: saved.lastTick ?? state.lastTick,
    }));
  },
}));
