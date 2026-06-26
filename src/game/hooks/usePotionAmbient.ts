import { useIsFocused } from 'expo-router';

/** Pausa animações da poção quando a aba Alquimia não está visível (17.7). */
export function usePotionAmbientActive(): boolean {
  return useIsFocused();
}
