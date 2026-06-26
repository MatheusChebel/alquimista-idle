# Kit Visual — código exato para o Cursor reproduzir os mockups

> **Por que o estilo desviou:** os mockups foram feitos com a fonte de ícones **Tabler**,
> hex específicos e uma moldura-selo exata. O manual descrevia isso em **palavras**, então
> o Cursor reimplementou em RN com escolhas próprias (outra fonte de ícones, cores
> aproximadas, selo mais chapado) e o resultado divergiu.
>
> **A garantia:** parar de descrever e **colar o código exato** abaixo. Mesma biblioteca de
> ícones dos mockups (**`@tabler/icons-react-native`**), mesmos hex, mesma geometria de SVG.
> Se o Cursor usar estes arquivos, a tela fica **idêntica** às imagens.

---

## 0. Regras para o Cursor (LEIA)
1. **Não troque a biblioteca de ícones.** Use **`@tabler/icons-react-native`** com os nomes exatos da seção 3. Foi com ela que os mockups foram feitos.
2. **Não aproxime cores.** Use os hex de `theme.ts` (seção 2) exatamente.
3. **Cole os componentes** das seções 3–6 como estão; só ajuste imports de caminho.
4. **Compare lado a lado:** salve as imagens de referência em `docs/mockups/` e confira cada tela contra elas (seção 7).
5. Mantenha as regras de desempenho já definidas (worklets, `transform`/`opacity`, tetos).

---

## 1. Instalação
```bash
npx expo install @tabler/icons-react-native react-native-svg
npx expo install expo-font @expo-google-fonts/cinzel @expo-google-fonts/space-grotesk @expo-google-fonts/cormorant-garamond
```
Os ícones Tabler em RN são **componentes** (renderizam SVG), com props `size`, `color`, `stroke`:
```tsx
import { IconFlask2 } from "@tabler/icons-react-native";
<IconFlask2 size={24} color="#46E5C4" stroke={1.8} />
```

---

## 2. Tokens exatos — `src/constants/theme.ts`
```ts
export const BASE = {
  bgDeep:     "#0F0B17",
  bgSurface:  "#1A1428",
  bgElevated: "#241B38",
  borderHair: "#392E55",
  textPrimary:"#EDE7F7",
  textMuted:  "#9588B4",
  textFaint:  "#5C5179",
  gold:       "#F5C542",
  goldInk:    "#3A2A06",  // texto sobre dourado
  danger:     "#C2606A",
} as const;

export type Phase = "nigredo" | "albedo" | "citrinitas" | "rubedo";
export const PHASE = {
  nigredo:    { accent: "#46E5C4", glow: "#7CFFE3", essence: "#46E5C4" },
  albedo:     { accent: "#A9D4FF", glow: "#E4F1FF", essence: "#BFE3FF" },
  citrinitas: { accent: "#F5C542", glow: "#FFE08A", essence: "#FFD15C" },
  rubedo:     { accent: "#FF5D63", glow: "#FF9A5C", essence: "#FF6F61" },
} as const;

export const RADIUS = { card: 14, pill: 10, sigil: 999 } as const;
export const SPACE  = { xs: 4, sm: 8, md: 10, lg: 14, xl: 18 } as const;
```
> Observação importante sobre os mockups: a **poção é verde** (`essence` de Nigredo, `#46E5C4`) mesmo com a Roda em Albedo — o líquido segue a cor de Essência que você definir; nos mockups ficou `#46E5C4`.

### Fontes (carregar antes do 1º render)
```ts
import { useFonts } from "expo-font";
import { Cinzel_700Bold } from "@expo-google-fonts/cinzel";
import { SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold } from "@expo-google-fonts/space-grotesk";
import { CormorantGaramond_600SemiBold } from "@expo-google-fonts/cormorant-garamond";
// const [ready] = useFonts({ Cinzel_700Bold, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, CormorantGaramond_600SemiBold });
// número/contador: fontFamily "SpaceGrotesk_600SemiBold" + style fontVariant: ['tabular-nums']
// eyebrow/título: "Cinzel_700Bold"  ·  nome de item: "CormorantGaramond_600SemiBold"
```

---

