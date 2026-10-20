# TODO — Boxing Training Platform

Milestone-based task tracking. Work in priority order. Do not skip quality gates.

## Milestone 1 — Repo scaffolding + design system foundation (DONE)

- [x] Fix tsconfig for TypeScript 7 (`moduleResolution: "bundler"`, remove `baseUrl`)
- [x] Fix Box.tsx (unused imports, readonly style properties)
- [x] Fix Text.tsx (import collision, recursive type, missing props)
- [x] Create Button.tsx (primary/secondary/ghost/danger variants)
- [x] Create Card.tsx (graphite surface, optional lime accent)
- [x] Create StatTile.tsx (stat + muted label)
- [x] Create ProgressBar.tsx (lime fill, muted track)
- [x] Create Timer.tsx (monospace time, lime when running)
- [x] Create EmptyState.tsx (heading, body, optional action)
- [x] Create src/lib/supabase.ts (configured client + dev-mode stub)
- [x] Create src/app/_entry.tsx (router entry)
- [x] Create src/app/_layout.tsx (root layout + auth gate)
- [x] Create src/app/shell.tsx (tab shell: mobile bottom tabs + desktop sidebar)
- [x] `npx tsc --noEmit` passes
- [x] Set up Vitest smoke test
- [x] `npm test` passes
- [x] Commit Milestone 1 (3f630bf)

## Milestone 2 — Responsive layouts + navigation (IN PROGRESS)

- [x] Create OnboardingFlow multi-step wizard (welcome, experience, goals,
      availability, equipment, intensity, limitations, complete)
- [x] Wire OnboardingFlow into AppShell (full-screen until complete)
- [x] Create LoginScreen + SignupScreen (Supabase Auth, dev-mode stub)
- [x] Wire auth screens into RootLayout
- [x] Create AcademyScreen (curriculum categories, sample data)
- [x] Create LibraryScreen (searchable exercise library, filters)
- [x] Create WorkoutPlayerScreen (timer, work/rest, rounds, pause/skip)
- [x] Create ProgressScreen (stat tiles, consistency, skill progress)
- [x] Wire all screens into shell (mobile bottom tabs + desktop sidebar)
- [ ] Add lesson detail screen (academy lesson view)
- [ ] Add exercise detail screen (library exercise view)
- [ ] Wire Expo Router routes for /lesson/[id], /exercise/[id], /workout/[id]
- [ ] Desktop sidebar + mobile bottom tab parity verified

## Milestone 3 — Functional MVP (Phase 3)

- [ ] Connect Supabase Auth (signup, login, logout, reset)
- [ ] Seed curriculum data (Foundations, Punching, Footwork, Defence, Combinations)
- [ ] Seed exercise library data
- [ ] Implement workout sessions + persistence
- [ ] Implement progression engine (skill states, deterministic rules)
- [ ] Implement real progress summaries
- [ ] Content attribution + editorial review states
- [ ] RLS policies + tests

## Milestone 4 — Quality & cross-platform testing (Phase 4)

- [ ] Desktop browser + mobile web testing
- [ ] RLS policy tests
- [ ] Empty, loading, failure states
- [ ] Build & deployment documentation

## Milestone 5 — Future commercialisation (Phase 5)

- [ ] Entitlement gating review
- [ ] Payment provider evaluation
- [ ] Store release preparation

## Known limitations

- Supabase not configured: app runs in development mode with stub client.
  Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` to enable real auth/database.
- No native iOS/Android builds yet (web MVP first; EAS path documented but not built).
- No subscription/payment flows (entitlements table reserved in schema, UI gating future-ready).
- All data is sample/demonstration data. No real coaching content or progress persisted yet.
- tsconfig `extends: expo/tsconfig.base` is removed to keep vitest working;
  Expo dev server may re-add it on restart — remove it again if tests fail.

## Web dev server

Running on http://localhost:8081 (Expo web). Start with: `npx expo start --web --port 8081`

## Commit convention

`feat:` for new features, `fix:` for bug fixes, `chore:` for maintenance.
Commit frequently — at the end of each coherent change set.
