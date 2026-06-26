import Svg, { Line, Path } from 'react-native-svg';

import { usePhaseTheme } from '@/game/hooks/usePhaseTheme';

type GrimorioOrnamentProps = {
  width?: number;
};

export function GrimorioOrnament({ width = 240 }: GrimorioOrnamentProps) {
  const theme = usePhaseTheme();
  const h = 20;

  return (
    <Svg width={width} height={h} viewBox="0 0 240 20">
      <Line x1="0" y1="10" x2="90" y2="10" stroke={theme.accent} strokeWidth={1} opacity={0.5} />
      <Line x1="150" y1="10" x2="240" y2="10" stroke={theme.accent} strokeWidth={1} opacity={0.5} />
      <Path
        d="M120 2 L124 10 L120 18 L116 10 Z"
        fill="none"
        stroke={theme.glow}
        strokeWidth={1.2}
      />
      <Path
        d="M108 6 Q120 0 132 6 Q120 14 108 6"
        fill="none"
        stroke={theme.accent}
        strokeWidth={1}
        opacity={0.7}
      />
    </Svg>
  );
}