## 3. Selo + ícones — `src/game/components/Sigil.tsx`
A **moldura-selo** é o que dá coesão; é um `View` (barato), com anel fino e fundo translúcido. Igualzinho aos mockups.
```tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import {
  IconFlask2, IconSoup, IconFlame, IconRobot, IconPlant2, IconDiamond,
  IconFeather, IconCircleDotted, IconTree, IconHandFinger, IconHandStop,
  IconWaveSine, IconDroplet, IconInfinity, IconSparkles,
} from "@tabler/icons-react-native";
import { BASE } from "../../constants/theme";

// id -> componente Tabler EXATO usado no mockup
export const ICONS: Record<string, React.ComponentType<any>> = {
  alembic: IconFlask2, cauldron: IconSoup, athanor: IconFlame,
  homunculus: IconRobot, herbgarden: IconPlant2, crucible: IconDiamond,
  familiar: IconFeather, portal: IconCircleDotted, tree: IconTree,
  click: IconHandFinger, glove: IconHandStop, resonance: IconWaveSine,
  essence: IconDroplet, magnumopus: IconInfinity, conjunction: IconSparkles,
};

// tom do glifo por item (alguns fogem da cor da categoria, como no mockup)
export const ICON_TINT: Record<string, string> = {
  athanor: "#FF9A5C", crucible: BASE.gold, familiar: "#A9D4FF",
};

export function Sigil({ ringColor, size = 50, fillColor, children }:{
  ringColor: string; size?: number; fillColor?: string; children: React.ReactNode;
}) {
  return (
    <View style={[styles.sigil, {
      width: size, height: size, borderRadius: size / 2,
      borderColor: ringColor, backgroundColor: (fillColor ?? ringColor) + "22",
    }]}>{children}</View>
  );
}

export function ItemIcon({ id, ringColor, size = 50, glyphColor }:{
  id: string; ringColor: string; size?: number; glyphColor?: string;
}) {
  const Glyph = ICONS[id];
  const color = glyphColor ?? ICON_TINT[id] ?? ringColor;
  return (
    <Sigil ringColor={ringColor} size={size}>
      {Glyph ? <Glyph size={size * 0.48} color={color} stroke={1.8} /> : null}
    </Sigil>
  );
}

const styles = StyleSheet.create({
  sigil: { alignItems: "center", justifyContent: "center", borderWidth: StyleSheet.hairlineWidth },
});
```
> Nomes Tabler seguem o padrão `Icon` + PascalCase (`ti-flask-2` → `IconFlask2`). Se algum export não existir na versão instalada, confirme em tabler.io/icons e ajuste **só aqui** no `ICONS`.

---

## 4. A Poção — `src/game/components/Potion.tsx` (react-native-svg, idêntica ao mockup)
```tsx
import React from "react";
import Svg, { Circle, Rect, Ellipse } from "react-native-svg";

export function Potion({ size = 172, essence = "#46E5C4", glow = "#7CFFE3", gold = "#F5C542" }:{
  size?: number; essence?: string; glow?: string; gold?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 172 172">
      {/* halo (respira via animação externa; aqui estático) */}
      <Circle cx={86} cy={88} r={72} fill={glow} opacity={0.05} />
      <Circle cx={86} cy={88} r={56} fill={glow} opacity={0.08} />
      <Circle cx={86} cy={88} r={42} fill={glow} opacity={0.13} />
      <Circle cx={86} cy={88} r={30} fill={glow} opacity={0.18} />
      {/* gargalo + lábio */}
      <Rect x={78} y={34} width={16} height={40} rx={3} fill={essence} opacity={0.55} stroke={gold} strokeWidth={1.2} />
      <Rect x={71} y={30} width={30} height={8} rx={3} fill="#241B38" stroke={gold} strokeWidth={1.3} />
      {/* bulbo + líquido */}
      <Circle cx={86} cy={96} r={42} fill={essence} opacity={0.92} stroke={gold} strokeWidth={1.5} />
      <Ellipse cx={86} cy={72} rx={38} ry={7} fill={glow} opacity={0.30} />
      <Ellipse cx={72} cy={82} rx={12} ry={7} fill="#E4F1FF" opacity={0.40} />
      {/* bolhas */}
      <Circle cx={78} cy={108} r={4} fill="#E4F1FF" opacity={0.85} />
      <Circle cx={96} cy={96} r={3.5} fill="#E4F1FF" opacity={0.80} />
      <Circle cx={86} cy={118} r={2.5} fill="#E4F1FF" opacity={0.75} />
    </Svg>
  );
}
```
Para o **glow respirando** e o **bob**, envolva num `Animated.View` (Reanimated) animando `opacity` de um halo e `translateY` — ver receitas 6c/6 do doc de arte. A geometria acima **não muda**.

---

## 5. A Roda da Grande Obra — `src/game/components/GreatWorkWheel.tsx`
```tsx
import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

const PHASE_COLORS = ["#46E5C4", "#A9D4FF", "#F5C542", "#FF5D63"]; // nigredo→rubedo
const ARCS = [
  "M18,4 A14,14 0 0 1 32,18",   // top-right  (Nigredo)
  "M32,18 A14,14 0 0 1 18,32",  // bottom-right(Albedo)
  "M18,32 A14,14 0 0 1 4,18",   // bottom-left(Citrinitas)
  "M4,18 A14,14 0 0 1 18,4",    // top-left   (Rubedo)
];

/** current = índice da fase atual (0..3). Arcos passados/atual: cheios; futuros: 22%. */
export function GreatWorkWheel({ size = 40, current = 1 }: { size?: number; current?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36">
      {ARCS.map((d, i) => (
        <Path key={i} d={d} fill="none" stroke={PHASE_COLORS[i]} strokeWidth={3.5}
          strokeLinecap="round" opacity={i <= current ? 1 : 0.22} />
      ))}
      <Circle cx={18} cy={18} r={3} fill={PHASE_COLORS[current]} />
    </Svg>
  );
}
```
> Versão grande (tela Magnum Opus): mesmo componente com `size={180}` e a barra de progresso da fase atual conforme a seção 8.4 do doc de arte.

