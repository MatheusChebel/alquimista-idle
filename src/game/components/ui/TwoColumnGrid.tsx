import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';

type TwoColumnGridProps = {
  children: ReactNode;
  minItems?: number;
};

/** Grade 2 colunas quando a lista é longa (seção 8.3). */
export function TwoColumnGrid({ children, minItems = 4 }: TwoColumnGridProps) {
  const items = Array.isArray(children) ? children : [children];
  const filtered = items.filter(Boolean);

  if (filtered.length < minItems) {
    return <View style={styles.single}>{filtered}</View>;
  }

  return (
    <View style={styles.grid}>
      {filtered.map((child, index) => (
        <View key={index} style={styles.cell}>
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  single: {
    gap: Spacing.two,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  cell: {
    width: '48.5%',
  },
});
