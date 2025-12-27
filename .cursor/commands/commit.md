# Commit Message Guidelines

Generate git commit messages following these rules.

---

## 1. Commit Message Format

Use **Conventional Commits** format:

<type>(optional-scope): short summary

Optional body (only if needed)

---

## 2. Allowed Commit Types

Use one of the following types:

- feat: A new feature
- fix: A bug fix
- refactor: Code change that neither fixes a bug nor adds a feature
- perf: Performance improvement
- style: Formatting, linting, or styling changes (no logic change)
- test: Adding or updating tests
- docs: Documentation-only changes
- chore: Tooling, config, dependencies, build steps
- ci: CI/CD related changes

---

## 3. Scope (Optional but Preferred)

Add scope when possible, based on the area changed:

Examples:
- feat(auth): add login page
- fix(api): handle null response
- refactor(ui): simplify button component
- chore(deps): update next.js version

Common scopes:
- app
- ui
- api
- auth
- config
- styles
- tests
- deps

---

## 4. Summary Line Rules

- Use **imperative present tense**
  - ✅ "add navbar"
  - ❌ "added navbar"
- Keep it **under 72 characters**
- Be specific and meaningful
- Do NOT end with a period

---

## 5. Commit Body (Only When Needed)

Include a body only if:
- The change is non-trivial
- There is important context or reasoning
- Multiple changes are bundled together

Body guidelines:
- Explain **why**, not **what**
- Use bullet points if helpful

Example:

fix(auth): prevent redirect loop

- Handle expired token correctly
- Add fallback route for unauthenticated users

---

## 6. Project-Specific Context

This project:
- Uses Next.js App Router
- Uses TypeScript
- Uses React Server & Client Components
- Uses next/font and modern Next.js conventions

When generating commit messages:
- Mention App Router concepts if relevant (layouts, server components, route handlers)
- Prefer clarity over cleverness

---

## 7. What to Avoid

- ❌ Vague messages: "update", "fix stuff", "changes"
- ❌ Multiple unrelated changes in one commit message
- ❌ Mentioning AI, Cursor, or tooling in commit messages
- ❌ Emojis

---

## 8. Examples

feat(ui): add responsive navbar

fix(api): handle empty search results

refactor(app): move layout logic to shared component

chore(config): update eslint and prettier rules
