declare module 'pdfjs-dist/legacy/build/pdf' {
  export function getDocument(options: {
    data: Uint8Array;
    disableFontFace?: boolean;
    disableRange?: boolean;
    disableStream?: boolean;
    disableAutoFetch?: boolean;
    isOffscreenCanvasSupported?: boolean;
    canvasMaxAreaInBytes?: number;
    useSystemFonts?: boolean;
    useWorkerFetch?: boolean;
    isEvalSupported?: boolean;
    canvasFactory?: object;
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

declare module 'pdfjs-dist/legacy/build/pdf.worker' {
  export const WorkerMessageHandler: unknown;
}

declare module 'pdfjs-dist/build/pdf' {
  export function getDocument(options: {
    data: Uint8Array;
    disableFontFace?: boolean;
    disableRange?: boolean;
    disableStream?: boolean;
    disableAutoFetch?: boolean;
    isOffscreenCanvasSupported?: boolean;
    canvasMaxAreaInBytes?: number;
    useSystemFonts?: boolean;
    useWorkerFetch?: boolean;
    isEvalSupported?: boolean;
    canvasFactory?: object;
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

declare module 'whatwg-url-without-unicode' {
  export class URL {
    constructor(url: string, base?: string | URL);
    href: string;
    origin: string;
    protocol: string;
    username: string;
    password: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
    toString(): string;
  }

  export class URLSearchParams {
    constructor(init?: string | Record<string, string> | [string, string][]);
    append(name: string, value: string): void;
    delete(name: string, value?: string): void;
    forEach(callback: (value: string, name: string) => void): void;
    get(name: string): string | null;
    has(name: string, value?: string): boolean;
    set(name: string, value: string): void;
    toString(): string;
  }
}
