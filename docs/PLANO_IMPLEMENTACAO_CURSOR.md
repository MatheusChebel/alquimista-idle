# Plano de Implementação — Grimório do Alquimista

> Documento operacional para o agente (Cursor) construir o idle/clicker passo a passo.
> Baseado no design de economia em `design-alquimista-idle.md`.
> **Stack real do projeto já detectada e refletida aqui.**

---

## 0. Instruções para o agente (LEIA PRIMEIRO)

1. **Siga este documento fase por fase, na ordem.** Não pule fases. Cada fase tem um **Checkpoint** com critérios de aceite — só avance quando todos passarem.
2. **Pare em cada Checkpoint** e rode a verificação indicada. Se algo falhar, conserte antes de seguir.
3. **Obedeça o `AGENTS.md` do projeto:** antes de escrever qualquer código de Expo, consulte a doc versionada em `https://docs.expo.dev/versions/v56.0.0/`. Este projeto é **Expo SDK 56 / React Native 0.85 / React 19.2 / TypeScript 6**.
4. **Não introduza dependências novas** sem necessidade. Tudo que o jogo precisa nesta fase já está instalado (ver seção 1). Para adicionar algo opcional, use `npx expo install <pacote>` (nunca `npm install` direto em projeto Expo).
5. **Reuse os componentes existentes** (`themed-text`, `themed-view`, `Cauldron`, etc.) em vez de recriar. Estilização é via `StyleSheet` + componentes temáticos — **este projeto NÃO usa NativeWind/Tailwind no nativo.**
6. Faça **commits pequenos** ao fim de cada fase com mensagem clara (ex.: `feat(game): fase 1 - loop e persistencia`).
7. Quando este doc trouxer blocos de código marcados como **"cole isto"**, use-os como fonte da verdade dos números — não reinvente valores de balanceamento.

---

## 1. Stack real (detectada no projeto)

| Item | Valor |
|---|---|
| Framework | Expo SDK **56** (RN 0.85, React 19.2, TS 6) |
| Roteamento | **expo-router** (file-based em `src/app/`) — já desacoplado do react-navigation no SDK 56; importe hooks de navegação de `expo-router` |
| Estado | **zustand** (já instalado — `src/game/store/gameStore.ts` existe) |
| Persistência | **@react-native-async-storage/async-storage** (já instalado) |
| Animação | **react-native-reanimated** (já instalado) |
| Vetores/ícones | **react-native-svg** (já instalado) |
| Gestos | **react-native-gesture-handler** (já instalado) |
| Estilo | `StyleSheet` + `themed-text.tsx` / `themed-view.tsx` + `src/constants/theme.ts` |
| Opcional recomendado | `expo-haptics` (vibração no clique) — instalar com `npx expo install expo-haptics` se for usar |

### Estrutura atual relevante (já existe no repo)

```
app-teste/
├─ AGENTS.md  CLAUDE.md            # regras do agente (NÃO sobrescrever)
├─ package.json  tsconfig.json
└─ src/
   ├─ app/                         # rotas (expo-router)
   │  ├─ _layout.tsx
   │  ├─ index.tsx                 # tela inicial (será a tela da POÇÃO)
   │  └─ explore.tsx               # segunda aba (será o GRIMÓRIO)
   ├─ components/                  # UI compartilhada (themed-text, app-tabs, etc.)
   ├─ constants/theme.ts
   ├─ hooks/
   └─ game/                        # LÓGICA DO JOGO (recém-começada)
      ├─ components/
      │  ├─ Cauldron.tsx           # a poção/caldeirão clicável (existe)
      │  └─ GoldDisplay.tsx        # mostra a moeda (existe) -> RENOMEAR
      └─ store/
         └─ gameStore.ts           # zustand (existe, ~stub) -> EXPANDIR
```

---

## 2. Convenções

