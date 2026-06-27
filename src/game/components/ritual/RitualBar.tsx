import React, { memo, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { BASE, SPACE } from '@/constants/theme';
import { playSfx } from '@/game/audio/audio';
import { RITUALS } from '@/game/data/rituals';
import { ItemIcon } from '@/game/components/Sigil';
import { usePhaseTheme } from '@/game/hooks/usePhaseTheme';
import { gameText } from '@/game/lib/typography';
import { useGameStore } from '@/game/store/gameStore';

function CooldownRing({ progress, size, color }: { progress: number; size: number; color: string }) {
  const r = size / 2 - 2;
  const c = 2 * Math.PI * r;
  const dash = c * Math.max(0, Math.min(1, progress));
  return (
    <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeDasharray={`${dash} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        opacity={0.85}
      />
    </Svg>
  );
}

function RitualButton({ ritualId }: { ritualId: string }) {
  const theme = usePhaseTheme();
  const ritual = RITUALS.find((r) => r.id === ritualId)!;
  const totalEssenceEarned = useGameStore((s) => s.totalEssenceEarned);
  const cooldownEnds = useGameStore((s) => s.ritualCooldowns[ritualId] ?? 0);
  const castRitual = useGameStore((s) => s.castRitual);

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  const unlocked = totalEssenceEarned >= ritual.unlockEssence;
  const onCooldown = cooldownEnds > now;
  const remaining = Math.max(0, cooldownEnds - now);
  const progress = onCooldown ? remaining / ritual.cooldownMs : 0;
  const disabled = !unlocked || onCooldown;
  const size = 52;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={ritual.displayName}
      disabled={disabled}
      onPress={() => {
        if (castRitual(ritualId)) playSfx('comprarUpgrade');
      }}
      style={[styles.btn, disabled && styles.btnDisabled]}>
      <View style={{ width: size, height: size }}>
        <ItemIcon
          id={ritualId}
          kind="ritual"
          phase={theme.phase}
          ritualIconName={ritual.icon}
          size={size}
        />
        {onCooldown ? <CooldownRing progress={progress} size={size} color={BASE.arcane} /> : null}
      </View>
      <Text style={[styles.label, { color: unlocked ? BASE.textPrimary : BASE.textFaint }]} numberOfLines={1}>
        {ritual.displayName}
      </Text>
      {onCooldown ? (
        <Text style={styles.cd}>{Math.ceil(remaining / 1000)}s</Text>
      ) : !unlocked ? (
        <Text style={styles.cd}>🔒</Text>
      ) : null}
    </Pressable>
  );
}

export const RitualBar = memo(function RitualBar() {
  const visible = useMemo(() => RITUALS, []);

  return (
    <View style={styles.wrap}>
      <Text style={[gameText.labelSmall, styles.eyebrow, { color: BASE.arcane }]}>RITUAIS</Text>
      <View style={styles.row}>
        {visible.map((r) => (
          <RitualButton key={r.id} ritualId={r.id} />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: SPACE.lg,
    gap: SPACE.sm,
    alignItems: 'center',
  },
  eyebrow: {
    letterSpacing: 1.2,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    gap: SPACE.md,
    justifyContent: 'center',
  },
  btn: {
    alignItems: 'center',
    gap: 4,
    minWidth: 64,
  },
  btnDisabled: {
    opacity: 0.55,
  },
  label: {
    fontSize: 11,
    fontFamily: 'CormorantGaramond_600SemiBold',
    textAlign: 'center',
  },
  cd: {
    fontSize: 10,
    color: BASE.textMuted,
    fontFamily: 'SpaceGrotesk_500Medium',
  },
});
