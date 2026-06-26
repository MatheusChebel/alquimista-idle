import { ItemIcon as KitItemIcon } from '@/game/components/Sigil';
import { BASE } from '@/constants/theme';
import type { IconCategory } from '@/game/data/icons';

export function ringColorForCategory(category: IconCategory, essenceColor: string): string {
  if (category === 'generator') return essenceColor;
  return BASE.gold;
}

type ItemIconProps = {
  id: string;
  category?: IconCategory;
  color?: string;
  accentColor?: string;
  ringColor?: string;
  glyphColor?: string;
  size?: number;
};

/** Adaptador — mantém API antiga; glifos vêm do kit Tabler em `Sigil.tsx`. */
export function ItemIcon({
  id,
  category = 'generator',
  color = BASE.gold,
  accentColor: _accentColor,
  ringColor,
  glyphColor,
  size = 50,
}: ItemIconProps) {
  return (
    <KitItemIcon
      id={id}
      ringColor={ringColor ?? ringColorForCategory(category, color)}
      size={size}
      glyphColor={glyphColor}
    />
  );
}
