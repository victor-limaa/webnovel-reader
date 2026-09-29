import { StyleSheet } from 'react-native';

import { palette, shadows } from '@/shared/design-system/tokens';

export const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
    paddingBottom: 32,
    gap: 18,
  },
  modeSwitch: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 8,
    backgroundColor: palette.paperDeep,
    gap: 4,
  },
  modeButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  modeButtonActive: {
    backgroundColor: palette.umber,
  },
  modeText: {
    color: palette.umber,
    fontWeight: '900',
  },
  modeTextActive: {
    color: palette.panel,
  },
  panel: {
    gap: 16,
    borderRadius: 8,
    backgroundColor: palette.panel,
    borderWidth: 1,
    borderColor: palette.line,
    padding: 16,
    ...shadows.lifted,
  },
  field: {
    gap: 8,
  },
  label: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  input: {
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: '#FFFDF8',
    paddingHorizontal: 12,
    color: palette.ink,
    fontSize: 16,
  },
  textArea: {
    minHeight: 260,
    paddingTop: 12,
    lineHeight: 23,
  },
  summary: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: palette.paperDeep,
  },
  summaryText: {
    color: palette.muted,
    fontWeight: '800',
  },
  draftList: {
    gap: 10,
  },
  draftCard: {
    gap: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.line,
    padding: 12,
    backgroundColor: '#FFFDF8',
  },
  draftError: {
    borderColor: palette.danger,
  },
  draftTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chapterNumber: {
    color: palette.umber,
    fontWeight: '900',
  },
  draftActions: {
    flexDirection: 'row',
    gap: 16,
  },
  draftTitleInput: {
    color: palette.ink,
    fontSize: 17,
    fontWeight: '900',
    paddingVertical: 4,
  },
  draftMeta: {
    color: palette.muted,
    fontSize: 12,
  },
  errorText: {
    color: palette.danger,
    fontSize: 13,
    lineHeight: 19,
  },
  novelPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  novelPill: {
    maxWidth: '100%',
    minHeight: 38,
    borderRadius: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: '#FFFDF8',
  },
  novelPillActive: {
    backgroundColor: palette.umber,
    borderColor: palette.umber,
  },
  novelPillText: {
    color: palette.umber,
    fontWeight: '800',
  },
  novelPillTextActive: {
    color: palette.panel,
  },
});
