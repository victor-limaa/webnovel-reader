import { File } from 'expo-file-system';
import { URL, URLSearchParams } from 'whatwg-url-without-unicode';

/** Native PDF.js adapter used only by the infrastructure layer. */
type PdfTextContentItem = {
  str?: string;
  hasEOL?: boolean;
};

type PdfJsModule = typeof import('pdfjs-dist/legacy/build/pdf');
type PdfJsWorkerModule = typeof import('pdfjs-dist/legacy/build/pdf.worker');

type PdfWorkerGlobal = typeof globalThis & {
  URL?: unknown;
  URLSearchParams?: unknown;
  DOMException?: unknown;
  pdfjsWorker?: PdfJsWorkerModule;
};

class NativeDOMException extends Error {
  constructor(message = '', name = 'Error') {
    super(message);
    this.name = name;
  }
}

const textOnlyCanvasFactory = {
  create() {
    throw new Error('Renderizacao de paginas PDF nao esta disponivel no mobile.');
  },
  reset() {},
  destroy() {},
};

function installNativePdfGlobals() {
  const pdfGlobal = globalThis as Record<string, unknown>;
  pdfGlobal.URL ??= URL;
  pdfGlobal.URLSearchParams ??= URLSearchParams;
  pdfGlobal.DOMException ??= NativeDOMException;
}

async function loadPdfJs(): Promise<PdfJsModule> {
  installNativePdfGlobals();

  const [pdfjs, pdfjsWorker] = await Promise.all([
    import('pdfjs-dist/legacy/build/pdf'),
    import('pdfjs-dist/legacy/build/pdf.worker'),
  ]);

  (globalThis as PdfWorkerGlobal).pdfjsWorker = pdfjsWorker;
  return pdfjs;
}

export async function extractPdfText(uri: string) {
  const pdfjs = await loadPdfJs();

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
