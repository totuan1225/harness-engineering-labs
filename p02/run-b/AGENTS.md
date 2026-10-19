# AGENTS.md — P02 Agent-Readable Workspace

## Mission

Develop the Knowledge Base Electron application through multiple independent AI Agent sessions.

The repository is the source of truth. Do not rely on previous chat history to determine project state.

## Required Reading Order

At the beginning of every session:

1. Read `AGENTS.md`.
2. Read `session-handoff.md` if it exists.
3. Read `feature_list.json`.
4. Read `docs/PRODUCT.md`.
5. Read `docs/ARCHITECTURE.md`.
6. Inspect relevant source files to verify the documented behavior.

Do not assume a feature works solely because its status is `pass`.

## Architecture Rules

- Main process: `src/main/` — Electron lifecycle and IPC handlers.
- Preload: `src/preload/` — secure contextBridge API.
- Renderer: `src/renderer/` — React UI.
- Services: `src/services/` — document management, indexing, Q&A, persistence.
- Shared contracts: `src/shared/types.ts`.

Keep `contextIsolation: true` and `nodeIntegration: false`.

Do not access Node.js APIs directly from the renderer.

## Development Workflow

1. Identify the current session objective.
2. Inspect the relevant implementation.
3. Record the baseline before making changes.
4. Implement only the requested features.
5. Run `npm run check` and `npm run build`.
6. Perform or request manual GUI testing for Electron functionality.
7. Update `feature_list.json` with truthful status and evidence.
8. Update `session-handoff.md` before ending the session.

## Feature Status Rules

- `not-started`: No implementation work completed.
- `in-progress`: Implementation underway.
- `implemented-unverified`: Code exists but required functional testing is incomplete.
- `pass`: Required behavior has been verified with evidence.
- `fail`: Required behavior was tested and failed.

A successful TypeScript check or build is not proof of successful GUI behavior.

## Session Handoff Contract

At the end of a session, write `session-handoff.md` with:

- Session objective.
- Completed work and modified files.
- Verification commands and results.
- Known issues and unverified behavior.
- Remaining features.
- Exact recommended next steps.

A new session must verify the handoff against the repository before proceeding.

## Project 02 Scope

- Session A: Implement Document Import and Document Detail.
- Session B: Implement and verify Basic Persistence.
- Stop Session A before completing Persistence.
- Avoid unrelated refactoring.
- Do not modify files outside this repository.

## Environment Notes

The starter may contain existing TypeScript errors.

On this Windows machine, a parent-level PostCSS configuration at `D:\postcss.config.js` may interfere with Vite. Resolve build configuration locally within this repository; do not modify the parent configuration.

Do not run `npm audit fix --force` as part of this exercise.

## Completion Criteria

A feature is complete only when:

1. Its implementation is present.
2. Relevant checks pass.
3. Required functional behavior is verified.
4. `feature_list.json` contains accurate evidence.
5. The repository state is documented for the next session.