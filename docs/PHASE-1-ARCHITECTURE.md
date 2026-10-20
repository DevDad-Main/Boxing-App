# Phase 1 — Discovery & Architecture

**Product:** Boxing training & athletic-development platform (cross-platform, iOS / Android / web)  
**Status:** Phase 1 deliverable — architecture, schema, design system, MVP scope, plan  
**Date:** 2026-10-20  
**Brand palette:** Obsidian `#151817`, Graphite `#252A28`, Athletic Lime `#C8F169`, Warm Ivory `#F3F1E9`

---

## 1. Product understanding (summary of requirements)

A premium boxing-learning and home-training platform that takes users from complete beginner through intermediate and advanced technical development. It combines structured boxing education, home-based athletic development (strength, speed, agility, footwork, defence), a guided workout player, measurable progression, and motivation — with a future-ready SaaS entitlement model.

**Audience:** Beginners, recreational home boxers, fitness-through-boxing users, intermediate and advanced recreational athletes.  
**Primary use case:** A user opens the app, sees what to train today, completes a guided session, and sees their progress reflected across skills, programmes, and statistics.  
**Business model:** Free intro tier today; Premium / Coach / Organisation tiers later, enforced on the backend (not fake checkout flows).  
**Constraints:** No AI-generated coaching as default, no copyrighted video without permission, no fake social proof, real RLS-secured database, secure auth, responsive web first with a viable native path.

---

## 2. Recommended architecture

### 2.1 Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Application | **React Native + Expo (SDK 53)** with TypeScript | Single codebase for iOS, Android, and web. Expo Router for file-based routing. Responsive desktop layouts via Tailwind + NativeWind. |
| Styling | **Tailwind CSS + NativeWind** | Shared design tokens across web and native; theming (dark default) works everywhere. |
| Backend | **Supabase (PostgreSQL)** | Auth + database + Realtime + Storage in one managed service; row-level security (RLS) built in. |
| Authentication | **Supabase Auth** (email/password + OAuth providers) | No passwords stored by us; magic-link/email option available; JWTs handled by Supabase client. |
| Media | **External embeds / authorised links** (YouTube, Vimeo, or coach-hosted) + Supabase Storage for user-uploaded notes/thumbnails | Do not download or rehost copyrighted content. Store only attribution metadata, URLs, and rights status. |
| State | **React Query (TanStack Query)** + React Context / Zustand | Server state (content, progress) cached; client state (ui, player timer) local. |
| Forms/validation | **React Hook Form + Zod** | Shared validation schemas usable on client and (via edge functions) server. |
| Testing | **Vitest** (unit + integration) + **Expo detox / Playwright** (E2E on web) | Vitest runs on desktop; Playwright covers responsive web flows; Detox reserved for native E2E once native builds exist. |
| Deployment | Web: Vercel / Netlify / GitHub Pages (SPA fallback). Native: EAS Build for iOS/Android. Documented separately. | Keeps web and native release workflows distinct as required by the spec. |

### 2.2 Why not alternatives

- **Flutter:** single native binary, but the user has an iPhone and wants iOS; Expo + EAS gives a clearer path to the App Store with a web share of code. Flutter also lacks the React ecosystem the existing repo (`checkpoint` uses React/Tailwind) already invests in.
- **Pure PWA:** fails the "native iOS/Android release" requirement and has weaker background audio/timer behaviour for a workout player.
- **Custom Node/Postgres backend:** more operational surface than Supabase; RLS and Auth come free with Supabase, reducing the chance of a data-leak bug.

### 2.3 Directory structure (monorepo-style, single Expo app)

```
boxing-app/
├── app/                 # Expo Router routes (tabs, (auth), (admin))
├── assets/              # images, fonts, diagrams (original, licence-cleared)
├── components/          # shared UI (design system)
│   ├── ui/              # primitive shadcn-like buttons, inputs, cards
│   ├── workout/         # timer, round counter, exercise step
│   ├── academy/         # lesson card, skill tree node
│   └── progress/        # stat tiles, sparkline, empty states
├── content/             # static curriculum JSON (seed data)
├── hooks/               # useAuth, useWorkout, useSkills, useProgramme
├── lib/                 # supabase client, zod schemas, constants
├── services/            # server-side-ish logic (progression engine, entitlements)
├── store/               # Zustand slices (ui, player, onboarding)
├── types/               # shared TS types
├── supabase/            # migrations, seed SQL, RLS policies
├── e2e/                 # Playwright / Detox specs
└── tests/               # Vitest unit + integration
```

