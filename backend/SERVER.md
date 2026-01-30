## Xtin Capital Backend – Server Architecture & Guide

This document describes the **backend server** located in the `backend/` folder. It is intended as a **technical, implementation-level guide** for developers working on the server.

The stack is:
- **Runtime**: Node.js (ES modules)
- **Framework**: Express
- **Database**: MongoDB via Mongoose
- **Validation**: Zod
- **Auth**: JWT-based (access tokens)

---

## High-Level Architecture

The backend is organized into clear layers:

- **Entry & App Setup**
  - `index.mjs` – starts the HTTP server.
  - `app.mjs` – configures the Express app, middleware, and mounts route modules.
- **Configuration & Constants**
  - `constants/config.mjs` – loads environment variables via `dotenv` and exposes a strongly-typed `config` object.
  - `constants/constants.mjs` – shared constants such as HTTP status codes, generic messages, regex patterns, etc.
- **Database Layer**
  - `db/database.mjs` – initializes the MongoDB connection using Mongoose and the URI from `config.MONGODB_URI`.
- **Domain Modules**
  - **User/Auth** – signup/login, JWT auth.
  - **Courses & Purchases** – courses listing, purchase tracking.
  - **Forms** – “join as advisory” form submissions.
  - **Metrics** – site metrics for home page.
  - **Subscriptions** – newsletter/email subscriber list.
- **Cross-Cutting Concerns**
  - `middlewares/auth.mjs` – authentication and authorization middleware.
  - `validators/*.mjs` – Zod-based request validation for user/forms/metrics.
  - `repository/*.mjs` – data access layer per domain (User, Course, Forms, Metric, Subscription).
  - `models/*.mjs` – Mongoose schemas for all persistent entities.
  - `utils/*.mjs` – helper classes and functions (`ApiError`, `ApiResponse`, `trimStrings`, etc.).

All modules are written using **ES modules** (`type: "module"` in `package.json`).

---

## Project Layout (Backend Root)

- `app.mjs`
  - Creates an Express app.
  - Connects to MongoDB via `connectDB()` from `db/database.mjs`.
  - Registers core middleware:
    - `express.json()` for JSON body parsing.
    - `express.urlencoded({ extended: true })` for form-encoded data.
  - Mounts feature routes under the `/api` prefix:
    - `user.routes.mjs`
    - `course.routes.mjs`
    - `forms.routes.mjs`
    - `metric.routes.mjs`
    - `subscription.routes.mjs`
  - Exposes health endpoint `GET /` returning a JSON “Xtin Server is Live” message.

- `index.mjs`
  - Imports the configured `app` from `app.mjs`.
  - Imports `config` from `constants/config.mjs`.
  - Starts the HTTP server with:
    - `app.listen(config.PORT, ...)`
  - Logs the running URL to the console.

- `README.md`
  - Higher-level project overview and setup steps.
  - Some parts are more generic and not always 1:1 with the code; this `SERVER.md` is the authoritative technical reference.

- `package.json`
  - `"type": "module"` for ESM.
  - `"main": "index.mjs"`.
  - Scripts:
    - `"dev": "nodemon index.mjs"` – development with auto-reload.
  - Core dependencies:
    - `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `dotenv`, `cors`, `zod`.

- `sample.env`
  - Template for environment variables (see **Environment & Config** section).

---

## Environment & Configuration

### `constants/config.mjs`

This file uses `dotenv` to read `.env` and builds a `config` object:

- **Server & API**
  - `config.PORT` – server port (default `5000`).
  - `config.API_URL` – base API URL (default `http://localhost:5000/api`).
- **Database**
  - `config.DB_HOST`
  - `config.DB_NAME`
  - `config.DB_PASSWORD`
  - `config.MONGODB_URI` – full MongoDB connection URI (default `mongodb://localhost:27017/xtin_capital`).
- **Caching**
  - `config.REDIS_URL` – not yet used in current code, but reserved for future caching.
- **Auth**
  - `config.JWT_SECRET` – secret used to sign/verify JWTs.
