import { IconFlame, IconHandFinger, IconMoon } from '@tabler/icons-react-native';

export const EVENT_VISUALS = {
  frenzy: { name: 'FRENESI', multLabel: 'produção ×7', color: '#FF9A5C', bg: '#1C1208', Icon: IconFlame },
  clickFrenzy: { name: 'TOQUE DOURADO', multLabel: 'toque ×777', color: '#F5C542', bg: '#1A1606', Icon: IconHandFinger },
  eclipse: { name: 'ECLIPSE', multLabel: 'produção ×0,5', color: '#B0506E', bg: '#180B12', Icon: IconMoon },
} as const;

export type TimedEventId = keyof typeof EVENT_VISUALS;
