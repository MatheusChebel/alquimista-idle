# Atualização v4 — Manual DEFINITIVO para o Cursor

> Este documento é para ser seguido **à risca**. Onde houver tabela ou código, use
> exatamente os valores/nomes dados. Instruções dizem **ANEXAR/ADICIONAR** — não
> reescreva o que já existe. Stack: Expo SDK 56, Reanimated v4, react-native-svg,
> @tabler/icons-react-native, Zustand. Trabalhe por Partes (A→H), parando nos Checkpoints.

---

## A. Renomear "Aparelhos" → "Instrumentos" (apenas texto de UI)

- Troque **somente as strings visíveis** de `Aparelhos` para **`Instrumentos`** e `Aparelho` → `Instrumento` (singular).
- **NÃO** renomeie identificadores de código (`generators`, `GeneratorRow`, `owned`, ids como `cauldron`). Só o texto exibido. Isso evita quebrar imports.
- Locais prováveis: a eyebrow `APARELHOS — ESSÊNCIA POR SEGUNDO` → `INSTRUMENTOS — ESSÊNCIA POR SEGUNDO`; títulos/labels nas telas Poção, Laboratório e Grimório.

**Checkpoint A:** busca global por "Aparelho" não retorna mais nada em texto de UI; o app compila.

---

## B. Mais conteúdo (o jogo está curto)

### B.1 Novos Instrumentos — ANEXAR a `src/game/data/generators.ts`
Continuam a curva existente (mesma fórmula `baseCost × 1.15 ^ qtd`). Cole no fim do array `GENERATORS`:
```ts
  { id: "hiddenlab",    displayName: "Laboratório Oculto",   description: "Uma ala secreta que destila sozinha.",        baseCost: 75_000_000_000,        baseEps: 1_600_000 },
  { id: "astralclock",  displayName: "Relógio Astral",       description: "Dobra o tempo a favor da obra.",              baseCost: 1_000_000_000_000,     baseEps: 10_000_000 },
  { id: "voidcondenser",displayName: "Condensador de Vazio",  description: "Extrai essência do nada.",                    baseCost: 14_000_000_000_000,    baseEps: 65_000_000 },
  { id: "philprism",    displayName: "Prisma Filosofal",      description: "Refrata a luz em essência pura.",             baseCost: 170_000_000_000_000,   baseEps: 430_000_000 },
  { id: "cosmoseye",    displayName: "Olho do Cosmos",        description: "Vê e colhe os fios do destino.",              baseCost: 2_100_000_000_000_000, baseEps: 2_900_000_000 },
```
> Agora são **14 Instrumentos**. As Transmutações (×2) deles são geradas automaticamente pelo `upgrades.ts` existente (1/5/25/50/100), então **nada a fazer lá** além de garantir os ícones (Parte C).

### B.2 Mais upgrades de Toque — ADICIONAR a `CLICK_UPGRADES` em `src/game/data/upgrades.ts`
Primeiro, **estenda os tipos** de upgrade de clique para suportar a nova escala (estilo "Thousand Fingers" do Cookie Clicker):
```ts
// kind passa a aceitar: "flatMult" | "epsPercent" | "perInstrument" | "perInstrumentMult"
// perInstrument:      clique += value * (total de Instrumentos possuídos)
// perInstrumentMult:  multiplica o efeito acumulado de perInstrument por value
```
Cole no fim de `CLICK_UPGRADES`:
```ts
  { id: "click7",  displayName: "Dedos Etéreos",        cost: 1_000_000_000,     kind: "epsPercent",        value: 0.20 },
  { id: "click8",  displayName: "Toque dos Mil Frascos", cost: 5_000_000_000,     kind: "perInstrument",     value: 0.1 },
  { id: "click9",  displayName: "Toque dos Milhões",     cost: 50_000_000_000,    kind: "perInstrumentMult", value: 5 },
  { id: "click10", displayName: "Catalisador de Toque",  cost: 200_000_000_000,   kind: "flatMult",          value: 2 },
  { id: "click11", displayName: "Ressonância Absoluta",  cost: 1_000_000_000_000, kind: "epsPercent",        value: 0.30 },
  { id: "click12", displayName: "Toque Filosofal",       cost: 5_000_000_000_000, kind: "perInstrumentMult", value: 10 },
```
**Fórmula final do valor do clique** (atualize a função que calcula `clickValue`):
```
clickValue =
    baseClick * Π(flatMult comprados)
  + (perInstrumentBase) * totalInstrumentos * Π(perInstrumentMult comprados)
  + (soma de epsPercent comprados) * EPS_atual
// perInstrumentBase = soma dos value dos upgrades "perInstrument" comprados (0 se nenhum)
// totalInstrumentos = Σ owned[i] de TODOS os instrumentos
```

