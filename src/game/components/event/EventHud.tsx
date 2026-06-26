import { memo, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { SPACE } from '@/constants/theme';
import { ASTRAL_EVENTS } from '@/game/data/events';
import type { TimedEventId } from '@/game/data/eventVisuals';
import { EventBanner } from '@/game/components/event/EventBanner';
import { LuckyPopup } from '@/game/components/event/LuckyPopup';
import { pruneActiveEffects } from '@/game/lib/economy';
import { useGameStore } from '@/game/store/gameStore';

function getPrimaryTimedEvent(activeEffects: ReturnType<typeof useGameStore.getState>['activeEffects']) {
  const now = Date.now();
  const pruned = pruneActiveEffects(activeEffects, now);
  if (pruned.length === 0) return null;

  const effect = [...pruned].sort((a, b) => a.endsAt - b.endsAt)[0];
  if (effect.kind !== 'frenzy' && effect.kind !== 'clickFrenzy' && effect.kind !== 'eclipse') {
    return null;
  }

  const def = ASTRAL_EVENTS.find((e) => e.apply === effect.kind);
  const durationMs = def?.durationMs ?? Math.max(1, effect.endsAt - now);

  return {
    eventId: effect.kind as TimedEventId,
    endsAt: effect.endsAt,
    durationMs,
  };
}

export const EventHud = memo(function EventHud() {
  const activeEffects = useGameStore((s) => s.activeEffects);
  const luckyPopup = useGameStore((s) => s.luckyPopup);
  const clearLuckyPopup = useGameStore((s) => s.clearLuckyPopup);

  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (activeEffects.length === 0) return;
    const id = setInterval(() => setTick((n) => n + 1), 500);
    return () => clearInterval(id);
  }, [activeEffects.length]);

  const timed = getPrimaryTimedEvent(activeEffects);
  void tick;

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      {timed ? (
        <EventBanner eventId={timed.eventId} endsAt={timed.endsAt} durationMs={timed.durationMs} />
      ) : null}
      {luckyPopup ? <LuckyPopup amountLabel={luckyPopup} onDone={clearLuckyPopup} /> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: SPACE.lg,
    zIndex: 50,
  },
});
