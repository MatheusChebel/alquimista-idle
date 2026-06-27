import { GENERATORS } from '@/game/data/generators';
import { visualTier } from '@/game/data/labTiers';
import type { GameStore } from '@/game/types/game';

const MASTERY_QUINT = 3;
const COLLECTION_ONE_EACH_QUINT = 10;
const COLLECTION_ALL_TIER3_QUINT = 25;

function hasOneOfEach(owned: Record<string, number>): boolean {
  return GENERATORS.every((g) => (owned[g.id] ?? 0) >= 1);
}

function allAtTier3(owned: Record<string, number>): boolean {
  return GENERATORS.every((g) => visualTier(owned[g.id] ?? 0) >= 3);
}

/** Bônus únicos de Quintessência (Parte F) — não resetam no prestígio. */
export function applyQuintessenceBonuses(state: GameStore): Partial<GameStore> {
  const updates: Partial<GameStore> = {};
  let quintessence = state.quintessence;
  let quintessenceEarned = state.quintessenceEarned;
  let changed = false;

  const grant = (amount: number) => {
    quintessence += amount;
    quintessenceEarned += amount;
    changed = true;
  };

  const masteryClaimed = { ...state.masteryClaimed };
  for (const gen of GENERATORS) {
    if (masteryClaimed[gen.id]) continue;
    if ((state.owned[gen.id] ?? 0) < 100) continue;
    masteryClaimed[gen.id] = true;
    grant(MASTERY_QUINT);
  }

  const collectionBonusesClaimed = { ...state.collectionBonusesClaimed };
  if (!collectionBonusesClaimed.oneOfEach && hasOneOfEach(state.owned)) {
    collectionBonusesClaimed.oneOfEach = true;
    grant(COLLECTION_ONE_EACH_QUINT);
  }
  if (!collectionBonusesClaimed.allTier3 && allAtTier3(state.owned)) {
    collectionBonusesClaimed.allTier3 = true;
    grant(COLLECTION_ALL_TIER3_QUINT);
  }

  if (changed) {
    updates.quintessence = quintessence;
    updates.quintessenceEarned = quintessenceEarned;
    updates.masteryClaimed = masteryClaimed;
    updates.collectionBonusesClaimed = collectionBonusesClaimed;
  }

  return updates;
}
