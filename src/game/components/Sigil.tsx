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
} from '@tabler/icons-react-native';

import { BASE } from '@/constants/theme';

// id -> componente Tabler EXATO usado no mockup
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

// tom do glifo por item (alguns fogem da cor da categoria, como no mockup)
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

export function ItemIcon({
  id,
  ringColor,
  size = 50,
  glyphColor,
}: {
  id: string;
  ringColor: string;
  size?: number;
  glyphColor?: string;
}) {
  const Glyph = ICONS[id];
  const color = glyphColor ?? ICON_TINT[id] ?? ringColor;
  return (
    <Sigil ringColor={ringColor} size={size}>
      {Glyph ? <Glyph size={size * 0.48} color={color} strokeWidth={1.8} /> : null}
    </Sigil>
  );
}

const styles = StyleSheet.create({
  sigil: { alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth },
});
