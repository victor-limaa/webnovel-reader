import { ActivityIndicator, Text, View } from 'react-native';

import { IconButton } from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { palette } from '@/lib/theme/tokens';

import { ReaderContent } from './components/ReaderContent';
import { ReaderHeader } from './components/ReaderHeader';
import { ReaderPlayer } from './components/ReaderPlayer';
import { useReaderViewModel } from './hooks/useReaderViewModel';
import { styles } from './styles';

export function ReaderScreen() {
  const viewModel = useReaderViewModel();
  const { t } = useI18n();

  if (viewModel.loading) {
    return (
      <Screen padded={false}>
        <View style={styles.center}>
          <ActivityIndicator color={palette.umber} />
        </View>
      </Screen>
    );
  }

  if (!viewModel.chapter || !viewModel.settings) {
    return (
      <Screen>
        <IconButton icon="arrow-back" onPress={viewModel.handleBack} />
        <View style={styles.center}>
          <Text style={styles.missing}>{t('reader.missing')}</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen padded={false} safeAreaStyle={{ backgroundColor: viewModel.theme.background }} style={{ backgroundColor: viewModel.theme.background }}>
      <ReaderHeader
        chapter={viewModel.chapter}
        theme={viewModel.theme}
        onBack={viewModel.handleBack}
        onOpenChapterList={viewModel.openChapterList}
      />
      <ReaderContent
        scrollRef={viewModel.scrollRef}
        text={viewModel.text}
        title={viewModel.chapter.title}
        settings={viewModel.settings}
        theme={viewModel.theme}
        onScroll={viewModel.handleScroll}
        onScrollEnd={viewModel.handleScrollEnd}
      />
      <ReaderPlayer
        previous={viewModel.previous}
        next={viewModel.next}
        isSpeaking={viewModel.isSpeaking}
        theme={viewModel.theme}
        onPlay={viewModel.handlePlay}
        onStop={viewModel.handleStop}
        onMoveAudio={viewModel.moveAudio}
        onOpenChapter={viewModel.openAdjacentChapter}
      />
    </Screen>
  );
}
