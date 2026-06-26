import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

const PHASE_COLORS = ['#46E5C4', '#A9D4FF', '#F5C542', '#FF5D63'];
const ARCS = [
  'M18,4 A14,14 0 0 1 32,18',
  'M32,18 A14,14 0 0 1 18,32',
  'M18,32 A14,14 0 0 1 4,18',
  'M4,18 A14,14 0 0 1 18,4',
];

/** current = índice da fase atual (0..3). Arcos passados/atual: cheios; futuros: 22%. */
export function GreatWorkWheel({ size = 40, current = 1 }: { size?: number; current?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36">
      {ARCS.map((d, i) => (
        <Path
          key={i}
          d={d}
          fill="none"
          stroke={PHASE_COLORS[i]}
          strokeWidth={3.5}
          strokeLinecap="round"
          opacity={i <= current ? 1 : 0.22}
        />
      ))}
      <Circle cx={18} cy={18} r={3} fill={PHASE_COLORS[current]} />
    </Svg>
  );
}
