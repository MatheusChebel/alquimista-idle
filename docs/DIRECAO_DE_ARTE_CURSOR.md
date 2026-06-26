# Direção de Arte & Estilização — Grimório do Alquimista

> Guia estético para deixar o jogo bonito, com vida e "suco" (game feel).
> Companheiro do `PLANO_IMPLEMENTACAO_CURSOR.md`. Stack: Expo SDK 56,
> **react-native-reanimated v4**, **react-native-svg**, `StyleSheet` + `theme.ts`.
> Inspirado na clareza dos idles de referência, mas com identidade própria.

---

## 0. Como usar este documento

1. Este doc é a **fonte da verdade visual**. Cores, fontes e timings aqui têm prioridade sobre improviso.
2. Toda cor e medida vira **token** em `src/constants/theme.ts` (seção 2 e 3 trazem os tokens prontos). Nenhum hex solto espalhado pelos componentes.
3. Animações usam **Reanimated v4** (já instalado; worklets configurados pelo `babel-preset-expo`). Os snippets da seção 6 são coláveis.
4. Regra de ouro: **gaste a ousadia em um lugar só.** O elemento-assinatura (a Poção viva) é a estrela; o resto é quieto e disciplinado pra ela brilhar.
5. Piso de qualidade inegociável: respeitar *Reduzir Movimento*, contraste legível, 60fps. Detalhes na seção 13.

---

## 1. North Star estético (a sensação)

**Uma frase:** *o laboratório de um alquimista à meia-luz — escuro, quente e vivo, onde uma única poção brilha como a fonte de toda a magia.*

Três palavras-guia: **Penumbra. Brilho. Ritual.**

- **Penumbra:** o fundo nunca é preto puro nem cinza neutro. É uma escuridão *quente e arroxeada* (carvão com tinta de ameixa), como pedra à luz de vela. Isso já separa o jogo do clichê "fundo preto + um acento neon".
- **Brilho:** a luz vem de dentro das coisas — a poção emite glow, a essência pulsa, itens compráveis "respiram" com uma aura dourada. Luz é informação: o que brilha, você pode tocar.
- **Ritual:** a tipografia e os ícones evocam um grimório antigo — capitulares gravadas, serifa de manuscrito, símbolos alquímicos. Mas o número (a Essência) é limpo e moderno, porque é o que o jogador olha 90% do tempo.

**Anti-referências (o que evitar):** flat design genérico de SaaS; gradiente roxo→rosa de template; emojis como ícones; cantos arredondados em tudo igual; aquele "fundo quase-preto com um único verde-limão" que toda IA gera. Nós temos um **sistema de 4 cores** (a Magnum Opus) — isso é o diferencial, use-o.

---

## 2. Sistema de cores

### 2.1 A tela base — "o laboratório à meia-luz"
Constante em todas as fases. É o palco escuro e quente.

| Token | Hex | Uso |
|---|---|---|
| `bg.deep` | `#0F0B17` | fundo da tela (ameixa-carvão, não preto) |
| `bg.surface` | `#1A1428` | cards, painéis |
| `bg.elevated` | `#241B38` | item destacado, modal |
| `border.hair` | `#392E55` | divisórias finas (1px), molduras |
| `text.primary` | `#EDE7F7` | branco-quente principal |
| `text.muted` | `#9588B4` | rótulos, custos, secundário |
| `text.faint` | `#5C5179` | desabilitado, placeholders |
| `shadow.glow` | `rgba(0,0,0,0.55)` | sombra base sob cards |

### 2.2 As 4 paletas da Magnum Opus (o coração da identidade)
Cada fase de prestígio troca o **acento** e a **cor da própria Essência (a poção muda de cor!)**. É a grande recompensa visual de longo prazo: ascender literalmente transforma a paleta do mundo.

| Fase | Acento principal | Glow / brilho | Essência (líquido) | Sensação |
|---|---|---|---|---|
| **Nigredo** (início) | `#46E5C4` viridiano | `#7CFFE3` | `#46E5C4` | a primeira reação, frio e espectral |
| **Albedo** (2º) | `#A9D4FF` prata-lunar | `#E4F1FF` | `#BFE3FF` | purificação, luar |
| **Citrinitas** (3º) | `#F5C542` ouro | `#FFE08A` | `#FFD15C` | o despertar solar, ouro alquímico |
| **Rubedo** (final) | `#FF5D63` rubi | `#FF9A5C` molten | `#FF6F61` | a Obra completa, brasa e ouro |

