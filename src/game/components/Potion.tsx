import React from 'react';
import Svg, { Circle, Rect, Ellipse } from 'react-native-svg';

export function Potion({
  size = 172,
  essence = '#46E5C4',
  glow = '#7CFFE3',
  gold = '#F5C542',
}: {
  size?: number;
  essence?: string;
  glow?: string;
  gold?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 172 172">
      <Circle cx={86} cy={88} r={72} fill={glow} opacity={0.05} />
      <Circle cx={86} cy={88} r={56} fill={glow} opacity={0.08} />
      <Circle cx={86} cy={88} r={42} fill={glow} opacity={0.13} />
      <Circle cx={86} cy={88} r={30} fill={glow} opacity={0.18} />
      <Rect
        x={78}
        y={34}
        width={16}
        height={40}
        rx={3}
        fill={essence}
        opacity={0.55}
        stroke={gold}
        strokeWidth={1.2}
      />
      <Rect x={71} y={30} width={30} height={8} rx={3} fill="#241B38" stroke={gold} strokeWidth={1.3} />
      <Circle cx={86} cy={96} r={42} fill={essence} opacity={0.92} stroke={gold} strokeWidth={1.5} />
      <Ellipse cx={86} cy={72} rx={38} ry={7} fill={glow} opacity={0.3} />
      <Ellipse cx={72} cy={82} rx={12} ry={7} fill="#E4F1FF" opacity={0.4} />
      <Circle cx={78} cy={108} r={4} fill="#E4F1FF" opacity={0.85} />
      <Circle cx={96} cy={96} r={3.5} fill="#E4F1FF" opacity={0.8} />
      <Circle cx={86} cy={118} r={2.5} fill="#E4F1FF" opacity={0.75} />
    </Svg>
  );
}
