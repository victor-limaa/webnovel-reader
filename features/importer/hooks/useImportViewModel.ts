import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import { addManualChapter, createNovelWithChapters, getNextChapterNumber, listNovels } from '@/lib/data/repository';
import type { Novel } from '@/lib/data/types';
import { countWords, createId, normalizeText, saveChapterText } from '@/lib/files/text-storage';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { persistDraftText, pickChapterFiles, type PickedChapterDraft } from '@/lib/import/importer';

import { getInitialNovelTitle, reorderDrafts } from '../helpers';
import type { ImportMode, ImportViewModel } from '../types';

export function useImportViewModel(): ImportViewModel {
  const db = useSQLiteContext();
  const router = useRouter();
  const { t } = useI18n();
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
  const manualWordCount = useMemo(() => countWords(manualText), [manualText]);
  const failedDrafts = drafts.length - validDrafts.length;

  async function handlePickFiles() {
    setLoadingFiles(true);
    try {
      const picked = await pickChapterFiles((chapterNumber) => t('common.chapter', { number: chapterNumber }));
      if (picked.length > 0) {
        setDrafts(picked);
        setNovelTitle((current) => current || getInitialNovelTitle(picked[0]));
      }
    } catch (error) {
      Alert.alert(t('import.pickErrorTitle'), error instanceof Error ? error.message : t('import.pickErrorFallback'));
    } finally {
      setLoadingFiles(false);
    }
  }

  function updateDraftTitle(id: string, title: string) {
    setDrafts((current) => current.map((draft) => (draft.id === id ? { ...draft, title } : draft)));
  }

  function moveDraft(id: string, direction: -1 | 1) {
    setDrafts((current) => reorderDrafts(current, id, direction));
  }

  async function saveFileImport() {
    const title = novelTitle.trim();
    if (!title || validDrafts.length === 0) {
      Alert.alert(t('import.reviewTitle'), t('import.reviewMessage'));
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
      Alert.alert(t('import.saveErrorTitle'), error instanceof Error ? error.message : t('import.saveNovelError'));
    } finally {
      setSaving(false);
    }
  }

  async function saveManualImport() {
    const normalizedText = normalizeText(manualText);
    const existingNovel = novels.find((novel) => novel.id === selectedNovelId);
    const title = existingNovel?.title ?? manualNovelTitle.trim();

    if (!title || !manualChapterTitle.trim() || !normalizedText) {
      Alert.alert(t('import.completeTitle'), t('import.completeMessage'));
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
      Alert.alert(t('import.saveErrorTitle'), error instanceof Error ? error.message : t('import.saveChapterError'));
    } finally {
      setSaving(false);
    }
  }

  return {
    mode,
    setMode,
    novelTitle,
    setNovelTitle,
    drafts,
    validDrafts,
    failedDrafts,
    loadingFiles,
    saving,
    novels,
    selectedNovelId,
    setSelectedNovelId,
    manualNovelTitle,
    setManualNovelTitle,
    manualChapterTitle,
    setManualChapterTitle,
    manualText,
    setManualText,
    manualWordCount,
    handlePickFiles,
    moveDraft,
    saveFileImport,
    saveManualImport,
    updateDraftTitle,
  };
}
