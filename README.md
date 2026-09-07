# Student Progress Tracker

A full-stack EdTech application for securely managing students, skills, and assessment entries. The project is built from a real classroom workflow: recording assessment evidence, tracking skill mastery, and building toward a dashboard that helps teachers identify learning gaps and prioritize support.

**Live demo:** https://student-progress-tracker-sepia.vercel.app

**Note:** All student names and data in this project are fictional. No real student information is used anywhere in this app.

## Why I built this

As a Computer Science and STEM teacher, I regularly use assessment data to determine which students have mastered a skill and which need additional support. This project translates that workflow into software.

The current application supports secure access and database-backed management of students, skills, and assessment entries. A dashboard that summarizes those records and surfaces support priorities is the next major feature.

## Tech Stack

- **Frontend:** React + TypeScript, Vite, Tailwind CSS
- **Backend:** Supabase (Postgres database + authentication)
- **Deployment:** Vercel

## Features

**Implemented:**
- Signup, login, logout, and session handling
- Protected authenticated application access
- Supabase-backed student records
- Supabase-backed skill records
- Assessment entry and assessment-history views
- Relationships between students, skills, and assessment records
- React component architecture with TypeScript
- Deployed application workflow on Vercel

**In progress:**
- Dashboard summarizing student mastery and support priorities
- Automated tests
- Final repository and setup documentation

## Engineering workflow

This project uses a team-style Git workflow rather than committing feature work directly to `main`:

- Work is tracked with GitHub Issues and a project board
- Features are developed on separate branches
- Changes are merged into `main` through Pull Requests

## Notable fix

Authentication worked locally but initially failed after deployment because Vite exposes frontend environment variables only when they use the `VITE_` prefix. The production configuration was corrected through Vercel environment-variable settings.

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

A Supabase project with the required database tables and security policies is also needed. Database setup documentation is planned as part of the remaining repository polish.

## About

Built by [Marsharine A. Simpson](https://github.com/marsharine-cs) — Computer Science Teacher, EdTech Builder, and Technology Professional.
