import {
  Cinzel_700Bold,
} from '@expo-google-fonts/cinzel';
import {
  CormorantGaramond_600SemiBold,
  CormorantGaramond_600SemiBold_Italic,
} from '@expo-google-fonts/cormorant-garamond';
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
} from '@expo-google-fonts/space-grotesk';
import { useFonts } from 'expo-font';

/** Carrega famílias do manual de arte (seção 3). */
export function useGameFonts(): boolean {
  const [loaded] = useFonts({
    Cinzel_700Bold,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_600SemiBold_Italic,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
  });

  return loaded;
}
