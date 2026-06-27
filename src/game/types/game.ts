export type ActiveEffectKind = 'frenzy' | 'clickFrenzy' | 'eclipse';

export interface ActiveEffect {
  id: string;
  kind: ActiveEffectKind;
  endsAt: number;
}

export type RitualEffectKind = 'epsMult' | 'clickMult';

export interface ActiveRitualEffect {
  id: string;
  effect: RitualEffectKind;
  magnitude: number;
  endsAt: number;
}

export interface GameState {
  essence: number;
  owned: Record<string, number>;
  boughtUpgrades: Record<string, true>;
  boughtClickUpgrades: Record<string, true>;
  boughtPermNodes: Record<string, true>;
  unlockedAchievements: Record<string, true>;
  activeEffects: ActiveEffect[];
  activeRitualEffects: ActiveRitualEffect[];
  ritualCooldowns: Record<string, number>;
  ritualsLaunched: number;
  totalClicks: number;
  totalEssenceEarned: number;
  conjunctionsClicked: number;
  frenzyActivations: number;
  ghostClicksPerSec: number;
  quintessence: number;
  quintessenceEarned: number;
  prestigePoints: number;
  quintRewardsClaimed: Record<string, true>;
  masteryClaimed: Record<string, true>;
  collectionBonusesClaimed: Record<string, true>;
  trialsCompleted: Record<string, true>;
  runStartedAt: number;
  lastTick: number;
  lastEventBanner: string | null;
  luckyPopup: string | null;
  achievementToast: string | null;
  magnumOpusOpen: boolean;
  godMode: boolean;
}

export interface GameActions {
  tick: (deltaMs: number) => void;
  click: () => void;
  buyGenerator: (id: string) => boolean;
  buyUpgrade: (id: string) => boolean;
  buyClickUpgrade: (id: string) => void;
  buyQuintessenceNode: (id: string) => void;
  castRitual: (id: string) => boolean;
  prestige: () => boolean;
  triggerAstralEvent: () => { displayName: string; apply: 'frenzy' | 'lucky' | 'clickFrenzy' | 'eclipse' };
  clearEventBanner: () => void;
  clearLuckyPopup: () => void;
  clearAchievementToast: () => void;
  openMagnumOpus: () => void;
  closeMagnumOpus: () => void;
  hydrate: (saved: Partial<GameState>) => void;
  toggleGodMode: () => void;
  devAddEssence: (n: number) => void;
  devAddQuintessence: (n: number) => void;
  devResetSave: () => void;
}

export type GameStore = GameState & GameActions;
