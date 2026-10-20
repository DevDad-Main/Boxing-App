# Boxing Training Platform

Premium cross-platform boxing education and athletic-development platform. Built with React Native, Expo, TypeScript, and Supabase. Targets iOS, Android, and web from a single codebase.

## Status

**Phase 1 — Discovery & Architecture** (complete).  
**Phase 2 — Design System & Prototype** (in progress).  
See `docs/PHASE-1-ARCHITECTURE.md` for the full architecture, schema, design system, MVP scope, and phased plan.

This is an early-stage product. Core learning and tracking flows are not yet complete — see the TODO list below.

## Product vision

A premium boxing-learning and home-training platform that takes users from complete beginner through intermediate and advanced technical development. Combines structured boxing education, home-based athletic training (footwork, shadowboxing, defensive movement), measurable progression, and motivational features — with a future-ready SaaS entitlement model.

**Not:** a landing page, generic fitness dashboard, static mockup, or chatbot.  
**Not:** AI-generated coaching as the default source of technical instruction.

## Recommended stack

| Layer | Choice |
|-------|--------|
| Application | React Native + Expo (SDK 58) + TypeScript |
| Navigation | Expo Router |
| Styling | Custom design-system components (theme tokens + `clsx`/`tailwind-merge`) |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Authentication | Supabase Auth (email/password + OAuth) |
| Server state | TanStack Query (React Query) |
| Forms/validation | React Hook Form + Zod |
| Icons | Lucide React Native |
| Testing | Vitest (unit/integration), Playwright (web E2E) |
| Deployment | Web: static hosting; Native: EAS Build |

## Design system

Palette (dark-first, premium athletic):

| Token | Value | Usage |
|-------|-------|-------|
| Obsidian | `#151817` | Backgrounds, app shell |
| Graphite | `#252A28` | Cards, elevated surfaces |
| Athletic Lime | `#C8F169` | Primary actions, active states, progression |
| Warm Ivory | `#F3F1E9` | Primary text, headings |
| Muted | `#8A948F` | Secondary text, captions |
| Border | `#3A423E` | Subtle dividers |

Components: `Box`, `Text`, `Button` (primary/secondary/ghost/danger), `Card`, `StatTile`, `ProgressBar`, `Timer`, `EmptyState`.  
Source: `src/components/ui/`, `src/lib/theme.ts`.

## Getting started

### Prerequisites

- Node.js (v20+ recommended)
- No Xcode / Android Studio required for web development

### Install

```bash
cd /home/devdad/Projects/boxing-app
npm install
```

### Environment variables

Copy the example and fill in Supabase credentials:

```bash
cp .env.example .env
```

`SUPABASE_URL` and `SUPABASE_ANON_KEY` are read as `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.  
If not set, the app boots in **development mode** with a clearly labelled stub — no live integration is pretended.

### Run

```bash
npm start        # Expo dev server
npm run web      # Web browser
npm run android  # Android (requires dev build after native modules)
npm run ios      # iOS (requires dev build after native modules)
```

### Typecheck

```bash
npx tsc --noEmit
```

## Project structure

```
boxing-app/
├── app.json              # Expo config
├── index.js              # Entry point (registers src/app/_entry)
├── package.json
├── tsconfig.json
├── AGENTS.md             # Agent instructions
├── docs/
│   └── PHASE-1-ARCHITECTURE.md
├── assets/               # images, fonts, diagrams
├── src/
│   ├── app/              # Expo Router routes
│   │   ├── _entry.tsx    # Router entry
│   │   ├── _layout.tsx   # Root layout + auth gate
│   │   ├── shell.tsx     # Authenticated app shell (tabs / sidebar)
│   │   ├── tabs/         # Tab routes (home, academy, library, calendar, profile)
│   │   └── onboarding/   # Onboarding routes
│   │   └── auth/         # Auth routes (login, signup, reset)
│   ├── components/ui/    # Design-system primitives
│   ├── lib/              # supabase client, theme, utils, cn
│   ├── hooks/            # (planned) useAuth, useWorkout, useSkills, useProgramme
│   ├── services/         # (planned) progression engine, entitlements
│   ├── store/            # (planned) Zustand slices
│   ├── types/            # (planned) shared TS types
│   └── supabase/         # (planned) migrations, seed SQL, RLS policies
├── tests/                # Vitest unit + integration
└── e2e/                  # (planned) Playwright / Detox specs
```

## Non-negotiable constraints (from product spec)

- iOS, Android, and desktop web support; shared codebase where practical.
- Real, maintainable architecture; persistent user accounts in a database.
- Secure authentication (Supabase Auth); no passwords stored by us.
- Row-level security; one user's records are never accessible by another.
- No AI-generated coaching as default technical instruction.
- No copyrighted video without permission; external attributed links only.
- No fake social proof, no fake checkout, no decorative mockups.
- Core functionality must be functional, not decorative buttons.

## Roadmap (phases)

| Phase | Goal |
|-------|------|
| 1 | Discovery & architecture (done) |
| 2 | Design system & prototype |
| 3 | Functional MVP (auth, curriculum, workouts, progression, progress dashboard) |
| 4 | Quality & cross-platform testing |
| 5 | Future commercialisation (entitlements, payments) |

## Contributing

This is an early-stage product. Before writing code, read `docs/PHASE-1-ARCHITECTURE.md` and `AGENTS.md`. Establish architecture and design decisions first, then build incrementally and test each capability.

## License

MIT — see `LICENSE`.