> Implementação: `theme.ts` exporta `PHASE_PALETTES[phase]`. Um único `ThemeProvider` (ou hook `usePhaseTheme()`) injeta acento/glow/essência conforme a fase atual. Trocar de fase = trocar um objeto, e toda a UI segue.

### 2.3 Cores funcionais (estado dos itens)
| Estado | Tratamento |
|---|---|
| **Comprável agora** | moldura + glow no **acento dourado** `#F5C542` (sempre, independente da fase) + leve pulso. É o convite. |
| **Caro (não pode pagar)** | normal, mas o **custo** em `#C2606A` (vermelho dessaturado) |
| **Bloqueado** (não atingiu requisito) | item a 35% de opacidade, dessaturado, ícone de cadeado, sem glow |
| **Recém-comprado** | flash rápido do acento da fase (300ms) e assenta |
| **Evento Eclipse (negativo)** | violeta-sangue `#8B2F4A`, vinheta escurece |

### 2.4 Tokens prontos (`src/constants/theme.ts`)
```ts
export const BASE = {
  bgDeep: "#0F0B17",
  bgSurface: "#1A1428",
  bgElevated: "#241B38",
  borderHair: "#392E55",
  textPrimary: "#EDE7F7",
  textMuted: "#9588B4",
  textFaint: "#5C5179",
  gold: "#F5C542",        // "comprável" — constante
  danger: "#C2606A",
  eclipse: "#8B2F4A",
} as const;

export type Phase = "nigredo" | "albedo" | "citrinitas" | "rubedo";

export const PHASE_PALETTES: Record<Phase, {
  accent: string; glow: string; essence: string;
}> = {
  nigredo:    { accent: "#46E5C4", glow: "#7CFFE3", essence: "#46E5C4" },
  albedo:     { accent: "#A9D4FF", glow: "#E4F1FF", essence: "#BFE3FF" },
  citrinitas: { accent: "#F5C542", glow: "#FFE08A", essence: "#FFD15C" },
  rubedo:     { accent: "#FF5D63", glow: "#FF9A5C", essence: "#FF6F61" },
};
```

---

## 3. Tipografia

Três vozes. Carregue com `expo-font` + `@expo-google-fonts/*`:
`npx expo install expo-font @expo-google-fonts/cinzel @expo-google-fonts/cormorant-garamond @expo-google-fonts/space-grotesk`

| Papel | Fonte | Onde | Por quê |
|---|---|---|---|
| **Títulos / selos** | **Cinzel** (maiúsculas gravadas) | nome do jogo, títulos de aba ("GRIMÓRIO"), nomes de fase | parece carimbada em pedra/metal — voz ritualística, com moderação |
| **Voz do grimório** | **Cormorant Garamond** (serifa antiga, itálico lindo) | nomes dos Aparelhos, textos de "flavor", descrições | manuscrito alquímico; dá alma sem custar legibilidade |
| **Números & UI** | **Space Grotesk** (com **tabular figures**) | o contador de Essência, EPS, custos, botões | limpa e moderna; **tabular** = dígitos não "pulam" quando o número rola |

**Escala de tipo** (px, base 16):
- Contador de Essência (herói): 44, Space Grotesk, peso 600, `fontVariant: ['tabular-nums']`, leve `letterSpacing: -0.5`.
- Título de aba: 22, Cinzel, peso 700, `letterSpacing: 2`, maiúsculas.
- Nome de Aparelho: 18, Cormorant Garamond, peso 600.
- Flavor/descrição: 14, Cormorant Garamond itálico, `text.muted`.
- Custo / números secundários: 15, Space Grotesk, tabular.
- Rótulo pequeno (EPS, "/seg"): 12, Space Grotesk, `letterSpacing: 1`, maiúsculas, `text.faint`.

> Detalhe que importa: **sempre** `fontVariant: ['tabular-nums']` em qualquer número que muda em tempo real. Sem isso o contador treme.

---

## 4. O elemento-assinatura: a Poção viva

Esta é a única coisa "cara" do jogo visualmente. Tudo aqui é capricho. É um SVG (react-native-svg) com 4 camadas, todas animadas:

1. **Halo de glow** (atrás): círculo radial difuso na cor `glow` da fase. Pulsa devagar (respiração) — opacidade 0.45 ↔ 0.9 em ~2.4s, loop.
2. **O frasco** (SVG): contorno fino dourado/prata + corpo de vidro semitransparente.
3. **O líquido (Essência)**: preenche o frasco na cor `essence` da fase, com um leve gradiente (mais claro no topo). Uma **onda** sutil na superfície (path animado) sobe e desce de leve.
4. **Bolhas**: 3–5 círculos pequenos que sobem do fundo, somem no topo e reaparecem — loop desencontrado (cada uma com delay diferente).

