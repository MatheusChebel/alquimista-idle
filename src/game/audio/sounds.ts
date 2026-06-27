export const SFX = {
  destilar: { src: require('@/assets/sfx/destilar.m4a'), volume: 0.7, pitchVar: 0.06, pool: 4 },
  comprarInstrumento: {
    src: require('@/assets/sfx/comprar-instrumento.m4a'),
    volume: 0.8,
    pitchVar: 0.04,
    pool: 3,
  },
  comprarUpgrade: { src: require('@/assets/sfx/comprar-upgrade.m4a'), volume: 0.8, pitchVar: 0.0, pool: 2 },
  conquista: { src: require('@/assets/sfx/conquista.m4a'), volume: 0.85, pitchVar: 0.0, pool: 1 },
  conjuncao: { src: require('@/assets/sfx/conjuncao.m4a'), volume: 0.8, pitchVar: 0.0, pool: 2 },
  sorte: { src: require('@/assets/sfx/sorte.m4a'), volume: 0.85, pitchVar: 0.0, pool: 1 },
} as const;

export type SfxId = keyof typeof SFX;
