import Svg, { Circle, Line, Path, Polygon, Rect } from 'react-native-svg';

import { usePhaseTheme } from '@/game/hooks/usePhaseTheme';

type GeneratorGlyphProps = {
  id: string;
  size?: number;
};

/** Glifos alquímicos simplificados — um por instrumento (seção 9). */
export function GeneratorGlyph({ id, size = 36 }: GeneratorGlyphProps) {
  const theme = usePhaseTheme();
  const stroke = theme.accent;
  const sw = 1.8;

  const common = { width: size, height: size, viewBox: '0 0 36 36' as const };

  switch (id) {
    case 'alembic':
      return (
        <Svg {...common}>
          <Polygon points="18,4 28,14 8,14" fill="none" stroke={stroke} strokeWidth={sw} />
          <Line x1="18" y1="14" x2="18" y2="26" stroke={stroke} strokeWidth={sw} />
          <Circle cx="18" cy="28" r="4" fill="none" stroke={stroke} strokeWidth={sw} />
        </Svg>
      );
    case 'cauldron':
      return (
        <Svg {...common}>
          <Path
            d="M8 20 Q18 30 28 20 L26 14 Q18 10 10 14 Z"
            fill="none"
            stroke={stroke}
            strokeWidth={sw}
          />
          <Line x1="10" y1="12" x2="26" y2="12" stroke={stroke} strokeWidth={sw} />
        </Svg>
      );
    case 'athanor':
      return (
        <Svg {...common}>
          <Rect x="8" y="10" width="20" height="18" rx="2" fill="none" stroke={stroke} strokeWidth={sw} />
          <Path d="M12 28 L24 28" stroke={stroke} strokeWidth={sw} />
          <Circle cx="18" cy="19" r="4" fill={theme.essence} opacity={0.35} />
        </Svg>
      );
    case 'homunculus':
      return (
        <Svg {...common}>
          <Circle cx="18" cy="12" r="5" fill="none" stroke={stroke} strokeWidth={sw} />
          <Path d="M18 17 L18 26 M14 21 L22 21 M15 30 L21 30" stroke={stroke} strokeWidth={sw} />
        </Svg>
      );
    case 'herbgarden':
      return (
        <Svg {...common}>
          <Line x1="18" y1="28" x2="18" y2="14" stroke={stroke} strokeWidth={sw} />
          <Path d="M18 14 Q12 10 10 16 Q14 18 18 14" fill="none" stroke={stroke} strokeWidth={sw} />
          <Path d="M18 16 Q24 12 26 18 Q22 20 18 16" fill="none" stroke={stroke} strokeWidth={sw} />
        </Svg>
      );
    case 'crucible':
      return (
        <Svg {...common}>
          <Polygon points="18,6 28,16 24,30 12,30 8,16" fill="none" stroke={stroke} strokeWidth={sw} />
          <Circle cx="18" cy="20" r="3" fill={theme.glow} opacity={0.5} />
        </Svg>
      );
    case 'familiar':
      return (
        <Svg {...common}>
          <Path d="M10 20 Q18 8 26 20 Q22 26 18 24 Q14 26 10 20" fill="none" stroke={stroke} strokeWidth={sw} />
          <Circle cx="15" cy="18" r="1.2" fill={stroke} />
        </Svg>
      );
    case 'portal':
      return (
        <Svg {...common}>
          <Circle cx="18" cy="18" r="10" fill="none" stroke={stroke} strokeWidth={sw} />
          <Circle cx="18" cy="18" r="5" fill="none" stroke={theme.glow} strokeWidth={sw} opacity={0.7} />
        </Svg>
      );
    case 'tree':
      return (
        <Svg {...common}>
          <Line x1="18" y1="28" x2="18" y2="18" stroke={stroke} strokeWidth={sw} />
          <Circle cx="18" cy="14" r="8" fill="none" stroke={stroke} strokeWidth={sw} />
          <Circle cx="18" cy="14" r="3" fill={theme.essence} opacity={0.4} />
        </Svg>
      );
    default:
      return (
        <Svg {...common}>
          <Circle cx="18" cy="18" r="8" fill="none" stroke={stroke} strokeWidth={sw} />
        </Svg>
      );
  }
}
