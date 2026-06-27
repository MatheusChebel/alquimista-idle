import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BASE, Spacing } from '@/constants/theme';
import { playSfx } from '@/game/audio/audio';
import { usePhaseTheme } from '@/game/hooks/usePhaseTheme';
import { gameText } from '@/game/lib/typography';
import { useGameStore } from '@/game/store/gameStore';

/** Banner curto ao desbloquear conquista (Fase 3 — feedback visual). */
export function AchievementToast() {
  const theme = usePhaseTheme();
  const toast = useGameStore((s) => s.achievementToast);
  const clearAchievementToast = useGameStore((s) => s.clearAchievementToast);

  useEffect(() => {
    if (!toast) return;
    playSfx('conquista');
    const timer = setTimeout(() => clearAchievementToast(), 2800);
    return () => clearTimeout(timer);
  }, [toast, clearAchievementToast]);

  if (!toast) return null;

  return (
    <View pointerEvents="none" style={styles.wrap}>
      <View style={[styles.card, { borderColor: theme.glow, backgroundColor: BASE.bgElevated }]}>
        <Text style={[gameText.labelSmall, { color: BASE.gold, letterSpacing: 1.2 }]}>CONQUISTA</Text>
        <Text style={[gameText.generatorName, { color: BASE.textPrimary, textAlign: 'center' }]}>
          {toast}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 56,
    left: Spacing.three,
    right: Spacing.three,
    zIndex: 200,
    alignItems: 'center',
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    gap: 4,
    alignItems: 'center',
    shadowColor: BASE.shadowGlow,
    shadowOpacity: 0.45,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
