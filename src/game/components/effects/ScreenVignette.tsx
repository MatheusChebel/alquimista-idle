import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

/** Vinheta escura nas bordas — tint de evento fica no EventOverlay. */
export function ScreenVignette({ strength = 0.6 }: { strength?: number }) {
  const { width, height } = useWindowDimensions();

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width={width} height={height}>
        <Defs>
          <RadialGradient id="vignette" cx="50%" cy="38%" rx="72%" ry="68%">
            <Stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <Stop offset="72%" stopColor="#000000" stopOpacity={strength * 0.35} />
            <Stop offset="100%" stopColor="#000000" stopOpacity={strength} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill="url(#vignette)" />
      </Svg>
    </View>
  );
}
