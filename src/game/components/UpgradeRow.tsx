import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BASE, Radius, Spacing } from '@/constants/theme';
import { AffordablePulse } from '@/game/components/effects/AffordablePulse';
import { ItemIcon } from '@/game/components/icons/ItemIcon';
import type { ItemIconKind } from '@/game/components/Sigil';
import { usePhaseTheme } from '@/game/hooks/usePhaseTheme';
import { useThrottledAffordable } from '@/game/hooks/useThrottledAffordable';
import { formatNumber } from '@/game/lib/formulas';
import { hapticPurchase } from '@/game/lib/haptics';
import { gameText } from '@/game/lib/typography';

type UpgradeRowProps = {
  displayName: string;
  description: string;
  cost: number;
  canAfford?: boolean;
  locked?: boolean;
  iconId?: string;
  iconKind?: ItemIconKind;
  category?: 'generator' | 'click' | 'mystic';
  compact?: boolean;
  onBuy: () => void;
};

export const UpgradeRow = memo(function UpgradeRow({
  displayName,
  description,
  cost,
  canAfford: canAffordProp,
  locked = false,
  iconId = 'essence',
  iconKind,
  category = 'click',
  compact = false,
  onBuy,
}: UpgradeRowProps) {
  const theme = usePhaseTheme();
  const throttledAfford = useThrottledAffordable(cost);
  const canAfford = canAffordProp ?? throttledAfford;

  const handleBuy = () => {
    if (!canAfford || locked) return;
    hapticPurchase();
    onBuy();
  };

  if (locked) {
    return (
      <View style={[styles.row, styles.rowLockedStatic, compact && styles.compactLocked]}>
        <ItemIcon id={iconId} kind={iconKind} category={category} phase={theme.phase} color={theme.essence} size={compact ? 34 : 40} />
        <View style={[styles.info, compact && styles.infoCompact]}>
          <Text
            style={[gameText.generatorName, { color: BASE.textFaint, fontSize: compact ? 13 : 18 }]}
            numberOfLines={2}>
            {displayName}
          </Text>
          {!compact ? (
            <Text style={[gameText.flavor, { color: BASE.textFaint }]}>🔒 {description}</Text>
          ) : null}
        </View>
      </View>
    );
  }

  if (compact) {
    return (
      <AffordablePulse
        active={canAfford}
        style={[
          styles.row,
          {
            backgroundColor: canAfford ? BASE.bgElevated : BASE.bgSurface,
            borderRadius: Radius.card,
          },
        ]}>
        <Pressable
          accessibilityRole="button"
          disabled={!canAfford}
          onPress={handleBuy}
          style={styles.compactPress}>
          <ItemIcon id={iconId} kind={iconKind} category={category} phase={theme.phase} color={theme.essence} size={34} />
          <Text style={[gameText.generatorName, styles.compactName, { color: BASE.textPrimary }]} numberOfLines={2}>
            {displayName}
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
          backgroundColor: canAfford ? BASE.bgElevated : BASE.bgSurface,
          borderRadius: Radius.card,
        },
      ]}>
      <Pressable
        accessibilityRole="button"
        disabled={!canAfford}
        onPress={handleBuy}
        style={styles.press}>
        <ItemIcon id={iconId} kind={iconKind} category={category} phase={theme.phase} color={theme.essence} size={40} />
        <View style={styles.info}>
          <Text style={[gameText.generatorName, { color: BASE.textPrimary }]}>{displayName}</Text>
          <Text style={[gameText.flavor, { color: BASE.textMuted }]}>{description}</Text>
        </View>
        <Text style={[gameText.cost, { color: canAfford ? BASE.gold : BASE.danger }]}>
          ✦ {formatNumber(cost)}
        </Text>
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
    justifyContent: 'space-between',
    gap: Spacing.two,
    padding: Spacing.three,
  },
  compactPress: {
    alignItems: 'center',
    gap: 4,
    padding: Spacing.two,
    minHeight: 118,
    justifyContent: 'center',
  },
  compactName: {
    fontSize: 13,
    textAlign: 'center',
  },
  rowLockedStatic: {
    flexDirection: 'row',
    backgroundColor: BASE.bgSurface,
    borderColor: BASE.borderHair,
    borderWidth: 1,
    borderRadius: Radius.card,
    padding: Spacing.three,
    opacity: 0.35,
    gap: Spacing.two,
  },
  compactLocked: {
    flexDirection: 'column',
    padding: Spacing.two,
    minHeight: 100,
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  infoCompact: {
    alignItems: 'center',
  },
});
