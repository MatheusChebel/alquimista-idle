import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { BASE, BottomTabInset, Spacing } from '@/constants/theme';
import { AstralConjunction } from '@/game/components/AstralConjunction';
import { Cauldron } from '@/game/components/Cauldron';
import { EssenceDisplay } from '@/game/components/EssenceDisplay';
import { EventHud } from '@/game/components/event/EventHud';
import { LabScreen } from '@/game/components/lab/LabScreen';
import { QuickBuyCarousel } from '@/game/components/shop/QuickBuyCarousel';
import { GameOverlays } from '@/game/components/effects/GameOverlays';

export default function GameScreen() {
  return (
    <ThemedView style={styles.container}>
      <GameOverlays />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <EssenceDisplay />
        <EventHud />
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.five }]}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[]}>
          <View style={styles.main}>
            <Cauldron />
            <QuickBuyCarousel />
            <LabScreen />
          </View>
        </ScrollView>
      </SafeAreaView>
      <AstralConjunction enabled />
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
