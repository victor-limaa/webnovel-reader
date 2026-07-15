declare module 'pdfjs-dist/legacy/build/pdf.mjs' {
  export function getDocument(options: {
    data: Uint8Array;
    disableFontFace?: boolean;
    useWorkerFetch?: boolean;
    isEvalSupported?: boolean;
  }): {
    promise: Promise<{
      numPages: number;
      getPage(pageNumber: number): Promise<{
        getTextContent(): Promise<{ items: unknown[] }>;
      }>;
      destroy(): Promise<void>;
    }>;
  };
}