---

## 3. Screen & navigation map

### 3.1 Root navigation (Expo Router)

```
RootLayout
├── (auth)               # login, signup, reset-password, magic-link
│   ├── login
│   ├── signup
│   └── reset
├── (onboarding)         # step 1..5 (goals, experience, days, duration, equipment, limitations)
│   ├── welcome
│   ├── experience
│   ├── goals
│   ├── availability
│   └── complete
├── (tabs)               # authenticated app shell (bottom tab mobile / sidebar desktop)
│   ├── index            # Home / Training Dashboard (answers: today? why? progress? next?)
│   ├── academy          # Boxing Academy (curriculum browser)
│   ├── library          # Exercise Library (searchable, filterable)
│   ├── calendar         # Training Calendar
│   └── profile          # Profile & Preferences
├── workout/[id]         # Guided Workout Player (full-screen, timer, steps)
├── lesson/[id]          # Academy lesson detail
├── exercise/[id]        # Exercise Library detail
├── progress             # Progress & Statistics (time filters, PRs, milestones)
├── saved                # Saved Lessons
└── subscription         # Subscription & Account Management (future-ready gating)
```

### 3.2 Desktop vs mobile shell

- **Mobile:** persistent bottom tab bar (Home, Academy, Library, Calendar, Profile). Modal stacks for workout player and lesson detail.
- **Desktop:** persistent left sidebar (Obsidian background) + content area. Global top bar with user profile and notifications. Same routes, different layout components via `Platform.OS` or a `useResponsiveLayout` hook.

### 3.3 Core user journeys

1. **Onboarding → first session:** Sign up → complete onboarding → get a deterministic recommended programme → Home shows "train today" card → tap → Guided Workout Player → finish → progress updates.
2. **Learn a technique:** Academy → choose category (Foundations/Punching/Footwork/Defence/Combinations) → lesson detail with instructions, common mistakes, linked demonstration (external, attributed) → mark learning/practising → skill state advances per progression rules.
3. **Train athletically:** Library → filter by objective (strength/agility/etc.) and equipment (none) → exercise detail → add to a custom workout or start a shadowboxing round with timer.

---

## 4. Initial database schema (Supabase / PostgreSQL)

All tables live in a `public` schema with RLS enabled. Users can only read/write their own rows unless an `admin_role` policy allows otherwise. Every table has `created_at`/`updated_at` timestamptz.

### 4.1 Core identity & access

```sql
-- profiles extends Supabase Auth users
create table profiles (
  id uuid references auth.users not null primary key,
  display_name text,
  experience_level text check (experience_level in ('beginner','intermediate','advanced')),
  goals text[],                      -- array of text goals
  training_days_per_week int check (training_days_per_week between 1 and 7),
  typical_session_minutes int check (typical_session_minutes between 10 and 180),
  training_location text check (training_location in ('home','gym','outdoor','mixed')),
  available_equipment text[],        -- e.g. {'none','jump_rope','dumbbells','mirror'}
  preferred_intensity text check (preferred_intensity in ('low','moderate','high')),
  movement_limitations text,         -- free text, no medical details required
  suggested_programme_id uuid references programmes(id),
  onboarding_complete boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table admin_roles (
  user_id uuid references auth.users not null primary key,
  role text check (role in ('editor','owner')) not null,
  created_at timestamptz default now()
);

create table content_review_records (
  id uuid primary key default gen_random_uuid(),
  content_type text not null,        -- 'lesson' | 'exercise' | 'media_source'
  content_id uuid not null,
  reviewer_id uuid references auth.users,
  status text check (status in ('pending','approved','rejected')) default 'pending',
  notes text,
  reviewed_at timestamptz,
  created_at timestamptz default now()
);
```

### 4.2 Curriculum

