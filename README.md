# Student Progress Tracker

A full-stack web app for tracking which students have mastered which skills and surfacing who needs support first — built to digitize a real classroom workflow: using assessment data to identify learning gaps and adjust instruction.

**Live demo:** https://student-progress-tracker-sepia.vercel.app

**Note:** All student names and data in this project are fictional. No real student information is used anywhere in this app.

## Why I built this

As a Computer Science and STEM teacher, I regularly use assessment data to figure out which students have mastered a skill and which need more support. This project turns that instinct into software — a tool that tracks skill mastery per student and highlights who needs help first, so a teacher can prioritize instruction time.

## Tech Stack

- **Frontend:** React + TypeScript, Vite, Tailwind CSS
- **Backend:** Supabase (Postgres database + authentication)
- **Deployment:** Vercel

## Features

**Done:**
- Full authentication flow — signup, login, logout
- Protected routes (unauthenticated users can't access app pages)
- Project scaffold and styling

**In progress:**
- Student and skill tracking data models
- Assessment/mastery input
- Dashboard surfacing students who need support first

## Engineering workflow

This project is built using a real team-style workflow rather than committing straight to `main`:

- Work is tracked via GitHub Issues and a project board
- Features are built on separate branches
- Changes are merged into `main` via Pull Requests

## Notable fix

Deployed authentication worked locally but silently failed in production due to a Vite environment variable naming issue — Vite only exposes variables prefixed with `VITE_` to the frontend. Fixed via Vercel CLI environment variable configuration.

## Getting Started

```bash
# Clone the repo
git clone https://github.com/marsharine-cs/student-progress-tracker.git
cd student-progress-tracker

# Install dependencies
npm install

# Add environment variables
# Requires a Supabase project URL and anon key, prefixed with VITE_:
#   VITE_SUPABASE_URL=your-supabase-url
#   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Run locally
npm run dev
```

## About

Built by [Marsharine A. Simpson](https://github.com/marsharine-cs) — Computer Science Teacher and Junior Software Developer.
