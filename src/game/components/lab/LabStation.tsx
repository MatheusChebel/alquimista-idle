import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { IconLock } from '@tabler/icons-react-native';

import { BASE, RADIUS, type Phase } from '@/constants/theme';
import { ItemIcon } from '@/game/components/Sigil';
import { visualTier, tierTint } from '@/game/data/labTiers';
import { useRevealOnUnlock } from '@/game/hooks/useRevealOnUnlock';
import { useStationIdle } from '@/game/hooks/useStationIdle';
import { useTierFlash } from '@/game/hooks/useTierFlash';

const TIERS = ['I', 'II', 'III', 'IV', 'V'] as const;

function TransmutationPips({
  generatorId,
  boughtUpgrades,
}: {
  generatorId: string;
  boughtUpgrades: Record<string, true>;
}) {
  return (
    <View style={styles.pips}>
      {TIERS.map((tier) => {
        const id = `${generatorId}_${tier}`;
        const on = Boolean(boughtUpgrades[id]);
        return (
          <View
            key={tier}
            style={[styles.pip, { backgroundColor: on ? BASE.gold : BASE.bgElevated, opacity: on ? 1 : 0.35 }]}
          />
        );
      })}
    </View>
  );
}

export const LabStation = memo(function LabStation({
  id,
  name,
  owned,
  epsLabel,
  phase,
  animated,
  justUnlocked,
  boughtUpgrades,
}: {
  id: string;
  name: string;
  owned: number;
  epsLabel: string;
  phase: Phase;
  animated: boolean;
  justUnlocked?: boolean;
  boughtUpgrades: Record<string, true>;
}) {
  const tier = visualTier(owned);
  const tint = tierTint(tier, phase);
  const goldBadge = tier >= 4;
  const revealStyle = useRevealOnUnlock(Boolean(justUnlocked));
  const idleStyle = useStationIdle(animated);
  const flashStyle = useTierFlash(tier);

  return (
    <Animated.View style={[styles.card, revealStyle, idleStyle]}>
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.flash, { backgroundColor: tint }, flashStyle]}
      />
      <View style={styles.heroRow}>
        <ItemIcon id={id} kind="instrument" phase={phase} ringColor={tint} size={64} />
        <View style={styles.headerMeta}>
          <View style={styles.header}>
            <Text style={styles.name} numberOfLines={2}>
              {name} <Text style={styles.count}>×{owned}</Text>
            </Text>
            <View style={[styles.badge, goldBadge ? styles.badgeGold : styles.badgeMuted]}>
              <Text style={[styles.badgeTxt, { color: goldBadge ? BASE.goldInk : BASE.textMuted }]}>
                NÍVEL {tier}
              </Text>
            </View>
          </View>
          <TransmutationPips generatorId={id} boughtUpgrades={boughtUpgrades} />
        </View>
      </View>
      <Text style={styles.eps}>{epsLabel}</Text>
    </Animated.View>
  );
});

export function LockedStation({ hint }: { hint: string }) {
  return (
    <View style={[styles.card, styles.locked]}>
      <View style={styles.lockSigil}>
        <IconLock size={15} color={BASE.textFaint} strokeWidth={1.8} />
      </View>
      <Text style={styles.lockTxt}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: BASE.bgSurface,
    borderRadius: RADIUS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BASE.borderHair,
    paddingVertical: 12,
    paddingHorizontal: 11,
    marginBottom: 9,
    overflow: 'hidden',
  },
  flash: {
    borderRadius: RADIUS.card,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  headerMeta: { flex: 1, gap: 6 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  name: { flex: 1, fontSize: 15, color: BASE.textPrimary, fontFamily: 'CormorantGaramond_600SemiBold' },
  count: { fontSize: 12, color: BASE.textMuted, fontFamily: 'SpaceGrotesk_500Medium' },
  badge: { borderRadius: 6, paddingVertical: 2, paddingHorizontal: 7 },
  badgeGold: { backgroundColor: BASE.gold },
  badgeMuted: { backgroundColor: BASE.bgElevated },
  badgeTxt: { fontSize: 10, letterSpacing: 0.5, fontFamily: 'SpaceGrotesk_500Medium' },
  pips: { flexDirection: 'row', gap: 5 },
  pip: { width: 8, height: 8, borderRadius: 4 },
  eps: {
    fontSize: 11,
    color: BASE.textMuted,
    fontFamily: 'SpaceGrotesk_500Medium',
    fontVariant: ['tabular-nums'],
  },
  locked: {
    borderStyle: 'dashed',
    borderColor: '#2A2440',
    backgroundColor: '#140F1F',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    opacity: 0.6,
  },
  lockSigil: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: BASE.bgSurface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#2A2440',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockTxt: { flex: 1, fontSize: 13, color: BASE.textFaint, fontFamily: 'CormorantGaramond_600SemiBold' },
});
