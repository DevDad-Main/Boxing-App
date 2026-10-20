# TODO — Boxing Training Platform

Milestone-based task tracking. Work in priority order. Do not skip quality gates.

## Milestone 1 — Repo scaffolding + design system foundation (Phase 1 exit)

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
- [ ] Set up Vitest smoke test
- [ ] `npm test` passes
- [ ] Commit Milestone 1

## Milestone 2 — Responsive layouts + navigation (Phase 2)

- [ ] Create onboarding screens (welcome, experience, goals, availability, complete)
- [ ] Create auth screens (login, signup, reset)
- [ ] Create academy lesson browser + lesson detail
- [ ] Create exercise library search + exercise detail
- [ ] Create guided workout player skeleton (timer, steps)
- [ ] Create progress dashboard skeleton (stat tiles, empty state)
- [ ] Wire expo-router navigation between tabs and detail screens
- [ ] Desktop sidebar + mobile bottom tab parity

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

- Supabase not configured: app runs in development mode with stub client. Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` to enable real auth/database.
- No native iOS/Android builds yet (web MVP first; EAS path documented but not built).
- No subscription/payment flows (entitlements table reserved in schema, UI gating future-ready).
- All tab screens except Home are placeholders ("coming soon").
