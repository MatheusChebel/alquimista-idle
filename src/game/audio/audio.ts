import { Platform } from 'react-native';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

import { hasExpoAudioNative } from '@/game/lib/audio/audioNative';

import { SFX, type SfxId } from './sounds';

let muted = false;
let ready = false;
const pools: Partial<Record<SfxId, { players: AudioPlayer[]; next: number }>> = {};

/** Chame uma vez no boot do app (AudioProvider / _layout). */
export async function initAudio(): Promise<boolean> {
  if (Platform.OS === 'web' || !hasExpoAudioNative()) {
    ready = false;
    return false;
  }

  if (ready) return true;

  try {
    await setAudioModeAsync({ playsInSilentMode: false });

    (Object.keys(SFX) as SfxId[]).forEach((id) => {
      const cfg = SFX[id];
      const players = Array.from({ length: cfg.pool }, () => {
        const p = createAudioPlayer(cfg.src);
        p.volume = cfg.volume;
        p.shouldCorrectPitch = false;
        return p;
      });
      pools[id] = { players, next: 0 };
    });

    ready = true;
    return true;
  } catch {
    ready = false;
    return false;
  }
}

export function isAudioReady(): boolean {
  return ready;
}

export function setMuted(v: boolean) {
  muted = v;
}

export function isMuted(): boolean {
  return muted;
}

/** Toca um efeito curto, com pitch aleatório, sem cortar o anterior (pool round-robin). */
export function playSfx(id: SfxId) {
  if (muted || !ready) return;
  const pool = pools[id];
  if (!pool) return;
  const cfg = SFX[id];
  const p = pool.players[pool.next];
  pool.next = (pool.next + 1) % pool.players.length;
  try {
    if (cfg.pitchVar > 0) {
      p.setPlaybackRate(1 + (Math.random() * 2 - 1) * cfg.pitchVar);
    }
    p.seekTo(0);
    p.play();
  } catch {
    // player indisponível — ignora
  }
}
