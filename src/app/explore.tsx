import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BASE, BottomTabInset, Spacing } from '@/constants/theme';
import { ACHIEVEMENTS } from '@/game/data/achievements';
import { AchievementList } from '@/game/components/achievements/AchievementList';
import { TrialList } from '@/game/components/trials/TrialList';
import { GeneratorList } from '@/game/components/GeneratorList';
import { GrandeObraWheel } from '@/game/components/prestige/GrandeObraWheel';
import { ClickUpgradeList, TransmutationList } from '@/game/components/UpgradeList';
import { ParchmentOverlay } from '@/game/components/effects/ParchmentOverlay';
import { GrimorioOrnament } from '@/game/components/icons/GrimorioOrnament';
import { SegmentedControl } from '@/game/components/ui/SegmentedControl';
import { useClickValue, useGameEps, useSealMult } from '@/game/hooks/useGameStats';
import { usePhaseTheme } from '@/game/hooks/usePhaseTheme';
import { formatNumber } from '@/game/lib/formulas';
import { gameText } from '@/game/lib/typography';
import { useGameStore } from '@/game/store/gameStore';

type GrimorioTab = 'aparelhos' | 'toque' | 'magnum' | 'selos';

const TABS: { value: GrimorioTab; label: string }[] = [
  { value: 'aparelhos', label: 'Instrumentos' },
  { value: 'toque', label: 'Toque' },
  { value: 'magnum', label: 'Magnum' },
  { value: 'selos', label: 'Selos' },
];

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <ThemedText type="small" style={{ color: BASE.textMuted }}>
        {label}
      </ThemedText>
      <Text style={[gameText.cost, { color: BASE.textPrimary, fontSize: 14 }]}>{value}</Text>
    </View>
  );
}

export default function GrimorioScreen() {
  const theme = usePhaseTheme();
  const [tab, setTab] = useState<GrimorioTab>('aparelhos');

  const essence = useGameStore((state) => state.essence);
  const eps = useGameEps();
  const clickValue = useClickValue();
  const sealMult = useSealMult();
  const unlockedCount = useGameStore((s) => Object.keys(s.unlockedAchievements).length);
  const quintessence = useGameStore((s) => s.quintessence);
  const quintessenceEarned = useGameStore((s) => s.quintessenceEarned);
  const prestigePoints = useGameStore((s) => s.prestigePoints);
  const openMagnumOpus = useGameStore((s) => s.openMagnumOpus);

  const eyebrow = useMemo(() => {
    if (tab === 'aparelhos') return 'INSTRUMENTOS — ESSÊNCIA POR SEGUNDO';
    if (tab === 'toque') return 'POR TOQUE';
    if (tab === 'selos') return 'CONQUISTAS DO ALQUIMISTA';
    return 'A GRANDE OBRA';
  }, [tab]);

  const eyebrowColor =
    tab === 'toque' ? BASE.gold : tab === 'selos' ? theme.glow : theme.accent;

  return (
    <ThemedView style={styles.container}>
      <ParchmentOverlay />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.five }]}
          showsVerticalScrollIndicator={false}>
          <Text style={[gameText.tabTitle, styles.title, { color: theme.accent }]}>GRIMÓRIO</Text>
          <GrimorioOrnament width={260} />

          <SegmentedControl
            options={TABS}
            value={tab}
            onChange={(value) => setTab(value as GrimorioTab)}
          />

          <Text style={[gameText.labelSmall, styles.eyebrow, { color: eyebrowColor }]}>{eyebrow}</Text>

          {tab === 'aparelhos' && (
            <View style={[styles.section, { backgroundColor: BASE.bgSurface, borderColor: BASE.borderHair }]}>
              <GeneratorList />
              <TransmutationList />
            </View>
          )}

          {tab === 'toque' && (
            <View style={[styles.section, { backgroundColor: BASE.bgSurface, borderColor: BASE.borderHair }]}>
              <ClickUpgradeList />
            </View>
          )}

          {tab === 'magnum' && (
            <View style={[styles.section, { backgroundColor: BASE.bgSurface, borderColor: BASE.borderHair }]}>
              <GrandeObraWheel size={180} showCenter />
              <View style={styles.statsBlock}>
                <StatRow label="Essência atual" value={`✦ ${formatNumber(essence)}`} />
                <StatRow label="Renda passiva" value={`${formatNumber(eps)}/s`} />
                <StatRow label="Poder de clique" value={formatNumber(clickValue)} />
                <StatRow label="Selo do Alquimista" value={`×${sealMult.toFixed(2)}`} />
                <StatRow label="Conquistas" value={`${unlockedCount}/${ACHIEVEMENTS.length}`} />
                <StatRow label="Quintessência" value={`✦ ${formatNumber(quintessence)}`} />
                <StatRow label="Quintessência total" value={`✦ ${formatNumber(quintessenceEarned)}`} />
                <StatRow label="Pontos de prestígio" value={`${prestigePoints}`} />
              </View>
              <Pressable
                onPress={openMagnumOpus}
                style={[styles.magnumLink, { borderColor: theme.accent, backgroundColor: BASE.bgElevated }]}>
                <Text style={[gameText.generatorName, { color: theme.accent }]}>Abrir Magnum Opus</Text>
              </Pressable>
            </View>
          )}

          {tab === 'selos' && (
            <View style={[styles.section, { backgroundColor: BASE.bgSurface, borderColor: BASE.borderHair }]}>
              <AchievementList />
              <Text style={[gameText.labelSmall, styles.subEyebrow, { color: BASE.arcane }]}>PROVAÇÕES</Text>
              <TrialList />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BASE.bgDeep,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    gap: Spacing.three,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  eyebrow: {
    alignSelf: 'flex-start',
    letterSpacing: 1.4,
    width: '100%',
  },
  subEyebrow: {
    alignSelf: 'flex-start',
    letterSpacing: 1.2,
    width: '100%',
    marginTop: Spacing.two,
  },
  section: {
    width: '100%',
    borderRadius: 14,
    padding: Spacing.three,
    gap: Spacing.two,
    borderWidth: 1,
    shadowColor: BASE.shadowGlow,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  statsBlock: {
    gap: Spacing.two,
    width: '100%',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  magnumLink: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    padding: Spacing.three,
    alignItems: 'center',
  },
});