### B.3 NOVO sistema — Rituais Alquímicos (habilidades ativas: "o que fazer")
Dá ação ativa entre compras (inspirado nas skills do Tap Titans). São botões com **cooldown**, sem recurso extra. Crie `src/game/data/rituals.ts`:
```ts
export interface RitualDef {
  id: string; displayName: string; description: string;
  unlockEssence: number;       // libera ao já ter ganho esta Essência total
  cooldownMs: number;
  durationMs: number;          // 0 = instantâneo
  effect: "instantEssence" | "epsMult" | "clickMult";
  magnitude: number;           // instantEssence: segundos de EPS; epsMult/clickMult: multiplicador
  icon: string;                // glifo Tabler (Parte C)
}
export const RITUALS: RitualDef[] = [
  { id:"transmutar", displayName:"Transmutar",   description:"Converte o ar em essência.", unlockEssence:1_000,      cooldownMs:30_000,  durationMs:0,      effect:"instantEssence", magnitude:30,  icon:"IconWand" },
  { id:"catalisar",  displayName:"Catalisar",    description:"Acelera todas as reações.",  unlockEssence:100_000,    cooldownMs:120_000, durationMs:30_000, effect:"epsMult",        magnitude:3,   icon:"IconBolt" },
  { id:"midas",      displayName:"Mão de Midas", description:"Cada toque vale ouro.",      unlockEssence:10_000_000, cooldownMs:180_000, durationMs:20_000, effect:"clickMult",      magnitude:10,  icon:"IconHandStop" },
];
```
- UI: uma fileira de 1–3 botões circulares (Sigil) perto da poção; cada um mostra o ícone e, em cooldown, um **arco de progresso** por cima (mesma técnica da Roda) + tempo restante. Desabilitado/esmaecido enquanto recarrega ou bloqueado.
- Efeitos somam-se aos multiplicadores globais (mesma cadeia do EPS). `instantEssence` = `EPS_atual * magnitude` na hora.
- Performance: o cooldown é 1 timer a 4 Hz por ritual ativo; o arco usa SVG (não anima layout).

### B.4 NOVO sistema — Conquistas (engajamento + fonte de Quintessência)
Crie `src/game/data/achievements.ts`. Cada conquista desbloqueada dá **+2% de produção global** (o "Selo do Alquimista") **e** uma recompensa única de **Quintessência** (Parte F). Comece com estas 12 (some mais depois):
```ts
export interface AchievementDef { id:string; displayName:string; check:string; quintReward:number; }
export const ACHIEVEMENTS: AchievementDef[] = [
  { id:"firstdrop",   displayName:"Primeira Gota",        check:"1 toque",                         quintReward:1 },
  { id:"click100",    displayName:"Mãos Inquietas",       check:"100 toques",                      quintReward:1 },
  { id:"ess1k",       displayName:"Aprendiz",             check:"1.000 de essência (total)",       quintReward:1 },
  { id:"ess1m",       displayName:"Boticário",            check:"1.000.000 de essência (total)",   quintReward:2 },
  { id:"cauldron10",  displayName:"Fervura",              check:"10 Caldeirões",                   quintReward:2 },
  { id:"cauldron50",  displayName:"Caldeiraria",          check:"50 Caldeirões",                   quintReward:3 },
  { id:"oneofeach",   displayName:"Colecionador",         check:"1 de cada Instrumento",           quintReward:5 },
  { id:"firstritual", displayName:"Primeiro Feitiço",     check:"lançar 1 Ritual",                 quintReward:2 },
  { id:"firstevent",  displayName:"Sob os Astros",        check:"coletar 1 Conjunção",             quintReward:2 },
  { id:"firstopus",   displayName:"A Grande Obra Começa", check:"1ª Magnum Opus",                  quintReward:5 },
  { id:"tier5any",    displayName:"Mestria",              check:"levar 1 Instrumento ao Nível 5",  quintReward:5 },
  { id:"allnigredo",  displayName:"Fim do Nigredo",       check:"alcançar a fase Albedo",          quintReward:10 },
];
// globalMult recebe: sealMult = 1.02 ^ (nº de conquistas desbloqueadas)
```
- UI: uma lista simples (pode ser uma aba ou seção do Grimório) mostrando desbloqueadas (acesas) e bloqueadas (fantasma + o critério). Notificação curta ao desbloquear (toast + som `achievement`).

