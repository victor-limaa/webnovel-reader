import { Text, View } from 'react-native';

import { IconButton } from '@/shared/design-system/components/IconButton';
import { useI18n } from '@/shared/i18n/I18nContext';

import { styles } from '../reader.styles';
import type { ReaderHeaderProps } from '../model/reader.types';

export function ReaderHeader({ chapter, theme, onBack, onOpenChapterList, onOpenSettings }: ReaderHeaderProps) {
  const { t } = useI18n();

  return (
    <View style={[styles.readerHeader, { backgroundColor: theme.background, borderBottomColor: theme.line }]}>
      <IconButton icon="arrow-back" onPress={onBack} />
      <View style={styles.headerText}>
        <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>{chapter.title}</Text>
        <Text style={[styles.headerMeta, { color: theme.muted }]}>
          {t('common.chapter', { number: chapter.chapterNumber })}
        </Text>
      </View>
      <IconButton icon="list" onPress={onOpenChapterList} />
      <IconButton icon="settings-outline" onPress={onOpenSettings} />
    </View>
  );
}
