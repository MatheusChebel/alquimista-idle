import { Pressable, StyleSheet } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons/static';

import { BASE } from '@/constants/theme';
import { useSettingsStore } from '@/game/store/settingsStore';

type SoundToggleProps = {
  color?: string;
};

/** Toggle de mudo acessível no HUD (seção 12). */
export function SoundToggle({ color = BASE.textMuted }: SoundToggleProps) {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);
  const audioReady = useSettingsStore((s) => s.audioNativeAvailable);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        audioReady === false
          ? 'Som indisponível — recompile o dev client'
          : soundEnabled
            ? 'Desativar som'
            : 'Ativar som'
      }
      onPress={toggleSound}
      hitSlop={8}
      style={[styles.hit, audioReady === false && styles.unavailable]}>
      <MaterialDesignIcons
        name={(soundEnabled && audioReady !== false ? 'volume-high' : 'volume-off') as never}
        size={22}
        color={audioReady === false ? BASE.textFaint : soundEnabled ? color : BASE.textFaint}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    padding: 4,
  },
  unavailable: {
    opacity: 0.55,
  },
});
