import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { BASE, BottomTabInset, Spacing } from '@/constants/theme';
import { AstralConjunction } from '@/game/components/AstralConjunction';
import { Cauldron } from '@/game/components/Cauldron';
import { DevPanel } from '@/game/components/DevPanel';
import { EssenceDisplay } from '@/game/components/EssenceDisplay';
import { EventHud } from '@/game/components/event/EventHud';
import { LabScreen } from '@/game/components/lab/LabScreen';
import { RitualBar } from '@/game/components/ritual/RitualBar';
import { QuickBuyCarousel } from '@/game/components/shop/QuickBuyCarousel';
import { GameOverlays } from '@/game/components/effects/GameOverlays';

export default function GameScreen() {
  const [devOpen, setDevOpen] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <GameOverlays />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <EssenceDisplay onDevLongPress={__DEV__ ? () => setDevOpen(true) : undefined} />
        <EventHud />
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.five }]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.main}>
            <Cauldron />
            <RitualBar />
            <QuickBuyCarousel />
            <LabScreen />
          </View>
        </ScrollView>
      </SafeAreaView>
      <AstralConjunction enabled />
      {__DEV__ ? <DevPanel visible={devOpen} onClose={() => setDevOpen(false)} /> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BASE.bgDeep,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    gap: Spacing.two,
  },
  main: {
    gap: Spacing.two,
  },
});
