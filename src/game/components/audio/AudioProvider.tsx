import { useEffect, type ReactNode } from 'react';

import { initAudio, isAudioReady, setMuted } from '@/game/audio/audio';
import { useSettingsStore } from '@/game/store/settingsStore';

/** Inicializa pools de SFX no boot e sincroniza mudo com settings. */
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
    void initAudio().then((ok) => {
      setMuted(!soundEnabled);
      setAudioNativeAvailable(ok && isAudioReady());
    });
  }, [ready, soundEnabled, setAudioNativeAvailable]);

  return children;
}
