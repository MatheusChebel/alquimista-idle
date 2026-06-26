export interface GeneratorDef {
  id: string;
  displayName: string;
  description: string;
  baseCost: number;
  baseEps: number;
}

export const GENERATORS: GeneratorDef[] = [
  { id: 'alembic', displayName: 'Alambique', description: 'Destilador básico de essência.', baseCost: 15, baseEps: 0.1 },
  { id: 'cauldron', displayName: 'Caldeirão', description: 'Fervura lenta de reagentes.', baseCost: 100, baseEps: 1 },
  { id: 'athanor', displayName: 'Athanor', description: 'O forno eterno do alquimista.', baseCost: 1_100, baseEps: 8 },
  { id: 'homunculus', displayName: 'Homúnculo', description: 'Servo artificial que trabalha sozinho.', baseCost: 12_000, baseEps: 47 },
  { id: 'herbgarden', displayName: 'Jardim de Erbas', description: 'Cultivo de ingredientes raros.', baseCost: 130_000, baseEps: 260 },
  { id: 'crucible', displayName: 'Cadinho de Cristal', description: 'Amplifica todas as reações.', baseCost: 1_400_000, baseEps: 1_400 },
  { id: 'familiar', displayName: 'Familiar (Corvo)', description: 'Criatura mágica que coleta essência.', baseCost: 20_000_000, baseEps: 7_800 },
  { id: 'portal', displayName: 'Portal Etéreo', description: 'Extrai essência de outro plano.', baseCost: 330_000_000, baseEps: 44_000 },
  { id: 'tree', displayName: 'Árvore Filosofal', description: 'A fonte viva da Pedra.', baseCost: 5_100_000_000, baseEps: 260_000 },
];