- **Cloudinary**
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_URL` – reserved for asset hosting.

### `sample.env`

Example keys to fill in `.env`:

- `PORT`
- `DB_HOST`
- `DB_NAME`
- `JWT_SECRET`
- `MONGODB_URI`
- `REDIS_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_URL`

> **Guideline:** Keep all secrets (especially `JWT_SECRET` and `MONGODB_URI`) outside of source control and configured per environment.

---

## Constants & Shared Definitions

### `constants/constants.mjs`

Centralized constants:

- **HTTP Status Codes (`HTTP_STATUS`)**
  - `OK`, `CREATED`, `BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `INTERNAL_SERVER_ERROR`.

- **Messages (`MESSAGES`)**
  - Common text like `SUCCESS`, `USER_NOT_FOUND`, `USER_ALREADY_EXISTS`, `INVALID_INPUT`, `SERVER_ERROR`.

- **Auth (`AUTH`)**
  - `ACCESS_TOKEN_EXPIRY` – e.g. `"4h"`.
  - `REFRESH_TOKEN_EXPIRY`.

- **Pagination (`PAGINATION`)**
  - `DEFAULT_PAGE`, `DEFAULT_LIMIT`, `MAX_LIMIT`.

- **Uploads (`UPLOADS`)**
  - `MAX_FILE_SIZE`, `ALLOWED_FILE_TYPES`.

- **Environment Names (`ENV`)**
  - `DEV`, `PROD`, `TEST`.

- **Regex (`REGEX`)**
  - `EMAIL`, `PHONE`, `PASSWORD`, `MONGO_ID`, `MONGO_ID_2`, `SEBI_REGISTRATION_NUMBER`.

These are reused across models and validators to avoid duplicated validation logic.

---

## Database Connection

### `db/database.mjs`

- Imports `mongoose` and `dotenv`, and uses `config.MONGODB_URI`.
- `connectDB`:
  - Asynchronously connects to MongoDB.
  - Logs `"MongoDB connected"` on success.
  - Logs error details on failure.
- `app.mjs` calls `connectDB()` once at startup, before request handling.

> **Pattern:** Only connect once on startup; do not re-connect per request.

---

## Models (Mongoose Schemas)

### 1. `models/user.model.mjs`

Represents a user account:

- Fields:
  - `first_name`, `last_name`:
    - `String`, `required`, trimmed, min length 2, alpha-only regex.
  - `email`:
    - `String`, `required`, `unique`, validated with email regex.
  - `phone_number`:
    - `String`, `required`, `unique`, must match `REGEX.PHONE` (10 digits, no leading 0).
  - `password`:
    - `String`, `required`, hashed with `bcryptjs` before being stored (in controller).
- Options:
  - `timestamps: true` – `createdAt` and `updatedAt`.
- Model name:
  - `User`.

### 2. `models/course.model.mjs`

Represents a learnable course:

- Fields:
  - `courseId`: `String`, `required`, `unique`, `trim`, `lowercase`.
  - `title`, `description`: `String`, `required`, `trim`.
  - `price`: `Number`, `required`, `min: 0`.
  - `thumbnail`: `String`, required.
  - `isPublished`: `Boolean`, defaults to `false`.
- Virtual Relationships:
  - `slides` – virtual relation to `Slide` model (via `course` field in slides).
  - `videos` – virtual relation to `Video` model (via `course` field in videos).
- Serialization:
  - `courseSchema.set("toObject", { virtuals: true })`.
  - `courseSchema.set("toJSON", { virtuals: true })`.

### 3. `models/slide.model.mjs`

Represents slide content belonging to a course:

- Fields:
  - `title`, `description`, `url`, `order`, `isFree`.
  - `course`: `ObjectId` referencing `Course` (required).
  - `url` is `unique`.

### 4. `models/video.model.mjs`

Represents video content belonging to a course:

- Fields:
  - `title`, `description`, `url`, `duration`, `order`, `isPreview`.
  - `course`: `ObjectId` referencing `Course` (required).
- Index:
  - Unique compound index on `{ course, order }` so each course has a stable video ordering.

### 5. `models/purchase.model.mjs`

Represents a purchase of a course by a user:

- Fields:
  - `userId`: `ObjectId` references `User`.
  - `courseId`: `ObjectId` references `Course`.
  - `pricePaid`: `Number`, `min: 0`.
  - `purchasedAt`: `Date`, defaults to `Date.now`.
  - `paymentMethod`: enum `["card", "upi", "netbanking", "wallet"]`.
  - `transactionId`: `String`, `unique`.
