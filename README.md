# Student Progress Tracker

**Full-stack EdTech · React · TypeScript · Supabase · Assessment data · Teacher dashboard**

A full-stack classroom application for recording assessment evidence, tracking skill mastery, and helping teachers quickly identify where students need support.

**Live demo:** https://student-progress-tracker-sepia.vercel.app

> All student names and records in this project are fictional. No real student information is used in the demo or repository.

## Why I built it

As an educator, I routinely use assessment results to decide who has mastered a skill, who is partially there, and who needs reteaching. This project turns that classroom workflow into a database-backed application.

Instead of keeping progress in disconnected notes or spreadsheets, the app links **students, skills, and dated assessment evidence** and summarizes the latest mastery status in a teacher-facing dashboard.

## What the application does

- secure signup, login, logout, password reset, and session handling
- protected authenticated application routes
- create, edit, list, and delete student records
- create, edit, list, and delete skill records
- enter dated assessment evidence
- view assessment history over time
- track three mastery states: **mastered, partial, needs help**
- display a students × skills mastery grid using each pair's most recent status
- isolate each teacher's data through Supabase Row Level Security
- provide loading, empty, and error states for core workflows
- run automated tests for dashboard calculations, forms, authentication, and password reset
- deploy through Vercel

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Backend | Supabase |
| Database | PostgreSQL via Supabase |
| Authentication | Supabase Auth |
| Security | Row Level Security policies |
| Testing | Vitest, Testing Library |
| Deployment | Vercel |
| Workflow | GitHub Issues, branches, pull requests |

## Engineering highlights

### Data isolation

The app uses Row Level Security so authenticated teachers can only read and write rows associated with their own user account.

### Assessment history instead of one static score

Assessment records are dated. The dashboard derives the current mastery state from the most recent evidence for each student-skill pair, while the history remains available for review.

### Real deployment debugging

Several issues only became visible when moving from local development to production:

- Vite environment variables had to use the `VITE_` prefix before the deployed frontend could read the Supabase configuration.
- Tailwind was installed but not registered with Vite, so production CSS initially omitted required utility classes.
- Account deletion exposed missing cascade behavior across tables referencing `auth.users`; the schema was corrected so related application records can be handled safely.

These fixes are documented because deployment and debugging are part of the engineering work, not separate from it.

## Project workflow

Feature work follows a team-style process rather than being committed directly to `main`:

1. define work in GitHub Issues
2. develop on a feature branch
3. test locally
4. open a Pull Request
5. review the change
6. merge into `main`

That workflow was used to build the app incrementally and to keep implementation decisions visible.

## Local setup

```bash
git clone https://github.com/marsharine-cs/student-progress-tracker.git
cd student-progress-tracker
npm install
cp .env.example .env.local
npm run dev
```

Add your Supabase project URL and anon key to `.env.local` before running the application.

### Database setup

1. Create a Supabase project.
2. Open **SQL Editor** in Supabase.
3. Run [`supabase/schema.sql`](supabase/schema.sql).
4. Add the project URL and anon key to `.env.local`.

The schema creates the core tables, indexes, and per-user policies. A read-only inspection script is available at [`supabase/inspect.sql`](supabase/inspect.sql).

### Useful scripts

```bash
npm run dev
npm test
npm run test:watch
npm run lint
npm run build
```

## Current status

Core application functionality is implemented and deployed. Remaining work is focused on final production QA and future enhancements rather than establishing the basic product workflow.

## What this project demonstrates

- full-stack application development
- React and TypeScript component work
- relational data modeling
- authentication and authorization
- database-backed CRUD workflows
- assessment-data logic
- automated testing
- production debugging
- Git/GitHub collaboration practices
- EdTech product thinking grounded in a real teaching workflow

## About the developer

Built by **[Marsharine A. Simpson](https://github.com/marsharine-cs)** — Computer Science educator, curriculum developer, EdTech builder, and technology professional.

- [Professional portfolio](https://projectsportfolio-nine.vercel.app/)
- [LinkedIn](https://www.linkedin.com/in/marsharine-a-simpson/)
- [Computer Science curriculum repository](https://github.com/marsharine-cs/computer-science-secondary-curriculum)
