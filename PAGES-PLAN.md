# DSA Progress Tracker - Pages Plan

## 🎯 Core Concept
A simple, clean DSA progress tracking website where learners can view all DSA problems publicly, but must sign up to track their progress.

---

## 📄 Pages Overview

| Page | Route | Access | Purpose |
|------|-------|--------|---------|
| Landing/Home | `/` | Public | Explain the app, convince users to join |
| Sheet | `/sheet` | Public (view), Auth (interact) | Display all DSA problems |
| Login | `/login` | Public | User authentication |
| Sign Up | `/signup` | Public | User registration |
| Profile | `/profile` | Protected | User settings and account management |

---

## 🏠 1. Landing Page (`/`)

### Purpose
Convert visitors into users by showing value proposition.

### Content Needed
- **Hero Section**
  - Catchy headline: What is this app?
  - Subheading: Why DSA learners need this
  - Two CTAs: "View Sheet" (primary) and "Sign Up" (secondary)

- **Features/Benefits**
  - Track progress across all DSA topics
  - See which problems you've solved
  - Organized by topics/difficulty
  - Simple and distraction-free

- **Simple Stats** (if available)
  - Total problems in database
  - Number of registered users
  - Topics covered

### UI Notes
- Keep it minimal - one clear message
- Large, readable text
- Visual hierarchy: headline → benefits → CTA
- Mobile-first design

### Component Type
Server Component (mostly static content)

---

## 📋 2. Sheet Page (`/sheet`)

### Purpose
Main feature - display all DSA problems in an organized way.

### Access Pattern
- **Viewing:** Public (anyone can browse)
- **Interaction:** Protected (must be logged in to mark as done)

### Content/Features Needed
- **Problem List/Table** with:
  - Problem name/title
  - Topic/category (Arrays, Strings, DP, etc.)
  - Difficulty (Easy, Medium, Hard)
  - Checkbox for "completed" status
  - Link to problem (LeetCode, GFG, etc.)
  - Date completed (if solved)

- **Filters** (optional, add later):
  - By topic
  - By difficulty
  - Show only completed/incomplete

- **Progress Summary** (if logged in):
  - "You've solved X out of Y problems"
  - Topic-wise breakdown

### Smart Auth Flow
```
User clicks checkbox:
  ↓
  Check if logged in (token in localStorage)
  ↓
  If NOT logged in:
    → Redirect to /login
    → After login, redirect back to /sheet
  ↓
  If logged in:
    → Make API call to mark problem as done
    → Update UI (checkbox checked, add completion date)
```

### Data to Fetch from Backend
- GET `/api/problems` - All problems
- GET `/api/user/progress` - User's completed problems (if logged in)
- POST `/api/problems/:id/complete` - Mark problem as done

### UI Notes
- Clean table or card layout
- Color-code by difficulty (green/yellow/red)
- Strikethrough or different style for completed problems
- Responsive: table on desktop, cards on mobile

### Component Type
Client Component (needs interactivity, state)

---

## 🔐 3. Login Page (`/login`)

### Purpose
Authenticate existing users.

### Form Fields
- Email (required)
- Password (required)
- "Remember me" checkbox (optional)

### Features
- Form validation
- Error messages (invalid credentials)
- "Don't have an account? Sign up" link
- Loading state while authenticating

### API Call
- POST `/api/auth/login`
- Body: `{ email, password }`
- Response: `{ token, user: { id, name, email } }`

### After Successful Login
1. Store token in localStorage
2. Store user info (optional)
3. Redirect to:
   - `/sheet` (default)
   - OR previous page if came from sheet checkbox click

### UI Notes
- Centered form on page
- Simple, clean design
- Clear error messages
- Accessible form labels

### Component Type
Client Component (form, state, API calls)

---

## ✍️ 4. Sign Up Page (`/signup`)

### Purpose
Register new users.

### Form Fields
- First Name (required)
- Last Name (required)
- Email (required)
- Password (required)
- Confirm Password (optional but recommended)

### Features
- Form validation
- Password strength indicator (optional)
- Error messages (email already exists)
- "Already have an account? Login" link
- Loading state while registering

### API Call
- POST `/api/auth/signup`
- Body: `{ firstName, lastName, email, password }`
- Response: `{ token, user: { id, name, email } }`

### After Successful Signup
1. Store token in localStorage
2. Redirect to `/sheet`
3. Optional: Show welcome message

### UI Notes
- Similar design to login page (consistency)
- Clear, helpful error messages
- Show requirements (password length, etc.)

