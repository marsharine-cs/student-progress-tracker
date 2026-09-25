# Technical interview guide

## Why Supabase?

Supabase provided authentication, PostgreSQL, and database-enforced authorization in one service, allowing the project to concentrate on the product workflow while still demonstrating relational modeling and Row Level Security. For a larger system, I would evaluate whether separate API services were needed for domain logic, audit trails, integrations, or tighter operational control.

## Why is RLS stronger than frontend filtering?

Frontend filtering only changes what the interface displays. A user can still craft network requests outside the interface. RLS evaluates authorization inside PostgreSQL for every protected query, so the database rejects rows that do not belong to the authenticated user.

## Why were composite foreign keys necessary?

Checking only `assessment_entries.user_id` was not enough. Without tenant-aware foreign keys, a crafted assessment could potentially carry one user's `user_id` while referencing another user's student or skill UUID. Binding `(student_id, user_id)` and `(skill_id, user_id)` ensures the referenced records and assessment share the same owner.

## How does the dashboard determine current mastery?

Assessment history is ordered newest first. The dashboard keeps the first status found for each student-skill key, producing the latest view without deleting earlier evidence. The transformation is isolated in a tested function so the rule is explicit and independently verifiable.

## What did production deployment reveal?

Deployment exposed configuration and integration problems that local implementation alone did not: Vite environment-variable naming, Tailwind's Vite registration, and deletion behavior across records referencing authenticated users. Each issue was traced to its responsible layer and corrected through the repository workflow.

## What would change for substantially more users?

I would measure query behavior, add pagination, verify indexes with query plans, move complex aggregation behind database views or an API, introduce structured observability, define backup and migration procedures, add a staging environment, and automate cross-account integration tests against disposable test data.

## What would I improve next?

The next steps are applying and verifying the tenant-hardening migration in production, adding staging-backed cross-account tests, improving operational monitoring, and validating performance with a larger dataset. These are stated as future work rather than presented as completed features.
