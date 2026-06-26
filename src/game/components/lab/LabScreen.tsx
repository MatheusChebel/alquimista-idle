import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useIsFocused } from 'expo-router';

import { BASE, SPACE, type Phase } from '@/constants/theme';
import { LabStation, LockedStation } from '@/game/components/lab/LabStation';
import { GENERATORS } from '@/game/data/generators';
import { useCalmMode } from '@/game/hooks/useCalmMode';
import { useGenMultipliers } from '@/game/hooks/useGameStats';
import { usePhaseTheme } from '@/game/hooks/usePhaseTheme';
import { getGlobalMult } from '@/game/lib/economy';
import { formatNumber } from '@/game/lib/formulas';
import { gameText } from '@/game/lib/typography';
import { useGameStore } from '@/game/store/gameStore';

function getNextLockedGenerator(owned: Record<string, number>) {
  for (let i = 1; i < GENERATORS.length; i++) {
    const gen = GENERATORS[i];
    if ((owned[gen.id] ?? 0) > 0) continue;
    const prev = GENERATORS[i - 1];
    if ((owned[prev.id] ?? 0) > 0) return gen;
    return null;
  }
  return null;
}

export const LabScreen = memo(function LabScreen() {
  const focused = useIsFocused();
  const calm = useCalmMode();
  const theme = usePhaseTheme();
  const phase = theme.phase as Phase;

  const owned = useGameStore((s) => s.owned);
  const unlockedAchievements = useGameStore((s) => s.unlockedAchievements);
  const activeEffects = useGameStore((s) => s.activeEffects);
  const prestigePoints = useGameStore((s) => s.prestigePoints);
  const genMultipliers = useGenMultipliers();

  const animated = focused && !calm;

  const globalMult = useMemo(
    () => getGlobalMult(unlockedAchievements, activeEffects, prestigePoints),
    [unlockedAchievements, activeEffects, prestigePoints],
  );

  const stations = useMemo(
    () => GENERATORS.filter((g) => (owned[g.id] ?? 0) > 0),
    [owned],
  );

  const nextLocked = useMemo(() => getNextLockedGenerator(owned), [owned]);

  if (stations.length === 0 && !nextLocked) return null;

  return (
    <View style={styles.wrap}>
      <Text style={[gameText.labelSmall, styles.eyebrow, { color: BASE.textMuted }]}>LABORATÓRIO</Text>
      {stations.map((gen) => {
        const count = owned[gen.id] ?? 0;
        const mult = genMultipliers[gen.id] ?? 1;
        const eps = count * gen.baseEps * mult * globalMult;
        return (
          <LabStation
            key={gen.id}
            id={gen.id}
            name={gen.displayName}
            owned={count}
            epsLabel={`+${formatNumber(eps)} /seg`}
            phase={phase}
            animated={animated}
          />
        );
      })}
      {nextLocked ? (
        <LockedStation hint={`${nextLocked.displayName} — compre 1 para revelar a estação`} />
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: SPACE.lg,
    gap: 0,
  },
  eyebrow: {
    letterSpacing: 1.2,
    marginBottom: SPACE.sm,
    textTransform: 'uppercase',
  },
});
