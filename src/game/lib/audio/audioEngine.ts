import { Platform } from 'react-native';

import { hasExpoAudioNative } from '@/game/lib/audio/audioNative';

type AudioImpl = typeof import('@/game/lib/audio/audioEngineImpl');

let muted = false;
let available: boolean | null = null;
let initPromise: Promise<void> | null = null;
let impl: AudioImpl | null = null;
let warnedUnavailable = false;

async function ensureImpl(): Promise<AudioImpl | null> {
  if (Platform.OS === 'web') return null;
  if (available === false) return null;
  if (impl) return impl;

  if (!initPromise) {
    initPromise = (async () => {
      if (!hasExpoAudioNative()) {
        available = false;
        impl = null;
        if (__DEV__ && !warnedUnavailable) {
          warnedUnavailable = true;
          console.warn(
            '[audio] ExpoAudio nativo indisponível — instale o dev client mais recente (EAS build) para ativar o som.',
          );
        }
        return;
      }

      try {
        const module = await import('@/game/lib/audio/audioEngineImpl');
        await module.bootstrap();
        impl = module;
        available = true;
        module.setMuted(muted);
      } catch (error) {
        available = false;
        impl = null;
        if (__DEV__) {
          console.warn('[audio] Falha ao iniciar expo-audio:', error);
        }
      }
    })();
  }

  await initPromise;
  return impl;
}

/** `true` quando o dev client tem expo-audio; `false` se indisponível; `null` antes do boot. */
export function isAudioAvailable(): boolean | null {
  return available;
}

export function setAudioMuted(value: boolean) {
  muted = value;
  impl?.setMuted(value);
}

export async function initAudioEngine() {
  await ensureImpl();
}

export function pauseAmbient() {
  impl?.pauseAmbient();
}

export function resumeAmbient() {
  impl?.resumeAmbient();
}

export function playPlink() {
  void ensureImpl().then((m) => m?.playPlink());
}

export function playShimmer() {
  void ensureImpl().then((m) => m?.playShimmer());
}

export function playChime() {
  void ensureImpl().then((m) => m?.playChime());
}

export function playWhoosh() {
  void ensureImpl().then((m) => m?.playWhoosh());
}
