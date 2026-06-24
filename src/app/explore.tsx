import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { UPGRADES } from '@/game/constants/upgrades';
import { PRESTIGE_GOLD_THRESHOLD, getPrestigeMultiplier } from '@/game/constants/prestige';
import { selectGameStats, useGameStore } from '@/game/store/gameStore';
import { formatGold } from '@/game/utils/formatGold';

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="smallBold">{value}</ThemedText>
    </View>
  );
}

export default function StatsScreen() {
  const totalGoldEarned = useGameStore((state) => state.totalGoldEarned);
  const prestigePoints = useGameStore((state) => state.prestigePoints);
  const upgradeLevels = useGameStore((state) => state.upgradeLevels);
  const stats = useGameStore(selectGameStats);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.five }]}
          showsVerticalScrollIndicator={false}>
          <ThemedText type="subtitle" style={styles.title}>
            Grimório
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
            Estatísticas da sua jornada alquímica
          </ThemedText>

          <View style={styles.section}>
            <ThemedText type="smallBold" style={styles.sectionTitle}>
              Progresso
            </ThemedText>
            <StatRow label="Ouro total gerado" value={`🪙 ${formatGold(totalGoldEarned)}`} />
            <StatRow label="Renda passiva" value={`${formatGold(stats.goldPerSecond)}/s`} />
            <StatRow label="Poder de clique" value={formatGold(stats.clickPower)} />
            <StatRow label="Multiplicador total" value={`x${stats.totalMultiplier.toFixed(2)}`} />
          </View>

          <View style={styles.section}>
            <ThemedText type="smallBold" style={styles.sectionTitle}>
              Prestígio
            </ThemedText>
            <StatRow label="Pontos de prestígio" value={`✨ ${prestigePoints}`} />
            <StatRow
              label="Bônus permanente"
              value={`+${Math.round((getPrestigeMultiplier(prestigePoints) - 1) * 100)}%`}
            />
            <StatRow label="Meta de prestígio" value={formatGold(PRESTIGE_GOLD_THRESHOLD)} />
          </View>

          <View style={styles.section}>
            <ThemedText type="smallBold" style={styles.sectionTitle}>
              Upgrades
            </ThemedText>
            {UPGRADES.map((upgrade) => (
              <StatRow
                key={upgrade.id}
                label={`${upgrade.emoji} ${upgrade.name}`}
                value={`Nv. ${upgradeLevels[upgrade.id]}`}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120A1C',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  title: {
    color: '#D4AF37',
  },
  subtitle: {
    marginTop: -Spacing.two,
  },
  section: {
    backgroundColor: '#241734',
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: '#3A2E4A',
  },
  sectionTitle: {
    color: '#D4AF37',
    marginBottom: Spacing.one,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
});
