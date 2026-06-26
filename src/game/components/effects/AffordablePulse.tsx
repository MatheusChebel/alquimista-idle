import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { BASE } from '@/constants/theme';

type AffordablePulseProps = {
  active: boolean;
  children: ReactNode;
  style?: object;
};

/** Borda dourada estática — sem loop (melhor FPS em listas). */
export function AffordablePulse({ active, children, style }: AffordablePulseProps) {
  return (
    <View
      style={[
        styles.wrap,
        style,
        active ? styles.affordable : styles.defaultBorder,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    overflow: 'hidden',
  },
  defaultBorder: {
    borderColor: BASE.borderHair,
  },
  affordable: {
    borderColor: BASE.gold,
    borderWidth: 1.5,
  },
});
