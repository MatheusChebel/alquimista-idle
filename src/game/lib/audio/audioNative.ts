import { requireOptionalNativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';

/** Verifica o módulo nativo sem carregar o JS do expo-audio. */
export function hasExpoAudioNative(): boolean {
  if (Platform.OS === 'web') return false;
  return requireOptionalNativeModule('ExpoAudio') != null;
}