- **Moeda:** o conceito "Gold/ouro" passa a se chamar **Essence (Essência)** em todo o código e UI. Renomeie `GoldDisplay.tsx` → `EssenceDisplay.tsx` e qualquer campo `gold` no store → `essence`.
- **Idioma:** identificadores de código em inglês (`essence`, `generators`, `cost`); textos de UI e `displayName` dos itens em **PT-BR** (ex.: `"Alambique"`).
- **Números grandes:** sempre formatar via `formatNumber()` (seção 4). Internamente os valores são `number` comuns; o jogo não passa de ~1e15 nesta versão, então `number` basta (não precisa de BigInt agora).
- **Sem `localStorage`:** persistência é só via AsyncStorage (assíncrono).

---

## 3. Arquitetura alvo (o que vamos construir)

```
src/game/
├─ data/
│  ├─ generators.ts     # os 9 Aparelhos (dados puros)
│  ├─ upgrades.ts       # Transmutações (multiplicadores)
│  └─ events.ts         # Conjunções Astrais (eventos)
├─ lib/
│  ├─ formulas.ts       # custo, custo acumulado, EPS total, formatNumber
│  └─ persistence.ts    # save/load via AsyncStorage
├─ hooks/
│  └─ useGameLoop.ts    # tick do jogo (100ms)
├─ store/
│  └─ gameStore.ts      # zustand (estado + ações)   [EXPANDIR o existente]
└─ components/
   ├─ Cauldron.tsx          [EXISTE]  poção clicável + animação
   ├─ EssenceDisplay.tsx    [RENOMEAR de GoldDisplay]
   ├─ GeneratorRow.tsx      uma linha comprável de Aparelho
   ├─ GeneratorList.tsx     lista de Aparelhos
   ├─ UpgradeList.tsx       lista de Transmutações
   └─ AstralConjunction.tsx evento flutuante clicável
```

---

## 4. Dados da economia (FONTE DA VERDADE — cole estes arquivos)

> Valores adaptados do Cookie Clicker (curva comprovada). Crescimento de custo por unidade = **1.15**.

### `src/game/data/generators.ts`
```ts
export interface GeneratorDef {
  id: string;
  displayName: string;   // PT-BR, exibido na UI
  description: string;
  baseCost: number;      // custo da 1ª unidade
  baseEps: number;       // essência/seg por unidade
}

// Cada unidade custa baseCost * 1.15 ^ (quantidade já possuída)
export const GENERATORS: GeneratorDef[] = [
  { id: "alembic",   displayName: "Alambique",          description: "Destilador básico de essência.",        baseCost: 15,            baseEps: 0.1 },
  { id: "cauldron",  displayName: "Caldeirão",          description: "Fervura lenta de reagentes.",           baseCost: 100,           baseEps: 1 },
  { id: "athanor",   displayName: "Athanor",            description: "O forno eterno do alquimista.",         baseCost: 1_100,         baseEps: 8 },
  { id: "homunculus",displayName: "Homúnculo",          description: "Servo artificial que trabalha sozinho.",baseCost: 12_000,        baseEps: 47 },
  { id: "herbgarden",displayName: "Jardim de Ervas",    description: "Cultivo de ingredientes raros.",        baseCost: 130_000,       baseEps: 260 },
  { id: "crucible",  displayName: "Cadinho de Cristal", description: "Amplifica todas as reações.",           baseCost: 1_400_000,     baseEps: 1_400 },
  { id: "familiar",  displayName: "Familiar (Corvo)",   description: "Criatura mágica que coleta essência.",  baseCost: 20_000_000,    baseEps: 7_800 },
  { id: "portal",    displayName: "Portal Etéreo",      description: "Extrai essência de outro plano.",       baseCost: 330_000_000,   baseEps: 44_000 },
  { id: "tree",      displayName: "Árvore Filosofal",   description: "A fonte viva da Pedra.",                 baseCost: 5_100_000_000, baseEps: 260_000 },
];
```

