# DSA Progress Tracker – Backend

Node.js + Express backend with PostgreSQL and Prisma ORM.

## Prerequisites
- Node.js 18+
- Docker (for local Postgres)

## 1) Install dependencies
```bash
npm install
```

## 2) Environment variables
Create `.env` in `backend/` (based on `sample.env`):
```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=DSA-Tracker
DB_PASSWORD=root
DB_PORT=5432
JWT_SECRET=your_secure_jwt_secret_here_change_in_production
DATABASE_URL=postgresql://postgres:root@localhost:5432/DSA-Tracker
```

## 3) Start PostgreSQL via Docker
```bash
# From backend/
docker compose up -d
# or (older docker versions)
docker-compose up -d
```
This launches a Postgres 16 instance named `dsa_tracker_db` (see `docker-compose.yml`).

## 4) Prisma
The Prisma Client is generated to `backend/generated/prisma` (see `prisma/schema.prisma` generator output).

- Generate client (run this whenever the schema changes):
```bash
npx prisma generate
```

- Create and apply a new migration (dev):
```bash
npx prisma migrate dev --name init
```
This reads `prisma/schema.prisma`, creates a migration in `prisma/migrations/`, applies it to the database, and re-generates the client.

- Apply migrations in production/CI (no prompts):
```bash
npx prisma migrate deploy
```

- Reset dev database (DROPS all data):
```bash
npx prisma migrate reset
```

- Inspect and edit data with Prisma Studio:
```bash
npx prisma studio
```

## 5) Run the server
```bash
npm run dev
```
This runs `nodemon index.mjs`.

## File pointers
- Prisma schema: `prisma/schema.prisma`
- Prisma client singleton: `prisma/client.js` (imports from `../generated/prisma`)
- DB Compose: `docker-compose.yml`
- Sample env: `sample.env`

## Troubleshooting
- If you see "P1001: Can’t reach database" ensure Docker Postgres is running and `DATABASE_URL` is correct.
- After changing `schema.prisma`, always run `npx prisma generate` (or `migrate dev`, which also generates).
- Windows: if `docker compose` fails, try `docker-compose`.