```sql
create table programmes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  difficulty text check (difficulty in ('beginner','intermediate','advanced')),
  is_premium boolean default false,
  is_published boolean default false,
  created_at timestamptz default now()
);

create table programme_stages (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid references programmes(id) on delete cascade,
  order_index int not null,
  title text not null,
  description text,
  prerequisite_stage_id uuid references programme_stages(id)
);

create table skills (
  id uuid primary key default gen_random_uuid(),
  category text check (category in ('foundations','punching_fundamentals','footwork','defence','combinations_tactics')),
  slug text unique not null,
  title text not null,
  difficulty text check (difficulty in ('beginner','intermediate','advanced')),
  prerequisites uuid[] references skills(id),   -- array of skill ids (simple, testable)
  learning_objectives text[],
  instructions text,
  common_mistakes text[],
  safety_considerations text,
  recommended_practice_minutes int,
  completion_criteria text,
  is_published boolean default false,
  requires_coach_supervision boolean default false,
  created_at timestamptz default now()
);

create table skill_prerequisites (
  skill_id uuid references skills(id) on delete cascade,
  prerequisite_skill_id uuid references skills(id) on delete cascade,
  primary key (skill_id, prerequisite_skill_id)
);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid references skills(id) on delete cascade,
  slug text unique not null,
  title text not null,
  content_type text check (content_type in ('video','text','diagram','mixed')),
  instructions text,
  demonstration_url text,            -- external, attributed link only
  demonstration_source text,         -- named coach / org
  source_url text,
  rights_status text check (rights_status in ('licensed','public_domain','fair_use','pending','not_cleared')),
  difficulty text,
  duration_minutes int,
  editorial_status text check (editorial_status in ('draft','pending_review','published','rejected')) default 'draft',
  created_at timestamptz default now()
);

create table media_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,                -- named coach / publisher
  qualifications text,               -- only verifiable claims
  source_url text not null,
  publication_date date,
  review_date date,
  rights_and_licensing text,
  difficulty text,
  curriculum_mapping text[],
  editorial_review_status text default 'pending',
  last_verification_date date,
  is_endorsement boolean default false  -- linking != endorsement
);
```

### 4.3 Exercise library

```sql
create table exercise_definitions (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text check (category in ('strength','explosive_power','hand_speed','foot_speed','agility','coordination','balance','reaction_training','conditioning','endurance','core_stability','mobility','warmups','recovery')),
  difficulty text check (difficulty in ('beginner','intermediate','advanced')),
  instructions text,
  demonstration_url text,            -- external, attributed
  equipment_required text[],         -- e.g. {'none'}
  suggested_sets text,
  suggested_reps text,
  suggested_duration_seconds int,
  work_interval_seconds int,
  rest_interval_seconds int,
  regressions text[],
  progressions text[],
  common_errors text[],
  safety_notes text,
  linked_skill_ids uuid[] references skills(id),
  is_published boolean default false,
  created_at timestamptz default now()
);
```

### 4.4 Workouts & sessions

```sql
create table workout_templates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  programme_id uuid references programmes(id),
  difficulty text,
  total_duration_minutes int,
  is_shadowboxing boolean default false,
  theme text,                        -- for shadowboxing: stance, jab_cross, defence, combos, free
  is_premium boolean default false,
  is_published boolean default false,
  created_at timestamptz default now()
);

create table workout_template_exercises (
  id uuid primary key default gen_random_uuid(),
  template_id uuid references workout_templates(id) on delete cascade,
  order_index int not null,
  exercise_definition_id uuid references exercise_definitions(id),
  work_seconds int,
  rest_seconds int,
  rounds int,
  notes text
);

create table workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  template_id uuid references workout_templates(id),
  status text check (status in ('scheduled','in_progress','paused','completed','cancelled','interrupted')) default 'scheduled',
  started_at timestamptz,
  completed_at timestamptz,
  total_duration_seconds int,
  difficulty_rating int check (difficulty_rating between 1 and 10),
  effort_rating int check (effort_rating between 1 and 10),
  notes text,
  created_at timestamptz default now()
);

create table workout_exercise_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references workout_sessions(id) on delete cascade,
  exercise_definition_id uuid references exercise_definitions(id),
  order_index int,
  started_at timestamptz,
  completed_at timestamptz,
  duration_seconds int,
  rounds_completed int,
  skipped boolean default false,
  notes text
);
```

### 4.5 User progress & assessment