### `src/game/data/upgrades.ts`
```ts
export interface UpgradeDef {
  id: string;
  displayName: string;
  generatorId: string;   // qual Aparelho ele turbina
  unlockAt: number;      // nº de unidades possuídas para aparecer
  costMult: number;      // custo = baseCost do gerador * costMult
  effect: 2;             // multiplica produção daquele gerador por 2
}

// 5 transmutações por gerador, liberadas em 1/5/25/50/100 unidades.
// Regra: cada uma custa ~o que você já investiu naquele gerador.
const TIERS = [
  { suffix: "I",   unlockAt: 1,   costMult: 10 },
  { suffix: "II",  unlockAt: 5,   costMult: 50 },
  { suffix: "III", unlockAt: 25,  costMult: 500 },
  { suffix: "IV",  unlockAt: 50,  costMult: 50_000 },
  { suffix: "V",   unlockAt: 100, costMult: 5_000_000 },
];

import { GENERATORS } from "./generators";

export const UPGRADES: UpgradeDef[] = GENERATORS.flatMap((g) =>
  TIERS.map((t) => ({
    id: `${g.id}_${t.suffix}`,
    displayName: `${g.displayName} ${t.suffix}`,
    generatorId: g.id,
    unlockAt: t.unlockAt,
    costMult: t.costMult,
    effect: 2 as const,
  }))
);

// Linha de clique (Destilar) — comprada no Grimório
export interface ClickUpgradeDef {
  id: string;
  displayName: string;
  cost: number;
  // tipo "flat": multiplica o valor base do clique
  // tipo "epsPercent": clique passa a valer X% do EPS atual
  kind: "flatMult" | "epsPercent";
  value: number;
}
export const CLICK_UPGRADES: ClickUpgradeDef[] = [
  { id: "click1", displayName: "Dedos de Mercúrio", cost: 100,     kind: "flatMult",   value: 2 },
  { id: "click2", displayName: "Luvas Alquímicas",  cost: 500,     kind: "flatMult",   value: 2 },
  { id: "click3", displayName: "Toque Reverso",     cost: 10_000,  kind: "flatMult",   value: 2 },
  { id: "click4", displayName: "Ressonância Etérea",cost: 100_000, kind: "epsPercent", value: 0.01 },
  { id: "click5", displayName: "Ressonância Maior", cost: 2_000_000,kind: "epsPercent",value: 0.03 },
  { id: "click6", displayName: "Ressonância Suprema",cost:50_000_000,kind:"epsPercent",value: 0.10 },
];
```

### `src/game/lib/formulas.ts`
```ts
import { GENERATORS } from "../data/generators";

export const COST_GROWTH = 1.15;

/** Custo da PRÓXIMA unidade de um gerador, dado quantas já possui. */
export function nextCost(baseCost: number, owned: number): number {
  return Math.ceil(baseCost * Math.pow(COST_GROWTH, owned));
}

/** Custo acumulado de comprar `amount` unidades a partir de `owned`. */
export function bulkCost(baseCost: number, owned: number, amount: number): number {
  // soma de série geométrica
  const start = baseCost * Math.pow(COST_GROWTH, owned);
  return Math.ceil((start * (Math.pow(COST_GROWTH, amount) - 1)) / (COST_GROWTH - 1));
}

/** EPS total já com multiplicadores de transmutação e globais. */
export function computeEps(
  owned: Record<string, number>,
  genMultipliers: Record<string, number>, // produto das transmutações ×2 por gerador
  globalMult: number
): number {
  let base = 0;
  for (const g of GENERATORS) {
    const qty = owned[g.id] ?? 0;
    const mult = genMultipliers[g.id] ?? 1;
    base += qty * g.baseEps * mult;
  }
  return base * globalMult;
}

/** Formata números grandes: 12.3 mil, 4.5 mi, 1.2 bi, 8.9 tri… */
const SUFFIXES = ["", " mil", " mi", " bi", " tri", " qa", " qi"];
export function formatNumber(n: number): string {
  if (n < 1000) return Math.floor(n).toString();
  const tier = Math.floor(Math.log10(n) / 3);
  const scaled = n / Math.pow(1000, tier);
  const suffix = SUFFIXES[tier] ?? `e${tier * 3}`;
  return `${scaled.toFixed(scaled < 10 ? 2 : scaled < 100 ? 1 : 0)}${suffix}`;
}
```

