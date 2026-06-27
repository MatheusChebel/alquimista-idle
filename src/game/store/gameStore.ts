import { create } from 'zustand';

import { ACHIEVEMENTS } from '@/game/data/achievements';
import { ASTRAL_EVENTS } from '@/game/data/events';
import { GENERATORS } from '@/game/data/generators';
import { getPermanentBonuses, QUINTESSENCE_NODES } from '@/game/data/quintessence';
import { RITUALS } from '@/game/data/rituals';
import { CLICK_UPGRADES, UPGRADES } from '@/game/data/upgrades';
import {
  getUpgradeCost,
  pickAstralEvent,
  pruneActiveEffects,
  pruneRitualEffects,
} from '@/game/lib/economy';
import { getEconomyContext } from '@/game/lib/economyRuntime';
import { formatNumber, nextCost } from '@/game/lib/formulas';
import { applyQuintessenceBonuses } from '@/game/lib/quintessenceBonuses';
import { calculatePrestigeGain } from '@/game/lib/prestige';
import { checkTrials } from '@/game/lib/trials';
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
  activeRitualEffects: [],
  ritualCooldowns: {} as Record<string, number>,
  ritualsLaunched: 0,
  totalClicks: 0,
  totalEssenceEarned: 0,
  conjunctionsClicked: 0,
  frenzyActivations: 0,
  ghostClicksPerSec: 0,
  quintessence: 0,
  quintessenceEarned: 0,
  prestigePoints: 0,
  quintRewardsClaimed: {} as Record<string, true>,
  masteryClaimed: {} as Record<string, true>,
  collectionBonusesClaimed: {} as Record<string, true>,
  trialsCompleted: {} as Record<string, true>,
  runStartedAt: Date.now(),
  lastTick: Date.now(),
  lastEventBanner: null as string | null,
  luckyPopup: null as string | null,
  achievementToast: null as string | null,
  magnumOpusOpen: false,
  godMode: false,
});

function checkAchievements(state: GameStore): Partial<GameStore> {
  if (Object.keys(state.unlockedAchievements).length >= ACHIEVEMENTS.length) {
    return {};
  }

  const updates: Partial<GameStore> = {};
  const unlockedAchievements = { ...state.unlockedAchievements };
  const quintRewardsClaimed = { ...state.quintRewardsClaimed };
  let quintessence = state.quintessence;
  let quintessenceEarned = state.quintessenceEarned;
  let newestAchievement: string | null = null;

  for (const achievement of ACHIEVEMENTS) {
    if (unlockedAchievements[achievement.id]) continue;

    const snapshot = { ...state, ...updates, unlockedAchievements, quintessence };
    if (!achievement.check(snapshot)) continue;

    unlockedAchievements[achievement.id] = true;
    newestAchievement = achievement.displayName;
    if (!quintRewardsClaimed[achievement.id]) {
      quintessence += achievement.quintReward;
      quintessenceEarned += achievement.quintReward;
      quintRewardsClaimed[achievement.id] = true;
    }
  }

  updates.unlockedAchievements = unlockedAchievements;
  updates.quintRewardsClaimed = quintRewardsClaimed;
  updates.quintessence = quintessence;
  updates.quintessenceEarned = quintessenceEarned;
  if (newestAchievement) {
    updates.achievementToast = newestAchievement;
  }
  return updates;
}