```sql
create table user_skill_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  skill_id uuid references skills(id) not null,
  state text check (state in ('not_started','learning','practising','demonstrated','needs_review')) default 'not_started',
  self_assessed_confidence int check (self_assessed_confidence between 1 and 5),
  coach_verified boolean default false,
  last_practised_at timestamptz,
  practice_count int default 0,
  updated_at timestamptz default now(),
  unique (user_id, skill_id)
);

create table assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  skill_id uuid references skills(id),
  type text check (type in ('self','coach')),
  result text check (result in ('pass','fail','needs_review')),
  notes text,
  assessed_at timestamptz default now()
);

create table milestones (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  criterion_type text,               -- 'sessions_count' | 'minutes_total' | 'streak_days' | 'skill_demonstrated'
  criterion_value int,
  is_published boolean default false
);

create table user_milestones (
  user_id uuid references auth.users not null,
  milestone_id uuid references milestones(id) not null,
  achieved_at timestamptz default now(),
  primary key (user_id, milestone_id)
);

create table saved_lessons (
  user_id uuid references auth.users not null,
  lesson_id uuid references lessons(id) on delete cascade,
  saved_at timestamptz default now(),
  primary key (user_id, lesson_id)
);

create table training_schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  programme_id uuid references programmes(id),
  active boolean default true,
  created_at timestamptz default now()
);

create table subscription_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null unique,
  tier text check (tier in ('free','premium','coach','organisation')) default 'free',
  status text check (status in ('active','past_due','cancelled')) default 'active',
  expires_at timestamptz,
  updated_at timestamptz default now()
);
```

### 4.6 Security notes

- RLS enabled on every table; policies restrict rows to `auth.uid() = user_id` (or owner) except published content which is readable by all authenticated users.
- `admin_roles` gate `content_review_records`, programme publishing, and lesson editorial status changes.
- Never store passwords; Supabase Auth manages credentials.
- All sensitive writes validated via Zod on the client and re-validated in Supabase edge functions / database constraints where feasible.

---

## 5. Design system specification

### 5.1 Color tokens (dark-first)

| Token | Value | Usage |
|-------|-------|-------|
| `--obsidian` | `#151817` | Backgrounds, app shell, modal backdrops |
| `--graphite` | `#252A28` | Cards, elevated surfaces, secondary containers |
| `--lime` | `#C8F169` | Primary actions, active states, progression indicators, accents |
| `--ivory` | `#F3F1E9` | Primary text on dark, headings |
| `--muted` | `#8A948F` | Secondary text, captions, metadata |
| `--border` | `#3A423E` | Subtle dividers |
| `--danger` | `#EF4444` | Destructive actions, errors |
| `--success` | `#10B981` | Completion states |

**Rule:** Lime is used selectively — only for important actions, active states, and progression. Never decorative.

### 5.2 Typography

- **Headings:** Strong, deliberate hierarchy; semi-bold to bold; tight tracking; warm ivory on obsidian.
- **Body:** Highly legible, regular weight, warm ivory at 85–90% opacity.
- **Stats/metadata:** Compact, monospace or semi-bold sans, muted or lime for emphasis.
- All text meets WCAG AA contrast (4.5:1) against its background.

### 5.3 Components

- **Button variants:** primary (lime fill, obsidian text), secondary (graphite fill, ivory text), ghost (transparent, ivory text), danger (red fill).
- **Card:** graphite surface, 1px border, subtle radius (not excessive), lime left-border accent for active items.
- **Progress indicators:** circular or bar, lime fill, ivory label, muted track.
- **Stat tile:** obsidian/graphite surface, large lime or ivory number, muted label underneath.
- **Timer:** large monospace display, lime when running, muted when paused, accessible pause/skip/resume controls.
- **Empty state:** illustration placeholder + ivory heading + muted body + primary action button.
- **Navigation:** bottom tab mobile (lime active indicator), desktop sidebar (obsidian, graphite active item).

### 5.4 Interaction rules

- No purple gradients, no excessive glassmorphism, no random decorative charts, no unnecessary shadows, no excessive rounded rectangles, no tiny low-contrast labels.
- Consistent icon style (single icon set, stroke width).
- Visible focus states, keyboard navigation on desktop, screen-reader labels.
- Scalable text; responsive breakpoints at 640px / 1024px / 1280px.

---

## 6. MVP scope & explicit exclusions

### 6.1 In scope (Phase 3 functional MVP)

