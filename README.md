# Student Progress Tracker

A full-stack EdTech application for securely managing students, skills, assessment evidence, and teacher-facing progress insights. The project is built from a real classroom workflow: recording assessment evidence, tracking skill mastery, and using a dashboard to identify learning gaps and prioritize support.

**Live demo:** https://student-progress-tracker-sepia.vercel.app

**Note:** All student names and data in this project are fictional. No real student information is used anywhere in this app.

## Why I built this

As a Computer Science and STEM teacher, I regularly use assessment data to determine which students have mastered a skill and which need additional support. This project translates that workflow into software.

The application supports secure access, database-backed management of students and skills, dated assessment history, and a teacher dashboard that summarizes mastery distribution, support priorities, skill-level difficulty, and recent activity.

## Tech Stack

- **Frontend:** React + TypeScript, Vite, Tailwind CSS
- **Backend:** Supabase (Postgres database + authentication)
- **Deployment:** Vercel

## Features

**Implemented:**
- Signup, login, logout, and session handling
- Protected authenticated application access
- Supabase-backed student records with create, edit, list, and delete workflows
- Supabase-backed skill records with create, edit, list, and delete workflows
- Assessment entry and dated assessment-history views
- Mastery statuses: mastered, partial, and needs help
- Relationships between students, skills, and assessment records
- Teacher dashboard with total-record summaries
- Mastery-distribution visualization
- Students-needing-support ranking
- Skills-needing-attention ranking
- Recent assessment activity
- Loading, empty, and error states for dashboard data
- Responsive React component architecture with TypeScript
- Row Level Security policies so each teacher sees only their own data
- Automated tests with Vitest and Testing Library (dashboard calculations, assessment form, auth screen)
- Deployed application workflow on Vercel

**Remaining:**
- Final production QA on the live site

## Engineering workflow

This project uses a team-style Git workflow rather than committing feature work directly to `main`:

- Work is tracked with GitHub Issues and a project board
- Features are developed on separate branches
- Changes are merged into `main` through Pull Requests

## Notable fixes

- Authentication worked locally but initially failed after deployment because Vite exposes frontend environment variables only when they use the `VITE_` prefix. The production configuration was corrected through Vercel environment-variable settings.
- Tailwind was installed but never registered in the Vite config, so the production stylesheet contained none of the utility classes the components use. Registering the `@tailwindcss/vite` plugin and importing Tailwind in `src/index.css` fixed it.

## Getting Started

```bash
# Clone the repo
git clone https://github.com/marsharine-cs/student-progress-tracker.git
cd student-progress-tracker

# Install dependencies
npm install

# Copy the environment template
cp .env.example .env.local

# Add your Supabase project values to .env.local

# Run locally
npm run dev
```

### Database setup

The app expects three tables in your Supabase project, each protected by Row Level Security so a teacher can only read and write their own rows.

1. Create a Supabase project and copy its URL and anon key into `.env.local`.
2. In the Supabase dashboard open **SQL Editor**, create a new query, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and run it.

That file creates the `students`, `skills`, and `assessment_entries` tables, their indexes, and the per-user policies. It is safe to run more than once. To compare an existing project against it, run the read-only [`supabase/inspect.sql`](supabase/inspect.sql).

### Scripts

```bash
npm run dev       # start the dev server
npm test          # run the test suite once
npm run test:watch
npm run lint      # ESLint
npm run build     # typecheck and production build
```

## About

Built by [Marsharine A. Simpson](https://github.com/marsharine-cs) — Computer Science Teacher, EdTech Builder, and Technology Professional.
