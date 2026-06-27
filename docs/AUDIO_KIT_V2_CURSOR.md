# Kit de Áudio — implementação definitiva (com os seus arquivos)

> Documento para o Cursor seguir **à risca**. Os 6 sons já foram **preparados** (convertidos
> para `.m4a`, leves e compatíveis com Android; o "bubbles" foi cortado para 0,8s). Stack:
> **expo-audio** (já instalado), Expo SDK 56.

---

## 0. Os arquivos (já prontos — só colocar na pasta)

Baixe os 6 `.m4a` que vieram junto deste documento e coloque em **`assets/sfx/`**:

| Arquivo final | Origem (Freesound) | Momento no jogo | Duração |
|---|---|---|---|
| `destilar.m4a` | water-drop (beskhu) | **toque na poção** | 0,38s |
| `comprar-instrumento.m4a` | bubbles (kwahmah_02) | **comprar Instrumento** | 0,80s |
| `comprar-upgrade.m4a` | magic wand tinkle (kneekoo) | **comprar Transmutação** + **lançar Ritual** | 2,0s |
| `conquista.m4a` | success jingle (titankaempfer) | **desbloquear Conquista** + **Magnum Opus** | 6,85s |
| `conjuncao.m4a` | whoosh (infamouslazure) | **coletar Conjunção** (início do evento) | 1,96s |
| `sorte.m4a` | sparkle flourish (driftspeira) | **evento Sorte** + tier-up no Laboratório | 3,95s |

> Não há trilha de fundo de evento (Frenesi/Toque Dourado/Eclipse) — só efeitos. Os eventos ainda terão som: `conjuncao` ao iniciar e `sorte` no evento de Sorte. Quando você tiver loops de música, peça que eu adiciono.
> Opcional: o `conquista.m4a` tem 6,85s; se quiser mais ágil, corte para ~2,5s.

---

## 1. Config dos sons — `src/game/audio/sounds.ts`
```ts
export const SFX = {
  destilar:           { src: require("../../../assets/sfx/destilar.m4a"),           volume: 0.70, pitchVar: 0.06, pool: 4 },
  comprarInstrumento: { src: require("../../../assets/sfx/comprar-instrumento.m4a"), volume: 0.80, pitchVar: 0.04, pool: 3 },
  comprarUpgrade:     { src: require("../../../assets/sfx/comprar-upgrade.m4a"),     volume: 0.80, pitchVar: 0.0,  pool: 2 },
  conquista:          { src: require("../../../assets/sfx/conquista.m4a"),           volume: 0.85, pitchVar: 0.0,  pool: 1 },
  conjuncao:          { src: require("../../../assets/sfx/conjuncao.m4a"),           volume: 0.80, pitchVar: 0.0,  pool: 2 },
  sorte:              { src: require("../../../assets/sfx/sorte.m4a"),               volume: 0.85, pitchVar: 0.0,  pool: 1 },
} as const;
export type SfxId = keyof typeof SFX;
// pitchVar = variação aleatória de tom (±). pool = instâncias pré-criadas p/ sobrepor sem cortar.
```
> **O segredo do clique não-mecânico:** `pitchVar: 0.06` no `destilar` → cada toque sai com o tom levemente diferente. É isso que tira a sensação robótica.

---

## 2. Gerenciador — `src/game/audio/audio.ts`
Pré-carrega tudo uma vez (nunca cria player no toque), aplica o pitch aleatório, limita instâncias e respeita o mudo/silencioso.
```ts
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from "expo-audio";
import { SFX, type SfxId } from "./sounds";

let muted = false;
const pools: Partial<Record<SfxId, { players: AudioPlayer[]; next: number }>> = {};

/** Chame UMA vez no boot do app (ex.: em src/app/_layout.tsx). */
export async function initAudio() {
  await setAudioModeAsync({ playsInSilentMode: false }); // respeita o silencioso do aparelho
  (Object.keys(SFX) as SfxId[]).forEach((id) => {
    const cfg = SFX[id];
    const players = Array.from({ length: cfg.pool }, () => {
      const p = createAudioPlayer(cfg.src);
      p.volume = cfg.volume;
      p.shouldCorrectPitch = false; // deixa o tom variar junto com o rate
      return p;
    });
    pools[id] = { players, next: 0 };
  });
}

export function setMuted(v: boolean) { muted = v; }
export function isMuted() { return muted; }

/** Toca um efeito curto, com pitch aleatório, sem cortar o anterior (pool round-robin). */
export function playSfx(id: SfxId) {
  if (muted) return;
  const pool = pools[id];
  if (!pool) return;
  const cfg = SFX[id];
  const p = pool.players[pool.next];
  pool.next = (pool.next + 1) % pool.players.length;
  try {
    if (cfg.pitchVar > 0) {
      p.setPlaybackRate(1 + (Math.random() * 2 - 1) * cfg.pitchVar); // ±pitchVar
    }
    p.seekTo(0);
    p.play();
  } catch {}
}
```
> Confira na doc do `expo-audio` v56 (seu `AGENTS.md` manda) os nomes exatos: `createAudioPlayer`, `setPlaybackRate`, `shouldCorrectPitch`, `setAudioModeAsync({ playsInSilentMode })`.

