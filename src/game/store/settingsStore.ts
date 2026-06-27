import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { setMuted } from '@/game/audio/audio';

const SETTINGS_KEY = 'game_settings_v1';

type SettingsState = {
  soundEnabled: boolean;
  audioNativeAvailable: boolean | null;
  ready: boolean;
  hydrate: () => Promise<void>;
  toggleSound: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  setAudioNativeAvailable: (available: boolean | null) => void;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  soundEnabled: true,
  audioNativeAvailable: null,
  ready: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(SETTINGS_KEY);
      const soundEnabled = raw ? Boolean(JSON.parse(raw).soundEnabled ?? true) : true;
      set({ soundEnabled, ready: true });
      setMuted(!soundEnabled);
    } catch {
      set({ ready: true });
    }
  },

  setSoundEnabled: (soundEnabled) => {
    set({ soundEnabled });
    setMuted(!soundEnabled);
    void AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ soundEnabled }));
  },

  toggleSound: () => {
    get().setSoundEnabled(!get().soundEnabled);
  },

  setAudioNativeAvailable: (audioNativeAvailable) => set({ audioNativeAvailable }),
}));
