import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';

/** Textura de pergaminho ~4% opacidade (seção 8). */
export function ParchmentOverlay() {
  const { width, height } = useWindowDimensions();

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width={width} height={height}>
        <Defs>
          <Pattern id="parchmentDots" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <Circle cx="1" cy="1" r="0.6" fill="#EDE7F7" opacity={0.04} />
            <Circle cx="4" cy="4" r="0.5" fill="#F5C542" opacity={0.03} />
          </Pattern>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill="url(#parchmentDots)" />
      </Svg>
    </View>
  );
}
