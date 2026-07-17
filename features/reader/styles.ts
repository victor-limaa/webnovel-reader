import { StyleSheet } from 'react-native';

import { palette } from '@/lib/theme/tokens';

export const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missing: {
    color: palette.ink,
    fontWeight: '800',
  },
  readerHeader: {
    minHeight: 72,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  headerMeta: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120,
  },
  chapterTitle: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '900',
    marginBottom: 22,
  },
  body: {
    fontFamily: 'serif',
  },
  player: {
    minHeight: 82,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  navButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.3,
  },
});
