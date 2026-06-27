import { ItemIcon as KitItemIcon, ringColorForKind, type ItemIconKind } from '@/game/components/Sigil';
import { BASE, type Phase } from '@/constants/theme';
import type { IconCategory } from '@/game/data/icons';

/** @deprecated use ringColorForKind — mantido para carrossel legado */
export function ringColorForCategory(category: IconCategory, essenceColor: string): string {
  if (category === 'generator') return essenceColor;
  if (category === 'click') return BASE.arcane;
  return BASE.gold;
}

type ItemIconProps = {
  id: string;
  kind?: ItemIconKind;
  category?: IconCategory;
  phase?: Phase;
  color?: string;
  ringColor?: string;
  glyphColor?: string;
  ritualIconName?: string;
  size?: number;
};

export function ItemIcon({
  id,
  kind,
  category = 'generator',
  phase = 'nigredo',
  color = BASE.gold,
  ringColor,
  glyphColor,
  ritualIconName,
  size = 50,
}: ItemIconProps) {
  const resolvedKind =
    kind ??
    (category === 'generator' ? 'instrument' : category === 'click' ? 'click' : 'ritual');

  return (
    <KitItemIcon
      id={id}
      kind={resolvedKind}
      phase={phase}
      ringColor={ringColor ?? ringColorForKind(resolvedKind, phase, color)}
      size={size}
      glyphColor={glyphColor}
      ritualIconName={ritualIconName}
    />
  );
}
