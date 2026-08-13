# Prisma Implementation Context

This document provides a comprehensive reference for the Prisma ORM setup in this project. It covers schema design, client instantiation, migrations, seeding, repository patterns, and query details.

---

## 1. Database & Provider

- **Database:** PostgreSQL
- **Connection String:** `postgresql://postgres:root@localhost:5432/DSA-Tracker`
- **Environment Variable:** `DATABASE_URL` in `backend/.env`
- **Adapter:** `@prisma/adapter-pg` (native pg driver for better performance vs. default Prisma driver)
- **Schema Location:** `backend/prisma/schema.prisma`

---

## 2. Prisma Client Instantiation

**File:** `backend/prisma/client.mjs`

```javascript
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { config } from "../constants/config.mjs";

const globalForPrisma = globalThis;

const createPrismaClient = () => {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: ["query", "info", "warn", "error"],
  });
};

const prisma = globalForPrisma.prisma || createPrismaClient();

if (config.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma };
```

**Key design decisions:**
- **Singleton pattern** — stored on `globalThis` in dev to survive hot reloads without creating multiple pool connections.
- **pg.Pool** — a single connection pool is shared across the entire app lifetime.
- **Logging** — all four log levels (query, info, warn, error) are enabled (useful in dev, consider reducing in prod).
- In production, the `globalThis` cache is not set, so the client is created fresh per process (appropriate for serverless/container restarts).

---

## 3. Schema Models

### 3.1 `Question` → `questions` table

| Field | Type | Notes |
|---|---|---|
| `id` | Int | Primary key, auto-increment |
| `problem_id` | String | **Unique** — canonical identifier |
| `problem_name` | String | Display name |
| `company_tags` | String[] | Array of company names |
| `leetcode_link` | String? | Optional |
| `gfg_link` | String? | Optional |
| `code360_link` | String? | Optional |
| `tuf_article` | String? | Optional |
| `tuf_yt_video_link` | String? | Optional |
| `difficulty` | Int? | Optional (made nullable in migration v2) |
| `leetcode_premium_question` | Boolean | Default: `false` |
| `tuf_link` | String? | Optional |

**Relations:**
- `sheetQuestions` → one-to-many with `SheetQuestion`
- `userProgresses` → one-to-many with `UserProgress`

---

### 3.2 `Sheet` → `sheets` table

| Field | Type | Notes |
|---|---|---|
| `id` | Int | Primary key, auto-increment |
| `name` | String | **Unique** (added migration v3) |
| `number_of_questions` | Int | Total question count |
| `has_sub_steps` | Boolean | Default: `false` |

**Relations:**
- `sheetQuestions` → one-to-many with `SheetQuestion`

---

### 3.3 `SheetQuestion` → `sheet_questions` table (bridge/junction)

| Field | Type | Notes |
|---|---|---|
| `id` | Int | Primary key, auto-increment |
| `question_id` | Int | FK → `Question.id` |
| `sheet_id` | Int | FK → `Sheet.id` |
| `step_number` | Int | Step within the sheet |
| `sub_step_number` | Int | Default: `0` |

**Composite unique constraint:** `(question_id, sheet_id, step_number, sub_step_number)`
- This allows the same question to appear in the same sheet at different steps/sub-steps (fixed in migration v4 — originally only `(question_id, sheet_id)` was unique, which was too restrictive).

**Relations:**
- `question` → many-to-one with `Question`
- `sheet` → many-to-one with `Sheet`

---

### 3.4 `User` → `users` table

| Field | Type | Notes |
|---|---|---|
| `id` | Int | Primary key, auto-increment |
| `first_name` | String | |
| `last_name` | String | |
| `email` | String | **Unique** |
| `password_hash` | String | bcrypt hash |
| `role` | UserRole | Enum, default: `USER` |
| `created_at` | DateTime | Default: `now()` |

**Enum `UserRole`:** `ADMIN` | `USER`

**Relations:**
- `userProgresses` → one-to-many with `UserProgress`

---

### 3.5 `UserProgress` → `user_progress` table

