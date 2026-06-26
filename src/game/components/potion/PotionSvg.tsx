import { memo } from 'react';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import type { PhaseTheme } from '@/constants/theme';

type PotionSvgProps = {
  theme: PhaseTheme;
  width?: number;
  height?: number;
};

/** SVG estático — sem bolhas nem halo duplicado (render 1×). */
export const PotionSvg = memo(function PotionSvg({ theme, width = 88, height = 108 }: PotionSvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 88 108">
      <Defs>
        <LinearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={theme.essence} stopOpacity="1" />
          <Stop offset="1" stopColor={theme.accent} stopOpacity="0.85" />
        </LinearGradient>
      </Defs>

      <Path
        d="M34 18 h20 v10 c0 4 -2 8 -10 8 s-10 -4 -10 -8 Z"
        fill="rgba(26,20,40,0.35)"
        stroke={theme.glow}
        strokeWidth={1.5}
      />
      <Path
        d="M24 36 h40 c4 0 8 6 8 14 v34 c0 14 -10 22 -28 22 s-28 -8 -28 -22 V50 c0 -8 4 -14 8 -14 Z"
        fill="rgba(26,20,40,0.45)"
        stroke={theme.accent}
        strokeWidth={2}
      />
      <Rect x={28} y={58} width={32} height={36} rx={12} fill="url(#liquidGrad)" opacity={0.92} />
      <Path
        d="M28 58 Q44 52 60 58"
        fill="none"
        stroke={theme.glow}
        strokeWidth={1.2}
        opacity={0.7}
      />
    </Svg>
  );
});
