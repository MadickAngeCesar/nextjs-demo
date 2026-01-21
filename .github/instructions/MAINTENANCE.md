Purpose
=======
This document supplements repository instructions and provides practical guidance for:

- Maintaining CI/CD and workflows
- Documenting code and APIs
- Using AI to assist with routine maintenance, updates, and feature work

CI/CD & Workflow (summary)
--------------------------
- Primary workflow: `.github/workflows/ci.yml`.
- The CI runs on pushes and PRs to `main` and supports manual (`workflow_dispatch`).
- It performs: dependency install, lint, typecheck, tests, build, and records `pnpm audit` results.

Local verification (quick)
--------------------------
Run these locally before opening a PR:

```bash
pnpm ci
pnpm run lint
pnpm run typecheck
pnpm test --if-present
pnpm run build --if-present
```

When changing CI
----------------
- Add new CI steps as separate jobs and use `needs:` to define ordering.
- Keep steps idempotent and guarded with `--if-present` where scripts may not exist yet.
- Do not commit secrets; use GitHub repository secrets and limited `permissions` in the workflow.
- Test new steps locally where possible (e.g., run the same commands in a local container or runner).

Documentation rules
-------------------
- Document all exported/public types, APIs, and complex logic with JSDoc.
- For UI components, document props, defaults, and accessibility notes.
- Keep higher-level docs in `docs/` and short how-tos alongside code when appropriate.

Using AI safely for maintenance
------------------------------
- Use AI to draft changes (workflows, tests, docs) but always:
  - Run tests and CI locally after applying changes.
  - Review diffs for secrets or dangerous shell commands.
  - Prefer small, single-purpose AI prompts ("Add Playwright integration with a single smoke test").

Release & versioning
--------------------
- Use conventional commits to enable automated changelog generation.
- Tag releases and add release notes describing user-facing changes.

Troubleshooting
---------------
- If CI breaks after a workflow change, revert the change and open a short investigation PR.
- Use uploaded artifacts (audit results, build outputs) from runs to help diagnose failures.

PR checklist
------------
- Run lint, typecheck, tests locally.
- Update docs for behavior/API changes.
- Add changelog entry for user-visible changes.
- Describe CI changes in the PR body and expected failure modes.

Contact
-------
- Add a `CODEOWNERS` file for core areas (e.g., `my-app/**`) so maintainers are automatically requested in PRs.

Notes
-----
- This file is a companion guide. The canonical machine-readable instruction is `.github/instructions/Document code.instructions.md` (if present).
- If you want, I can also clean or replace that file directly — tell me to proceed and I'll overwrite it.
