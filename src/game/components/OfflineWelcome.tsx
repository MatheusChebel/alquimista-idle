import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { BASE, Radius, Spacing, tabularNums } from '@/constants/theme';
import { usePhaseTheme } from '@/game/hooks/usePhaseTheme';
import { formatNumber } from '@/game/lib/formulas';
import { gameText } from '@/game/lib/typography';

type OfflineWelcomeProps = {
  essenceGained: number;
  secondsAway: number;
  onDismiss: () => void;
};

/** Modal de boas-vindas com ganho offline (Fase 1 — persistência). */
export function OfflineWelcome({ essenceGained, secondsAway, onDismiss }: OfflineWelcomeProps) {
  const theme = usePhaseTheme();

  if (essenceGained <= 0) return null;

  const minutes = Math.max(1, Math.round(secondsAway / 60));

  return (
    <Modal animationType="fade" transparent visible onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: BASE.bgSurface, borderColor: theme.accent }]}>
          <Text style={[gameText.tabTitle, { color: theme.accent, fontSize: 18 }]}>BEM-VINDO DE VOLTA</Text>
          <Text style={[gameText.flavor, { color: BASE.textMuted, textAlign: 'center' }]}>
            O laboratório trabalhou por ~{minutes} min enquanto você estava fora.
          </Text>
          <Text style={[gameText.essenceHero, tabularNums, { color: theme.essence, fontSize: 32 }]}>
            +✦ {formatNumber(essenceGained)}
          </Text>
          <Pressable
            onPress={onDismiss}
            style={[styles.button, { borderColor: theme.glow, backgroundColor: BASE.bgElevated }]}>
            <Text style={[gameText.cost, { color: theme.accent }]}>Continuar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    padding: Spacing.three,
  },
  card: {
    borderRadius: Radius.card,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
    alignItems: 'center',
  },
  button: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.two,
  },
});