**Idle (parado):** o frasco inteiro faz um *bob* vertical de ±6px em ~3.2s (seno), como flutuando. O halo respira. As bolhas sobem. Nada acelerado — é hipnótico, não agitado.

**No toque (Destilar):** ver seção 5 — é onde mora o "suco".

---

## 5. Game feel ("suco") — princípios

O que separa um clicker gostoso de um chato é o **feedback do clique**. Cada toque precisa devolver: movimento, número, luz e (opcional) vibração. Princípios:

- **Squash & stretch:** ao tocar, a poção encolhe rápido (scale 0.92) e volta com *spring* (efeito gelatina). Sensação tátil.
- **Número flutuante (+N):** um `+Essência` sobe do ponto do toque, em Cormorant, e some subindo. Vários podem coexistir.
- **Ripple de luz:** um anel da cor `accent` expande do centro da poção e some (como gota n'água).
- **Micro-pulso do halo:** o glow dá um flash curto a cada toque.
- **Haptics (opcional):** `expo-haptics` → `impactAsync(Light)` no toque. Pequeno mas vicia.
- **Contador que "rola":** quando a Essência muda, o número anima do valor antigo ao novo (300ms) em vez de saltar.

### Tabela de timings & easing (use como referência fixa)
| Animação | Duração | Curva | Loop |
|---|---:|---|---|
| Squash do clique | 90ms ↓ + spring ↑ | `withSpring({damping:8})` | não |
| +N flutuante | 900ms (sobe 64px, fade nos últimos 350ms) | `Easing.out(Easing.quad)` | não |
| Ripple de luz | 600ms (scale 0→2.2, fade) | `Easing.out(Easing.ease)` | não |
| Respiração do halo | 2400ms | `Easing.inOut(Easing.sin)` | sim (reverse) |
| Bob da poção | 3200ms | `Easing.inOut(Easing.sin)` | sim (reverse) |
| Bolhas subindo | 2200–3000ms (desencontradas) | `Easing.linear` | sim |
| Pulso "comprável" | 1600ms | `Easing.inOut(Easing.ease)` | sim |
| Rolagem do contador | 300ms | `Easing.out(Easing.cubic)` | não |
| Spawn do evento | spring overshoot | `withSpring` | não |
| Transição de fase | 1200ms orquestrado | `Easing.inOut(Easing.cubic)` | não |

> Regra anti-IA: **movimento deliberado, não espalhado.** Um momento orquestrado (a transição de fase) vale mais que 20 efeitos piscando. Se algo se mexe sem motivo, corte.

---

## 6. Receitas de animação (Reanimated v4 — colar e adaptar)

> Imports vêm de `react-native-reanimated`. Use `Animated.View`/`Animated.Text`.

**a) Squash + spring no clique da poção**
```tsx
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withSpring, withTiming } from "react-native-reanimated";

const scale = useSharedValue(1);
const onTapDestilar = () => {
  scale.value = withSequence(
    withTiming(0.92, { duration: 90 }),
    withSpring(1, { damping: 8, stiffness: 180 })
  );
  // ...chamar store.click(), spawnar +N, ripple, haptics
};
const potionStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
// <Animated.View style={potionStyle}> {/* SVG da poção */} </Animated.View>
```

**b) Número flutuante "+N"** (component que se auto-destrói)
```tsx
const y = useSharedValue(0);
const opacity = useSharedValue(1);
useEffect(() => {
  y.value = withTiming(-64, { duration: 900 });
  opacity.value = withTiming(0, { duration: 900 }, () => { /* runOnJS remove da lista */ });
}, []);
const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }], opacity: opacity.value }));
```

**c) Respiração do halo (loop infinito)**
```tsx
import { withRepeat, Easing } from "react-native-reanimated";
const glow = useSharedValue(0.45);
useEffect(() => {
  glow.value = withRepeat(withTiming(0.9, { duration: 2400, easing: Easing.inOut(Easing.sin) }), -1, true);
}, []);
const haloStyle = useAnimatedStyle(() => ({ opacity: glow.value }));
```

**d) Pulso "comprável" na moldura do card**
```tsx
const pulse = useSharedValue(0);
useEffect(() => {
  if (affordable) pulse.value = withRepeat(withTiming(1, { duration: 1600 }), -1, true);
  else pulse.value = withTiming(0, { duration: 200 });
}, [affordable]);
// interpola para a sombra/borda dourada
const cardStyle = useAnimatedStyle(() => ({
  shadowOpacity: 0.2 + pulse.value * 0.5,   // iOS
  borderColor: `rgba(245,197,66,${0.3 + pulse.value * 0.6})`,
}));
```

