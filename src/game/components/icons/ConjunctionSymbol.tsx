import Svg, { Circle, Path } from 'react-native-svg';

type ConjunctionSymbolProps = {
  variant: number;
  size?: number;
  color: string;
  glow: string;
};

/** Símbolos astrais em SVG (seção 7). */
export function ConjunctionSymbol({ variant, size = 28, color, glow }: ConjunctionSymbolProps) {
  const v = variant % 4;
  const common = { width: size, height: size, viewBox: '0 0 32 32' as const };

  switch (v) {
    case 0:
      return (
        <Svg {...common}>
          <Circle cx="16" cy="16" r="9" fill="none" stroke={color} strokeWidth={2} />
          <Circle cx="16" cy="16" r="4" fill={glow} opacity={0.6} />
        </Svg>
      );
    case 1:
      return (
        <Svg {...common}>
          <Path
            d="M16 6 A10 10 0 1 0 16 26 A7 7 0 1 1 16 6"
            fill="none"
            stroke={color}
            strokeWidth={2}
          />
        </Svg>
      );
    case 2:
      return (
        <Svg {...common}>
          <Circle cx="16" cy="20" r="6" fill="none" stroke={color} strokeWidth={2} />
          <Path d="M16 6 L20 14 L12 14 Z" fill="none" stroke={color} strokeWidth={2} />
        </Svg>
      );
    default:
      return (
        <Svg {...common}>
          <Path
            d="M10 24 Q16 8 22 24 M12 20 L20 20"
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
      );
  }
}
