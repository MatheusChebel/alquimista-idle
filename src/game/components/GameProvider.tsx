import { ActivityIndicator, StyleSheet } from 'react-native';
import type { ReactNode } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BASE } from '@/constants/theme';
import { usePhaseTheme } from '@/game/hooks/usePhaseTheme';

type GameLoadingProps = {
  children: ReactNode;
  isReady: boolean;
};

export function GameLoading({ children, isReady }: GameLoadingProps) {
  const theme = usePhaseTheme();

  if (!isReady) {
    return (
      <ThemedView style={[styles.loading, { backgroundColor: BASE.bgDeep }]}>
        <ActivityIndicator size="large" color={theme.accent} />
        <ThemedText type="small" style={{ color: BASE.textMuted }}>
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
