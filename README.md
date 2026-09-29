# Webnovel Reader

A cross-platform application for organizing, reading, and listening to webnovels directly on your device. Webnovel Reader turns TXT files, PDFs with selectable text, and manually pasted content into a local library, preserving chapters, preferences, and reading progress without requiring an account or a constant internet connection.

Built with Expo, React Native, and TypeScript, the project runs on Android, iOS, and the web from a single codebase.

## Overview

Webnovel Reader is designed for readers who keep chapters in separate files or want to build a personal reading collection. The main workflow lets users:

1. import one or multiple chapters;
2. review titles and arrange the files;
3. save the content as a new or existing webnovel;
4. read with a customizable appearance;
5. resume from the saved position or listen using the voices available on the device.

Structured data is stored in SQLite, while the full chapter content is kept as text files in the application's document directory. This separation avoids storing long texts in the database and keeps library and progress queries simple and efficient.

## Features

### Local library

- Lists webnovels stored on the device.
- Displays chapter counts and the last chapter accessed.
- Provides a detail screen with chapters in reading order.
- Offers quick access to start or resume reading.
- Works offline after content has been imported.

### Content import

- Select multiple TXT and PDF files.
- Sort selected files naturally and rearrange them manually before saving.
- Derive initial chapter titles from file names, with support for editing them.
- Extract text from digital PDFs on Android, iOS, and the web.
- Normalize imported text and count its words.
- Create chapters manually from pasted text.
- Create a new webnovel or add a manual chapter to an existing one.
- Identify chapters that could not be read before completing an import.

> Scanned or image-only PDFs cannot be processed because the project does not currently include OCR. A PDF must contain extractable text.

### Reader

- Paper, Sepia, and Night themes.
- Adjustable font size and line height.
- Brightness controls while reading.
- Navigation between previous and next chapters.
- Persistent scroll position and narration position.
- Automatic progress restoration when reopening a chapter.
- Text selection to choose where narration should begin.

### Text-to-speech narration

- Text-to-speech powered by `expo-speech` and the voices installed on the device.
- Playback, pause, and approximate 10-second skip forward or backward controls.
- Adjustable speed, pitch, and voice.
- Automatic splitting of long chapters into sections supported by the TTS engine.
- Automatic continuation to the next chapter when narration finishes.
- Position persistence when pausing, leaving the reader, or sending the app to the background.

### Preferences and languages

- Interface available in Brazilian Portuguese and English.
- Locally persisted reading, audio, and language preferences.
- Global reader theme selection.
- Integration with the system light or dark theme at the navigation layer.

## Technology stack

| Technology | Role |
| --- | --- |
| Expo 54 / React Native 0.81 | Cross-platform application foundation |
| React 19 | Declarative user interface |
| TypeScript | Strict typing and contracts between modules |
| Expo Router | File-based routing and typed routes |
| Expo SQLite | Catalog, progress, and preference persistence |
| Expo File System | Chapter content storage and retrieval |
| Expo Document Picker | Local TXT and PDF file selection |
| PDF.js | PDF text extraction |
| Expo Speech | Text-to-speech chapter narration |
| Expo Brightness | Reader brightness controls |
| React Navigation | Stack and bottom-tab navigation |

## Architecture

The project uses a feature-first MVVM architecture blended with React Native and Expo Router conventions. The `@/` alias points to `src/`. Route files remain in the root `app/` directory and are thin adapters with no application logic. `app.json` explicitly configures this router root so the organizational `src/app/` directory is never interpreted as routes.

```text
Routes (app/) ──► Screens / Views (src/features/*/*.screen.tsx)
                         │
                         ▼
                 Hooks / ViewModels
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
      Feature model + API       Infra capabilities
              │                     │
              └──────────┬──────────┘
                         ▼
               Shared contracts and UI
```

### Routing layer

The `app/` directory uses Expo Router's file-based routing convention. Its files are intentionally small: they receive navigation requests and render a screen exported by the corresponding feature module.

| Route | Responsibility |
| --- | --- |
| `app/(tabs)/index.tsx` | Library |
| `app/(tabs)/import.tsx` | Chapter import |
| `app/(tabs)/settings.tsx` | Global preferences |
| `app/novel/[novelId].tsx` | Webnovel details and chapters |
| `app/reader/[chapterId].tsx` | Chapter reading and narration |

Composition lives in `src/app/`: `navigation/` owns navigators, `providers/` owns global React providers, `bootstrap/` initializes infrastructure, and `config/` holds application configuration.

### Feature modules

Each directory under `src/features/` contains the interface and behavior of a specific domain:

- `model/` contains types, transformations, and pure rules without React;
- `hooks/` contains ViewModels, state, actions, effects, and orchestration;
- `components/` contains views used only by that feature;
- `api/` contains domain-specific persistence and external adapters;
- `*.screen.tsx` is the declarative View;
- `index.ts` is the feature's public entry point.

Screens are composed of smaller components and consume hooks that act as **View Models**. These hooks coordinate state, navigation, and infrastructure calls, leaving components focused on rendering and user interaction.