- Index:
  - Unique compound index `{ userId: 1, courseId: 1 }` – user cannot purchase same course twice.

### 6. `models/subscription.model.mjs`

Represents email subscriptions for newsletters:

- Fields:
  - `email`: `String`, `required`, `unique`.

### 7. `models/metric.model.mjs`

Represents metrics for the website:

- Fields:
  - `trading_volume`, `active_traders`, `uptime`, `avg_latency`: `Number`, `required`.
  - `metric`: `String`, `required` – key name (currently `"home_page_metrics"`).

### 8. `models/forms.model.mjs`

Represents “join as advisory” form submissions:

- Fields:
  - `full_name`, `email`, `phone_number`, `experience`, `sebi_registration_number`.
  - Nested embedded documents:
    - `qualifications` – boolean flags (CFP, CFA, CA, CWM, NISM).
    - `areas_of_expertise` – boolean flags (equity_investments, mutual_funds, etc.).
  - `professional_bio`: `String`, required.
  - `video_consultation_rate`, `audio_consultation_rate`: `Number`, `min: 0`.
  - `profile_picture`, `sebi_registration_document`: `String` URLs.
- Uses patterns from `REGEX` constants (email, phone, SEBI registration).

---

## Validators (Zod Schemas)

Zod-based validation ensures **clean, trimmed, strongly validated** data at the controller boundary.

### `validators/user.validator.mjs`

- Uses `zod/v4` and regex from `REGEX`.
- `trimStrings` helper from `utils/helper_functions.mjs` ensures all string fields are stripped of whitespace.

#### Schemas

- `UserSignupSchema`:
  - `first_name`, `last_name` – string, [2, 100] chars.
  - `email` – valid email, lowercased.
  - `phone_number` – must match `REGEX.PHONE`.
  - `password` – min 8 chars, must match complex `REGEX.PASSWORD`.

- `userLoginSchema`:
  - `email` – valid email, lowercased.
  - `password` – same complexity requirements.

#### Runtime Validators

- `validateUserSignup(user)`:
  - Trims the incoming object.
  - `safeParse` with `UserSignupSchema`.
  - On failure: `{ errors: [msgs...], message: "User validation failed" }`.
  - On success: `{ data, message: "User validated successfully" }`.

- `validateUserLogin(user)`:
  - Ensures `email` present (manual required check).
  - Trims and validates with `userLoginSchema`.
  - Same error structure as above.

- `validateMongoObjectID(id)`:
  - Zod string matching `REGEX.MONGO_ID_2`.
  - Used by repository methods (e.g. `getUserById`).

### `validators/form.validator.mjs`

- `joinAsAdvisoryFormSchema`:
  - Validates all fields for the form described in `forms.model.mjs`.
  - Enforces correct enums for `experience`, correct nested boolean structure, valid URLs, etc.

- `validateJoinAsAdvisoryForm(form)`:
  - Trims input.
  - `safeParse` with `joinAsAdvisoryFormSchema`.
  - Same `{ errors, message }` vs `{ data, message }` pattern.

### `validators/metric.validator.mjs`

- Contains `validateMetricSchema` used in `metric.controller.mjs`:
  - Validates `trading_volume`, `active_traders`, `uptime`, `avg_latency` payloads.

---

## Utilities

### `utils/ApiError.mjs`

Custom error type:

- Extends `Error`.
- Fields:
  - `statusCode`, `message`, `errors` (array), `stack`, `data`, `success`.
- By convention, `success` is `false` for all `ApiError`s.

> **Note:** Controllers currently use JSON error responses directly rather than centralizing all errors with `ApiError` and global middleware, but this class is ready for more advanced error handling.

### `utils/ApiResponse.mjs`

Standardized success response type:

- Fields:
  - `statusCode`
  - `data`
  - `message` (default `"Success"`)
  - `success` (derived: `statusCode < 400`)

### `utils/helper_functions.mjs`

- `trimStrings(obj)`:
  - Returns a new object where every string value is `trim()`med.
  - Used by validators to ensure clean user input.

---

## Middleware

### `middlewares/auth.mjs`

Two exported middlewares:

