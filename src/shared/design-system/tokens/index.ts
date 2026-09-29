import { StyleSheet } from 'react-native';

/** Global, semantic design tokens shared by every feature. */

export const palette = {
  ink: '#211A16',
  paper: '#F8F1E7',
  paperDeep: '#EFE1D1',
  panel: '#FFF9F0',
  umber: '#7C3F22',
  umberDark: '#4C2416',
  gold: '#D99A3D',
  moss: '#52664E',
  blue: '#365C6C',
  muted: '#7D6D61',
  line: '#E0CDB8',
  danger: '#A83E31',
  success: '#4F6F46',
  night: '#171412',
  nightPanel: '#241D19',
  nightLine: '#3D3029',
  nightText: '#F6EBDD',
};

export const shadows = StyleSheet.create({
  lifted: {
    shadowColor: '#3A2014',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 5,
  },
});

export const readerThemes = {
  paper: {
    background: palette.paper,
    panel: palette.panel,
    text: palette.ink,
    muted: palette.muted,
    line: palette.line,
    accent: palette.umber,
  },
  night: {
    background: palette.night,
    panel: palette.nightPanel,
    text: palette.nightText,
    muted: '#C4B4A2',
    line: palette.nightLine,
    accent: palette.gold,
  },
  sepia: {
    background: '#E9D5B7',
    panel: '#F4E4C8',
    text: '#2D2118',
    muted: '#755C42',
    line: '#D1B48C',
    accent: palette.umber,
  },
};

export type ReaderThemeName = keyof typeof readerThemes;
