import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { GeneratorRow } from '@/game/components/GeneratorRow';
import { TwoColumnGrid } from '@/game/components/ui/TwoColumnGrid';
import { usePhaseTheme } from '@/game/hooks/usePhaseTheme';
import { getProgressiveGenerators } from '@/game/lib/progressiveUnlock';
import { nextCost } from '@/game/lib/formulas';
import { gameText } from '@/game/lib/typography';
import { useGameStore } from '@/game/store/gameStore';

type GeneratorListProps = {
  eyebrow?: string;
};

export const GeneratorList = memo(function GeneratorList({ eyebrow }: GeneratorListProps) {
  const theme = usePhaseTheme();
  const owned = useGameStore((s) => s.owned);
  const essence = useGameStore((s) => s.essence);

  const generators = useMemo(() => {
    const visible = getProgressiveGenerators(owned);
    return [...visible].sort((a, b) => {
      const affordA = essence >= nextCost(a.baseCost, owned[a.id] ?? 0) ? 1 : 0;
      const affordB = essence >= nextCost(b.baseCost, owned[b.id] ?? 0) ? 1 : 0;
      return affordB - affordA;
    });
  }, [essence, owned]);

  const useGrid = generators.length >= 4;

  return (
    <View style={styles.container}>
      {eyebrow ? (
        <Text style={[gameText.labelSmall, styles.eyebrow, { color: theme.accent }]}>{eyebrow}</Text>
      ) : (
        <Text style={[gameText.generatorName, styles.title, { color: theme.accent }]}>Aparelhos</Text>
      )}
      <TwoColumnGrid minItems={4}>
        {generators.map((generator) => (
          <GeneratorRow key={generator.id} generatorId={generator.id} compact={useGrid} />
        ))}
      </TwoColumnGrid>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
    width: '100%',
  },
  title: {
    marginBottom: Spacing.one,
  },
  eyebrow: {
    letterSpacing: 1.4,
    marginBottom: Spacing.one,
  },
});
