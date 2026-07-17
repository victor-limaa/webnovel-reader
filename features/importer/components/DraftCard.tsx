import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, TextInput, View } from 'react-native';

import { INPUT_PLACEHOLDER_COLOR } from '../constants';
import { getDraftErrorMessage } from '../helpers';
import { styles } from '../styles';
import type { PickedChapterDraft } from '@/lib/import/importer';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { palette } from '@/lib/theme/tokens';

type DraftCardProps = {
  draft: PickedChapterDraft;
  index: number;
  onMove: (id: string, direction: -1 | 1) => void;
  onTitleChange: (id: string, title: string) => void;
};

export function DraftCard({ draft, index, onMove, onTitleChange }: DraftCardProps) {
  const { t } = useI18n();

  return (
    <View style={[styles.draftCard, draft.error && styles.draftError]}>
      <View style={styles.draftTop}>
        <Text style={styles.chapterNumber}>#{index + 1}</Text>
        <View style={styles.draftActions}>
          <Pressable hitSlop={10} onPress={() => onMove(draft.id, -1)}>
            <Ionicons name="arrow-up" size={20} color={palette.umber} />
          </Pressable>
          <Pressable hitSlop={10} onPress={() => onMove(draft.id, 1)}>
            <Ionicons name="arrow-down" size={20} color={palette.umber} />
          </Pressable>
        </View>
      </View>
      <TextInput
        value={draft.title}
        onChangeText={(value) => onTitleChange(draft.id, value)}
        style={styles.draftTitleInput}
        placeholderTextColor={INPUT_PLACEHOLDER_COLOR}
      />
      <Text style={styles.draftMeta}>
        {draft.originalFileName} · {t('common.sourceMeta', { source: draft.sourceType.toUpperCase(), count: draft.wordCount })}
      </Text>
      {draft.error ? <Text style={styles.errorText}>{getDraftErrorMessage(draft.error, t)}</Text> : null}
    </View>
  );
}