1. `authenticate`
   - Extracts `Bearer <token>` from `Authorization` header.
   - If no token: returns `401` with `{ error: "Access denied. No token provided." }`.
   - Verifies JWT using `config.JWT_SECRET`.
   - If verification passes:
     - Looks up the full `User` document by `decoded.userId`.
     - Attaches `req.user = { id: user._id }` (hooks are prepared for `role` and `tenantId`).
   - On error:
     - Returns `400` with `{ error: "Invalid token", err }`.

2. `authorize(roles)`
   - Higher-order middleware that accepts an array of roles.
   - Checks `req.user.role` is one of the allowed roles.
   - If unauthorized: `403` with a generic “You do not have access” error.
   - **Note:** The `role` field is not yet in `User` schema but scaffolding is ready.

> **Usage pattern:** Add `authenticate` (and optionally `authorize`) to routes that require logged-in users, e.g. course purchase endpoints.

---

## Repositories (Data Access Layer)

Repositories hide raw Mongoose operations behind domain-specific functions, keeping controllers relatively thin.

### `repository/user.repository.mjs`

- `saveUser(user)`:
  - `User.create(user)` and returns the saved instance.

- `getUserById(id)`:
  - Validates `id` with `validateMongoObjectID`.
  - Returns:
    - On invalid ID: `{ user: null, error: { statusCode: 400, message, errors } }`.
    - On not found: `{ user: null, error: { statusCode: 404, message: "User not found" } }`.
    - On success: `{ user, error: null }` (password excluded).
    - On unexpected errors: returns an internal error structure and logs.

- `getUserByEmail(email)`:
  - `User.findOne({ email })`.

- `checkUserExists(email)`:
  - Same as `getUserByEmail` but conceptually used as existence check.

### `repository/course.repository.mjs`

- `availableCourses()`:
  - Fetches published (`isPublished: true`) courses.
  - Returns only selected fields: `courseId`, `title`, `description`, `price`, `thumbnail`, `_id`.

- `purchasedCourses(userId)`:
  - `Purchase.find({ userId })` and populates `courseId`:
    - match: `isPublished: true`.
    - selects core fields.
    - populates `videos` and `slides` using virtuals.
  - Returns an array of populated courses.

- `purchasedCourseById(userId, courseId)`:
  - Queries one `Purchase` with `{ userId, courseId }` and the same population.
  - Returns the populated `Course` (`purchase.courseId`).

- `purchaseCourseById(userId, courseId, transactionId, pricePaid, paymentMethod, purchasedAt)`:
  - Creates a `Purchase` record.
  - Throws on DB errors (e.g., duplicate purchases).

### `repository/forms.repository.mjs`

- `saveJoinAsAdvisoryForm(form)`:
  - `JoinAsAdvisoryForm.create(form)`.

### `repository/metric.repository.mjs`

- `readMetric()`:
  - Returns the single `Metric` with `metric: "home_page_metrics"`.

- `checkMetricExists()`:
  - Like `readMetric` but returns `true/false`.

- `createMetric(metric)`:
  - `Metric.create(metric)`.

- `updateMetric(metric)`:
  - `Metric.updateOne({ metric: "home_page_metrics" }, metric)`.

### `repository/subscription.repository.mjs`

- `readSubscribers()`:
  - Returns all `Subscription` documents.

- `createSubscriber(subscriber)`:
  - `Subscription.create(subscriber)`.

- `deleteSubscriber(email)`:
  - Deletes one subscriber by `email`.

---

## Controllers (Request Handlers)

Controllers manage incoming HTTP requests:

### 1. `controllers/user.controller.mjs`

- **signup**
  - Validates request body using `validateUserSignup`.
  - If errors: `400` with `{ errors, message }`.
  - Checks existing user by email via `checkUserExists`.
    - If exists: `400` with `USER_ALREADY_EXISTS`.
  - Hashes password with `bcrypt.hash(password, 10)`.
  - Persists new user via `saveUser`.
  - Returns `201` with user metadata (no password).

- **login**
  - Validates using `validateUserLogin`.
  - If invalid: `400` with error messages.
  - Fetches user by email.
    - On missing user: `400` “Invalid credentials”.
  - Compares password with `bcrypt.compare`.
    - On mismatch: `400` “Invalid credentials”.
  - Generates JWT via `jwt.sign`:
    - Payload includes `userId`, `email`, names, and phone.
    - Secret from `config.JWT_SECRET`.
    - Expiry from `AUTH.ACCESS_TOKEN_EXPIRY`.
  - Returns `200` with token and user data.

