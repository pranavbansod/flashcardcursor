# Git Push Guidelines

Follow these rules before generating or executing a git push command.

---

## 1. Pre-Push Checklist (Mandatory)

Before pushing, ensure:

- Working tree is clean
- All changes are committed
- No debug logs or commented code are left behind
- No secrets, API keys, or env values are committed
- Code builds successfully (locally if possible)

---

## 2. Branch Rules

Determine the correct branch before pushing:

- main / master
  - Only stable, production-ready code
  - No experimental or WIP changes
- feature/*
  - New features or enhancements
- fix/*
  - Bug fixes
- refactor/*
  - Code restructuring
- chore/*
  - Tooling, config, or dependency changes

If unsure, prefer pushing to a **feature/** branch.

---

## 3. Push Command Format

Default push format:

git push origin <current-branch>

If pushing a new branch for the first time:

git push -u origin <branch-name>

---

## 4. Protection & Safety Rules

- ❌ Do NOT force push to main or shared branches
- ⚠️ Force push (`--force-with-lease`) only if:
  - You own the branch
  - You understand the consequences
  - History rewrite is intentional

---

## 5. Project-Specific Context

This project:
- Uses Next.js (App Router)
- Uses TypeScript
- Is deployed on Vercel
- Likely uses CI checks on push

Before pushing:
- Prefer pushing smaller, focused commits
- Avoid pushing broken builds
- Avoid pushing `.env.local` or build artifacts

---

## 6. When NOT to Push

Do not push if:
- Tests are failing
- Build is broken
- Code is incomplete or marked TODO
- Changes are exploratory or temporary

In such cases, keep changes local or use a WIP branch.

---

## 7. Examples

Push current feature branch:
git push origin feature/navbar

Push new branch and set upstream:
git push -u origin fix/api-null-check

Safe force push on owned branch:
git push --force-with-lease origin feature/layout-refactor

---

## 8. Cursor Behavior Instructions

When generating push commands:
- Detect current branch automatically
- Prefer safe defaults
- Warn before force pushing
- Never push directly to main unless explicitly instructed