**e) Transição de cor entre fases (a recompensa)**
```tsx
import { interpolateColor, withTiming } from "react-native-reanimated";
const t = useSharedValue(0);
// ao prestigiar p/ nova fase: t.value = withTiming(1, { duration: 1200 })
const bgStyle = useAnimatedStyle(() => ({
  backgroundColor: interpolateColor(t.value, [0, 1], [oldAccent, newAccent]),
}));
```

> Performance: toda animação roda na UI thread via worklets (Reanimated v4). Não anime layout (width/height/top) quando puder animar `transform`/`opacity`. Para o glow, prefira `opacity`/`scale` a sombras pesadas no Android.

---

## 7. Conjunção Astral (o evento) — visual

O evento precisa **chamar o olho sem ser feio**. Quando spawna:
- Um **símbolo alquímico** SVG (sol, lua, Mercúrio, enxofre) surge em posição aleatória, com glow forte do acento da fase.
- **Entrada:** spring com overshoot (scale 0 → 1.1 → 1). **Idle:** gira bem devagar (8s/volta) + respira. **Saída** (se ignorado): fade + shrink em 300ms.
- **Ao clicar:** explosão de ~12 partículas de faísca na cor do glow, um flash branco curto na tela inteira (opacidade ≤ 0.15), e um banner sóbrio no topo nomeando o efeito ("FRENESI", em Cinzel).
- Durante **Frenesi**: uma vinheta pulsante quente nas bordas e o EPS no contador ganha um brilho. Durante **Eclipse**: vinheta violeta-sangue, o glow da poção esmaece.

---

## 8. Componentes de UI

### Card de Aparelho (`GeneratorRow`)
Layout horizontal, denso mas respirável:
```
┌───────────────────────────────────────────────┐
│ ◈  Alambique                      x 12         │   ← ícone SVG | nome (Cormorant) | qtd (Space Grotesk)
│    Destilador básico de essência   1.2/seg     │   ← flavor (itálico muted) | contribuição EPS
│                              ┌──────────────┐  │
│                              │  17 ✦ comprar │  │   ← botão: custo + selo de Essência
│                              └──────────────┘  │
└───────────────────────────────────────────────┘
```
- Fundo `bg.surface`, borda `border.hair` 1px, radius 14.
- Ícone à esquerda: um glifo SVG simples e único por Aparelho (não emoji).
- Botão comprável → glow dourado pulsante; indisponível → custo em `danger`, sem pulso.
- Ao comprar: o card dá um flash do acento e a qtd incrementa com micro-bounce.

### 8.3 Navegação & arquitetura de informação (REVISÃO v2 — substitui a lista única)

> **Problema da v1:** tudo numa coluna só, muita rolagem, tudo com a mesma cara ("tabelado"). Esta revisão é a forma correta. Vale para o Grimório e para a home.

**a) Segmented control de categorias** no topo do Grimório (3 pílulas):
**Aparelhos** (Essência/seg) · **Toque** (clique) · **Magnum Opus** (prestígio).
O jogador cai direto na categoria certa e cada lista fica curta — acaba a caça rolando.
- Pílula ativa: fundo `bg.elevated` + texto no `gold`. Inativas: texto `text.muted`.
- Cada categoria abre com uma **eyebrow** em maiúsculas pequenas, na cor que a identifica: `ESSÊNCIA POR SEGUNDO` (acento da fase) / `POR TOQUE` (gold) / `A GRANDE OBRA` (acento). Assim nunca há dúvida do que é cada upgrade.

**b) Divulgação progressiva (mata a rolagem):**
- Mostrar só Aparelhos **desbloqueados + o próximo** como teaser (ex.: "Homúnculo — desbloqueia ao ter 5 Athanor", esmaecido, com cadeado). Nunca 6 linhas vazias.
- **Compráveis sobem pro topo** da lista com a moldura dourada. O olho vai direto na próxima compra.
- Quando a categoria tiver muitos itens, usar **grade de 2 colunas** de tiles compactos pra cortar a altura pela metade.

**c) Prateleira de compra rápida na tela da Poção** (ataca o problema na raiz):
- Um carrossel **horizontal** (scroll lateral) no rodapé da tela da Poção com os 3–4 upgrades compráveis do momento. Compra-se sem trocar de aba. Scroll horizontal no lugar de vertical.

**d) Header fixo (sticky):** Essência + EPS colados no topo ao rolar — o número-herói nunca sai de vista.

