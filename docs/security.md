# Security decisions and verification

## Implemented controls

| Risk | Control | Verification |
|---|---|---|
| Anonymous access to application data | Authenticated application flow and RLS policies | Component tests plus database policy definitions |
| One teacher reading another teacher's rows | Owner-scoped RLS using `user_id = auth.uid()` | Schema regression tests inspect all protected tables |
| Assessment referencing another account's student or skill | Composite foreign keys on `(student_id, user_id)` and `(skill_id, user_id)` | Schema regression tests inspect both constraints |
| Accidental policy removal | RLS enabled in the checked-in schema | Automated schema regression test |
| Unreviewed source regressions | Pull requests and GitHub Actions | Lint, unit/component tests, browser smoke tests, build |

## Important deployment distinction

Repository tests verify the checked-in schema and application behavior. They do **not** prove that a remote Supabase project has received the latest migration. Existing deployments must run [`../supabase/harden-tenant-boundaries.sql`](../supabase/harden-tenant-boundaries.sql) and then inspect the live constraints and policies.

## Production migration checklist

1. Back up the database or create a restore point.
2. Run [`../supabase/inspect.sql`](../supabase/inspect.sql) and save the before-state results.
3. Review existing rows for mismatched `user_id`, `student_id`, or `skill_id` ownership.
4. Run [`../supabase/harden-tenant-boundaries.sql`](../supabase/harden-tenant-boundaries.sql) in the Supabase SQL Editor.
5. Run the inspection query again and confirm the composite unique constraints and foreign keys exist.
6. Test two separate accounts and confirm each account sees only its own students, skills, and assessments.
7. Record the migration date and operator in the deployment notes.

## Known limitations

- The repository does not contain credentials and cannot automatically attest to the live Supabase configuration.
- Browser smoke tests cover the public authentication interface without creating real accounts. A disposable staging Supabase project is required for automated cross-account database tests.
- The application is a portfolio demonstration, not a FERPA-compliant production student-information system. It must not store real student information without a formal privacy, retention, audit, and incident-response review.
- Rate limiting and abuse controls for authentication are provided primarily by Supabase project configuration and should be reviewed before real-world use.
