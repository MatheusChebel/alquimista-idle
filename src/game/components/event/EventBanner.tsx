import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

import { BASE, RADIUS } from '@/constants/theme';
import { EVENT_VISUALS, type TimedEventId } from '@/game/data/eventVisuals';

function useRemaining(endsAt: number) {
  const [ms, setMs] = React.useState(Math.max(0, endsAt - Date.now()));
  React.useEffect(() => {
    const t = setInterval(() => setMs(Math.max(0, endsAt - Date.now())), 250);
    return () => clearInterval(t);
  }, [endsAt]);
  return ms;
}

const fmt = (ms: number) => {
  const s = Math.ceil(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export function EventBanner({
  eventId,
  endsAt,
  durationMs,
}: {
  eventId: TimedEventId;
  endsAt: number;
  durationMs: number;
}) {
  const v = EVENT_VISUALS[eventId];
  const remaining = useRemaining(endsAt);
  const ending = remaining <= 3000 && remaining > 0;

  const intro = useSharedValue(0);
  React.useEffect(() => {
    intro.value = withTiming(1, { duration: 250 });
  }, [intro]);

  const introStyle = useAnimatedStyle(() => ({
    opacity: intro.value,
    transform: [{ translateY: (1 - intro.value) * -16 }],
  }));

  const p = useSharedValue(Math.max(0, (endsAt - Date.now()) / durationMs));
  React.useEffect(() => {
    const rem = Math.max(0, endsAt - Date.now());
    p.value = withTiming(0, { duration: rem, easing: Easing.linear });
  }, [endsAt, durationMs, p]);

  const fillStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: Math.max(0, p.value) }],
  }));

  const pulse = useSharedValue(1);
  React.useEffect(() => {
    if (ending) {
      pulse.value = withRepeat(withTiming(0.4, { duration: 400 }), -1, true);
    } else {
      pulse.value = withTiming(1, { duration: 150 });
    }
  }, [ending, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  const Icon = v.Icon;

  return (
    <Animated.View
      style={[styles.banner, { backgroundColor: v.bg, borderColor: v.color }, introStyle]}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: v.color + '2E' }]}>
          <Icon size={16} color={v.color} strokeWidth={1.8} />
        </View>
        <Text style={[styles.name, { color: v.color }]} numberOfLines={1}>
          {v.name} <Text style={styles.mult}>· {v.multLabel}</Text>
        </Text>
        <Animated.Text style={[styles.time, { color: v.color }, pulseStyle]}>{fmt(remaining)}</Animated.Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { backgroundColor: v.color }, fillStyle, pulseStyle]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: RADIUS.card,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 11,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 8 },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { flex: 1, fontSize: 14, letterSpacing: 1, fontFamily: 'Cinzel_700Bold' },
  mult: {
    color: BASE.textMuted,
    letterSpacing: 0,
    fontFamily: 'SpaceGrotesk_500Medium',
    fontSize: 12,
  },
  time: { fontSize: 13, fontFamily: 'SpaceGrotesk_500Medium', fontVariant: ['tabular-nums'] },
  track: { height: 5, backgroundColor: BASE.bgElevated, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', width: '100%', borderRadius: 3, transformOrigin: 'left' },
});
