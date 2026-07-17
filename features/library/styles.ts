import { StyleSheet } from 'react-native';

import { palette, shadows } from '@/lib/theme/tokens';

export const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingTop: 18,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  detailHeader: {
    paddingTop: 14,
    paddingBottom: 12,
    alignItems: 'flex-start',
  },
  hero: {
    minHeight: 132,
    borderRadius: 8,
    padding: 18,
    backgroundColor: palette.umberDark,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    overflow: 'hidden',
  },
  heroText: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  heroTitle: {
    color: palette.panel,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
  },
  heroBody: {
    color: '#E9D4BD',
    fontSize: 14,
    lineHeight: 20,
  },
  heroMark: {
    width: 72,
    height: 96,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: palette.umber,
    borderWidth: 1,
    borderColor: '#A56B3E',
    transform: [{ rotate: '7deg' }],
  },
  list: {
    gap: 12,
    paddingBottom: 28,
  },
  chapterList: {
    gap: 10,
    paddingBottom: 28,
  },
  emptyList: {
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    gap: 14,
    padding: 14,
    borderRadius: 8,
    backgroundColor: palette.panel,
    borderWidth: 1,
    borderColor: palette.line,
    ...shadows.lifted,
  },
  pressed: {
    opacity: 0.82,
  },
  cardContent: {
    flex: 1,
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  novelTitle: {
    flex: 1,
    color: palette.ink,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '900',
  },
  meta: {
    color: palette.umber,
    fontSize: 13,
    fontWeight: '800',
  },
  resume: {
    color: palette.muted,
    fontSize: 13,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.paperDeep,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: palette.gold,
  },
  detailHero: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.panel,
    marginBottom: 14,
    ...shadows.lifted,
  },
  detailHeroText: {
    flex: 1,
    gap: 8,
  },
  detailTitle: {
    color: palette.ink,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
  },
  detailMeta: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    color: palette.ink,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 22,
    marginBottom: 10,
  },
  chapterCard: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 8,
    backgroundColor: palette.panel,
    borderWidth: 1,
    borderColor: palette.line,
    padding: 12,
  },
  chapterBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.paperDeep,
  },
  chapterBadgeActive: {
    backgroundColor: palette.umber,
  },
  chapterBadgeText: {
    color: palette.umber,
    fontWeight: '900',
  },
  chapterBadgeTextActive: {
    color: palette.panel,
  },
  chapterText: {
    flex: 1,
    gap: 3,
  },
  chapterTitle: {
    color: palette.ink,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
  },
  chapterMeta: {
    color: palette.muted,
    fontSize: 12,
  },
});