**Checkpoint B:** 14 Instrumentos compráveis; 12 upgrades de Toque com a nova fórmula; Rituais lançáveis com cooldown; Conquistas desbloqueiam e aumentam a produção global.

---

## C. Ícones distintos por upgrade + linguagem visual (resolver o "tudo igual")

**Problema:** Transmutações (Alambique II, III…) usam o mesmo ícone/cor do Instrumento, então não dá pra distinguir **quantidade** de **melhoria passiva**.

**Regra de cor do anel (define o TIPO na hora):**
| Tipo de upgrade | Cor do anel (Sigil) | Glifo |
|---|---|---|
| **Instrumento** (comprar mais = quantidade) | **Essência** (ciano da fase) | o glifo do próprio Instrumento |
| **Transmutação** (×2 passivo do Instrumento) | **Dourado** `#F5C542` | glifo por **tier** (abaixo) |
| **Toque** (upgrades de clique) | **Arcano** `#B98CFF` (NOVO token) | glifo único por upgrade |
| **Ritual** | Arcano `#B98CFF` | glifo do ritual |

Adicione o token em `theme.ts`: `arcane: "#B98CFF"` dentro de `BASE`.

**Glifos de Transmutação por tier** (I→V ganham glifos diferentes, então as 5 transmutações de um Instrumento são distintas entre si E do Instrumento):
```ts
// src/game/data/upgradeIcons.ts
export const TRANSMUTATION_TIER_ICON: Record<string,string> = {
  I:   "IconChevronUp",
  II:  "IconChevronsUp",
  III: "IconArrowBigUpLines",
  IV:  "IconStar",
  V:   "IconCrown",
};
// Glifo único por upgrade de Toque:
export const CLICK_ICON: Record<string,string> = {
  click1:"IconHandFinger", click2:"IconHandStop", click3:"IconHandThreeFingers",
  click4:"IconWaveSine",   click5:"IconWaveSawTool", click6:"IconActivity",
  click7:"IconRipple",     click8:"IconGridDots",  click9:"IconStack2",
  click10:"IconBolt",      click11:"IconWaveSine", click12:"IconCrown",
};
```
> Confirme os nomes no diretório do Tabler (tabler.io/icons). Se algum não existir, troque por um vizinho **só aqui**. O importante é que sejam **todos diferentes**.

**Adapte o `ItemIcon`** para receber `kind` e escolher o anel + glifo:
```tsx
// kind: "instrument" | "transmutation" | "click" | "ritual"
// ringColor = instrument: PHASE[phase].essence | transmutation: BASE.gold | click/ritual: BASE.arcane
// glyph = instrument: ICONS[id] | transmutation: TRANSMUTATION_TIER_ICON[tier] | click: CLICK_ICON[id] | ritual: RITUALS.icon
```
Resultado: anel ciano = "mais quantidade", anel dourado = "melhoria passiva", anel arcano = "toque/ritual" — distinguível num olhar, e cada upgrade com glifo próprio.

**Checkpoint C:** no Grimório, Transmutações têm anel dourado e glifos por tier; upgrades de Toque têm anel arcano e glifos únicos; Instrumentos seguem com anel de Essência.

---

## D. Laboratório vivo (redesign do que já existe)

**Problema:** hoje os ícones só se repetem e depois nem aparecem. Trocar por **estações vivas**, no espírito das fileiras do Cookie Clicker / artefatos do Tap Titans.

