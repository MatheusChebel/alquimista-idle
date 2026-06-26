import { memo, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BASE, tabularNums } from '@/constants/theme';
import { GrandeObraWheel } from '@/game/components/prestige/GrandeObraWheel';
import { SoundToggle } from '@/game/components/audio/SoundToggle';
import { useClickValue, useGameEps } from '@/game/hooks/useGameStats';
import { usePhaseTheme } from '@/game/hooks/usePhaseTheme';
import { formatNumber } from '@/game/lib/formulas';
import { gameText } from '@/game/lib/typography';
import { useGameStore } from '@/game/store/gameStore';

/** HUD com contador atualizado ~3×/seg (menos re-render que cada flush de clique). */
export const EssenceDisplay = memo(function EssenceDisplay() {
  const theme = usePhaseTheme();
  const openMagnumOpus = useGameStore((s) => s.openMagnumOpus);
  const eps = useGameEps();
  const clickValue = useClickValue();

  const [essenceLabel, setEssenceLabel] = useState(() =>
    formatNumber(useGameStore.getState().essence),
  );

  useEffect(() => {
    let active = true;
    const tick = () => {
      if (!active) return;
      const next = formatNumber(useGameStore.getState().essence);
      setEssenceLabel((prev) => (prev === next ? prev : next));
    };
    tick();
    const id = setInterval(tick, 300);
    const unsub = useGameStore.subscribe(tick);
    return () => {
      active = false;
      clearInterval(id);
      unsub();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.hudRow}>
        <View style={styles.left}>
          <Text style={[gameText.labelSmall, { color: BASE.textFaint }]}>ESSÊNCIA</Text>
          <Text style={[gameText.essenceHero, { color: theme.essence, fontSize: 38 }]}>
            ✦ {essenceLabel}
          </Text>
          <Text style={[gameText.labelSmall, styles.meta, tabularNums, { color: BASE.textMuted }]}>
            +{formatNumber(eps)} /seg · clique {formatNumber(clickValue)}
          </Text>
        </View>
        <View style={styles.right}>
          <SoundToggle color={theme.accent} />
          <GrandeObraWheel size={44} onPress={openMagnumOpus} />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BASE.borderHair,
    backgroundColor: BASE.bgDeep,
  },
  hudRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  left: {
    flex: 1,
    gap: 2,
  },
  right: {
    alignItems: 'center',
    gap: 4,
  },
  meta: {
    textTransform: 'none',
    letterSpacing: 0,
    fontSize: 12,
  },
});