### `src/game/data/events.ts`
```ts
export interface AstralEventDef {
  id: string;
  displayName: string;
  weight: number;          // peso na sorteio
  durationMs: number;      // 0 = efeito instantâneo
  apply: "frenzy" | "lucky" | "clickFrenzy" | "eclipse";
  magnitude: number;
}
export const ASTRAL_EVENTS: AstralEventDef[] = [
  { id: "frenzy",      displayName: "Frenesi",       weight: 40, durationMs: 77_000, apply: "frenzy",      magnitude: 7 },
  { id: "lucky",       displayName: "Sorte",         weight: 40, durationMs: 0,      apply: "lucky",       magnitude: 0.15 },
  { id: "clickFrenzy", displayName: "Toque Dourado", weight: 15, durationMs: 13_000, apply: "clickFrenzy", magnitude: 777 },
  { id: "eclipse",     displayName: "Eclipse",       weight: 5,  durationMs: 6_000,  apply: "eclipse",     magnitude: 0.5 },
];
// Intervalo aleatório entre eventos: 60s a 300s.
export const EVENT_MIN_MS = 60_000;
export const EVENT_MAX_MS = 300_000;
```

---

## 5. Fases de implementação

Cada fase: **Objetivo → Arquivos → Tarefas → Checkpoint (aceite + verificação)**.

---

### FASE 0 — Preparação e rename

**Objetivo:** alinhar o esqueleto sem mudar comportamento ainda.

**Tarefas**
1. Criar as pastas `src/game/data/`, `src/game/lib/`, `src/game/hooks/`.
2. Colar os arquivos da seção 4 (`generators.ts`, `upgrades.ts`, `events.ts`, `formulas.ts`).
3. Renomear `src/game/components/GoldDisplay.tsx` → `EssenceDisplay.tsx`; trocar texto/labels de "ouro"/"gold" por "Essência"/"essence". Atualizar todos os imports.
4. Abrir `src/game/store/gameStore.ts` e renomear qualquer estado `gold` → `essence`. **Não** reescrever a lógica ainda.

**Checkpoint 0**
- [ ] `npx tsc --noEmit` passa sem erros.
- [ ] App abre (`npx expo start`) e nenhuma referência a "Gold/ouro" sobrou (busca global por `gold` e `ouro`).

---

### FASE 1 — MVP jogável (clique + 3 geradores + loop + save)

**Objetivo:** dá pra clicar, comprar 3 Aparelhos, ver EPS rodando, e o progresso salva.

**Arquivos**
- `src/game/store/gameStore.ts` (expandir)
- `src/game/lib/persistence.ts` (criar)
- `src/game/hooks/useGameLoop.ts` (criar)
- `src/game/components/GeneratorRow.tsx`, `GeneratorList.tsx` (criar)
- `src/app/index.tsx` (montar a tela)

**Especificação do store (zustand)**
```ts
interface GameState {
  essence: number;
  owned: Record<string, number>;     // generatorId -> quantidade
  lastTick: number;                  // timestamp p/ cálculo offline
  // ações
  tick: (deltaMs: number) => void;   // soma EPS * delta
  click: () => void;                 // soma valor do clique
  buyGenerator: (id: string) => void;
  hydrate: (saved: Partial<GameState>) => void;
}
```
- `click()`: por enquanto soma `1` de essência (valor base).
- `buyGenerator(id)`: usa `nextCost(baseCost, owned[id])`; se `essence >= custo`, debita e incrementa `owned[id]`.
- `tick(deltaMs)`: `essence += computeEps(owned, {}, 1) * (deltaMs/1000)`. (multiplicadores entram na Fase 2.)

**Loop (`useGameLoop.ts`)**
- `setInterval` de 100ms chamando `tick(100)`. Limpar no unmount.
- Montar o hook uma única vez no `src/app/_layout.tsx`.

**Persistência (`persistence.ts`)**
- `saveGame(state)`: `AsyncStorage.setItem("save", JSON.stringify({essence, owned, lastTick: Date.now()}))`. Chamar a cada ~5s e no `AppState` "background".
- `loadGame()`: lê, faz `JSON.parse`, retorna ou `null`.
- No boot, calcular **ganho offline**: `delta = Date.now() - lastTick` (cap em, ex., 8h) e aplicar `tick(delta)` uma vez.