**Cada Instrumento = uma Estação (carta)** que mostra o Instrumento E suas melhorias, com vida:
- **Arte maior** do Instrumento (glifo grande no Sigil, ~64px) que **muda de cor/realce por Nível** (tier visual 1→5).
- **Cabeçalho:** nome · `×N` · selo de NÍVEL.
- **Pips de Transmutação:** 5 pontinhos (I–V); acende o pip de cada Transmutação comprada (mostra o progresso de melhorias daquele Instrumento).
- **Contribuição:** `+X /seg`.
- **Sem repetir 100 ícones** — a quantidade é o `×N`. (Resolve o "depois nem aparece".)

**Animação de PRIMEIRA COMPRA (a estação "se revela"):** quando `owned` passa de 0→1, a carta entra com flip + escala + brilho (como destravar um artefato). Código:
```tsx
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withDelay, Easing } from "react-native-reanimated";

export function useRevealOnUnlock(justUnlocked: boolean) {
  const p = useSharedValue(justUnlocked ? 0 : 1);
  React.useEffect(() => {
    if (justUnlocked) {
      p.value = withSequence(
        withTiming(1, { duration: 420, easing: Easing.out(Easing.back(1.4)) })
      );
    }
  }, [justUnlocked]);
  return useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ scale: 0.8 + p.value * 0.2 }, { rotateY: `${(1 - p.value) * 90}deg` }],
  }));
}
// <Animated.View style={[styles.station, revealStyle]}> ... </Animated.View>
```
- **Level-up:** ao cruzar um tier, um flash rápido (opacity) na carta + troca de cor do glifo. Reutilize o pulso da seção de animações.
- **Idle:** 1 micro-animação por carta **visível** (bob/respiração), pausada fora da aba e em modo calmo (regras da Parte G).

**Checkpoint D:** comprar o 1º de um Instrumento revela a carta com animação; a carta mostra `×N`, NÍVEL e os pips de Transmutação; subir de tier muda a cor; sem repetição de ícones; animações pausam fora da aba.

---

## E. God Mode (somente desenvolvimento)

Para testar prestígio sem grindar. **Só ativo em `__DEV__`** (nunca em produção).

No `gameStore`:
```ts
godMode: false,
toggleGodMode: () => set((s) => ({ godMode: !s.godMode })),
devAddEssence: (n: number) => set((s) => ({ essence: s.essence + n, totalEssenceEarned: s.totalEssenceEarned + n })),
devAddQuintessence: (n: number) => set((s) => ({ quintessence: s.quintessence + n })),
// no loop (tick), no fim do cálculo:
//   if (get().godMode) set({ essence: 1e30 });   // essência praticamente infinita
```
Painel de dev (gated):
```tsx
// src/game/components/DevPanel.tsx — renderize SOMENTE se __DEV__
// Botões: [God Mode on/off] [+1e12] [+1e18] [+50 Quintessência] [Forçar Evento] [Resetar save]
// Acesso escondido: onLongPress no texto de versão/no contador. Ex.:
//   {__DEV__ && <DevPanel/>}
```
> Garanta que `godMode` e os botões **não** sejam incluídos no build de produção (cheque `__DEV__`).

**Checkpoint E:** com God Mode ligado a Essência fica altíssima; dá pra fazer Magnum Opus e testar o prestígio; nada disso aparece em produção.

---

## F. Mais fontes de Quintessência (chegar no máximo não pode ser a única)

Hoje só vem do total de Essência. Adicione estas fontes (somam-se):

| Fonte | Quanto | Quando |
|---|---|---|
| **Selar a Obra (base)** | `floor((totalEssenceEarned / 1e12) ^ (1/3))` − já recebido | ao prestigiar |
| **Conquistas** | o `quintReward` de cada uma (Parte B.4) | única, ao desbloquear |
| **Maestria de Instrumento** | **+3** por Instrumento levado ao **Nível 5** (100 un) | única, por Instrumento |
| **Marcos de Coleção** | possuir 1 de cada Instrumento: **+10**; todos no Nível 3: **+25** | única |
| **Provações (desafios)** | recompensa fixa ao cumprir a regra (abaixo) | única por provação |

