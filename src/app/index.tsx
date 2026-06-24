import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { AlchemyCauldron } from '@/game/components/AlchemyCauldron';
import { GoldHeader } from '@/game/components/GoldHeader';
import { PrestigeButton } from '@/game/components/PrestigeButton';
import { UpgradeList } from '@/game/components/UpgradeList';

export default function GameScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.five }]}
          showsVerticalScrollIndicator={false}>
          <GoldHeader />
          <AlchemyCauldron />
          <PrestigeButton />
          <UpgradeList />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120A1C',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    gap: Spacing.two,
  },
});