---

## 3. Onde disparar cada som (wiring — definitivo)

```ts
// (0) Boot — uma vez, em src/app/_layout.tsx
import { initAudio } from "../game/audio/audio";
useEffect(() => { initAudio(); }, []);

// (1) Toque na poção
import { playSfx } from "../game/audio/audio";
const onTapDestilar = () => { store.click(); playSfx("destilar"); };

// (2) Comprar Instrumento
const onBuyInstrument = (id) => { if (store.buyGenerator(id)) playSfx("comprarInstrumento"); };

// (3) Comprar Transmutação (upgrade único) e lançar Ritual — mesmo som mágico
const onBuyUpgrade = (id) => { if (store.buyUpgrade(id)) playSfx("comprarUpgrade"); };
const onCastRitual = (id) => { if (store.castRitual(id)) playSfx("comprarUpgrade"); };

// (4) Conquista desbloqueada e Magnum Opus concluída — jingle de vitória
const onAchievementUnlocked = () => playSfx("conquista");
const onMagnumOpus = () => { store.prestige(); playSfx("conquista"); };

// (5) Coletar a Conjunção (início do evento) — whoosh
const onCollectConjunction = () => { /* aplica evento */ playSfx("conjuncao"); };

// (6) Evento Sorte (instantâneo) — sparkle
const onLucky = () => { /* aplica ganho */ playSfx("sorte"); };
// (opcional) tier-up de estação no Laboratório também pode tocar "sorte".
```

---

## 4. Botão de mudo + persistência
```ts
// no store: muted: boolean
// const toggleMute = () => { const v = !store.muted; setMuted(v); store.setMuted(v); };
// Persista `muted` junto com o save. Ao carregar o save, chame setMuted(saved.muted).
```
- Coloque um ícone de mudo acessível (HUD ou settings). `IconVolume` / `IconVolumeOff` (Tabler).

---

## 5. Desempenho
- Players são **pré-criados** no `initAudio` → zero alocação no toque.
- Pools pequenos (clique 4, resto 1–3) → sobrepõe sem cortar e sem gastar memória.
- Sem música de fundo agora → custo de áudio é mínimo.
- Em **modo calmo/bateria** você pode chamar `setMuted(true)` automaticamente, se quiser.

---

## 6. Créditos e licença (verifique antes de publicar)
Os sons vêm do **Freesound**. Cada som tem sua licença (CC0 = sem crédito; **CC-BY = crédito obrigatório**). Abra cada página e confira:

| Som | Autor | Página |
|---|---|---|
| water drop | beskhu | freesound.org/s/273870/ |
| bubbles1 | kwahmah_02 | freesound.org/s/264097/ |
| magic wand spell tinkle | kneekoo | freesound.org/s/548497/ |
| success jingle | titankaempfer | freesound.org/s/689903/ |
| whoosh-1 | infamouslazure | freesound.org/s/688989/ |
| mysterious sparkle flourish | driftspeira | freesound.org/s/844398/ |

Se algum for **CC-BY**, adicione um bloco no `README` (e/ou numa tela de Créditos no app):
```
Áudio (Freesound): "water drop" por beskhu; "bubbles1" por kwahmah_02;
"magic wand spell tinkle" por kneekoo; "success jingle" por titankaempfer;
"whoosh-1" por infamouslazure; "mysterious sparkle flourish" por driftspeira.
Licenças em freesound.org.
```

---

## 7. Checklist
- [ ] Colocar os 6 `.m4a` em `assets/sfx/`.
- [ ] Criar `sounds.ts` e `audio.ts` (código acima).
- [ ] Chamar `initAudio()` no boot.
- [ ] Ligar `playSfx` nos 6 momentos (toque, comprar Instrumento, Transmutação/Ritual, Conquista/Magnum Opus, Conjunção, Sorte).
- [ ] Botão de mudo + persistir `muted`.
- [ ] Testar no Android: clique soa orgânico (pitch variando); compras e conquista com sons distintos.
- [ ] Conferir licenças no Freesound e creditar se necessário.
