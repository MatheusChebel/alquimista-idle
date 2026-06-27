import type { ComponentType } from 'react';
import {
  IconActivity,
  IconArrowBigUpLines,
  IconBolt,
  IconChevronUp,
  IconChevronsUp,
  IconCrown,
  IconGridDots,
  IconHandFinger,
  IconHandStop,
  IconHandThreeFingers,
  IconRipple,
  IconStack2,
  IconStar,
  IconWand,
  IconWaveSawTool,
  IconWaveSine,
} from '@tabler/icons-react-native';

type Glyph = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

export const TRANSMUTATION_TIER_ICON: Record<string, Glyph> = {
  I: IconChevronUp,
  II: IconChevronsUp,
  III: IconArrowBigUpLines,
  IV: IconStar,
  V: IconCrown,
};

export const CLICK_ICON: Record<string, Glyph> = {
  click1: IconHandFinger,
  click2: IconHandStop,
  click3: IconHandThreeFingers,
  click4: IconWaveSine,
  click5: IconWaveSawTool,
  click6: IconActivity,
  click7: IconRipple,
  click8: IconGridDots,
  click9: IconStack2,
  click10: IconBolt,
  click11: IconWaveSine,
  click12: IconCrown,
};

export const RITUAL_ICON: Record<string, Glyph> = {
  IconWand,
  IconBolt,
  IconHandStop,
};

export function transmutationTierFromId(upgradeId: string): string {
  const parts = upgradeId.split('_');
  return parts[parts.length - 1] ?? 'I';
}