### Component Type
Client Component (form, state, API calls)

---

## 👤 5. Profile Page (`/profile`)

### Purpose
User account management and settings.

### Access
Protected - redirect to `/login` if not authenticated.

### Features/Sections

#### View Profile
- Display current: First Name, Last Name, Email
- User stats: Total problems solved, join date

#### Edit Profile
- Form to update:
  - First Name
  - Last Name
  - Email
- Save button
- Success/error messages

#### Delete Account
- "Delete Account" button (destructive action)
- Confirmation dialog: "Are you sure?"
- After deletion: Clear localStorage, redirect to home

### API Calls
- GET `/api/user/profile` - Fetch user data
- PUT `/api/user/profile` - Update user info
- DELETE `/api/user/profile` - Delete account

### UI Notes
- Section-based layout (Profile Info, Settings, Danger Zone)
- Red styling for delete button
- Confirmation modal for destructive actions
- Success toast/message after updates

### Component Type
Client Component (needs auth check, forms, API calls)

---

## 🧭 Navigation/Layout

### Navbar (Root Layout)
Present on all pages:

**When Not Logged In:**
- Logo/Brand name (links to `/`)
- Sheet
- Login
- Sign Up

**When Logged In:**
- Logo/Brand name (links to `/`)
- Sheet
- Profile
- Logout button

### Conditional Rendering
Check localStorage for token to determine logged-in state.

---

## 🎨 UI/UX Philosophy

### Design Principles
- **Simple > Complex** - No unnecessary features
- **Clear > Clever** - Obvious interactions
- **Clean > Crowded** - Whitespace is good
- **Consistent > Varied** - Same patterns throughout

### Style Guidelines
- **Colors:** 2-3 colors max (primary, secondary, danger)
- **Spacing:** Consistent (use Tailwind scale: 4, 8, 12, 16)
- **Typography:** Clear hierarchy (h1, h2, body)
- **Shadows:** Subtle (shadow-sm, shadow-md)
- **Rounded corners:** Consistent (rounded-lg everywhere)
- **Buttons:** Clear, large click targets
- **Forms:** Simple, well-labeled, good validation

### Responsive Design
- Mobile-first approach
- Test on small screens constantly
- Stack vertically on mobile
- Grid/flex layouts on desktop

---

## 🔄 User Flow

```
New User Journey:
Landing (/)
  → View Sheet (/sheet)
  → Click checkbox (not logged in)
  → Redirected to Signup (/signup)
  → After signup → Sheet (/sheet)
  → Now can mark problems as done
  → Access Profile (/profile) to manage account

Returning User Journey:
Landing (/)
  → Login (/login)
  → Sheet (/sheet)
  → Continue tracking progress
```

---

## 📊 Data Requirements

### From Backend API

#### Problems
```javascript
{
  id: number,
  title: string,
  topic: string,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  link: string,
  description?: string
}
```

#### User Progress
```javascript
{
  problemId: number,
  completedAt: date,
  userId: number
}
```

#### User Profile
```javascript
{
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  createdAt: date,
  problemsSolved: number
}
```

---

## ✅ Development Priority

Build in this order:

1. **Landing page** - Set the tone, practice basics
2. **Sheet page** - Core feature (start with dummy data)
3. **Login/Signup** - Enable user accounts
4. **Connect sheet to backend** - Real data + auth flow
5. **Profile page** - Account management
6. **Polish** - Improve UI, add loading states, error handling

---

## 🚫 What NOT to Include (Keep It Simple)

- ❌ Social features (comments, likes)
- ❌ Multiple sheet templates
- ❌ Admin dashboard (add later if needed)
- ❌ Dark mode (v2 feature)
- ❌ Problem solving interface (just link to external)
- ❌ Email verification (add later if needed)
- ❌ Password reset (add later if needed)
- ❌ Complex animations

Keep it focused on core functionality first!

---

## 📱 Mobile Considerations

- Sheet: Use cards instead of table on mobile
- Forms: Large input fields, big buttons
- Navbar: Hamburger menu on mobile
- Spacing: More generous on mobile

---

## 🎯 Success Criteria

A user should be able to:
1. ✅ Understand what the app does within 5 seconds (landing page)
2. ✅ Browse all problems without signing up
3. ✅ Sign up/login quickly (< 30 seconds)
4. ✅ Mark problems as complete easily
5. ✅ See their progress at a glance
6. ✅ Update profile or delete account without confusion

**If it takes more than 3 clicks to do anything, simplify it.**

---

*Keep referring back to this plan while building. Update it if requirements change!*
