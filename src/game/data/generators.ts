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
  { id: 'hiddenlab', displayName: 'Laboratório Oculto', description: 'Uma ala secreta que destila sozinha.', baseCost: 75_000_000_000, baseEps: 1_600_000 },
  { id: 'astralclock', displayName: 'Relógio Astral', description: 'Dobra o tempo a favor da obra.', baseCost: 1_000_000_000_000, baseEps: 10_000_000 },
  { id: 'voidcondenser', displayName: 'Condensador de Vazio', description: 'Extrai essência do nada.', baseCost: 14_000_000_000_000, baseEps: 65_000_000 },
  { id: 'philprism', displayName: 'Prisma Filosofal', description: 'Refrata a luz em essência pura.', baseCost: 170_000_000_000_000, baseEps: 430_000_000 },
  { id: 'cosmoseye', displayName: 'Olho do Cosmos', description: 'Vê e colhe os fios do destino.', baseCost: 2_100_000_000_000_000, baseEps: 2_900_000_000 },
];
