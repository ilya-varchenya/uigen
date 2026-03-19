# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup       # Install deps + Prisma generate + run migrations (first-time setup)
npm run dev         # Dev server with Turbopack
npm run build       # Production build
npm run test        # Run all tests (Vitest)
npm run lint        # ESLint
```

To run a single test file:
```bash
npx vitest run src/path/to/test.test.tsx
```

Environment: requires `ANTHROPIC_API_KEY` for real AI generation; the app falls back to a mock provider if unset.

## Architecture

UIGen is a Next.js 15 App Router app that lets users generate React components via AI chat with live preview. All component code lives in an **in-memory virtual file system** — nothing is written to disk.

### Core data flow

1. User sends a message in `ChatContext` → serialized VFS state is sent to `/api/chat`
2. `/api/chat/route.ts` reconstructs the VFS, calls Claude (or mock) via Vercel AI SDK's `streamText`
3. Claude uses two tools to manipulate files: `str_replace_editor` and `file_manager`
4. Tool calls stream back to the client, `FileSystemContext` applies them to the in-memory VFS
5. `PreviewFrame` re-renders an iframe by running the VFS files through `JSXTransformer`, which uses Babel standalone + an import map

### Key modules

| Path | Role |
|------|------|
| `src/lib/file-system.ts` | `VirtualFileSystem` class — CRUD, serialization |
| `src/lib/contexts/file-system-context.tsx` | Client state for VFS; handles incoming tool calls |
| `src/lib/contexts/chat-context.tsx` | Wraps Vercel AI `useChat`; serializes VFS into API body |
| `src/app/api/chat/route.ts` | POST handler; runs `streamText` with tools; saves projects for auth users |
| `src/lib/tools/str-replace.ts` | `str_replace_editor` tool — view/create/str_replace/insert |
| `src/lib/tools/file-manager.ts` | `file_manager` tool — rename/delete files and dirs |
| `src/lib/transform/jsx-transformer.ts` | Babel-based JSX transform + import map generation for iframe preview |
| `src/lib/provider.ts` | Selects Claude (`claude-haiku-4-5`) or `MockLanguageModel` |
| `src/lib/prompts/generation.tsx` | System prompt; requires `/App.jsx` as entry point, `@/` import alias |
| `src/lib/auth.ts` | JWT sessions (7-day, httpOnly cookie) |
| `src/actions/index.ts` | Server actions: auth (signUp/signIn/signOut), projects (CRUD) |
| `src/middleware.ts` | Protects `/api/projects` and `/api/filesystem` routes |

### Database

Schema is defined in `prisma/schema.prisma` — reference it whenever you need to understand stored data structure. Prisma + SQLite (`prisma/dev.db`). Two models:
- **User**: id, email (unique), password (bcrypt)
- **Project**: id, name, userId (optional), messages (JSON string), data (JSON string — serialized VFS snapshot)

### Component generation conventions

- Entry point must be `/App.jsx`
- Imports use `@/` alias (maps to other VFS files)
- Styling is Tailwind CSS v4
- Generated components are plain React with no bundler — they execute directly in the iframe via import maps

### Code style

Use comments sparingly. Only comment complex code.

### Testing

Vitest with jsdom environment. Tests cover chat components, file system, contexts, and the JSX transformer. Config is in `vitest.config.mts`.