- Auth: signup, login, logout, password reset (Supabase Auth).
- Onboarding (5 steps) with deterministic programme recommendation.
- Home dashboard answering: what today, why, progress, next.
- Boxing Academy: curriculum browser (Foundations, Punching, Footwork, Defence, Combinations) with lesson detail and attributed external demonstrations.
- Exercise Library: searchable, filterable by category/objective/equipment; exercise detail with instructions.
- Guided Workout Player: timed rounds, work/rest intervals, pause/resume/skip, completion, difficulty/effort rating, notes.
- Progression engine: skill states (not_started → learning → practising → demonstrated → needs_review), deterministic prerequisite rules.
- Progress dashboard: sessions, minutes, weekly consistency, skills demonstrated, time filters (weekly/monthly/all-time), empty states.
- RLS-secured database, all migrations, seed content labelled as sample/demonstration.

### 6.2 Explicitly out of scope (Phase 1 exclusions)

- Native iOS/Android builds (EAS) — web MVP first; native path documented but not built.
- Subscription/payment flows — entitlements table exists; UI gating is future-ready but no checkout.
- Coach/Organisation tiers — schema reserved, not implemented.
- AI-generated coaching content — not used as default instruction.
- Downloaded/rehosted copyrighted video — external attributed links only.
- Chatbot, social feeds, leaderboards, wearable integration.

---

## 7. Phased implementation plan

| Phase | Goal | Key deliverables |
|-------|------|------------------|
| **Phase 1** (now) | Discovery & architecture | This document; repo structure; tech decision record |
| **Phase 2** | Design system & prototype | Tokens, components, responsive layouts, onboarding/dashboard/academy/library/player/progress screens with labelled sample data; navigation verified |
| **Phase 3** | Functional MVP | Supabase connected; auth; curriculum seed data; workout persistence; progression rules; real progress summaries; attribution & review states |
| **Phase 4** | Quality & cross-platform testing | Desktop + mobile web tests; RLS policy tests; empty/loading/failure states; build & deploy docs |
| **Phase 5** | Future commercialisation | Entitlement gating review; payment provider evaluation; store release prep |

---

## 8. Highest-risk assumptions

| Risk | Mitigation |
|------|------------|
| Video demonstrations: no cleared, free, professional source secured yet | Label lessons "awaiting editorial content" rather than inventing video; start with England Boxing / USA Boxing research and verify licences before linking |
| Deterministic progression rules may feel rigid | Keep rules transparent and explain *why* a user can/cannot advance; allow self-assessment distinct from coach verification |
| Single developer building cross-platform | Ship web MVP first; native only after web is stable; don't parallel-build iOS and Android |
| Supabase cost at scale | Start on free tier; monitor; entitlement gating keeps paid features server-side |
| Model in this session is a no-thinking variant | Keep implementation steps small and verifiable; write tests as we go |

---

## 9. Exact first development milestone

**Milestone 1 — Repo scaffolding + design system foundation**

1. Initialise the Expo + TypeScript project in `/home/devdad/Projects/boxing-app`.
2. Install Tailwind/NativeWind, React Query, Supabase client, Zod, React Hook Form, Lucide icons.
3. Define design tokens (obsidian, graphite, lime, ivory) and a `cn`/`tv` utility.
4. Build primitive components: Button (primary/secondary/ghost/danger), Card, StatTile, ProgressBar/Circle, Timer display, EmptyState.
5. Build the app shell: root layout, bottom-tab mobile nav, desktop sidebar, auth gate.
6. Add a "coming soon" placeholder home screen using only sample data labelled as demonstration.
7. Typecheck + Vitest smoke test pass; commit.

**Exit criteria:** `npm run typecheck` and `npm test` pass; the app boots on web desktop and mobile viewport showing the branded shell with no console errors.

---

## 10. How to run & test (after Milestone 1)

Not yet implemented — no code exists. Once Milestone 1 is complete:

```bash
cd /home/devdad/Projects/boxing-app
npm install        # or npx create-expo-app --template ... then add deps
npm run dev        # Expo dev server (web + native)
npm run typecheck  # tsc --noEmit
npm test           # vitest run
```

Supabase: create a project, copy the schema above into the SQL editor, set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env` (never commit secrets).

---

**Next step:** Begin Milestone 1 (repo scaffolding + design system). Would you like me to initialise the Expo project and write the first components, or do you want to adjust the architecture first?