### Card de Aparelho — versão limpa (atualiza o card acima)
Mantém uma linha, porém **compacto** (ver mockup aprovado): glifo circular na cor da Essência · nome + "×qtd" · meta "+X /seg cada" · pílula de custo à direita.
- Comprável → borda `gold` 1.5px + pulso leve (sem sombra pesada; o destaque é a borda). Não dá pra pagar → custo em `danger`, borda neutra. Bloqueado → 40% de opacidade + cadeado.
- Radius 14, fundo `bg.surface`, borda `border.hair` 0.5px.

### Barra superior (HUD) — atualizada
- Essência grande à esquerda (tabular) + EPS `muted` logo abaixo.
- À direita, a **Roda da Grande Obra** (8.4) — substitui os 4 pontos. Toca e abre a Magnum Opus.

### 8.4 A Roda da Grande Obra (indicador de prestígio) — substitui os "4 pontos"

Um selo circular: anel dividido em 4 arcos, um por fase (Nigredo → Albedo → Citrinitas → Rubedo).
- Fases **concluídas:** arco cheio e brilhante na cor da fase.
- Fase **atual:** arco mais grosso que funciona como **barra de progresso** — preenche conforme a Quintessência se acumula rumo à próxima fase (track na cor a ~28% + preenchimento na cor cheia).
- Fases **futuras:** arco fino na cor da fase a ~22% de opacidade (dá pra antever o que vem).
- **Centro:** nome da fase atual (na sua cor) + "Quintessência · N ✦" + "X% rumo a <próxima>".
- **No HUD:** versão de ~40px (toca → abre). **Na tela Magnum Opus:** versão grande (~180px) como peça central.
- **Animação:** ao ascender, o arco recém-concluído dá um flash e o próximo "acende" (use o cross-fade da seção 6e).
- Implementação: `react-native-svg` com 4 `<Path>` de arco; o preenchimento da fase atual é um arco sobreposto cujo comprimento vem de `progresso (0–1)`. Sem libs extras.

---

## 9. A transição entre fases (Nigredo → Rubedo) — o grande momento

Quando o jogador faz a Magnum Opus e sobe de fase, **pare tudo por ~1.2s** e entregue um momento:
1. Flash suave que lava a tela com o **novo acento**.
2. A poção troca a cor do líquido (interpolateColor) e o halo incha.
3. O nome da nova fase aparece em Cinzel, grande, centralizado, e recolhe.
4. A paleta inteira da UI faz o cross-fade pro novo acento.
5. Som grave de "ascensão" (se houver áudio).

É a única hora em que o jogo é maximalista. Vale o capricho — é o que o jogador vai lembrar e querer de novo.

---

## 10. Partículas & efeitos

Sem libs extras: faça partículas como pequenas `Animated.View`/SVG circles gerenciadas por um array no componente. Tipos:
- **Gotas de Essência:** sobem da poção ocasionalmente no idle.
- **Faíscas de evento:** burst radial ao clicar a Conjunção.
- **Poeira de transmutação:** ao comprar um upgrade caro, uma chuvinha curta de pontos dourados.
- **Fumaça do Athanor:** quando há ≥1 Athanor, um filete de fumaça/vapor sobe sutil no canto (puro charme ambiente).

Mantenha o total de partículas vivas com teto (ex.: ≤ 40) pra não cair o FPS em devices fracos.

---

## 11. Profundidade (o que faz parecer "produzido")

- **Vinheta:** um gradiente radial escuro nas bordas da tela (SVG ou overlay), sutil. Concentra o olhar no centro (a poção). Muda de cor levemente conforme a fase/evento.
- **Grão/textura:** uma textura de papel/pergaminho a ~4% de opacidade sobre os painéis do Grimório. Tira o "flat" plástico.
- **Luz direcional:** highlights mais claros no topo das superfícies, sombras embaixo — sugere uma fonte de luz (a poção) iluminando a cena.
- **Sombra dos cards:** suave e quente (não preto puro), com `shadow.glow`.

---

## 12. Som (opcional, mas multiplica o "suco")

Use `expo-audio` (SDK 56). Mínimo viável:
- *plink* curto e líquido no clique (varie o pitch ±5% pra não cansar).
- *shimmer* ao surgir uma Conjunção; *chime* ao coletá-la.
- *whoosh* grave na transição de fase.
- música ambiente: drone etéreo bem baixo, opcional e mutável.
Sempre com um **toggle de mudo** acessível.

---

## 13. Acessibilidade & performance (piso inegociável)