| Field | Type | Notes |
|---|---|---|
| `id` | Int | Primary key, auto-increment |
| `user_id` | Int | FK → `User.id` (CASCADE delete — migration v5) |
| `question_id` | Int | FK → `Question.id` |
| `done` | Boolean | Default: `false` |
| `note` | String? | Optional user note |
| `leetcode_done` | Boolean | Default: `false` |
| `gfg_done` | Boolean | Default: `false` |
| `code360_done` | Boolean | Default: `false` |
| `created_at` | DateTime | Default: `now()` |
| `updated_at` | DateTime | Auto-updated via `@updatedAt` |

**Composite unique constraint:** `(user_id, question_id)` — named `user_id_question_id` in Prisma, used directly in queries.

**Relations:**
- `question` → many-to-one with `Question`
- `user` → many-to-one with `User`

---

## 4. Entity Relationship Overview

```
User (1) ──────────────── (Many) UserProgress
                                       │
                                       │
Question (1) ──────────── (Many) UserProgress
Question (1) ──────────── (Many) SheetQuestion
Sheet    (1) ──────────── (Many) SheetQuestion
```

- `UserProgress` is the user-facing junction tracking completion state per (user, question) pair.
- `SheetQuestion` is the content junction ordering questions within sheets by step/sub-step.
- A question can appear in multiple sheets at different step positions.
- A user has exactly one `UserProgress` record per question (enforced by composite unique).

---

## 5. Migrations

All migrations live in `backend/prisma/migrations/`.

| Migration | Name | What it does |
|---|---|---|
| `20251203061610_init` | Initial schema | Creates all 5 tables, UserRole enum, all FK constraints (RESTRICT delete), unique indices on `problem_id`, `email`, `(user_id, question_id)`, `(question_id, sheet_id)` |
| `20251203064056_v2` | Make difficulty nullable | `ALTER TABLE "questions" ALTER COLUMN "difficulty" DROP NOT NULL` |
| `20251203064748_v3` | Unique sheet name | `CREATE UNIQUE INDEX "sheets_name_key" ON "sheets"("name")` |
| `20251203070103_fix_sheetquestion_composite_unique` | Fix SheetQuestion unique | Drops `(question_id, sheet_id)` unique, adds `(question_id, sheet_id, step_number, sub_step_number)` unique — allows same question in same sheet at different steps |
| `20251203101112_ondelete_cascade` | Cascade on user delete | Changes `user_progress.user_id` FK from RESTRICT to CASCADE — deleting a user deletes all their progress records |

---

## 6. Seeding

**File:** `backend/prisma/seed.mjs`
**Command:** `npm run prisma:seed`

Three sequential seed operations:

### `seedQuestions()` — from `prisma/data/questions.json`
```javascript
prisma.question.upsert({
  where: { problem_id },
  update: { /* all fields */ },
  create: { /* all fields */ }
})
```
- Parses `company_tags` from a string format into a String[] array.
- Safe to re-run (upsert is idempotent).

### `seedSheets()` — from `prisma/data/sheets.json`
```javascript
prisma.sheet.upsert({
  where: { name },
  update: { /* fields */ },
  create: { name, number_of_questions, has_sub_steps }
})
```

### `seedSheetQuestions()` — from `prisma/data/sheet_questions.json`
```javascript
prisma.sheetQuestion.upsert({
  where: {
    question_id_sheet_id_step_number_sub_step_number: {
      question_id, sheet_id, step_number, sub_step_number
    }
  },
  update: {},
  create: { question_id, sheet_id, step_number, sub_step_number }
})
```
- Uses the full composite unique key name as the where clause identifier.

After seeding, both the `pg.Pool` and the Prisma client are explicitly disconnected.

---

## 7. Repository Layer

All Prisma queries are isolated in repository files under `backend/repository/`.

### 7.1 `progress.repository.mjs`

**`userCompleteProgress(userId)`**
```javascript
prisma.userProgress.findMany({
  where: { user_id: userId },
  select: {
    id: true, done: true, note: true,
    leetcode_done: true, gfg_done: true, code360_done: true,
    created_at: true, updated_at: true,
    question: true   // full question object included
  }
})
```

