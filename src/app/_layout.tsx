import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AchievementToast } from '@/game/components/achievements/AchievementToast';
import { AudioProvider } from '@/game/components/audio/AudioProvider';
import { GameLoading } from '@/game/components/GameProvider';
import { OfflineWelcome } from '@/game/components/OfflineWelcome';
import { MagnumOpusRoot } from '@/game/components/MagnumOpus';
import { useGameFonts } from '@/game/hooks/useGameFonts';
import { useGameLoop } from '@/game/hooks/useGameLoop';
import { useGamePersistence } from '@/game/hooks/useGamePersistence';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const fontsReady = useGameFonts();
  const { isReady: saveReady, offlineWelcome, dismissOfflineWelcome } = useGamePersistence();
  const isReady = fontsReady && saveReady;

  useGameLoop(isReady);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AudioProvider>
        <MagnumOpusRoot />
        <GameLoading isReady={isReady}>
          <AchievementToast />
          <AnimatedSplashOverlay />
          <AppTabs />
          {offlineWelcome ? (
            <OfflineWelcome
              essenceGained={offlineWelcome.essenceGained}
              secondsAway={offlineWelcome.secondsAway}
              onDismiss={dismissOfflineWelcome}
            />
          ) : null}
        </GameLoading>
      </AudioProvider>
    </ThemeProvider>
  );
}
