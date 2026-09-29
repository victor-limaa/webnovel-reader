import { File } from 'expo-file-system';

/** Web PDF.js adapter used only by the infrastructure layer. */
type PdfTextContentItem = {
  str?: string;
  hasEOL?: boolean;
};

const textOnlyCanvasFactory = {
  create() {
    throw new Error('PDF page rendering is not available during text extraction.');
  },
  reset() {},
  destroy() {},
};

export async function extractPdfText(uri: string) {
  const pdfjs = await import('pdfjs-dist/build/pdf');
  const bytes = await new File(uri).bytes();
  const loadingTask = pdfjs.getDocument({
    data: bytes,
    disableFontFace: true,
    disableRange: true,
    disableStream: true,
    disableAutoFetch: true,
    isOffscreenCanvasSupported: false,
    canvasMaxAreaInBytes: 0,
    useSystemFonts: false,
    useWorkerFetch: false,
    isEvalSupported: false,
    canvasFactory: textOnlyCanvasFactory,
  });
  const document = await loadingTask.promise;
  const pages: string[] = [];

  try {
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      const text = content.items
        .map((item) => {
          const textItem = item as PdfTextContentItem;
          return `${textItem.str ?? ''}${textItem.hasEOL ? '\n' : ' '}`;
        })
        .join('')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();

      if (text.length > 0) {
        pages.push(text);
      }
    }
  } finally {
    await document.destroy();
  }

  const result = pages.join('\n\n');
  if (result.trim().length === 0) {
    throw new Error('Este PDF nao possui texto extraivel. PDFs escaneados precisam de OCR e ficam fora do MVP.');
  }

  return result;
}
