import { Pressable, Text, View } from 'react-native';

import { useI18n } from '@/shared/i18n/I18nContext';
import type { Novel } from '@/shared/types/domain';

import { styles } from '../importer.styles';

type NovelPickerProps = {
  novels: Novel[];
  selectedNovelId: string | null;
  onSelect: (id: string | null) => void;
};

export function NovelPicker({ novels, selectedNovelId, onSelect }: NovelPickerProps) {
  const { t } = useI18n();

  if (novels.length === 0) {
    return null;
  }

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{t('import.existingNovel')}</Text>
      <View style={styles.novelPills}>
        <Pressable
          style={[styles.novelPill, selectedNovelId === null && styles.novelPillActive]}
          onPress={() => onSelect(null)}>
          <Text style={[styles.novelPillText, selectedNovelId === null && styles.novelPillTextActive]}>{t('import.newNovel')}</Text>
        </Pressable>
        {novels.map((novel) => (
          <Pressable
            key={novel.id}
            style={[styles.novelPill, selectedNovelId === novel.id && styles.novelPillActive]}
            onPress={() => onSelect(novel.id)}>
            <Text style={[styles.novelPillText, selectedNovelId === novel.id && styles.novelPillTextActive]} numberOfLines={1}>
              {novel.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