### 2. `controllers/course.controller.mjs`

- **getAvailableCourses**
  - Uses `availableCourses()` repository.
  - Returns `200` with a list of published courses.

- **getPurchasedCourses**
  - Requires authenticated user (`req.user.id`).
  - Uses `purchasedCourses(req.user.id)`.
  - Returns `200` with the course list.

- **getCourseById**
  - Requires authenticated user.
  - Uses `purchasedCourseById(req.user.id, req.params.courseId)`.
  - Returns `200` with a single populated course (videos and slides).

- **purchaseCourse**
  - Requires authenticated user.
  - Reads `courseId` from `req.params`, `transactionId`, `pricePaid`, `paymentMethod` from `req.body`.
  - Calls `purchaseCourseById`.
  - Returns `200` with created purchase record.

### 3. `controllers/forms.controller.mjs`

- **joinAsAdvisoryForm**
  - Validates with `validateJoinAsAdvisoryForm`.
  - On failure: `400` with `{ errors, message }`.
  - On success: extracts validated fields, calls `saveJoinAsAdvisoryForm`.
  - Returns `201` with saved form data.
  - On server error: `500` with `MESSAGES.SERVER_ERROR` (note: there is a minor naming difference in the controller vs constants, but the intent is to return a generic server error).

### 4. `controllers/metric.controller.mjs`

- **readMetricController**
  - Uses `readMetric()` repository to fetch metrics.
  - Returns `200` with metric document.

- **createMetricController**
  - Validates payload using `validateMetricSchema`.
  - Checks `checkMetricExists()` – only allows a single `home_page_metrics` record.
  - On existence: `400` “Metric already exists”.
  - On success: `createMetric` with given values and fixed `metric: "home_page_metrics"`.
  - Returns `201` with created metric.

- **updateMetricController**
  - Calls `updateMetric(req.body)` directly.
  - Returns `200` with a success message (no data in response).

### 5. `controllers/subscription.controller.mjs`

- **readSubscribersController**
  - Returns all subscribers via `readSubscribers`.

- **createSubscriberController**
  - Expects subscriber data (e.g. `{ email }`) in `req.body`.
  - Uses `createSubscriber`.

- **deleteSubscriberController**
  - Expects `{ email }` in `req.body`.
  - Uses `deleteSubscriber(email)`.

All these controllers use the `HTTP_STATUS` constants for response status codes and log internal errors to console.

---

## Routes (API Surface)

Routes bind URL paths and HTTP methods to specific controller actions and apply middleware.

### `routes/user.routes.mjs`

- `POST /api/auth/login` → `login`
- `POST /api/auth/signup` → `signup`

### `routes/course.routes.mjs`

- `GET /api/courses/available` → `getAvailableCourses` (public)
- `GET /api/courses/purchased` → `authenticate` → `getPurchasedCourses`
- `GET /api/courses/:courseId` → `authenticate` → `getCourseById`
- `GET /api/courses/:courseId/purchase` → `authenticate` → `purchaseCourse`

> **Note:** Purchase operation currently uses `GET` with `req.body`; consider migrating to `POST` for semantic correctness.

### `routes/forms.routes.mjs`

- `POST /api/forms/join_as_advisory` → `joinAsAdvisoryForm`

### `routes/metric.routes.mjs`

- `GET /api/metrics` → `readMetricController`
- `POST /api/metrics` → `createMetricController`
- `PATCH /api/metrics` → `updateMetricController`

### `routes/subscription.routes.mjs`

- `GET /api/subscribers` → `readSubscribersController`
- `POST /api/subscribers` → `createSubscriberController`
- `DELETE /api/subscribers` → `deleteSubscriberController`

---

## Request Lifecycle Example

Example: **Authenticated fetch of purchased courses**

1. Client sends `GET /api/courses/purchased` with header `Authorization: Bearer <JWT>`.
2. Request goes into `app.mjs`:
   - Parsed by `express.json()`.
   - Routed to `/api` → `course.routes.mjs`.
3. `course.routes.mjs`:
   - For `/courses/purchased` route, stack is `[authenticate, getPurchasedCourses]`.
4. `authenticate` middleware:
   - Extracts and verifies JWT.
   - Loads user from DB and attaches `req.user.id`.
