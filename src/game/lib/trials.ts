import { GENERATORS } from '@/game/data/generators';
import { TRIALS } from '@/game/data/trials';
import type { GameStore } from '@/game/types/game';

function instrumentTypesOwned(owned: Record<string, number>): number {
  return GENERATORS.filter((g) => (owned[g.id] ?? 0) > 0).length;
}

export function checkTrials(state: GameStore): Partial<GameStore> {
  const trialsCompleted = { ...state.trialsCompleted };
  let quintessence = state.quintessence;
  let quintessenceEarned = state.quintessenceEarned;
  let changed = false;

  const complete = (id: string, reward: number) => {
    if (trialsCompleted[id]) return;
    trialsCompleted[id] = true;
    quintessence += reward;
    quintessenceEarned += reward;
    changed = true;
  };

  for (const trial of TRIALS) {
    if (trialsCompleted[trial.id]) continue;

    if (trial.id === 'notouch') {
      if (
        state.totalEssenceEarned >= 1e9 &&
        Object.keys(state.boughtClickUpgrades).length === 0
      ) {
        complete(trial.id, trial.quintReward);
      }
    } else if (trial.id === 'minimal') {
      if (state.totalEssenceEarned >= 1e9 && instrumentTypesOwned(state.owned) <= 3) {
        complete(trial.id, trial.quintReward);
      }
    } else if (trial.id === 'speed') {
      const elapsed = Date.now() - state.runStartedAt;
      if (state.totalEssenceEarned >= 1e8 && elapsed <= 10 * 60 * 1000) {
        complete(trial.id, trial.quintReward);
      }
    }
  }

  if (!changed) return {};
  return { trialsCompleted, quintessence, quintessenceEarned };
}