---

## 6. Card de compra rápida — `src/game/components/QuickBuyCard.tsx`
Estrutura e medidas iguais às do mockup (selo em cima, nome, pílula de custo). Comprável = borda `gold`.
```tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ItemIcon } from "./Sigil";
import { BASE, RADIUS } from "../../constants/theme";

export function QuickBuyCard({ id, name, cost, affordable, ringColor = BASE_ESSENCE, onBuy }:{
  id: string; name: string; cost: string; affordable: boolean; ringColor?: string; onBuy: () => void;
}) {
  return (
    <Pressable onPress={onBuy} style={[styles.card, { borderColor: affordable ? BASE.gold : BASE.borderHair, borderWidth: affordable ? 1.5 : StyleSheet.hairlineWidth }]}>
      <ItemIcon id={id} ringColor={ringColor} size={42} />
      <Text style={styles.name}>{name}</Text>
      <View style={[styles.pill, affordable ? styles.pillGold : styles.pillGhost]}>
        <Text style={[styles.cost, { color: affordable ? BASE.goldInk : BASE.danger }]}>{cost} ✦</Text>
      </View>
    </Pressable>
  );
}
const BASE_ESSENCE = "#46E5C4";
const styles = StyleSheet.create({
  card: { minWidth: 84, backgroundColor: BASE.bgSurface, borderRadius: RADIUS.card,
          paddingVertical: 10, paddingHorizontal: 6, alignItems: "center", gap: 6 },
  name: { fontSize: 12, color: BASE.textPrimary, fontFamily: "CormorantGaramond_600SemiBold" },
  pill: { borderRadius: 8, paddingVertical: 3, paddingHorizontal: 9 },
  pillGold: { backgroundColor: BASE.gold },
  pillGhost:{ borderWidth: StyleSheet.hairlineWidth, borderColor: BASE.borderHair },
  cost: { fontSize: 12, fontWeight: "500", fontFamily: "SpaceGrotesk_500Medium", fontVariant: ["tabular-nums"] },
});
```
A **prateleira** é um `ScrollView horizontal` com `gap: 8` desses cards (igual ao mockup: 3 visíveis + 1 "espiando" + hint "‹ deslize ›").

> Os demais componentes (linha de Aparelho do Grimório, estação do Laboratório, banner de evento) **reutilizam `ItemIcon`/`Sigil` e estes tokens** — uma vez que estas primitivas batem com o mockup, tudo construído sobre elas também bate.

---

## 7. Aceite — comparar lado a lado (obrigatório)
Salve as duas imagens de referência em `docs/mockups/pocao.png` e `docs/mockups/icones.png` e verifique:
- [ ] **Ícones idênticos:** mesmos glifos Tabler (frasco, caldeirão=tigela com vapor, chama, robô, plantinha, diamante, pena, círculo pontilhado, árvore; mão/onda/gota/infinito/brilho). Selo = anel fino + fundo translúcido, **não** preenchido sólido.
- [ ] **Cores idênticas:** fundo `#0F0B17`, líquido `#46E5C4`, anel/contorno dourado `#F5C542`, texto `#EDE7F7`/`#9588B4`. Sem roxos/azuis "aproximados".
- [ ] **Poção:** halo difuso (4 círculos), bulbo verde com contorno dourado, gargalo+lábio, 3 bolhas claras. Bate com `pocao.png`.
- [ ] **Roda:** 4 arcos coloridos, atual aceso, futuros a 22%.
- [ ] **Cards:** selo no topo, nome em serifa (Cormorant), pílula de custo dourada quando comprável; números em Space Grotesk tabular.
- [ ] **Categorias da folha de ícones:** Aparelhos com anel da cor da Essência; Toque & Místico com anel dourado.

Se algum item não bater, o conserto é **só** trocar a cor/o nome de ícone no `theme.ts` ou no `ICONS` — não reescrever telas.

---

## 8. Resumo
A fidelidade vem de três travas: **(1)** mesma lib de ícones do mockup (`@tabler/icons-react-native`, nomes exatos), **(2)** hex exatos de `theme.ts`, **(3)** SVG da poção e da Roda copiados ao pixel. Com as primitivas `Sigil`/`ItemIcon`/`Potion`/`GreatWorkWheel` corretas, todo o resto (Grimório, Laboratório, eventos) herda o visual. Construa sobre elas e compare sempre contra `docs/mockups/`.
