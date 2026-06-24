export type UpgradeId = 'touch' | 'furnace' | 'retort' | 'cinnabar' | 'stone';

export type UpgradeType = 'click' | 'passive' | 'multiplier';

export interface UpgradeDefinition {
  id: UpgradeId;
  name: string;
  description: string;
  emoji: string;
  baseCost: number;
  costMultiplier: number;
  type: UpgradeType;
  valuePerLevel: number;
}

export interface GameStats {
  clickPower: number;
  goldPerSecond: number;
  incomeMultiplier: number;
  prestigeMultiplier: number;
  totalMultiplier: number;
}

export interface UpgradeLevels {
  touch: number;
  furnace: number;
  retort: number;
  cinnabar: number;
  stone: number;
}

export interface GameState {
  gold: number;
  totalGoldEarned: number;
  upgradeLevels: UpgradeLevels;
  prestigePoints: number;
  lastTickAt: number;
}

export interface GameActions {
  click: () => void;
  buyUpgrade: (id: UpgradeId) => boolean;
  prestige: () => boolean;
  tick: (deltaSeconds: number) => void;
  applyOfflineProgress: () => void;
  resetSave: () => void;
}

export type GameStore = GameState & GameActions;
