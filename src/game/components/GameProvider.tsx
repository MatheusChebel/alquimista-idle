import { ActivityIndicator, StyleSheet } from 'react-native';
import type { ReactNode } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGameHydration } from '@/game/hooks/useGameHydration';
import { useGameLoop } from '@/game/hooks/useGameLoop';

type GameProviderProps = {
  children: ReactNode;
};

export function GameProvider({ children }: GameProviderProps) {
  const isReady = useGameHydration();

  useGameLoop();

  if (!isReady) {
    return (
      <ThemedView style={styles.loading}>
        <ActivityIndicator size="large" color="#D4AF37" />
        <ThemedText type="small" themeColor="textSecondary">
          Carregando laboratório...
        </ThemedText>
      </ThemedView>
    );
  }

  return children;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
});