### Shared and infrastructure

`src/shared/` contains code genuinely reused across features: the design system, global hooks, i18n contracts, domain contracts, and generic utilities. Code starts inside a feature and moves to `shared` only after it has more than one consumer.

`src/infra/` exposes technical capabilities rather than business operations: SQLite migration, chapter file storage, platform PDF extraction, speech playback, and device brightness. Operations such as listing novels, saving reading progress, or updating settings stay in the owning feature's `api/` directory.

### Platform-specific implementations

PDF extraction uses modules with platform suffixes:

- `pdf.native.ts` contains the implementation shared by Android and iOS;
- `pdf.android.ts` and `pdf.ios.ts` forward to the native implementation;
- `pdf.web.ts` adapts PDF.js loading for the browser;
- `pdf.ts` acts as a fallback for platforms without a dedicated implementation.

This pattern keeps technical differences isolated without spreading platform conditionals throughout the import interface.

## Persistence and data model

The application creates the `webnovel-reader.db` database through `SQLiteProvider`. Migrations are incremental and tracked using `PRAGMA user_version`; foreign keys are enabled, and the database uses WAL mode.

| Table | Contents |
| --- | --- |
| `novels` | Webnovel metadata |
| `chapters` | Metadata, order, source, and file URI for each chapter |
| `reading_progress` | Current chapter, narration position, and scroll ratio for each webnovel |
| `reader_settings` | Font size, line height, and theme |
| `audio_settings` | Voice, language, playback speed, and pitch |
| `app_settings` | Interface language |

Normalized chapter texts are stored separately at:

```text
<app-documents>/webnovels/<novelId>/<chapterId>.txt
```

Operations that create a webnovel and its chapters use an exclusive transaction, preventing a partially saved catalog if an operation fails.

## Project structure

```text
webnovel-reader/
├── app/                  # Thin Expo Router route adapters
├── src/
│   ├── app/              # Navigation, providers, bootstrap, and config
│   ├── features/
│   │   ├── importer/     # api, model, hooks, components, and View
│   │   ├── library/
│   │   ├── reader/
│   │   └── settings/
│   ├── infra/            # Storage, files, speech, and device capabilities
│   └── shared/
│       ├── design-system/# Global components, tokens, and theme contract
│       ├── components/   # Other global components
│       ├── hooks/
│       ├── i18n/
│       ├── types/
│       └── utils/
├── assets/images/        # Icons, splash screen, and static images
├── shims/                # Native dependency compatibility shims
├── scripts/              # Project utility scripts
├── app.json              # Expo configuration
├── metro.config.js       # Metro bundler configuration
├── package.json          # Dependencies and commands
└── tsconfig.json         # TypeScript configuration
```

## Getting started

### Prerequisites

- A recent Node.js LTS release;
- npm;
- Expo Go, an Android emulator, an iOS simulator, or a modern browser.

The iOS simulator requires macOS and Xcode. Android can be run on a physical device or an emulator configured through Android Studio.

### Installation

```bash
git clone <repository-url>
cd webnovel-reader
npm install
```

### Development environment

Start the Expo development server:

```bash
npm start
```

Alternatively, open a specific platform directly:

```bash
npm run android
npm run ios
npm run web
```

The current application does not require environment variables.

## Code quality

Before submitting changes, run:

```bash
npm run lint
npx tsc --noEmit
```

TypeScript is configured in strict mode. The project does not currently have an automated testing framework or coverage threshold, so changes should also be verified manually on the affected platforms.

## Development conventions

- Keep routes small and delegate their implementation to `src/features/`.
- Keep Screens declarative and move state, actions, navigation, and effects to ViewModel hooks.
- Keep feature models free from React and native framework dependencies.
- Keep business operations in feature `api/` modules and technical capabilities in `infra/`.
- Promote local code to `shared/` only when multiple features use it.
- Use PascalCase for components and camelCase for functions and hooks.
- Use the `@/` alias for imports from `src/`.
- Keep platform variants next to their base module with suffixes such as `.ios.tsx`, `.android.ts`, `.native.ts`, or `.web.ts`.
- Follow the existing style: two-space indentation, single quotes, semicolons, and trailing commas in multiline structures.

## Current limitations

- Image-based PDFs require OCR and cannot currently be imported.
- The library is entirely local and does not yet support cloud synchronization or backup.
- There is no authentication, remote catalog, or automatic chapter download.
- No automated test suite is currently configured.
- TTS voice quality and availability depend on the operating system and the voices installed on the device.

## Potential next steps

- OCR support for scanned documents.
- Editing and removal of webnovels or chapters.
- Custom covers and richer metadata.
- Search, filters, and collection organization.
- Export, backup, and synchronization across devices.
- Unit tests for helpers, the repository, and View Models.
- Integration tests for imports, reading progress, and database migrations.

## Project status

The project is currently a functional MVP. Its core flows—content import, local library, offline reading, customization, progress persistence, internationalization, and narration—are implemented. Cloud features, OCR, and advanced library management remain outside the current scope.
