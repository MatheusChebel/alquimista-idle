import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BASE, Radius, Spacing } from '@/constants/theme';
import { ACHIEVEMENTS } from '@/game/data/achievements';
import { ItemIcon } from '@/game/components/icons/ItemIcon';
import { TwoColumnGrid } from '@/game/components/ui/TwoColumnGrid';
import { usePhaseTheme } from '@/game/hooks/usePhaseTheme';
import { gameText } from '@/game/lib/typography';
import { useGameStore } from '@/game/store/gameStore';

export const AchievementList = memo(function AchievementList() {
  const theme = usePhaseTheme();
  const unlocked = useGameStore((s) => s.unlockedAchievements);

  return (
    <TwoColumnGrid minItems={6}>
      {ACHIEVEMENTS.map((achievement) => {
        const done = Boolean(unlocked[achievement.id]);
        return (
          <View
            key={achievement.id}
            style={[
              styles.row,
              {
                backgroundColor: done ? BASE.bgElevated : BASE.bgSurface,
                borderColor: done ? theme.accent : BASE.borderHair,
                opacity: done ? 1 : 0.45,
              },
            ]}>
            <ItemIcon
              id={done ? 'magnumopus' : 'essence'}
              category="mystic"
              ringColor={done ? BASE.gold : BASE.textFaint}
              size={34}
            />
            <Text
              style={[gameText.generatorName, styles.name, { color: done ? BASE.textPrimary : BASE.textFaint }]}
              numberOfLines={2}>
              {done ? achievement.displayName : '???'}
            </Text>
            {done ? (
              <Text style={[gameText.cost, { color: theme.accent, fontSize: 14 }]}>✓</Text>
            ) : (
              <Text style={{ color: BASE.textFaint, fontSize: 12 }}>🔒</Text>
            )}
          </View>
        );
      })}
    </TwoColumnGrid>
  );
});

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    gap: Spacing.one,
    padding: Spacing.two,
    borderRadius: Radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 108,
    justifyContent: 'center',
  },
  name: {
    fontSize: 13,
    textAlign: 'center',
  },
});
