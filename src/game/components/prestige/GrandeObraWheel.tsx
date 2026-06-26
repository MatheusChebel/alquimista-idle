import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  BASE,
  getPhaseForQuintessence,
  PHASE_DISPLAY_NAMES,
  PHASE_MILESTONES,
  type Phase,
} from '@/constants/theme';
import { GreatWorkWheel } from '@/game/components/GreatWorkWheel';
import { usePhaseTheme } from '@/game/hooks/usePhaseTheme';
import { formatNumber } from '@/game/lib/formulas';
import { gameText } from '@/game/lib/typography';
import { useGameStore } from '@/game/store/gameStore';

const PHASE_ORDER: Phase[] = ['nigredo', 'albedo', 'citrinitas', 'rubedo'];

type GrandeObraWheelProps = {
  size?: number;
  showCenter?: boolean;
  onPress?: () => void;
};

export const GrandeObraWheel = memo(function GrandeObraWheel({
  size = 44,
  showCenter = false,
  onPress,
}: GrandeObraWheelProps) {
  const theme = usePhaseTheme();
  const quintessenceEarned = useGameStore((s) => s.quintessenceEarned);
  const quintessence = useGameStore((s) => s.quintessence);

  const currentPhase = getPhaseForQuintessence(quintessenceEarned);
  const currentIdx = PHASE_ORDER.indexOf(currentPhase);

  let progress = 0;
  let nextPhase: Phase | null = 'albedo';

  if (quintessenceEarned >= PHASE_MILESTONES.rubedo) {
    progress = 1;
    nextPhase = null;
  } else if (quintessenceEarned >= PHASE_MILESTONES.citrinitas) {
    nextPhase = 'rubedo';
    progress =
      (quintessenceEarned - PHASE_MILESTONES.citrinitas) /
      (PHASE_MILESTONES.rubedo - PHASE_MILESTONES.citrinitas);
  } else if (quintessenceEarned >= PHASE_MILESTONES.albedo) {
    nextPhase = 'citrinitas';
    progress =
      (quintessenceEarned - PHASE_MILESTONES.albedo) /
      (PHASE_MILESTONES.citrinitas - PHASE_MILESTONES.albedo);
  } else {
    nextPhase = 'albedo';
    progress = quintessenceEarned / PHASE_MILESTONES.albedo;
  }

  progress = Math.min(1, Math.max(0, progress));

  const ring = <GreatWorkWheel size={size} current={currentIdx} />;

  const center = showCenter ? (
    <View style={styles.centerBlock}>
      <Text style={[gameText.generatorName, { color: theme.accent, fontSize: size > 80 ? 22 : 14 }]}>
        {PHASE_DISPLAY_NAMES[currentPhase]}
      </Text>
      <Text style={[gameText.labelSmall, { color: BASE.textMuted, textTransform: 'none' }]}>
        Quintessência · {formatNumber(quintessence)} ✦
      </Text>
      {nextPhase ? (
        <Text style={[gameText.flavor, { color: BASE.textFaint, fontSize: 13 }]}>
          {Math.round(progress * 100)}% rumo a {PHASE_DISPLAY_NAMES[nextPhase]}
        </Text>
      ) : (
        <Text style={[gameText.flavor, { color: BASE.textFaint, fontSize: 13 }]}>Obra completa</Text>
      )}
    </View>
  ) : null;

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Abrir Magnum Opus"
        onPress={onPress}
        style={showCenter ? styles.largeWrap : styles.hudWrap}>
        {showCenter ? (
          <View style={styles.largeInner}>
            <View style={{ width: size, height: size }}>{ring}</View>
            {center}
          </View>
        ) : (
          ring
        )}
      </Pressable>
    );
  }

  if (showCenter) {
    return (
      <View style={styles.largeInner}>
        <View style={{ width: size, height: size }}>{ring}</View>
        {center}
      </View>
    );
  }

  return ring;
});

const styles = StyleSheet.create({
  hudWrap: {
    padding: 2,
  },
  largeWrap: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  largeInner: {
    alignItems: 'center',
    gap: 12,
  },
  centerBlock: {
    alignItems: 'center',
    gap: 4,
  },
});
