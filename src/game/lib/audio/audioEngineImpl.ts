import { Platform } from 'react-native';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

type SfxName = 'plink' | 'shimmer' | 'chime' | 'whoosh';

const SOURCES = {
  plink: require('@/assets/audio/plink.wav'),
  shimmer: require('@/assets/audio/shimmer.wav'),
  chime: require('@/assets/audio/chime.wav'),
  whoosh: require('@/assets/audio/whoosh.wav'),
  ambient: require('@/assets/audio/ambient.wav'),
} as const;

let muted = false;
let booted = false;
const sfx: Partial<Record<SfxName, AudioPlayer>> = {};
let ambient: AudioPlayer | null = null;

export async function bootstrap() {
  if (booted || Platform.OS === 'web') return;
  booted = true;

  await setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: false,
    interruptionMode: 'mixWithOthers',
  });

  sfx.plink = createAudioPlayer(SOURCES.plink);
  sfx.shimmer = createAudioPlayer(SOURCES.shimmer);
  sfx.chime = createAudioPlayer(SOURCES.chime);
  sfx.whoosh = createAudioPlayer(SOURCES.whoosh);

  for (const player of Object.values(sfx)) {
    if (!player) continue;
    player.volume = 0.85;
  }

  ambient = createAudioPlayer(SOURCES.ambient);
  ambient.loop = true;
  ambient.volume = 0.1;

  if (!muted) {
    ambient.play();
  }
}

export function setMuted(value: boolean) {
  muted = value;
  if (!ambient) return;
  if (muted) ambient.pause();
  else ambient.play();
}

export function pauseAmbient() {
  ambient?.pause();
}

export function resumeAmbient() {
  if (!muted && ambient) ambient.play();
}

async function playSfx(name: SfxName, playbackRate = 1) {
  if (muted) return;
  const player = sfx[name];
  if (!player) return;
  player.setPlaybackRate(playbackRate);
  await player.seekTo(0);
  player.play();
}

export function playPlink() {
  void playSfx('plink', 0.95 + Math.random() * 0.1);
}

export function playShimmer() {
  void playSfx('shimmer', 1);
}

export function playChime() {
  void playSfx('chime', 1);
}

export function playWhoosh() {
  void playSfx('whoosh', 0.9);
}
