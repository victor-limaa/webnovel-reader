import { StyleSheet } from 'react-native';

import { palette, shadows } from '@/lib/theme/tokens';

export const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    paddingTop: 18,
    paddingBottom: 32,
    gap: 16,
  },
  panel: {
    gap: 14,
    padding: 16,
    borderRadius: 8,
    backgroundColor: palette.panel,
    borderWidth: 1,
    borderColor: palette.line,
    ...shadows.lifted,
  },
  sectionTitle: {
    color: palette.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  label: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  segment: {
    flexDirection: 'row',
    gap: 6,
    padding: 4,
    borderRadius: 8,
    backgroundColor: palette.paperDeep,
  },
  segmentButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: {
    backgroundColor: palette.umber,
  },
  segmentText: {
    color: palette.umber,
    fontWeight: '900',
  },
  segmentTextActive: {
    color: palette.panel,
  },
  stepper: {
    gap: 8,
  },
  stepperControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: '#FFFDF8',
    padding: 6,
  },
  stepButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.paperDeep,
  },
  stepButtonText: {
    color: palette.umber,
    fontSize: 24,
    fontWeight: '900',
  },
  stepValue: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  voiceList: {
    gap: 8,
  },
  voiceOption: {
    minHeight: 42,
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: '#FFFDF8',
  },
  voiceOptionActive: {
    backgroundColor: palette.umber,
    borderColor: palette.umber,
  },
  voiceText: {
    color: palette.umber,
    fontWeight: '800',
  },
  voiceTextActive: {
    color: palette.panel,
  },
});