function applyMetaProgress(state: GameStore): Partial<GameStore> {
  const merged = { ...state };
  const achievementUpdates = checkAchievements(merged);
  Object.assign(merged, achievementUpdates);
  const quintUpdates = applyQuintessenceBonuses(merged);
  Object.assign(merged, quintUpdates);
  const trialUpdates = checkTrials(merged);
  return { ...achievementUpdates, ...quintUpdates, ...trialUpdates };
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
      applyMetaProgress({
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
    if (!generator) return false;

    const state = get();
    const owned = state.owned[id] ?? 0;
    const cost = nextCost(generator.baseCost, owned);
    if (state.essence < cost) return false;

    const nextState = {
      ...state,
      essence: state.essence - cost,
      owned: { ...state.owned, [id]: owned + 1 },
      lastTick: Date.now(),
    };

    set({ ...nextState, ...applyMetaProgress(nextState) });
    return true;
  },

  buyUpgrade: (id: string) => {
    flushPendingClicksNow(set, get);
    const upgrade = UPGRADES.find((item) => item.id === id);
    if (!upgrade) return false;

    const state = get();
    if (state.boughtUpgrades[id]) return false;

    const ownedCount = state.owned[upgrade.generatorId] ?? 0;
    if (ownedCount < upgrade.unlockAt) return false;

    const cost = getUpgradeCost(upgrade.generatorId, upgrade.costMult);
    if (state.essence < cost) return false;

    const nextState = {
      ...state,
      essence: state.essence - cost,
      boughtUpgrades: { ...state.boughtUpgrades, [id]: true as const },
      lastTick: Date.now(),
    };

    set({ ...nextState, ...applyMetaProgress(nextState) });
    return true;
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

    set({ ...nextState, ...applyMetaProgress(nextState) });
  },

  castRitual: (id: string) => {
    flushPendingClicksNow(set, get);
    const ritual = RITUALS.find((r) => r.id === id);
    if (!ritual) return false;

    const state = get();
    const now = Date.now();
    if (state.totalEssenceEarned < ritual.unlockEssence) return false;
    if ((state.ritualCooldowns[id] ?? 0) > now) return false;

    const { eps, activeRitualEffects } = getEconomyContext(state, now);
    const ritualCooldowns = { ...state.ritualCooldowns, [id]: now + ritual.cooldownMs };
    const ritualsLaunched = state.ritualsLaunched + 1;

    let nextState: GameStore = {
      ...state,
      ritualCooldowns,
      ritualsLaunched,
      activeRitualEffects: [...activeRitualEffects],
      lastTick: now,
    };

    if (ritual.effect === 'instantEssence') {
      const gain = eps * ritual.magnitude;
      nextState = {
        ...nextState,
        essence: state.essence + gain,
        totalEssenceEarned: state.totalEssenceEarned + gain,
      };
    } else {
      nextState.activeRitualEffects.push({
        id: `${ritual.id}-${now}`,
        effect: ritual.effect,
        magnitude: ritual.magnitude,
        endsAt: now + ritual.durationMs,
      });
    }

    set({ ...nextState, ...applyMetaProgress(nextState) });
    return true;
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
      activeRitualEffects: [],
      ritualCooldowns: {},
      lastEventBanner: null,
      luckyPopup: null,
      runStartedAt: Date.now(),
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
      ...applyMetaProgress({ ...state, ...baseUpdate }),
    });

    return { displayName: event.displayName, apply: event.apply };
  },

  clearEventBanner: () => set({ lastEventBanner: null }),
  clearLuckyPopup: () => set({ luckyPopup: null }),
  clearAchievementToast: () => set({ achievementToast: null }),

  openMagnumOpus: () => set({ magnumOpusOpen: true }),

  closeMagnumOpus: () => set({ magnumOpusOpen: false }),

  toggleGodMode: () => set((s) => ({ godMode: !s.godMode })),

  devAddEssence: (n: number) => {
    const state = get();
    set({
      essence: state.essence + n,
      totalEssenceEarned: state.totalEssenceEarned + n,
    });
  },

  devAddQuintessence: (n: number) => {
    const state = get();
    set({
      quintessence: state.quintessence + n,
      quintessenceEarned: state.quintessenceEarned + n,
    });
  },

  devResetSave: () => {
    lastAchievementCheckAt = 0;
    pendingClicks = 0;
    if (clickFlushTimer) {
      clearTimeout(clickFlushTimer);
      clickFlushTimer = null;
    }
    set({ ...createInitialState() });
  },

  tick: (deltaMs: number) => {
    if (pendingClicks > 0) {
      flushPendingClicksNow(set, get);
    }

    const state = get();
    const now = Date.now();
    const { activeEffects, activeRitualEffects, eps, clickValue } = getEconomyContext(state, now);

    const effectsChanged =
      activeEffects.length !== state.activeEffects.length ||
      activeRitualEffects.length !== state.activeRitualEffects.length;
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
      update.activeRitualEffects = activeRitualEffects;
    }

    if (shouldRunAchievementCheck(now)) {
      const merged = {
        ...state,
        essence: newEssence,
        totalEssenceEarned: newTotal,
        activeEffects: effectsChanged ? activeEffects : state.activeEffects,
        activeRitualEffects: effectsChanged ? activeRitualEffects : state.activeRitualEffects,
      };
      set({ ...update, ...applyMetaProgress(merged) });
    } else {
      set(update);
    }

    if (get().godMode) {
      set({ essence: 1e30 });
    }
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
      activeRitualEffects: saved.activeRitualEffects ?? state.activeRitualEffects,
      ritualCooldowns: saved.ritualCooldowns ?? state.ritualCooldowns,
      ritualsLaunched: saved.ritualsLaunched ?? state.ritualsLaunched,
      totalClicks: saved.totalClicks ?? state.totalClicks,
      totalEssenceEarned: saved.totalEssenceEarned ?? state.totalEssenceEarned,
      conjunctionsClicked: saved.conjunctionsClicked ?? state.conjunctionsClicked,
      frenzyActivations: saved.frenzyActivations ?? state.frenzyActivations,
      ghostClicksPerSec: saved.ghostClicksPerSec ?? state.ghostClicksPerSec,
      quintessence: saved.quintessence ?? state.quintessence,
      quintessenceEarned: saved.quintessenceEarned ?? state.quintessenceEarned,
      prestigePoints: saved.prestigePoints ?? state.prestigePoints,
      quintRewardsClaimed: saved.quintRewardsClaimed ?? state.quintRewardsClaimed,
      masteryClaimed: saved.masteryClaimed ?? state.masteryClaimed,
      collectionBonusesClaimed: saved.collectionBonusesClaimed ?? state.collectionBonusesClaimed,
      trialsCompleted: saved.trialsCompleted ?? state.trialsCompleted,
      runStartedAt: saved.runStartedAt ?? state.runStartedAt,
      lastTick: saved.lastTick ?? state.lastTick,
    }));
  },
}));