**UI (`index.tsx`)**
- Topo: `<EssenceDisplay essence={...} eps={...} />` (Essência total + EPS atual).
- Centro: `<Cauldron onPress={click} />` (reaproveitar componente existente; adicionar animação de "pulso" com reanimated no toque).
- Mostrar só os **3 primeiros** geradores via `<GeneratorList limit={3} />` nesta fase.

**Checkpoint 1**
- [ ] Clicar aumenta a Essência.
- [ ] Comprar Alambique faz a Essência subir sozinha ao longo do tempo (EPS > 0).
- [ ] Custo do próximo Alambique sobe 15% a cada compra.
- [ ] Fechar e reabrir o app mantém o progresso (e dá ganho offline plausível).
- [ ] `npx tsc --noEmit` limpo.

---

### FASE 2 — Economia completa (9 geradores + transmutações + clique escalável)

**Objetivo:** profundidade de compra; o clique deixa de ser inútil no late game.

**Arquivos**
- `gameStore.ts` (adicionar upgrades e multiplicadores)
- `src/game/components/UpgradeList.tsx` (criar)
- `src/app/explore.tsx` → vira a tela **Grimório** (transmutações + upgrades de clique)

**Adições ao store**
```ts
boughtUpgrades: Record<string, true>;     // upgrades de gerador comprados
boughtClickUpgrades: Record<string, true>;
// derivados:
genMultipliers: Record<string, number>;   // 2^(nº de transmutações compradas daquele gerador)
clickValue: number;                        // base * Πflat + (epsPercent * epsAtual)
```
- `buyUpgrade(id)`: valida desbloqueio (`owned[generatorId] >= unlockAt`) e custo (`baseCost*costMult`); ao comprar, recomputa `genMultipliers[generatorId] *= 2`.
- `click()` agora: `essence += clickValue` onde `clickValue = baseClick * produto(flatMult) + somaEpsPercent * epsAtual`.
- `tick()` agora passa `genMultipliers` e `globalMult` (ainda 1) para `computeEps`.

**UI**
- `GeneratorList` mostra os 9, cada `GeneratorRow` exibindo nome, qtd, EPS contribuído e custo da próxima.
- `Grimório` (explore.tsx): lista transmutações **desbloqueadas e ainda não compradas** + os 6 upgrades de clique. Destaque visual (borda dourada) em itens compráveis agora — isso ensina o jogador a priorizá-los.

**Checkpoint 2**
- [ ] Os 9 geradores aparecem e compram corretamente.
- [ ] Comprar uma transmutação dobra o EPS daquele gerador.
- [ ] Após comprar "Ressonância Etérea", o valor do clique cresce junto com o EPS.
- [ ] Transmutações só aparecem após atingir o `unlockAt`.
- [ ] `npx tsc --noEmit` limpo.

---

### FASE 3 — Engajamento (eventos + conquistas + auto-clique)

**Objetivo:** momentos de atenção ativa e um multiplicador global que recompensa o progresso.

**Arquivos**
- `src/game/components/AstralConjunction.tsx` (criar)
- `gameStore.ts` (eventos ativos, conquistas, multiplicador global)

**Conjunção Astral (evento)**
- Um timer agenda o próximo evento em `random(EVENT_MIN_MS, EVENT_MAX_MS)`.
- Surge um ícone SVG flutuante e animado (reanimated) em posição aleatória da tela; some sozinho após ~13s se não for clicado.
- Ao clicar, sorteia por `weight` em `ASTRAL_EVENTS` e aplica o efeito:
  - `frenzy`: `globalMult *= 7` por `durationMs`.
  - `lucky`: ganho instantâneo = `0.15 * essence` (com teto = 15% * EPS * 900s p/ não explodir).
  - `clickFrenzy`: `clickValue *= 777` por `durationMs`.
  - `eclipse`: `globalMult *= 0.5` por `durationMs` (negativo, raro).
- **Combo:** efeitos com duração são multiplicativos entre si; `lucky` durante `frenzy` rende mais (porque usa o EPS já multiplicado). Não trate como caso especial — sai de graça se os multiplicadores forem aplicados na ordem certa.

