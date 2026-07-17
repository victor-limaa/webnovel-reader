import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, TextInput, View } from 'react-native';

import { INPUT_PLACEHOLDER_COLOR } from '../constants';
import { styles } from '../styles';
import type { PickedChapterDraft } from '@/lib/import/importer';
import { palette } from '@/lib/theme/tokens';

type DraftCardProps = {
  draft: PickedChapterDraft;
  index: number;
  onMove: (id: string, direction: -1 | 1) => void;
  onTitleChange: (id: string, title: string) => void;
};

export function DraftCard({ draft, index, onMove, onTitleChange }: DraftCardProps) {
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
        {draft.originalFileName} · {draft.sourceType.toUpperCase()} · {draft.wordCount} palavras
      </Text>
      {draft.error ? <Text style={styles.errorText}>{draft.error}</Text> : null}
    </View>
  );
}