**`userSheetProgress(userId, sheetId)`**
```javascript
prisma.userProgress.findMany({
  where: {
    user_id: userId,
    question: {
      sheetQuestions: { some: { sheet_id: sheetId } }
    }
  },
  select: {
    id: true, done: true, note: true,
    leetcode_done: true, gfg_done: true, code360_done: true,
    created_at: true, updated_at: true,
    question: {
      include: {
        sheetQuestions: {
          where: { sheet_id: sheetId },
          select: { step_number: true, sub_step_number: true }
        }
      }
    }
  }
})
```
- Filters via nested relation traversal: only questions that appear in the target sheet.
- Attaches step/sub-step numbers to each question for ordering on the frontend.

**`toggleQuestionDone(user_id, question_id)`**
```javascript
// Step 1: fetch current state
const record = await prisma.userProgress.findUnique({
  where: { user_id_question_id: { user_id, question_id } }
})
// Step 2: flip the flag
prisma.userProgress.update({
  where: { user_id_question_id: { user_id, question_id } },
  data: { done: !record.done }
})
```

**`toggleQuestionSite(user_id, question_id, site)`**
- Same two-step pattern as above but `site` is dynamic: one of `"leetcode_done"`, `"code360_done"`, `"gfg_done"`.
- Validated against the allowed set before executing.
```javascript
prisma.userProgress.update({
  where: { user_id_question_id: { user_id, question_id } },
  data: { [site]: !record[site] }  // computed property name
})
```

---

### 7.2 `user.repository.mjs`

**`saveUser({ first_name, last_name, email, password_hash, role })`**
```javascript
prisma.user.create({
  data: { first_name, last_name, email, password_hash, role },
  select: { id: true, first_name: true, last_name: true, email: true, role: true, created_at: true }
  // password_hash intentionally excluded from return
})
```

**`getUserById(id)`**
```javascript
prisma.user.findUnique({
  where: { id },
  select: { id: true, first_name: true, last_name: true, email: true, role: true, created_at: true }
})
```

**`getUserByEmail(email)`**
```javascript
prisma.user.findUnique({
  where: { email },
  select: { id: true, first_name: true, last_name: true, email: true, password_hash: true, role: true, created_at: true }
  // password_hash INCLUDED — needed for bcrypt.compare during login
})
```

**`checkUserExists(email)`**
```javascript
prisma.user.findUnique({
  where: { email },
  select: { id: true }  // minimal select — existence check only
})
```

**`getUsers()`** (admin only)
```javascript
prisma.user.findMany({
  select: { id: true, first_name: true, last_name: true, email: true, role: true, created_at: true },
  orderBy: { created_at: "desc" }
})
```

**`createEmptyUserProgress(userId)`**
```javascript
// Get all question IDs
const questions = await prisma.question.findMany()

// Upsert a progress row for every question
for (const q of questions) {
  await prisma.userProgress.upsert({
    where: { user_id_question_id: { user_id: userId, question_id: q.id } },
    update: {},
    create: {
      user_id: userId, question_id: q.id,
      done: false, note: "",
      leetcode_done: false, gfg_done: false, code360_done: false
    }
  })
}
```
- Called after signup to pre-populate a progress row for every question.
- `upsert` with empty `update: {}` makes it idempotent (safe to call again if interrupted).
- Note: this runs N sequential upserts (one per question). For large question sets this could be optimized with `createMany`.

**`deleteUser(id)`**
```javascript
prisma.user.delete({
  where: { id },
  select: { id: true, first_name: true, last_name: true, email: true, role: true, created_at: true }
})
```
- All `UserProgress` records cascade-delete automatically (migration v5).

---

### 7.3 `question.respository.mjs`

**`getQuestions()`**
```javascript
prisma.question.findMany()  // returns all fields, all rows
```

