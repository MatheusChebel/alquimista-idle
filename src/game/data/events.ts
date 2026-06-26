export interface AstralEventDef {
  id: string;
  displayName: string;
  weight: number;
  durationMs: number;
  apply: 'frenzy' | 'lucky' | 'clickFrenzy' | 'eclipse';
  magnitude: number;
}

export const ASTRAL_EVENTS: AstralEventDef[] = [
  { id: 'frenzy', displayName: 'Frenesi', weight: 40, durationMs: 77_000, apply: 'frenzy', magnitude: 7 },
  { id: 'lucky', displayName: 'Sorte', weight: 40, durationMs: 0, apply: 'lucky', magnitude: 0.15 },
  { id: 'clickFrenzy', displayName: 'Toque Dourado', weight: 15, durationMs: 13_000, apply: 'clickFrenzy', magnitude: 777 },
  { id: 'eclipse', displayName: 'Eclipse', weight: 5, durationMs: 6_000, apply: 'eclipse', magnitude: 0.5 },
];

export const EVENT_MIN_MS = 60_000;
export const EVENT_MAX_MS = 300_000;
