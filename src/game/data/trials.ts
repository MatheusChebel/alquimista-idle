export interface TrialDef {
  id: string;
  displayName: string;
  rule: string;
  quintReward: number;
}

export const TRIALS: TrialDef[] = [
  {
    id: 'notouch',
    displayName: 'Ascese',
    rule: 'Alcance 1e9 de Essência sem comprar nenhum upgrade de Toque',
    quintReward: 15,
  },
  {
    id: 'minimal',
    displayName: 'Voto de Pobreza',
    rule: 'Alcance 1e9 usando no máximo 3 tipos de Instrumento',
    quintReward: 20,
  },
  {
    id: 'speed',
    displayName: 'Pressa do Alquimista',
    rule: 'Alcance 1e8 em menos de 10 minutos de uma run',
    quintReward: 15,
  },
];
