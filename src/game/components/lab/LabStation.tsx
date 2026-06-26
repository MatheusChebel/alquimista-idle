import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconLock } from '@tabler/icons-react-native';

import { BASE, RADIUS, type Phase } from '@/constants/theme';
import { ItemIcon } from '@/game/components/Sigil';
import { StationShelf } from '@/game/components/lab/StationShelf';
import { visualTier, tierTint } from '@/game/data/labTiers';

export const LabStation = React.memo(function LabStation({
  id,
  name,
  owned,
  epsLabel,
  phase,
  animated,
}: {
  id: string;
  name: string;
  owned: number;
  epsLabel: string;
  phase: Phase;
  animated: boolean;
}) {
  const tier = visualTier(owned);
  const tint = tierTint(tier, phase);
  const goldBadge = tier >= 4;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ItemIcon id={id} ringColor={tint} size={30} />
        <Text style={styles.name} numberOfLines={1}>
          {name} <Text style={styles.count}>×{owned}</Text>
        </Text>
        <View style={[styles.badge, goldBadge ? styles.badgeGold : styles.badgeMuted]}>
          <Text style={[styles.badgeTxt, { color: goldBadge ? BASE.goldInk : BASE.textMuted }]}>
            NÍVEL {tier}
          </Text>
        </View>
      </View>
      <StationShelf id={id} owned={owned} tint={tint} animated={animated} />
      <Text style={styles.eps}>{epsLabel}</Text>
    </View>
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
    paddingVertical: 10,
    paddingHorizontal: 11,
    marginBottom: 9,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  name: { flex: 1, fontSize: 14, color: BASE.textPrimary, fontFamily: 'CormorantGaramond_600SemiBold' },
  count: { fontSize: 12, color: BASE.textMuted, fontFamily: 'SpaceGrotesk_500Medium' },
  badge: { borderRadius: 6, paddingVertical: 2, paddingHorizontal: 7 },
  badgeGold: { backgroundColor: BASE.gold },
  badgeMuted: { backgroundColor: BASE.bgElevated },
  badgeTxt: { fontSize: 10, letterSpacing: 0.5, fontFamily: 'SpaceGrotesk_500Medium' },
  eps: {
    marginTop: 6,
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
