# DSA Progress Tracker

A clean, simple web application for tracking your Data Structures and Algorithms (DSA) learning progress. View all DSA problems publicly, sign up to track your progress across multiple platforms (LeetCode, GeeksforGeeks, Code360).

## Features

- **Public Problem Sheet**: Browse all DSA problems without signing up
- **Progress Tracking**: Mark problems as completed across multiple platforms
- **Multi-Platform Support**: Track progress on LeetCode, GeeksforGeeks, and Code360
- **Personal Notes**: Add notes to problems for future reference
- **Topic Organization**: Problems organized by topics with step and sub-step ordering
- **User Authentication**: Secure sign up and login system
- **Profile Management**: Update your profile or delete your account
- **Responsive Design**: Clean, mobile-first interface built with Tailwind CSS

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **Netlify** - Deployment platform

### Backend
- **Express.js** - Web framework
- **Prisma** - ORM for database management
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Zod** - Schema validation

## Project Structure

```
DSA-Progress-Tracker/
├── frontend/           # Next.js application
│   ├── app/           # App router pages
│   │   ├── page.tsx   # Landing page
│   │   ├── sheet/     # Problem sheet page
│   │   ├── login/     # Login page
│   │   └── signup/    # Signup page
│   ├── globals.css    # Global styles
│   └── netlify.toml   # Netlify configuration
├── backend/           # Express API server
│   ├── index.mjs      # Server entry point
│   ├── prisma/        # Database schema and migrations
│   │   ├── schema.prisma
│   │   └── seed.mjs
│   └── package.json
├── PAGES-PLAN.md      # Detailed pages specification
└── NEXTJS-LEARNING-PATH.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your database configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dsa_tracker"
JWT_SECRET="your-secret-key"
PORT=3000
```

4. Generate Prisma client and run migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. (Optional) Seed the database:
```bash
npm run prisma:seed
```

6. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000` (or the next available port)

## Database Schema

### Key Models

- **User**: User accounts with authentication
- **Question**: DSA problems with links to multiple platforms
- **Sheet**: Collections of questions organized by topics
- **SheetQuestion**: Junction table linking questions to sheets with ordering
- **UserProgress**: Tracks user completion status and notes per question

## Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio GUI
- `npm run prisma:seed` - Seed database with initial data

### Frontend
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Key Features Explained

### Smart Authentication Flow
- Users can browse all problems without logging in
- Attempting to mark a problem as complete redirects to login/signup
- After authentication, users are redirected back to continue their action

### Progress Tracking
- Track completion status separately for LeetCode, GFG, and Code360
- Overall "done" status for each problem
- Add personal notes to any problem
- View completion dates and track your learning journey

### Responsive Design
- Mobile-first approach
- Table view on desktop, card view on mobile
- Clean, distraction-free interface
- Consistent spacing and typography

## Deployment

### Frontend (Netlify)
The frontend is configured for Netlify deployment with the Next.js plugin:
- Configuration in `frontend/netlify.toml`
- Automatic deployments on push

### Backend
Deploy the Express backend to your preferred platform:
- Heroku
- Railway
- DigitalOcean
- AWS/GCP/Azure

Ensure environment variables are properly configured in your deployment platform.

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Guidelines

- Keep it simple - avoid over-engineering
- Follow the mobile-first approach
- Maintain consistent UI/UX patterns
- Write clean, readable code
- Test on multiple screen sizes

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Problems
- `GET /api/problems` - Get all problems (public)
- `GET /api/user/progress` - Get user's progress (protected)
- `POST /api/problems/:id/complete` - Mark problem as done (protected)

### User
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update user profile (protected)
- `DELETE /api/user/profile` - Delete account (protected)

## License

ISC

## Author

Dev Bachani

## Support

For issues and feature requests, please open an issue on the GitHub repository.
