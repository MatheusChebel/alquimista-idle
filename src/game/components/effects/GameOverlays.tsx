import { memo } from 'react';

import { EventOverlay } from '@/game/components/event/EventOverlay';
import { PhaseTransitionOverlay } from '@/game/components/effects/PhaseTransition';
import { ScreenVignette } from '@/game/components/effects/ScreenVignette';

/** Overlays leves — vinheta + tint de evento. */
export const GameOverlays = memo(function GameOverlays() {
  return (
    <>
      <ScreenVignette />
      <EventOverlay />
      <PhaseTransitionOverlay />
    </>
  );
});
