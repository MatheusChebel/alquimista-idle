import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BASE, Radius, Spacing } from '@/constants/theme';
import { GENERATORS } from '@/game/data/generators';
import { AffordablePulse } from '@/game/components/effects/AffordablePulse';
import { ItemIcon } from '@/game/components/icons/ItemIcon';
import { useGenMultipliers } from '@/game/hooks/useGameStats';
import { usePhaseTheme } from '@/game/hooks/usePhaseTheme';
import { useThrottledAffordable } from '@/game/hooks/useThrottledAffordable';
import {
  generatorTeaserHint,
  isGeneratorTeaser,
} from '@/game/lib/progressiveUnlock';
import { formatNumber, nextCost } from '@/game/lib/formulas';
import { hapticPurchase } from '@/game/lib/haptics';
import { gameText } from '@/game/lib/typography';
import { useGameStore } from '@/game/store/gameStore';

type GeneratorRowProps = {
  generatorId: string;
  compact?: boolean;
};

export const GeneratorRow = memo(function GeneratorRow({ generatorId, compact = false }: GeneratorRowProps) {
  const theme = usePhaseTheme();
  const generator = GENERATORS.find((item) => item.id === generatorId);
  const owned = useGameStore((state) => state.owned[generatorId] ?? 0);
  const ownedAll = useGameStore((state) => state.owned);
  const cost = nextCost(generator?.baseCost ?? 0, owned);
  const canAfford = useThrottledAffordable(cost);
  const genMultipliers = useGenMultipliers();

  if (!generator) return null;

  const locked = isGeneratorTeaser(generatorId, ownedAll);
  const multiplier = genMultipliers[generatorId] ?? 1;
  const perUnit = generator.baseEps * multiplier;

  const handleBuy = () => {
    if (!canAfford || locked) return;
    hapticPurchase();
    useGameStore.getState().buyGenerator(generatorId);
  };

  if (locked) {
    return (
      <View
        style={[
          styles.row,
          styles.locked,
          compact && styles.lockedCompact,
          { backgroundColor: BASE.bgSurface, borderRadius: Radius.card },
        ]}>
        <ItemIcon id={generatorId} color={theme.essence} accentColor={theme.accent} size={compact ? 36 : 44} />
        <View style={[styles.info, compact && styles.infoCompact]}>
          <Text style={[gameText.generatorName, { color: BASE.textFaint, fontSize: compact ? 14 : 18 }]} numberOfLines={1}>
            {generator.displayName}
          </Text>
          {!compact ? (
            <Text style={[gameText.flavor, { color: BASE.textFaint }]}>🔒 {generatorTeaserHint(generatorId)}</Text>
          ) : null}
        </View>
      </View>
    );
  }

  if (compact) {
    return (
      <AffordablePulse
        active={canAfford}
        style={[styles.row, { backgroundColor: BASE.bgSurface, borderRadius: Radius.card }]}>
        <Pressable
          accessibilityRole="button"
          disabled={!canAfford}
          onPress={handleBuy}
          style={styles.compactPress}>
          <ItemIcon id={generatorId} color={theme.essence} accentColor={theme.accent} size={36} />
          <Text style={[gameText.generatorName, styles.compactName, { color: BASE.textPrimary }]} numberOfLines={2}>
            {generator.displayName}
          </Text>
          <Text style={[gameText.labelSmall, { color: BASE.textMuted, textTransform: 'none', fontSize: 11 }]}>
            ×{owned} · +{formatNumber(perUnit)}/s
          </Text>
          <Text style={[gameText.cost, { color: canAfford ? BASE.gold : BASE.danger, fontSize: 13 }]}>
            ✦ {formatNumber(cost)}
          </Text>
        </Pressable>
      </AffordablePulse>
    );
  }

  return (
    <AffordablePulse
      active={canAfford}
      style={[
        styles.row,
        {
          backgroundColor: BASE.bgSurface,
          borderRadius: Radius.card,
        },
      ]}>
      <Pressable
        accessibilityRole="button"
        disabled={!canAfford}
        onPress={handleBuy}
        style={styles.press}>
        <ItemIcon id={generatorId} color={theme.essence} accentColor={theme.accent} size={44} />
        <View style={styles.info}>
          <Text style={[gameText.generatorName, { color: BASE.textPrimary }]} numberOfLines={1}>
            {generator.displayName}
            <Text style={[gameText.cost, { color: BASE.textMuted, fontSize: 15 }]}> ×{owned}</Text>
          </Text>
          <Text style={[gameText.labelSmall, { color: BASE.textMuted, textTransform: 'none', fontSize: 12 }]}>
            +{formatNumber(perUnit)} /seg cada
          </Text>
        </View>
        <View style={[styles.costPill, { borderColor: canAfford ? BASE.gold : BASE.borderHair }]}>
          <Text style={[gameText.cost, { color: canAfford ? BASE.gold : BASE.danger, fontSize: 14 }]}>
            ✦ {formatNumber(cost)}
          </Text>
        </View>
      </Pressable>
    </AffordablePulse>
  );
});

const styles = StyleSheet.create({
  row: {
    overflow: 'hidden',
  },
  press: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  compactPress: {
    alignItems: 'center',
    gap: 4,
    padding: Spacing.two,
    minHeight: 132,
    justifyContent: 'center',
  },
  compactName: {
    fontSize: 14,
    textAlign: 'center',
  },
  locked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    opacity: 0.4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BASE.borderHair,
  },
  lockedCompact: {
    flexDirection: 'column',
    padding: Spacing.two,
    minHeight: 110,
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  infoCompact: {
    alignItems: 'center',
  },
  costPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
