import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BASE, Radius, Spacing } from '@/constants/theme';

type SegmentedControlProps<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

export const SegmentedControl = memo(function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View style={styles.row}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(opt.value)}
            style={[styles.pill, active && styles.pillActive]}>
            <Text style={[styles.label, { color: active ? BASE.gold : BASE.textMuted }]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.one,
    backgroundColor: BASE.bgSurface,
    borderRadius: Radius.pill,
    padding: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BASE.borderHair,
  },
  pill: {
    flex: 1,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.pill,
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: BASE.bgElevated,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
