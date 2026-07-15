import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/app/PrimaryButton';
import { Screen } from '@/components/app/Screen';
import { createNovelWithChapters, addManualChapter, getNextChapterNumber, listNovels } from '@/lib/data/repository';
import type { Novel } from '@/lib/data/types';
import { countWords, createId, normalizeText, saveChapterText } from '@/lib/files/text-storage';
import { persistDraftText, pickChapterFiles, type PickedChapterDraft } from '@/lib/import/importer';
import { palette, shadows } from '@/lib/theme/tokens';

type ImportMode = 'files' | 'paste';

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A9937C"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[styles.input, multiline && styles.textArea]}
      />
    </View>
  );
}

export function ImportScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const [mode, setMode] = useState<ImportMode>('files');
  const [novelTitle, setNovelTitle] = useState('');
  const [drafts, setDrafts] = useState<PickedChapterDraft[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [saving, setSaving] = useState(false);
  const [novels, setNovels] = useState<Novel[]>([]);
  const [selectedNovelId, setSelectedNovelId] = useState<string | null>(null);
  const [manualNovelTitle, setManualNovelTitle] = useState('');
  const [manualChapterTitle, setManualChapterTitle] = useState('');
  const [manualText, setManualText] = useState('');

  useEffect(() => {
    listNovels(db).then(setNovels);
  }, [db]);

  const validDrafts = useMemo(() => drafts.filter((draft) => !draft.error && draft.text.trim()), [drafts]);
  const failedDrafts = drafts.length - validDrafts.length;

  async function handlePickFiles() {
    setLoadingFiles(true);
    try {
      const picked = await pickChapterFiles();
      if (picked.length > 0) {
        setDrafts(picked);
        setNovelTitle((current) => current || picked[0]?.originalFileName?.replace(/\.[^/.]+$/, '') || '');
      }
    } catch (error) {
      Alert.alert('Nao foi possivel importar', error instanceof Error ? error.message : 'Tente novamente.');
    } finally {
      setLoadingFiles(false);
    }
  }

  function updateDraftTitle(id: string, title: string) {
    setDrafts((current) => current.map((draft) => (draft.id === id ? { ...draft, title } : draft)));
  }

  function moveDraft(id: string, direction: -1 | 1) {
    setDrafts((current) => {
      const index = current.findIndex((draft) => draft.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const copy = [...current];
      const [draft] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, draft);
      return copy.map((item, itemIndex) => ({ ...item, chapterNumber: itemIndex + 1 }));
    });
  }

  async function saveFileImport() {
    const title = novelTitle.trim();
    if (!title || validDrafts.length === 0) {
      Alert.alert('Revise a importacao', 'Informe o titulo da webnovel e mantenha ao menos um capitulo valido.');
      return;
    }

    setSaving(true);
    try {
      const novelId = createId('novel');
      const chapters = validDrafts.map((draft, index) =>
        persistDraftText(novelId, { ...draft, chapterNumber: index + 1 }),
      );

      await createNovelWithChapters(db, { id: novelId, title }, chapters);
      router.replace(`/novel/${novelId}`);
    } catch (error) {
      Alert.alert('Erro ao salvar', error instanceof Error ? error.message : 'Nao foi possivel salvar a webnovel.');
    } finally {
      setSaving(false);
    }
  }

  async function saveManualImport() {
    const normalizedText = normalizeText(manualText);
    const existingNovel = novels.find((novel) => novel.id === selectedNovelId);
    const title = existingNovel?.title ?? manualNovelTitle.trim();

    if (!title || !manualChapterTitle.trim() || !normalizedText) {
      Alert.alert('Complete os campos', 'Informe webnovel, titulo do capitulo e texto.');
      return;
    }

    setSaving(true);
    try {
      const novelId = existingNovel?.id ?? createId('novel');
      const chapterId = createId('chapter');
      const nextNumber = existingNovel ? await getNextChapterNumber(db, existingNovel.id) : 1;
      const textFileUri = saveChapterText(novelId, chapterId, normalizedText);

      await addManualChapter(
        db,
        { id: novelId, title, existingNovelId: existingNovel?.id },
        {
          id: chapterId,
          novelId,
          title: manualChapterTitle,
          chapterNumber: nextNumber,
          sourceType: 'manual',
          originalFileName: null,
          textFileUri,
          wordCount: countWords(normalizedText),
        },
      );

      router.replace(`/reader/${chapterId}`);
    } catch (error) {
      Alert.alert('Erro ao salvar', error instanceof Error ? error.message : 'Nao foi possivel salvar o capitulo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Entrada local</Text>
          <Text style={styles.title}>Importar webnovel</Text>
        </View>

        <View style={styles.modeSwitch}>
          <Pressable style={[styles.modeButton, mode === 'files' && styles.modeButtonActive]} onPress={() => setMode('files')}>
            <Ionicons name="documents" size={18} color={mode === 'files' ? palette.panel : palette.umber} />
            <Text style={[styles.modeText, mode === 'files' && styles.modeTextActive]}>Arquivos</Text>
          </Pressable>
          <Pressable style={[styles.modeButton, mode === 'paste' && styles.modeButtonActive]} onPress={() => setMode('paste')}>
            <Ionicons name="create" size={18} color={mode === 'paste' ? palette.panel : palette.umber} />
            <Text style={[styles.modeText, mode === 'paste' && styles.modeTextActive]}>Colar texto</Text>
          </Pressable>
        </View>

        {mode === 'files' ? (
          <View style={styles.panel}>
            <Field
              label="Titulo da webnovel"
              value={novelTitle}
              onChangeText={setNovelTitle}
              placeholder="Ex.: Lord of the Mysteries"
            />

            <PrimaryButton
              title={loadingFiles ? 'Lendo arquivos...' : 'Selecionar TXT/PDF'}
              icon="folder-open"
              onPress={handlePickFiles}
              disabled={loadingFiles || saving}
            />

            {loadingFiles ? <ActivityIndicator color={palette.umber} /> : null}

            {drafts.length > 0 ? (
              <View style={styles.summary}>
                <Text style={styles.summaryText}>
                  {validDrafts.length} capitulos validos
                  {failedDrafts > 0 ? `, ${failedDrafts} com erro` : ''}
                </Text>
              </View>
            ) : null}

            <FlatList
              data={drafts}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.draftList}
              renderItem={({ item, index }) => (
                <View style={[styles.draftCard, item.error && styles.draftError]}>
                  <View style={styles.draftTop}>
                    <Text style={styles.chapterNumber}>#{index + 1}</Text>
                    <View style={styles.draftActions}>
                      <Pressable hitSlop={10} onPress={() => moveDraft(item.id, -1)}>
                        <Ionicons name="arrow-up" size={20} color={palette.umber} />
                      </Pressable>
                      <Pressable hitSlop={10} onPress={() => moveDraft(item.id, 1)}>
                        <Ionicons name="arrow-down" size={20} color={palette.umber} />
                      </Pressable>
                    </View>
                  </View>
                  <TextInput
                    value={item.title}
                    onChangeText={(value) => updateDraftTitle(item.id, value)}
                    style={styles.draftTitleInput}
                    placeholderTextColor="#A9937C"
                  />
                  <Text style={styles.draftMeta}>
                    {item.originalFileName} · {item.sourceType.toUpperCase()} · {item.wordCount} palavras
                  </Text>
                  {item.error ? <Text style={styles.errorText}>{item.error}</Text> : null}
                </View>
              )}
            />

            <PrimaryButton
              title={saving ? 'Salvando...' : 'Salvar webnovel'}
              icon="checkmark"
              onPress={saveFileImport}
              disabled={saving || validDrafts.length === 0}
            />
          </View>
        ) : (
          <View style={styles.panel}>
            {novels.length > 0 ? (
              <View style={styles.field}>
                <Text style={styles.label}>Adicionar em webnovel existente</Text>
                <View style={styles.novelPills}>
                  <Pressable
                    style={[styles.novelPill, selectedNovelId === null && styles.novelPillActive]}
                    onPress={() => setSelectedNovelId(null)}>
                    <Text style={[styles.novelPillText, selectedNovelId === null && styles.novelPillTextActive]}>Nova</Text>
                  </Pressable>
                  {novels.map((novel) => (
                    <Pressable
                      key={novel.id}
                      style={[styles.novelPill, selectedNovelId === novel.id && styles.novelPillActive]}
                      onPress={() => setSelectedNovelId(novel.id)}>
                      <Text style={[styles.novelPillText, selectedNovelId === novel.id && styles.novelPillTextActive]} numberOfLines={1}>
                        {novel.title}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}

            {!selectedNovelId ? (
              <Field
                label="Titulo da webnovel"
                value={manualNovelTitle}
                onChangeText={setManualNovelTitle}
                placeholder="Nome da novel"
              />
            ) : null}
            <Field
              label="Titulo do capitulo"
              value={manualChapterTitle}
              onChangeText={setManualChapterTitle}
              placeholder="Capitulo 1"
            />
            <Field
              label="Texto"
              value={manualText}
              onChangeText={setManualText}
              placeholder="Cole o conteudo aqui..."
              multiline
            />
            <Text style={styles.summaryText}>{countWords(manualText)} palavras</Text>
            <PrimaryButton
              title={saving ? 'Salvando...' : 'Salvar capitulo'}
              icon="save"
              onPress={saveManualImport}
              disabled={saving}
            />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
    paddingBottom: 32,
    gap: 18,
  },
  header: {
    gap: 2,
  },
  eyebrow: {
    color: palette.umber,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: palette.ink,
    fontSize: 34,
    fontWeight: '900',
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