**Provações (Desafios) — `src/game/data/trials.ts`:** runs opcionais com uma regra; ao atingir o alvo, ganha Quintessência fixa.
```ts
export const TRIALS = [
  { id:"notouch", displayName:"Ascese", rule:"Alcance 1e9 de Essência sem comprar nenhum upgrade de Toque", quintReward:15 },
  { id:"minimal", displayName:"Voto de Pobreza", rule:"Alcance 1e9 usando no máximo 3 tipos de Instrumento", quintReward:20 },
  { id:"speed",   displayName:"Pressa do Alquimista", rule:"Alcance 1e8 em menos de 10 minutos de uma run", quintReward:15 },
];
// Implementação simples: a run de Provação roda em cima do estado normal, com flags de regra checadas no store.
```

> Importante: Conquistas, Maestria e Marcos dão Quintessência **fora do reset** (one-time, não some ao prestigiar). A "Selar a Obra" é a fonte recorrente. Isso dá progresso constante mesmo sem prestigiar.

**Checkpoint F:** Quintessência também sobe por conquistas, maestria de Instrumentos, marcos e provações — não só ao prestigiar.

---

## G. Auditoria de desempenho (o jogo ainda dá lag)

Investigue **nesta ordem** (do mais provável ao menos). Para cada item: cheque e corrija.

1. **Assinatura do store larga (suspeito nº 1).** Se algum componente assina o estado inteiro do Zustand (ou `essence`) e re-renderiza junto, a tela toda re-renderiza a cada tick. **Corrija:** selectors finos — `useStore(s => s.essence)` só no contador; cada `GeneratorRow`/estação assina só o próprio `owned[id]`. Use `useShallow` em selects de objeto.
2. **Frequência de `setState`.** O loop não pode dar `setState` a 30/60 Hz. **Corrija:** simulação por delta de timestamp; o número exibido atualiza a **~4 Hz** (250ms). Nada de re-render por frame.
3. **Afford­ability recalculada demais.** Recalcular "quem dá pra comprar" para 14 Instrumentos + dezenas de upgrades a cada tick trava. **Corrija:** calcule no ritmo do contador (4 Hz), memoizado.
4. **`console.log` em caminho quente.** Logs no tick/no render derrubam FPS no Android. **Corrija:** remova todos os logs de tick/click/render.
5. **Animação fora de worklet.** Qualquer animação via `setInterval` mexendo em `style`/`setState` causa jank. **Corrija:** tudo em Reanimated (worklet), só `transform`/`opacity`.
6. **Listas re-renderizando inteiras.** **Corrija:** `React.memo` nas linhas/estações; keys estáveis; não recrie arrays/handlers a cada render (`useCallback`/`useMemo`).
7. **Laboratório sem pausa offscreen.** Animações da aba Lab rodando o tempo todo. **Corrija:** `animated = abaFocada && !calmMode`; pause ao sair.
8. **Tetos.** ≤8 sprites animados na tela toda; ≤24 partículas; música 1 player. Garanta os tetos.
9. **Save frequente.** AsyncStorage salvando a cada tick trava. **Corrija:** salvar a cada 5–10s + no background.
10. **SVG/format re-render.** Não recrie a poção/Roda nem reformate números a cada frame. Memoize.

**Como medir:** rode num Android **básico**; ative o monitor de FPS. Meta: **UI thread 60fps travado**, JS nunca bloqueado > ~100ms. Se o JS engasga mas a UI segue 60, está OK (Reanimated isolando). Se a UI cai, o culpado é animação de layout/sombra — volte ao item 5.

**Checkpoint G:** sem `console.log` em loop; contador a 4 Hz; selectors finos; UI travada em 60fps num aparelho básico.

---

## H. Ordem de implementação
1. **A** (rename) → rápido.
2. **B** (conteúdo: Instrumentos, Toque, Rituais, Conquistas).
3. **C** (ícones distintos) — junto com B, pois B cria upgrades novos.
4. **F** (fontes de Quintessência) — depende das Conquistas de B.4.
5. **E** (God Mode) — fazer cedo ajuda a testar tudo acima.
6. **D** (Laboratório vivo).
7. **G** (passada de desempenho) — ao final de cada Parte e no fim.

> Regra de ouro: cada Parte tem um Checkpoint. Implemente, **pare**, valide com o usuário (e com o God Mode pra prestígio), só então siga. Não reescreva sistemas existentes — **anexe/adicione** conforme indicado.
