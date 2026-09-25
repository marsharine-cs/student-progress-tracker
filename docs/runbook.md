# Operations runbook

## Pre-deployment checks

```bash
npm ci
npm run lint
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

Confirm that the Vercel project has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` configured for the intended environment. Never place a Supabase service-role key in a Vite variable or browser bundle.

## Release verification

1. Open the deployed site in a private browser window.
2. Confirm sign-up, login, logout, and password-recovery navigation.
3. Use a dedicated test account to create a student, skill, and assessment.
4. Confirm the latest status appears in the dashboard and the dated entry remains in history.
5. Confirm empty, loading, and error states remain understandable.
6. Check the associated Vercel deployment and GitHub Actions run.

## Failure triage

| Symptom | First checks |
|---|---|
| Blank page or failed build | Vercel build log, TypeScript output, missing Vite variables |
| Authentication failure | Supabase Auth logs, allowed redirect URLs, project URL and anon key |
| Data not visible | Current session, RLS policies, row `user_id`, browser network response |
| Styling missing | Tailwind Vite plugin, CSS import, build output |
| Cross-account reference rejected | Confirm the student, skill, assessment, and current user share the same owner |

## Rollback

- Frontend: promote the last known-good Vercel deployment or revert the responsible pull request.
- Database: do not remove constraints blindly. Inspect affected data, restore from the approved backup when necessary, and document the incident.
- After rollback, repeat the release-verification checklist and record what failed and why.
