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

Você é um alquimista destilando **Essência** (a gota luminosa que escorre da poção). Toque para destilar, invista em **Instrumentos** que geram Essência por segundo, compre **Transmutações** no Grimório, lance **Rituais** ativos e, quando o crescimento desacelerar, realize a **Magnum Opus** (prestígio) para recomeçar mais forte — avançando pelas quatro fases clássicas da Grande Obra: **Nigredo → Albedo → Citrinitas → Rubedo**, cada uma com sua própria paleta.

## ✨ Funcionalidades

- 🧪 **Destilar com o toque** — feedback tátil, animação, número flutuante e som orgânico (tom variando a cada clique).
- ⚙️ **14 Instrumentos** geradores (da curva Alambique → Olho do Cosmos), com desbloqueio progressivo e curva de custo exponencial balanceada.
- 📖 **Grimório** — abas Instrumentos, Toque, Magnum e Selos:
  - **Transmutações** (×2 passivo por Instrumento) e **12 upgrades de Toque** (escala com EPS e quantidade de Instrumentos).
  - **Rituais alquímicos** — habilidades ativas com cooldown (Transmutar, Catalisar, Mão de Midas).
  - **Conquistas** — Selo do Alquimista (+2% produção global cada) e recompensas únicas de Quintessência.
  - **Provações** — desafios opcionais com regras específicas e bônus de Quintessência.
- 🔮 **Magnum Opus** — prestígio com Quintessência, **Roda da Grande Obra** e múltiplas fontes de Quintessência (prestígio, conquistas, maestria, marcos de coleção, provações).
- ☄️ **Conjunções Astrais** — eventos com bônus (Frenesi, Toque Dourado, Sorte, Eclipse), banner, timer e efeitos sonoros dedicados.
- 🏺 **Laboratório vivo** — estações por Instrumento com `×N`, nível visual, pips de Transmutação (I–V), animação de revelação na 1ª compra e flash ao subir de tier.
- 🎨 **Ícones distintos** — anel ciano (Instrumento), dourado (Transmutação), arcano (Toque/Ritual); glifos únicos por upgrade.
- 🔊 **Kit de áudio v2** — 6 SFX em `.m4a` pré-carregados (pools round-robin): destilar, comprar, upgrade/ritual, conquista, conjunção e sorte.
- 💾 **Progresso salvo** localmente, com ganho offline e toggle de som persistente.
- 🛠️ **God Mode** (somente `__DEV__`) — painel de dev para testar prestígio e progresso sem grind.
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

Pré-requisitos: **Node.js LTS** e o app **Expo Go** (ou um **dev client** para áudio nativo) no celular.

```bash
# 1. Clonar
git clone https://github.com/MatheusChebel/alquimista-idle.git
cd alquimista-idle

# 2. Instalar dependências
npm install

# 3. Rodar
npx expo start
# ou, com dev client (recomendado para SFX):
npx expo start --dev-client
```

Leia o QR Code com o app Expo Go (Android/iOS), ou pressione `a`/`i` no terminal para abrir num emulador. Os efeitos sonoros exigem um **dev client** com `expo-audio` nativo — no Expo Go o jogo roda, mas o som pode ficar indisponível.

### Scripts úteis
```bash
npx expo start            # ambiente de desenvolvimento
npx tsc --noEmit          # checagem de tipos
npx expo install <pkg>    # adicionar dependência compatível com o SDK
npx expo-doctor@latest    # diagnosticar problemas de versão
```

## 📁 Estrutura

```
assets/sfx/                # efeitos sonoros (.m4a)
src/
├─ app/                    # rotas (expo-router): Poção, Laboratório, Grimório
├─ components/             # UI compartilhada (themed-*, etc.)
├─ constants/theme.ts      # tokens de cor, tipografia e espaçamento
└─ game/
   ├─ audio/               # sounds.ts + gerenciador de SFX (pools)
   ├─ data/                # geradores, upgrades, rituais, conquistas, eventos
   ├─ lib/                 # fórmulas (custo, EPS, formatação, provações)
   ├─ hooks/               # loop do jogo, animações do lab
   ├─ store/               # estado (Zustand)
   └─ components/          # Poção, Roda, Sigil/ItemIcon, lab, rituais, eventos

docs/                      # documentação de design e implementação
└─ mockups/                # referências visuais (comparação lado a lado)
```

## 🎮 Economia (visão geral)

- **Moeda:** Essência (toque + produção passiva). **Prestígio:** Quintessência.
- **Custo dos Instrumentos:** `custo_base × 1.15 ^ (quantidade)` — crescimento exponencial comprovado.
- **Transmutações:** multiplicam a produção (×2) de um Instrumento.
- **Toque:** `base × mults + bônus por Instrumento + % do EPS atual`.
- **Selo do Alquimista:** `1.02 ^ (conquistas desbloqueadas)` de produção global.
- **Prestígio:** `floor((essência_total / 1e12) ^ (1/3))`, cada ponto = +1% de produção global.
- **Quintessência extra:** conquistas, maestria (nível 5), marcos de coleção e provações — fontes únicas que não resetam no prestígio.

## 🗺️ Roadmap

- [x] Loop central, Instrumentos, Grimório, persistência
- [x] Estética: poção viva, Roda da Grande Obra, sistema de ícones
- [x] O Laboratório (estações vivas, níveis, transmutações visíveis)
- [x] Conjunções Astrais com banner e timer
- [x] Rituais, conquistas, provações e fontes extras de Quintessência
- [x] Kit de áudio v2 (6 SFX em m4a, pools pré-carregados)
- [ ] Trilhas de fundo por evento / ambiente
- [ ] Sinergias entre Instrumentos
- [ ] Árvore da Quintessência (nós permanentes — em progresso)

## 🙏 Créditos

Projeto pessoal de **Matheus Chebel**. Tema, balanceamento e direção de arte desenvolvidos com apoio de IA. Ícones por [Tabler Icons](https://tabler.io/icons) (MIT).

**Áudio (Freesound):** "water drop" por beskhu; "bubbles1" por kwahmah_02; "magic wand spell tinkle" por kneekoo; "success jingle" por titankaempfer; "whoosh-1" por infamouslazure; "mysterious sparkle flourish" por driftspeira. Licenças em [freesound.org](https://freesound.org).

---

<div align="center">
<sub>Feito com ⚗️ e paciência de alquimista.</sub>
</div>
