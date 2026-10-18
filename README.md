# Pornhwa DB Mobile

A dark-first, image-led mobile catalogue and reading-library application for the [Pornhwa DB API](https://pornhwadb.com/api/v1), built with React Native, Expo (SDK 57), Expo Router, NativeWind (Tailwind CSS), Zustand, and TanStack Query.

---

## Architecture — Three Pillars

The codebase enforces strict, unidirectional layer separation:
```
UI  →  Logic  →  API  →  Shared
```

1. **API Layer (`src/api/`)**
   - Transport, typed endpoint clients, request throttling, ETag cache store, and error normalization.
   - Strictly free of React hooks, JSX, and application state.
   - Includes automatic request abortion (`abortAuthenticatedRequests`) and secure `X-API-Key` injection.

2. **Logic Layer (`src/logic/`)**
   - Zustand stores (`useRootStore` with modular slices: auth, browse filters, library UI, settings, reader, etc.).
   - TanStack Query hooks and query key factories.
   - Persistent offline write queue (`mutations.queue.ts`) with backoff retry and account isolation.
   - Data mappers (`src/logic/mappers/`) transforming API DTOs into clean domain models.
   - Pure use cases (`connectAccount`, `queueTrackingWrite`, etc.).
   - Strictly free of JSX or presentational elements.

3. **UI Layer (`src/ui/`)**
   - Design system primitives, domain components, feedback states, and screens.
   - Semantic tokens adhering to the AMOLED dark palette (via NativeWind CSS variables).
   - Icon-first navigation with full accessibility support (`accessibilityLabel`, `accessibilityRole`).

4. **Shared Layer (`src/shared/`)**
   - Pure utility functions, constants, formatting, rate limiters, storage abstractions, and TypeScript interfaces.

5. **Routing (`app/`)**
   - File-based routing powered by **Expo Router**.
   - Route files serve as thin glue layers binding logic hooks to UI screen components.

---

## Offline Synchronization & Caching

- **Query Cache Persistence**: Backed by `@tanstack/query-async-storage-persister` saving TanStack Query cache into AsyncStorage (`phdb.query-cache.v1`).
- **HTTP ETag Revalidation**: HTTP responses are cached with their server-supplied ETags (`phdb.etag-cache.v1`). In-flight GET requests send `If-None-Match`, returning cached payloads on HTTP 304.
- **Persistent Write Queue**: Mutations performed while offline or during transient network failures are enqueued in FIFO order (`phdb.write-queue.v1`) and flushed automatically upon reconnection.
- **Startup Hydration**: On app startup, both the mutation queue and ETag cache are hydrated before UI actions dispatch.

---

## Account Isolation & Security

- **In-flight Request Abort**: Disconnecting or switching accounts immediately aborts all pending authenticated Axios requests via `AbortController`.
- **Query & Persistence Purge**: On account disconnect, all active queries are cancelled, the TanStack Query client is cleared in memory, and persisted query storage is wiped.
- **Cache Partitioning**: Private endpoints (`/me`, `/tracking`, `/notifications`) are tagged with `[user:<uid>]`. On logout, `clearUserCache(uid)` removes the user's private cached responses while preserving public catalogue cache.
- **Write Queue Isolation**: Every queued mutation is tagged with the user's `accountId`. When flushed, only writes matching the currently authenticated account are processed. Writes from previous accounts remain safely deferred.
- **Safe 401 Handling**: When an authenticated request fails with 401, the system verifies that the failing key matches the currently active key before triggering a logout, preventing stale background requests from evicting newly connected accounts.

---

## Available Commands

| Command | Description |
|---|---|
| `npm test` | Runs the automated test suite using `tsx` and Node's built-in `node:test` runner |
| `npm run typecheck` | Runs the TypeScript compiler (`tsc --noEmit`) to verify type safety |
| `npm run check` | Runs lint, typecheck, and tests in sequence (local pre-push gate) |
| `npm run lint` | Runs ESLint with Expo and Prettier rules |
| `npm run build:web` | Exports the web distribution bundle into `dist/` |
| `npm start` | Launches the Expo development server |
| `npm run android` | Starts Expo dev server with Android intent |
| `npm run ios` | Starts Expo dev server with iOS intent |
| `npm run format` | Formats all source files with Prettier |
| `npm run codegen:api` | Regenerates TypeScript API types from the live OpenAPI spec |

---

## Continuous Integration (Jenkins)

The project includes a declarative `Jenkinsfile` configured for automated quality checks and multi-platform artifact builds:
- **Quality Checks Stage (Parallel)**:
  - `Typecheck`: Verifies zero TypeScript compilation errors.
  - `Lint`: Runs ESLint across all source and test files.
  - `Test`: Runs the full regression test suite (`npm test`).
- **Artifact Build Stages**:
  - `Build Web`: Generates and archives `dist/` production assets.
  - `Build Android`: Executes `npx expo prebuild` and compiles release/debug APKs via Gradle.