5. `getPurchasedCourses` controller:
   - Calls `purchasedCourses(req.user.id)` from repository.
   - Repository performs Mongoose queries/populations.
6. Response:
   - `200 OK` JSON with list of purchased courses including associated videos/slides.

---

## Coding Style & Best Practices in This Project

- **ESM Only**
  - Always use `import` / `export`, **no `require`**.

- **Async/Await**
  - All DB and async calls use `async/await`.
  - `try/catch` blocks are used around repository calls where errors are likely.

- **Validation First**
  - Validate and normalize (trim) request bodies before any DB operations.
  - Validators return unified objects with `errors` and `message` on failure.

- **Separation of Concerns**
  - **Controllers**: orchestrate validation + repository calls + HTTP responses.
  - **Repositories**: encapsulate raw data access.
  - **Models**: define shape, schema-level constraints, indexes.
  - **Middleware**: auth and cross-cutting logic.

- **Status Codes & Messages**
  - Always use `HTTP_STATUS.*` constants instead of raw numbers.
  - Prefer consistent JSON structures like:
    - `{ status, message, data }` or `{ errors, message }`.

- **Security**
  - Passwords are hashed with `bcryptjs`.
  - JWTs carry user identity; secret comes from environment.
  - Mongo IDs and user-provided identifiers are strongly validated with regex.

---

## Adding a New Feature / Resource

When introducing a new resource (e.g., `Orders`), follow this pattern:

1. **Model**
   - Create `models/order.model.mjs` with a Mongoose schema.
   - Use `timestamps` and any relevant indexes.

2. **Validator (Optional but Recommended)**
   - Create `validators/order.validator.mjs` with Zod schemas.
   - Use `trimStrings` and `REGEX` where relevant.

3. **Repository**
   - Create `repository/order.repository.mjs` with operations for CRUD.
   - Keep controllers free of Mongoose query details.

4. **Controller**
   - Create `controllers/order.controller.mjs`:
     - Validate input.
     - Call repository methods.
     - Return `HTTP_STATUS.*` and JSON.

5. **Routes**
   - Create `routes/order.routes.mjs` defining endpoints:
     - Example: `router.get("/orders", authenticate, listOrders);`.
   - Export router as default.

6. **Wire in `app.mjs`**
   - Import routes and mount under `/api`:
     - `app.use("/api", orderRoutes);`

7. **Auth & Permissions**
   - If needed, use `authenticate` and/or `authorize(["admin", ...])`.

8. **Documentation**
   - Update this `SERVER.md` and optionally Swagger/OpenAPI docs.

---

## Running & Development Workflow

### Installation

```bash
cd backend
npm install
```

### Environment Setup

```bash
cp sample.env .env
# Edit .env with the correct values
```

### Development Server

```bash
npm run dev
```

- This runs `nodemon index.mjs`, automatically reloading when files change.
- Default port is `config.PORT` (5000 if not configured).

### Production (Example)

- Build and run with a process manager (PM2, Docker, etc.).
- Ensure:
  - `NODE_ENV=production`
  - `JWT_SECRET` and `MONGODB_URI` are correctly set.

---

## Troubleshooting Tips

- **Cannot connect to MongoDB**
  - Check `MONGODB_URI` in `.env` and logs from `db/database.mjs`.
  - Make sure MongoDB is running and accessible from the backend container/host.

- **JWT errors (`Invalid token` / `Access denied`)**
  - Verify client is sending `Authorization: Bearer <token>`.
  - Check `JWT_SECRET` consistency between `login` token issuance and middleware verification.

- **Validation errors**
  - Zod errors are returned as `errors: [ "msg1", "msg2", ... ]`.
  - Inspect the request body and ensure all required fields and formats are correct.

- **Duplicate key errors**
  - User email/phone, subscription emails, and purchase `transactionId` are unique.
  - Check logs for Mongo duplicate key codes and handle them at controller or repository level.

---

## Summary

This backend implements a **clean, layered architecture** around Express and MongoDB, with:
- Centralized configuration and constants.
- Strong input validation using Zod.
- Well-defined models and repositories for each domain.
- JWT-based auth middleware.

New contributors should follow the existing **controller → repository → model → validator** patterns for consistency and maintainability. 


