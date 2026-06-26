<div align="center">

# ⚗️ Alquimista Idle

**Um idle/clicker de alquimia — toque a poção, destile Essência, monte o laboratório e avance pelas quatro fases da Grande Obra.**

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2056-000?logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.85-61DAFB?logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![State](https://img.shields.io/badge/State-Zustand-1A1428)](https://github.com/pmndrs/zustand)

</div>

---

## 📖 Sobre

**Alquimista Idle** é um jogo incremental de toque com tema alquímico, inspirado na simplicidade e no ritmo de clássicos como *Cookie Clicker*, *Clicker Heroes* e *Tap Titans* — mas com identidade própria.

Você é um alquimista destilando **Essência** (a gota luminosa que escorre da poção). Toque para destilar, invista em **Aparelhos** que geram Essência por segundo, compre **Transmutações** no Grimório e, quando o crescimento desacelerar, realize a **Magnum Opus** (prestígio) para recomeçar mais forte — avançando pelas quatro fases clássicas da Grande Obra: **Nigredo → Albedo → Citrinitas → Rubedo**, cada uma com sua própria paleta.

## ✨ Funcionalidades

- 🧪 **Destilar com o toque** — feedback tátil com animação e número flutuante.
- ⚙️ **9 Aparelhos** geradores (Alambique, Caldeirão, Athanor, Homúnculo, Jardim de Ervas, Cadinho de Cristal, Familiar, Portal Etéreo, Árvore Filosofal), com curva de custo exponencial balanceada.
- 📖 **Grimório** — Transmutações que multiplicam a produção e uma linha de upgrades de clique que escala com o EPS.
- 🔮 **Magnum Opus** — prestígio com Quintessência e a **Roda da Grande Obra** mostrando o progresso pelas 4 fases.
- ☄️ **Conjunções Astrais** — eventos com bônus (Frenesi, Toque Dourado, Sorte, Eclipse), com banner e timer.
- 🏺 **O Laboratório** — cada compra ganha presença visual: estações que se povoam e evoluem de nível.
- 💾 **Progresso salvo** localmente, com ganho offline.
- 🎨 Estética de **penumbra quente** com a poção viva como elemento-assinatura, focada em rodar liso em qualquer Android.

## 🛠️ Tecnologias

| Camada | Stack |
|---|---|
| Framework | Expo SDK 56 · React Native 0.85 · React 19.2 |
| Linguagem | TypeScript 6 |
| Roteamento | expo-router (file-based) |
| Estado | Zustand |
| Persistência | @react-native-async-storage/async-storage |
| Animação | react-native-reanimated v4 |
| Vetores / Ícones | react-native-svg · @tabler/icons-react-native |
| Áudio | expo-audio |

## 🚀 Começando

Pré-requisitos: **Node.js LTS** e o app **Expo Go** (ou um dev client) no celular.

```bash
# 1. Clonar
git clone https://github.com/MatheusChebel/alquimista-idle.git
cd alquimista-idle

# 2. Instalar dependências
npm install

# 3. Rodar
npx expo start
```

Leia o QR Code com o app Expo Go (Android/iOS), ou pressione `a`/`i` no terminal para abrir num emulador.

### Scripts úteis
```bash
npx expo start            # ambiente de desenvolvimento
npx tsc --noEmit          # checagem de tipos
npx expo install <pkg>    # adicionar dependência compatível com o SDK
npx expo-doctor@latest    # diagnosticar problemas de versão
```

## 📁 Estrutura

```
src/
├─ app/                    # rotas (expo-router): Poção, Laboratório, Grimório
├─ components/             # UI compartilhada (themed-*, etc.)
├─ constants/theme.ts      # tokens de cor, tipografia e espaçamento
└─ game/
   ├─ data/                # geradores, upgrades, eventos, tiers do lab
   ├─ lib/                 # fórmulas (custo, EPS, formatação)
   ├─ hooks/               # loop do jogo
   ├─ store/               # estado (Zustand)
   └─ components/          # Poção, Roda, Sigil/ItemIcon, cards, lab, eventos

docs/                      # documentação de design e implementação
└─ mockups/                # referências visuais (comparação lado a lado)
```

## 🎮 Economia (visão geral)

- **Moeda:** Essência (toque + produção passiva). **Prestígio:** Quintessência.
- **Custo dos Aparelhos:** `custo_base × 1.15 ^ (quantidade)` — crescimento exponencial comprovado.
- **Transmutações:** multiplicam a produção (×2) de um Aparelho.
- **Prestígio:** `floor((essência_total / 1e12) ^ (1/3))`, cada ponto = +1% de produção global.

## 🗺️ Roadmap

- [x] Loop central, Aparelhos, Grimório, persistência
- [x] Estética: poção viva, Roda da Grande Obra, sistema de ícones
- [x] O Laboratório (compras com presença visual)
- [x] Conjunções Astrais com banner e timer
- [ ] Design de áudio (sons fluidos de toque, compra, conquista; trilha por evento)
- [ ] Sinergias entre Aparelhos
- [ ] Árvore da Quintessência (nós permanentes)

## 🙏 Créditos

Projeto pessoal de **Matheus Chebel**. Tema, balanceamento e direção de arte desenvolvidos com apoio de IA. Ícones por [Tabler Icons](https://tabler.io/icons) (MIT).

---

<div align="center">
<sub>Feito com ⚗️ e paciência de alquimista.</sub>
</div>
