import { File } from 'expo-file-system';

type PdfTextContentItem = {
  str?: string;
  hasEOL?: boolean;
};

export async function extractPdfText(uri: string) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const bytes = await new File(uri).bytes();
  const loadingTask = pdfjs.getDocument({
    data: bytes,
    disableFontFace: true,
    useWorkerFetch: false,
    isEvalSupported: false,
  });
  const document = await loadingTask.promise;
  const pages: string[] = [];

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

  const result = pages.join('\n\n');
  if (result.trim().length === 0) {
    throw new Error('Este PDF nao possui texto extraivel. PDFs escaneados precisam de OCR e ficam fora do MVP.');
  }

  await document.destroy();
  return result;
}
