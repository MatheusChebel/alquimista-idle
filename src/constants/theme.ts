import { Platform, type TextStyle } from 'react-native';

import '@/global.css';

// ─── 2.4 Tokens base (DIRECAO_DE_ARTE_CURSOR.md) ───────────────────────────

export const BASE = {
  bgDeep: '#0F0B17',
  bgSurface: '#1A1428',
  bgElevated: '#241B38',
  borderHair: '#392E55',
  textPrimary: '#EDE7F7',
  textMuted: '#9588B4',
  textFaint: '#5C5179',
  gold: '#F5C542',
  goldInk: '#3A2A06',
  danger: '#C2606A',
  eclipse: '#8B2F4A',
  shadowGlow: 'rgba(0,0,0,0.55)',
} as const;

export type Phase = 'nigredo' | 'albedo' | 'citrinitas' | 'rubedo';

/** Tokens de fase — KIT_VISUAL_CURSOR.md §2 */
export const PHASE = {
  nigredo: { accent: '#46E5C4', glow: '#7CFFE3', essence: '#46E5C4' },
  albedo: { accent: '#A9D4FF', glow: '#E4F1FF', essence: '#BFE3FF' },
  citrinitas: { accent: '#F5C542', glow: '#FFE08A', essence: '#FFD15C' },
  rubedo: { accent: '#FF5D63', glow: '#FF9A5C', essence: '#FF6F61' },
} as const;

export const PHASE_PALETTES: Record<
  Phase,
  {
    accent: string;
    glow: string;
    essence: string;
  }
> = PHASE;

/** Fase inicial antes de ganhar Quintessência. */
export const DEFAULT_PHASE: Phase = 'nigredo';

export const PHASE_MILESTONES = {
  albedo: 50,
  citrinitas: 500,
  rubedo: 5_000,
} as const;

export const PHASE_DISPLAY_NAMES: Record<Phase, string> = {
  nigredo: 'Nigredo',
  albedo: 'Albedo',
  citrinitas: 'Citrinitas',
  rubedo: 'Rubedo',
};

/** Marcos de quintessência total → fase da Grande Obra (Fase 4). */
export function getPhaseForQuintessence(quintessenceEarned: number): Phase {
  if (quintessenceEarned >= PHASE_MILESTONES.rubedo) return 'rubedo';
  if (quintessenceEarned >= PHASE_MILESTONES.citrinitas) return 'citrinitas';
  if (quintessenceEarned >= PHASE_MILESTONES.albedo) return 'albedo';
  return 'nigredo';
}

/** Retorna quantas das 4 fases estão desbloqueadas (medidor ●●○○). */
export function getUnlockedPhaseCount(quintessenceEarned: number): number {
  if (quintessenceEarned >= PHASE_MILESTONES.rubedo) return 4;
  if (quintessenceEarned >= PHASE_MILESTONES.citrinitas) return 3;
  if (quintessenceEarned >= PHASE_MILESTONES.albedo) return 2;
  return 1;
}

/** Progresso da fase atual rumo à próxima (seção 8.4). */
export function getPhaseProgress(quintessenceEarned: number) {
  const phase = getPhaseForQuintessence(quintessenceEarned);
  const order: Phase[] = ['nigredo', 'albedo', 'citrinitas', 'rubedo'];
  const idx = order.indexOf(phase);
  const nextPhase = order[idx + 1] ?? null;

  if (!nextPhase) {
    return { phase, nextPhase: null as Phase | null, progress: 1 };
  }

  const start =
    phase === 'nigredo'
      ? 0
      : phase === 'albedo'
        ? PHASE_MILESTONES.albedo
        : phase === 'citrinitas'
          ? PHASE_MILESTONES.citrinitas
          : PHASE_MILESTONES.rubedo;

  const end =
    nextPhase === 'albedo'
      ? PHASE_MILESTONES.albedo
      : nextPhase === 'citrinitas'
        ? PHASE_MILESTONES.citrinitas
        : PHASE_MILESTONES.rubedo;

  const progress = Math.min(1, Math.max(0, (quintessenceEarned - start) / (end - start)));
  return { phase, nextPhase, progress };
}

// ─── Tipografia (escala da seção 3 — famílias carregadas depois via expo-font) ─

export const FontFamilies = {
  display: 'Cinzel_700Bold',
  grimoire: 'CormorantGaramond_600SemiBold',
  grimoireItalic: 'CormorantGaramond_600SemiBold_Italic',
  ui: 'SpaceGrotesk_600SemiBold',
  uiRegular: 'SpaceGrotesk_400Regular',
} as const;

export const TypeScale = {
  essenceHero: {
    fontSize: 44,
    fontWeight: '600' as const,
    letterSpacing: -0.5,
  },
  tabTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
  generatorName: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  flavor: {
    fontSize: 14,
    fontStyle: 'italic' as const,
  },
  cost: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  labelSmall: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
} as const;

export const tabularNums: TextStyle = { fontVariant: ['tabular-nums'] };

// ─── Motion (seção 5 — timings de referência) ────────────────────────────────

export const Motion = {
  clickSquashDownMs: 90,
  clickSpring: { damping: 8, stiffness: 180 },
  floatUpMs: 900,
  rippleMs: 600,
  haloBreatheMs: 2400,
  potionBobMs: 3200,
  affordablePulseMs: 1600,
  counterRollMs: 300,
  phaseTransitionMs: 1200,
  eventDespawnMs: 13_000,
} as const;

// ─── Layout ─────────────────────────────────────────────────────────────────

/** KIT_VISUAL_CURSOR.md §2 */
export const RADIUS = { card: 14, pill: 10, sigil: 999 } as const;

export const SPACE = { xs: 4, sm: 8, md: 10, lg: 14, xl: 18 } as const;

export const Radius = {
  card: RADIUS.card,
  cauldron: 80,
  pill: RADIUS.sigil,
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const TouchTarget = {
  min: 44,
  cauldron: 64,
} as const;

// ─── Compatibilidade com themed-text / themed-view (app escuro por padrão) ─

export const Colors = {
  light: {
    text: BASE.textPrimary,
    background: BASE.bgDeep,
    backgroundElement: BASE.bgSurface,
    backgroundSelected: BASE.bgElevated,
    textSecondary: BASE.textMuted,
  },
  dark: {
    text: BASE.textPrimary,
    background: BASE.bgDeep,
    backgroundElement: BASE.bgSurface,
    backgroundSelected: BASE.bgElevated,
    textSecondary: BASE.textMuted,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

/** Paleta ativa = BASE + acento/glow/essência da fase Magnum Opus. */
export function getPhaseTheme(phase: Phase = DEFAULT_PHASE) {
  return {
    phase,
    ...BASE,
    ...PHASE_PALETTES[phase],
  };
}

export type PhaseTheme = ReturnType<typeof getPhaseTheme>;
