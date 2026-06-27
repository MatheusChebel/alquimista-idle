import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BASE, Radius, Spacing } from '@/constants/theme';
import { TRIALS } from '@/game/data/trials';
import { ItemIcon } from '@/game/components/icons/ItemIcon';
import { gameText } from '@/game/lib/typography';
import { useGameStore } from '@/game/store/gameStore';

export const TrialList = memo(function TrialList() {
  const completed = useGameStore((s) => s.trialsCompleted);

  return (
    <View style={styles.wrap}>
      {TRIALS.map((trial) => {
        const done = Boolean(completed[trial.id]);
        return (
          <View
            key={trial.id}
            style={[
              styles.row,
              {
                backgroundColor: done ? BASE.bgElevated : BASE.bgSurface,
                borderColor: done ? BASE.gold : BASE.borderHair,
                opacity: done ? 1 : 0.55,
              },
            ]}>
            <ItemIcon
              id={trial.id}
              kind="ritual"
              ringColor={done ? BASE.gold : BASE.arcane}
              size={36}
            />
            <View style={styles.body}>
              <Text
                style={[gameText.generatorName, { color: done ? BASE.textPrimary : BASE.textFaint, fontSize: 15 }]}
                numberOfLines={1}>
                {trial.displayName}
              </Text>
              <Text style={[gameText.labelSmall, styles.rule, { color: BASE.textMuted }]}>{trial.rule}</Text>
            </View>
            <Text style={[gameText.cost, { color: done ? BASE.gold : BASE.textFaint, fontSize: 13 }]}>
              {done ? `✓ +${trial.quintReward}` : `+${trial.quintReward}`} ✦
            </Text>
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.two,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.card,
    borderWidth: StyleSheet.hairlineWidth,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  rule: {
    textTransform: 'none',
    letterSpacing: 0,
    fontSize: 11,
  },
});