**`getSheetQuestions(sheetId)`**
```javascript
prisma.question.findMany({
  where: {
    sheetQuestions: { some: { sheet_id: sheetId } }
  },
  include: {
    sheetQuestions: {
      where: { sheet_id: sheetId },
      select: { step_number: true, sub_step_number: true }
    }
  }
})
```
- Relation filter `some` — returns questions that have at least one SheetQuestion entry for this sheet.
- Nested include then scopes `sheetQuestions` to only the target sheet's entries.

---

### 7.4 `sheet.repository.mjs`

**`getSheet(sheetId)`**
```javascript
prisma.sheet.findUnique({ where: { id: sheetId } })
```

---

## 8. API Routes → Controllers → Repositories (Call Chain)

### Authentication routes (`backend/routes/user.routes.mjs`)

| Endpoint | Auth | Flow |
|---|---|---|
| `POST /api/auth/signup` | Public | `checkUserExists` → hash password → `saveUser` → `createEmptyUserProgress` → return JWT |
| `POST /api/auth/login` | Public | `getUserByEmail` → `bcrypt.compare` → return JWT |
| `GET /api/users` | ADMIN only | `getUsers` |
| `DELETE /api/users` | Authenticated | `deleteUser(req.user.userId)` |

### Progress routes (`backend/routes/progress.routes.mjs`)

| Endpoint | Auth | Flow |
|---|---|---|
| `GET /api/sheet_questions?sheetId=` | Public | `getSheetQuestions(sheetId)` + `getSheet(sheetId)` |
| `GET /api/complete_progress` | Authenticated | `userCompleteProgress(req.user.userId)` |
| `GET /api/sheet_progress?sheetId=` | Authenticated | `userSheetProgress(userId, sheetId)` + `getSheet(sheetId)` |
| `POST /api/toggle_question` | Authenticated | `toggleQuestionDone(userId, questionId)` |
| `POST /api/toggle_question_site` | Authenticated | `toggleQuestionSite(userId, questionId, site)` |

---

## 9. Authentication Middleware (Prisma-adjacent)

**File:** `backend/middlewares/auth.mjs`

- `authenticate`: Verifies JWT from `Authorization: Bearer <token>`. Attaches `{ userId, email, first_name, last_name, role }` to `req.user`. No Prisma calls.
- `authorize(roles[])`: Checks `req.user.role` against allowed roles. No Prisma calls.

The JWT payload is populated from the Prisma `User` object returned by `saveUser` (signup) or `getUserByEmail` (login).

---

## 10. Query Patterns Reference

| Pattern | Used for |
|---|---|
| `findMany({ where, select })` | Lists with filters and field projection |
| `findMany({ where: { relation: { some: { ... } } } })` | Filter by related model |
| `findUnique({ where: { id } })` | Single record by PK |
| `findUnique({ where: { email } })` | Single record by unique field |
| `findUnique({ where: { user_id_question_id: { ... } } })` | Single record by composite unique |
| `create({ data, select })` | Insert new record with selected return fields |
| `update({ where, data })` | Modify record |
| `delete({ where, select })` | Remove record with selected return |
| `upsert({ where, update, create })` | Idempotent insert-or-update |
| `include: { relation: { where, select } }` | Nested/filtered relation loading |

---

## 11. Notable Design Patterns

- **Repository pattern** — all Prisma access is behind repository functions; controllers never import `prisma` directly.
- **Selective field projection** — `select` is used consistently to avoid leaking `password_hash` in responses. Only `getUserByEmail` (login) deliberately includes it.
- **Idempotent seeding** — all seed operations use `upsert`, making it safe to re-run the seed script.
- **Composite unique key naming** — Prisma auto-generates the accessor name from field names joined by `_`, e.g., `user_id_question_id` for `@@unique([user_id, question_id])`. The SheetQuestion composite key is `question_id_sheet_id_step_number_sub_step_number`.
- **Cascade delete** — only `UserProgress → User` cascades. Sheet/Question deletions use RESTRICT (default), so orphan cleanup must be manual if those records are deleted.
- **Dynamic field update** — `toggleQuestionSite` uses a computed property key `{ [site]: value }` to update one of three boolean site-progress fields without separate code paths.