- **Reduzir movimento:** respeite `AccessibilityInfo.isReduceMotionEnabled()`. Se ligado: corte bob, respiração e partículas; mantenha só feedback essencial (o +N e a troca de número). Faça um `useReducedMotion()` que os componentes consultam.
- **Contraste:** texto principal sobre `bg.surface` deve passar AA. Os acentos são para luz/destaque, não para texto longo.
- **Toque:** alvo do clique da poção ≥ 64px. Botões ≥ 44px.
- **60fps:** anime só `transform`/`opacity` em worklets; nada de `setState` por frame (use `useSharedValue`). Teto de partículas. Evite sombras animadas pesadas no Android (prefira opacity/scale).
- **Tabular nums** em todo número vivo (já dito, mas é o erro #1).

---

## 14. Checklist de assets a produzir

- [ ] SVG da **poção** em 4 camadas (frasco, líquido, onda, bolhas) — cor do líquido por prop.
- [ ] **Halo/glow** radial (pode ser SVG `RadialGradient` ou PNG difuso).
- [ ] 9 **glifos** de Aparelho (um por gerador) — traço fino, estilo gravura.
- [ ] 4 **símbolos** de Conjunção Astral (sol, lua, Mercúrio, enxofre).
- [ ] Selo de **Essência** (ícone da moeda) e de **Quintessência**.
- [ ] Divisória ornamental do Grimório.
- [ ] Textura de **pergaminho** (tileável, leve).
- [ ] Vinheta de borda.
- [ ] (Áudio) plink, shimmer, chime, whoosh, drone ambiente.

---

## 15. Resumo & o que NÃO fazer

**A identidade em uma linha:** penumbra quente + uma poção viva que brilha + a paleta do mundo evoluindo pelas 4 cores da Magnum Opus.

**Faça:**
- Trate a poção como a estrela; capriche só nela e na transição de fase.
- Use luz como informação (brilha = clicável).
- Numerais limpos e tabulares; serifa de manuscrito pra "voz".
- Movimento lento e ambiente no idle; tátil e nítido no clique.

**Não faça:**
- Fundo preto puro + um acento neon (o clichê de IA).
- Gradiente roxo→rosa de template; emojis como ícones.
- Animar tudo o tempo todo (vira poluição e parece gerado).
- Esquecer `tabular-nums` (o contador vai tremer).
- Ignorar *Reduzir Movimento*.

---

## 16. Sistema de ícones (cada upgrade com "cara")

**Filosofia:** todo Aparelho e upgrade tem um glifo próprio dentro de uma **moldura-selo** consistente. A consistência da moldura é o que faz tudo parecer "um conjunto" (é o truque do Cookie Clicker). Duas etapas:

- **Agora (ponte vetorial):** usar a fonte de ícones **Material Design Icons (MDI)** — milhares de glifos, escaláveis, tingíveis na cor da fase, peso zero de arte.
- **Depois (a "cara" de verdade):** um **set ilustrado custom** (estilo gravura alquímica). Entra **sem tocar em tela nenhuma**, porque o ícone é resolvido por um **registry** keyado pelo `id`.

### 16.1 Instalação (SDK 56 — pacote escopado)
```bash
npx expo install @react-native-vector-icons/material-design-icons
```
`app.json` → adicionar o plugin:
```json
{ "expo": { "plugins": ["@react-native-vector-icons/material-design-icons"] } }
```
Import com a fonte embutida em build (sem flash em runtime — e mais rápido):
```ts
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons/static";
```

### 16.2 A Moldura-Selo (componente único e barato)
Um anel fino na cor da categoria + leve fundo translúcido + glifo centralizado. **Implementar como `View` com `borderRadius` (não SVG)** — formas redondas simples são muito mais baratas como View pro GPU.
```tsx
// <Sigil color={essenceColor} size={50}><MaterialDesignIcons name="pot-steam" .../></Sigil>
function Sigil({ color, size = 50, children }) {
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      borderWidth: StyleSheet.hairlineWidth, borderColor: color,
      backgroundColor: color + "22",            // ~13% alpha
      alignItems: "center", justifyContent: "center",
    }}>{children}</View>
  );
}
```
Cor da moldura por **categoria** (reforça a navegação da 8.3): Aparelhos = cor da Essência da fase; Toque = `gold`; Místico/prestígio = acento da fase.

### 16.3 Registry de ícones (desacoplado dos dados — troca o source sem refatorar)
```ts
// src/game/data/icons.ts
type IconRef = { family: "mdi"; glyph: string; tint?: string };
export const ICONS: Record<string, IconRef> = {
  // Aparelhos
  alembic:    { family: "mdi", glyph: "flask-round-bottom" },
  cauldron:   { family: "mdi", glyph: "pot-steam" },
  athanor:    { family: "mdi", glyph: "fire", tint: "#FF9A5C" },
  homunculus: { family: "mdi", glyph: "robot-outline" },
  herbgarden: { family: "mdi", glyph: "sprout" },
  crucible:   { family: "mdi", glyph: "diamond-stone", tint: "#F5C542" },
  familiar:   { family: "mdi", glyph: "bird", tint: "#A9D4FF" },
  portal:     { family: "mdi", glyph: "orbit" },
  tree:       { family: "mdi", glyph: "tree" },
  // Toque & místico
  click:      { family: "mdi", glyph: "gesture-tap" },
  glove:      { family: "mdi", glyph: "hand-back-right" },
  resonance:  { family: "mdi", glyph: "sine-wave" },
  essence:    { family: "mdi", glyph: "water" },         // a gota
  magnumopus: { family: "mdi", glyph: "all-inclusive" }, // ouroboros/infinito
  conjunction:{ family: "mdi", glyph: "star-four-points" },
};
```
> **Conferir o nome exato** de cada glifo no diretório MDI (procure por "pot", "flask", "fire", "hand", "sprout"…). Se um nome não existir na sua versão da fonte, escolha o vizinho mais próximo — o registry é o único lugar a editar.

`ItemIcon` consome o registry; trocar `family` para `"custom"` no futuro aponta para `<Image>`/`<Svg>` custom sem mexer em telas:
```tsx
export function ItemIcon({ id, color, size }) {
  const ref = ICONS[id];
  return <Sigil color={color} size={size}>
    <MaterialDesignIcons name={ref.glyph} size={size * 0.5} color={ref.tint ?? color} />
  </Sigil>;
}
```

### 16.4 O set custom (a "cara" final) — estilo e geração
Quando quiser a identidade ilustrada (recomendado pós-MVP), gere um set **coeso**:
- **Estilo:** gravura/woodcut alquímico, traço dourado de peso único sobre fundo transparente, leve preenchimento luminoso na cor-assinatura do item, margem de segurança de ~8%, fonte 256×256, visual centralizado e simétrico.
- **Prompt-base (repita trocando só o objeto):** *"alchemical engraving icon of a {caldeirão fumegante}, single thin gold line art, faint inner glow, centered, transparent background, mystical, cohesive icon set, flat, no text"*.
- **Troca:** salve em `assets/icons/<id>.svg` (ou png @2x/@3x), mude o registry para `{ family: "custom", source: require(...) }`. Telas não mudam.
- **Perf:** mantenha os SVGs custom **simples** (poucos nós de path); não anime paths complexos em loop. Se forem muitos na tela, prefira png @2x cacheado a SVG pesado.

---

## 17. Desempenho — rodar leve em qualquer Android atual

**Meta:** jogo simples, 60fps travado, sem gargalo, fluido até em celular básico. O jogo é leve por natureza — o que trava idle é sempre **re-render demais** e **animação na thread errada**. Regras abaixo evitam os dois.

**A seu favor (já vem no SDK 56):** Hermes v1 + Nova Arquitetura → cold start ~40% mais rápido, menos memória, GC com pausas bem menores. A base é boa; é só não estragar com padrão ruim.

### 17.1 O loop do jogo (o MAIOR risco de gargalo)
- **Um único timer**, não vários. Calcule por **delta de timestamp** (`now - lastTick`), não assumindo intervalo fixo — fica imune a frame drop e resolve o ganho offline de graça.
- **Nunca `setState` a 60 (nem a 10) Hz.** A conta `essence += eps*dt` é barata; caro é re-renderizar. Mantenha o valor autoritativo no store/ref e **atualize o número exibido só ~4×/seg** (a cada 250ms). O olho não percebe diferença e o custo despenca.
- **Contador sem re-render (opção avançada):** dirija o texto da Essência por um `useSharedValue` + `useAnimatedProps` num `TextInput` animado — o número "rola" na UI thread sem tocar no React. Use se quiser o efeito de rolagem suave sem custo.
- Pausa total em background (ver 17.6).

### 17.2 Animações: tudo na UI thread (Reanimated v4)
- Halo, bob, bolhas, pulso, ripple, "+N": **shared values + worklets** → rodam na **UI thread**, sem tráfego de bridge por frame. Continuam lisas **mesmo com o JS ocupado** (ex.: durante um save).
- **Anime só `transform` (translate/scale/rotate) e `opacity`.** Nunca `width/height/top/left/margin` (dispara layout todo frame = gargalo). **Nunca anime `shadow*`/blur em loop no Android** — o glow é `opacity`/`scale` de uma forma pré-pronta, não sombra animada.
- Animações ambientes são **poucas e lentas** (ciclos de 2–3s). Pulso dourado só nos cards **compráveis e visíveis**.

### 17.3 Partículas (o clássico mata-FPS)
- **Teto rígido** (~24–32 partículas vivas no total). Acima disso, não spawna.
- **Pool/reuso**: reaproveite objetos em vez de montar/desmontar componente toda hora.
- Cada partícula = **uma** `Animated.View` com transform+opacity, que se remove sozinha no callback da própria animação.
- Em **modo calmo** (17.7) ou *Reduzir Movimento*: corta partículas inteiras.

### 17.4 Higiene de re-render (React + zustand)
- **Selectors finos:** cada componente assina o mínimo. O contador assina `essence`; cada `GeneratorRow` assina só o próprio `owned[id]` e sua afford­ability — não o estado inteiro. Use `useShallow` em selects de objeto.
- `React.memo` nas linhas, `useCallback` nos handlers, keys estáveis.
- **Afford­ability não recalcula 10×/seg pra lista toda.** Recompute o "quem dá pra comprar" no mesmo ritmo do contador (~4 Hz). Acender a borda dourada 4×/seg é imperceptível e barato.
- Derivados (EPS total, custos) calculados no store **só quando os inputs mudam**, não a cada render.

### 17.5 Listas e telas
- Com ≤ ~20 itens visíveis, **`map` dentro de `ScrollView` basta** — `FlatList` é overhead desnecessário aqui. A **divulgação progressiva** (8.3) mantém a lista curtíssima, então é naturalmente leve.
- Sem scroll aninhado. Uma categoria por vez (segmented control) = menos nós montados.

### 17.6 Ícones, fontes e SVG
- MDI via **`/static`** (fonte embutida em build) = sem fetch/flash em runtime e render de glifo barato (mais leve que PNG).
- **Preload das fontes** (`useFonts`) antes do 1º paint pra não ter "salto" de layout.
- **Moldura-selo = `View`** com borderRadius (não SVG). Formas redondas simples são mais baratas como View.
- A **poção é SVG** com poucos nós (frasco + líquido + onda + 3–5 bolhas) — ok. Não coloque dezenas de nós SVG animados. Decorativo estático = renderiza 1× e fica.

### 17.7 Background, bateria e "modo calmo"
- **Pause o loop e as animações em background** (`AppState === "background"`); ao voltar, aplique o offline por timestamp. Economiza bateria e evita trabalho jogado fora.
- **Pause o ambiente da Poção quando ela não está visível** (ex.: aba Grimório aberta).
- **Modo calmo** (auto em *Reduzir Movimento*/economia de bateria, ou manual nas settings): desliga partículas e loops ambientes, mantém só feedback essencial (squash do clique, +N, troca de número). Animação contínua a 60fps esquenta e faz o aparelho fraco *throttlar* — o que ironicamente causaria o gargalo que queremos evitar.

### 17.8 Persistência sem hitch
- **Salvar throttled** (a cada 5–10s) **+ no background**, nunca a cada tick.
- Save **compacto**: só `essence`, `owned` (contagens), ids de upgrades comprados, `quintessence` e timestamps. JSON pequeno serializa rápido.

### 17.9 Orçamento de desempenho (referência rápida)
| Efeito | Técnica | Custo | Fallback (device fraco) |
|---|---|---|---|
| Halo / bob / bolhas | shared value + worklet (transform/opacity) | baixo | desliga em modo calmo |
| Pulso "comprável" | worklet, só em cards visíveis | baixo | sem pulso, só borda fixa |
| "+N" flutuante | 1 View self-removing | baixo | mantém (é essencial) |
| Partículas de evento | pool, teto 24–32 | médio | reduz teto / desliga |
| Contador | state ~4 Hz ou animatedProps | baixo | 4 Hz puro |
| Transição de fase | 1× orquestrada, ~1.2s | pontual | mantém (é rara) |
| Ícones | MDI /static, selo = View | baixo | — |

### 17.10 Como medir (faça antes de "tá bom")
- Teste num **Android real básico** ou emulador com CPU/GPU limitada — não confie só no seu aparelho.
- Olhe **FPS da UI thread vs JS thread separados** (o monitor do RN / DevTools): com Reanimated, a UI deve ficar em 60 mesmo se o JS oscilar. Meta: **UI travada em 60**, JS nunca bloqueado > ~100ms.
- Perfile re-renders (React DevTools Profiler): se um clique re-renderiza a lista toda, conserte o selector.
