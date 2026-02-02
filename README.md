# DSA Progress Tracker

A web application for tracking your DSA learning progress across LeetCode, GeeksforGeeks, and Code360.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend**: Express.js, Prisma, PostgreSQL, JWT, Zod
- **Infrastructure**: Docker, Docker Compose

## Getting Started

### Docker (Recommended)

Requires [Docker](https://docs.docker.com/get-docker/).

```bash
git clone https://github.com/your-username/DSA-Progress-Tracker.git
cd DSA-Progress-Tracker
docker compose up --build
```

| Service    | URL                   |
|------------|-----------------------|
| Frontend   | http://localhost:3000 |
| Backend    | http://localhost:5000 |
| PostgreSQL | localhost:5432        |

Run migrations and seed the database (first time only):

```bash
docker exec dsa_tracker_backend npx prisma migrate deploy
docker exec dsa_tracker_backend node prisma/seed.mjs
```

Stop services:

```bash
docker compose down        # keep data
docker compose down -v     # wipe data
```

### Manual Setup

**Prerequisites**: Node.js v18+, PostgreSQL, npm

**Backend**:
```bash
cd backend
npm install
cp sample.env .env          # edit .env with your database credentials
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed         # optional
npm run dev                 # runs on http://localhost:5000
```

**Frontend**:
```bash
cd frontend
npm install
# create .env.local with: NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev                 # runs on http://localhost:3000
```

## Environment Variables

| Variable              | Default                          | Description          |
|-----------------------|----------------------------------|----------------------|
| `POSTGRES_USER`       | `postgres`                       | Database user        |
| `POSTGRES_PASSWORD`   | `root`                           | Database password    |
| `POSTGRES_DB`         | `DSA-Tracker`                    | Database name        |
| `JWT_SECRET`          | `your_secure_jwt_secret_here...` | JWT signing secret   |
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000`          | API URL for frontend |

## API Endpoints

| Method | Endpoint                    | Auth     | Description              |
|--------|-----------------------------|----------|--------------------------|
| POST   | `/api/auth/signup`          | Public   | Register new user        |
| POST   | `/api/auth/login`           | Public   | Login                    |
| GET    | `/api/problems`             | Public   | Get all problems         |
| GET    | `/api/user/progress`        | Protected| Get user progress        |
| POST   | `/api/problems/:id/complete`| Protected| Mark problem as done     |
| GET    | `/api/user/profile`         | Protected| Get user profile         |
| PUT    | `/api/user/profile`         | Protected| Update user profile      |
| DELETE | `/api/user/profile`         | Protected| Delete account           |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Open a Pull Request

## License

ISC

## Author

Dev Bachani
