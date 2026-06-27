import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  IconFlask2,
  IconSoup,
  IconFlame,
  IconRobot,
  IconPlant2,
  IconDiamond,
  IconFeather,
  IconCircleDotted,
  IconTree,
  IconHandFinger,
  IconHandStop,
  IconWaveSine,
  IconDroplet,
  IconInfinity,
  IconSparkles,
  IconDoor,
  IconClock,
  IconDroplets,
  IconPrism,
  IconEye,
} from '@tabler/icons-react-native';

import { BASE, PHASE, type Phase } from '@/constants/theme';
import {
  CLICK_ICON,
  RITUAL_ICON,
  TRANSMUTATION_TIER_ICON,
  transmutationTierFromId,
} from '@/game/data/upgradeIcons';

export type ItemIconKind = 'instrument' | 'transmutation' | 'click' | 'ritual';

export const ICONS: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  alembic: IconFlask2,
  cauldron: IconSoup,
  athanor: IconFlame,
  homunculus: IconRobot,
  herbgarden: IconPlant2,
  crucible: IconDiamond,
  familiar: IconFeather,
  portal: IconCircleDotted,
  tree: IconTree,
  hiddenlab: IconDoor,
  astralclock: IconClock,
  voidcondenser: IconDroplets,
  philprism: IconPrism,
  cosmoseye: IconEye,
  click: IconHandFinger,
  click1: IconHandFinger,
  click2: IconHandStop,
  click3: IconHandStop,
  click4: IconWaveSine,
  click5: IconWaveSine,
  click6: IconWaveSine,
  glove: IconHandStop,
  resonance: IconWaveSine,
  essence: IconDroplet,
  magnumopus: IconInfinity,
  conjunction: IconSparkles,
};

export const ICON_TINT: Record<string, string> = {
  athanor: '#FF9A5C',
  crucible: BASE.gold,
  familiar: '#A9D4FF',
};

export function Sigil({
  ringColor,
  size = 50,
  fillColor,
  children,
}: {
  ringColor: string;
  size?: number;
  fillColor?: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={[
        styles.sigil,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: ringColor,
          backgroundColor: (fillColor ?? ringColor) + '22',
        },
      ]}>
      {children}
    </View>
  );
}

function resolveGlyph(
  id: string,
  kind: ItemIconKind,
  ritualIconName?: string,
): React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }> | null {
  if (kind === 'transmutation') {
    const tier = transmutationTierFromId(id);
    return TRANSMUTATION_TIER_ICON[tier] ?? TRANSMUTATION_TIER_ICON.I;
  }
  if (kind === 'click') {
    return CLICK_ICON[id] ?? CLICK_ICON.click1;
  }
  if (kind === 'ritual' && ritualIconName) {
    return RITUAL_ICON[ritualIconName] ?? ICONS.essence;
  }
  return ICONS[id] ?? null;
}

export function ringColorForKind(kind: ItemIconKind, phase: Phase, essenceColor?: string): string {
  if (kind === 'instrument') return essenceColor ?? PHASE[phase].essence;
  if (kind === 'transmutation') return BASE.gold;
  return BASE.arcane;
}

export function ItemIcon({
  id,
  kind = 'instrument',
  phase = 'nigredo',
  ringColor,
  size = 50,
  glyphColor,
  ritualIconName,
}: {
  id: string;
  kind?: ItemIconKind;
  phase?: Phase;
  ringColor?: string;
  size?: number;
  glyphColor?: string;
  ritualIconName?: string;
}) {
  const frame = ringColor ?? ringColorForKind(kind, phase);
  const Glyph = resolveGlyph(id, kind, ritualIconName);
  const color = glyphColor ?? (kind === 'instrument' ? (ICON_TINT[id] ?? frame) : frame);

  return (
    <Sigil ringColor={frame} size={size}>
      {Glyph ? <Glyph size={size * 0.48} color={color} strokeWidth={1.8} /> : null}
    </Sigil>
  );
}

const styles = StyleSheet.create({
  sigil: { alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth },
});
