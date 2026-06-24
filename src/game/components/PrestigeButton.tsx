import { Alert, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import {
  PRESTIGE_GOLD_THRESHOLD,
  calculatePrestigeReward,
  canPrestige,
} from '@/game/constants/prestige';
import { useGameStore } from '@/game/store/gameStore';
import { formatGold } from '@/game/utils/formatGold';

export function PrestigeButton() {
  const gold = useGameStore((state) => state.gold);
  const prestige = useGameStore((state) => state.prestige);
  const isAvailable = canPrestige(gold);

  if (!isAvailable) {
    return (
      <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
        Prestígio desbloqueia em {formatGold(PRESTIGE_GOLD_THRESHOLD)} ouro
      </ThemedText>
    );
  }

  const reward = calculatePrestigeReward(gold);

  const handlePress = () => {
    Alert.alert(
      'Reiniciar com Prestígio',
      `Você ganhará ${reward} ponto(s) de prestígio (+25% permanente cada).\n\nSeu ouro e upgrades serão resetados.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Transmutar Alma',
          style: 'destructive',
          onPress: () => prestige(),
        },
      ],
    );
  };

  return (
    <Pressable accessibilityRole="button" onPress={handlePress} style={styles.button}>
      <ThemedText type="smallBold" style={styles.buttonText}>
        ✨ Prestígio (+{reward} pts)
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hint: {
    textAlign: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#6B3FA0',
    borderRadius: 999,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    marginBottom: Spacing.three,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  buttonText: {
    color: '#F5E6B8',
  },
});
