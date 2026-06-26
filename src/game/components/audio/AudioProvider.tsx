import { useEffect, type ReactNode } from 'react';
import { AppState } from 'react-native';

import {
  initAudioEngine,
  isAudioAvailable,
  pauseAmbient,
  resumeAmbient,
  setAudioMuted,
} from '@/game/lib/audio/audioEngine';
import { useSettingsStore } from '@/game/store/settingsStore';

/** Inicializa áudio + drone ambiente (seção 12). */
export function AudioProvider({ children }: { children: ReactNode }) {
  const ready = useSettingsStore((s) => s.ready);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const hydrate = useSettingsStore((s) => s.hydrate);
  const setAudioNativeAvailable = useSettingsStore((s) => s.setAudioNativeAvailable);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!ready) return;
    void initAudioEngine().then(() => {
      setAudioMuted(!soundEnabled);
      setAudioNativeAvailable(isAudioAvailable());
    });
  }, [ready, soundEnabled, setAudioNativeAvailable]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') resumeAmbient();
      else pauseAmbient();
    });
    return () => sub.remove();
  }, []);

  return children;
}