**Conquistas → Selo do Alquimista (multiplicador global)**
- Defina ~15 conquistas simples (ex.: "possua 50 Caldeirões", "destile 1 milhão no total", "1ª Conjunção clicada").
- Cada conquista desbloqueada: `sealMult *= 1.02` (ou +2%). `globalMult = sealMult * (eventos ativos)`.

**Auto-clique (Mão Fantasma)**
- Um upgrade especial que dá N cliques automáticos por segundo: no `tick`, somar `clickValue * autoClicksPerSec * (deltaMs/1000)`.

**Checkpoint 3**
- [ ] Eventos aparecem em intervalos aleatórios e somem se ignorados.
- [ ] Frenesi multiplica o EPS visível por 7 durante a duração e depois volta.
- [ ] Desbloquear conquistas aumenta a produção global.
- [ ] (Opcional) Haptics no clique se `expo-haptics` foi adicionado.
- [ ] `npx tsc --noEmit` limpo.

---

### FASE 4 — Magnum Opus (prestígio + Quintessência + fases da Grande Obra)

**Objetivo:** loop de longo prazo; resetar pra ficar permanentemente mais forte.

**Arquivos**
- `gameStore.ts` (prestígio)
- `src/game/components/MagnumOpus.tsx` (tela/modal de prestígio)
- `src/constants/theme.ts` (paletas das 4 fases)

**Prestígio**
```ts
quintessence: number;          // moeda permanente
totalEssenceEarned: number;    // acumulado histórico (nunca zera)
prestigePoints: number;        // pontos gastáveis
```
- Ganho ao prestigiar: `floor((totalEssenceEarned / 1e12) ** (1/3))` (menos o que já tem).
- Reset: zera `essence`, `owned`, `boughtUpgrades`, eventos. **Mantém**: `quintessence`, conquistas, e nós permanentes comprados.
- Bônus: `globalMult` recebe `* (1 + 0.01 * prestigePoints)`.

**Árvore da Quintessência** (gastar a moeda permanente)
- Nós sugeridos: *Legado* (mantém % entre resets), *Começo Abençoado* (essência inicial), *Olho que Tudo Vê* (eventos +frequentes), *Mãos Douradas* (clique ×2 permanente).

**Fases da Grande Obra (estética + marcos)**
- A cada marco de `quintessence` total (50 / 500 / 5.000), avança a fase: **Nigredo → Albedo → Citrinitas → Rubedo**.
- Cada fase troca a paleta da UI (preto → branco → dourado → vermelho) via `theme.ts`. Implementar como um seletor de tema dependente da fase atual.

**Checkpoint 4**
- [ ] Botão de Magnum Opus aparece só quando o ganho de Quintessência ≥ 1.
- [ ] Prestigiar reseta a run e aplica o bônus global permanente.
- [ ] Atingir um marco troca a paleta da UI.
- [ ] Save persiste Quintessência e conquistas através do reset.
- [ ] `npx tsc --noEmit` limpo.

---

## 6. Comandos úteis (Expo SDK 56)

```bash
npx expo start            # rodar em dev (web/iOS/Android)
npx tsc --noEmit          # checagem de tipos (rode em cada checkpoint)
npx expo install <pkg>    # adicionar dependência compatível com o SDK
npx expo-doctor@latest    # diagnosticar problemas de versão
```

> Lembrete do AGENTS.md: para qualquer API de Expo, confira `https://docs.expo.dev/versions/v56.0.0/` antes de codar. Em SDK 56, hooks de navegação vêm de `expo-router`, não de `@react-navigation/*`.

---

## 7. Ordem de prioridade se o tempo for curto

1. Fase 1 inteira (é o coração jogável).
2. Fase 2 até "comprar transmutação dobra EPS".
3. Eventos (Fase 3) — é o que dá graça.
4. Prestígio (Fase 4) — é o que dá longevidade.

Tudo que estiver marcado como *opcional* (haptics, sinergias, árvore de Quintessência completa) pode ficar pro final.
