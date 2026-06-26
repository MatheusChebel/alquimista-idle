import { StyleSheet } from 'react-native';

import { FontFamilies, TypeScale, tabularNums } from '@/constants/theme';

export const gameText = StyleSheet.create({
  essenceHero: {
    fontFamily: FontFamilies.ui,
    ...TypeScale.essenceHero,
    ...tabularNums,
  },
  tabTitle: {
    fontFamily: FontFamilies.display,
    ...TypeScale.tabTitle,
  },
  generatorName: {
    fontFamily: FontFamilies.ui,
    ...TypeScale.generatorName,
  },
  flavor: {
    fontFamily: FontFamilies.grimoireItalic,
    ...TypeScale.flavor,
  },
  cost: {
    fontFamily: FontFamilies.ui,
    ...TypeScale.cost,
    ...tabularNums,
  },
  labelSmall: {
    fontFamily: FontFamilies.uiRegular,
    ...TypeScale.labelSmall,
  },
  banner: {
    fontFamily: FontFamilies.display,
    fontSize: 18,
    letterSpacing: 2,
  },
});
