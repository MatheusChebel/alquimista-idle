export type ActiveEffectKind = 'frenzy' | 'clickFrenzy' | 'eclipse';

export interface ActiveEffect {
  id: string;
  kind: ActiveEffectKind;
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
  totalClicks: number;
  totalEssenceEarned: number;
  conjunctionsClicked: number;
  frenzyActivations: number;
  ghostClicksPerSec: number;
  quintessence: number;
  quintessenceEarned: number;
  prestigePoints: number;
  lastTick: number;
  lastEventBanner: string | null;
  luckyPopup: string | null;
  achievementToast: string | null;
  magnumOpusOpen: boolean;
}

export interface GameActions {
  tick: (deltaMs: number) => void;
  click: () => void;
  buyGenerator: (id: string) => void;
  buyUpgrade: (id: string) => void;
  buyClickUpgrade: (id: string) => void;
  buyQuintessenceNode: (id: string) => void;
  prestige: () => boolean;
  triggerAstralEvent: () => string;
  clearEventBanner: () => void;
  clearLuckyPopup: () => void;
  clearAchievementToast: () => void;
  openMagnumOpus: () => void;
  closeMagnumOpus: () => void;
  hydrate: (saved: Partial<GameState>) => void;
}

export type GameStore = GameState & GameActions;
