# LeetLab

> A focused, full-stack coding practice workspace for solving DSA problems, running code, tracking progress, discussing solutions, and preparing for company interviews.

LeetLab combines a React/Vite frontend with an Express API, PostgreSQL, Prisma, and Judge0-powered code execution. Its **Company Prep** workspace ranks questions from the existing problem bank for a target company and role. When configured, Gemini can enrich the plan with current web-grounded interview research; when it is unavailable, LeetLab automatically falls back to transparent deterministic ranking.

---

## Contents

- [Product overview](#product-overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology stack](#technology-stack)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
- [Installation and local development](#installation-and-local-development)
- [Database and migrations](#database-and-migrations)
- [Company Prep and Gemini](#company-prep-and-gemini)
- [Application routes](#application-routes)
- [Useful commands](#useful-commands)
- [Security notes](#security-notes)
- [Troubleshooting](#troubleshooting)

## Product overview

LeetLab is designed around a simple practice loop:

1. Browse a curated problem library.
2. Filter by title, difficulty, topics, and companies.
3. Open a problem and work in the code editor.
4. Execute code against test cases through Judge0.
5. Submit solutions and track solved problems.
6. Save problems into private playlists.
7. Discuss solutions with other authenticated users.
8. Generate a company-specific preparation plan from existing questions.

The application uses the existing database records as the source of truth. Company Prep never creates duplicate problem records or invents links to problems.

## Features

### Problem practice

- Searchable problem library with compact table layout.
- Difficulty, topic, and company filters.
- Right-side company filter panel with multi-select filtering.
- Problem numbers, tags, difficulty badges, solved state, and playlist actions.
- Infinite loading for larger problem collections.
- Public problem statements with examples, constraints, hints, editorials, and test cases.

### Code execution and submissions

- Monaco-based editor experience.
- Support for JavaScript, Python, Java, C, and C++ language mappings.
- Code execution and batch test evaluation through Judge0.
- Submission history and result details.
- Per-user solved tracking through `ProblemSolved`.

### Accounts and progress

- Registration, login, logout, and session checks.
- JWT authentication stored in an HTTP-only cookie.
- User profile page and account menu.
- Private playlists and playlist detail pages.
- User-specific solved status and submissions.

### Discussions

- Problem-specific discussion threads.
- Authenticated users can create discussions.
- Users can delete their own discussions.

### Company Prep

- Company, role, job description, interview date, question count, daily time, and difficulty inputs.
- Transparent ranking from the existing problem bank.
- Company tag, topic, role, job-description, difficulty, and diversity signals.
- Optional Gemini research with Google Search grounding.
- Database-backed question IDs only.
- Relevance score, priority, reason, difficulty, tags, solved status, and evidence status.
- Source links and research summary when Gemini grounding succeeds.
- Deadline-aware day-wise schedule.
- Private saved plans through the `PrepPlan` model.
- Safe deterministic fallback when Gemini is not configured or unavailable.

## Architecture

```text
┌──────────────────────────────┐
│        React + Vite UI       │
│  Pages · Components · Stores │
└──────────────┬───────────────┘
               │ Axios / JSON / cookies
               ▼
┌──────────────────────────────┐
│       Express REST API       │
│ Routes · Controllers · Auth  │
└───────┬───────────┬──────────┘
        │           │
        │           ├──────────────────────┐
        ▼           ▼                      ▼
┌──────────────┐ ┌──────────────┐ ┌─────────────────────┐
│ PostgreSQL   │ │   Judge0     │ │ Gemini + Google     │
│ Prisma ORM   │ │ code runner  │ │ Search grounding   │
└──────────────┘ └──────────────┘ └─────────────────────┘
```

### Request flow

1. The frontend sends authenticated requests through `axiosInstance`.
2. Express routes apply `authMiddleware` where user access is required.
3. Controllers validate input and use Prisma for database access.
4. Code execution is delegated to Judge0; LeetLab does not execute untrusted code inside the API process.
5. Company Prep first ranks database questions deterministically.
6. If `GEMINI_API_KEY` is present, Gemini receives a bounded candidate list and may improve selection using grounded research.
7. AI-selected IDs are validated against the candidate database records.
8. If Gemini fails, the deterministic plan is returned instead of failing the whole request.

## Technology stack

### Frontend

- React 19
- Vite
- React Router
- Zustand
- Axios
- Tailwind CSS
- DaisyUI
- Lucide React
- React Hook Form and Zod
- Monaco Editor

### Backend

- Node.js
- Express 5
- Prisma 6
- PostgreSQL
- JWT and cookie-parser
- bcryptjs
- Axios
- dotenv

### External services

- [Judge0](https://judge0.com/) for code execution.
- [Gemini API](https://ai.google.dev/gemini-api/docs) with optional Google Search grounding for Company Prep research.

## Project structure

```text
leetlab/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── data/
│   ├── scripts/
│   ├── src/
│   │   ├── controllers/
│   │   ├── generated/prisma/
│   │   ├── libs/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layout/
│   │   ├── lib/
│   │   ├── page/
│   │   ├── providers/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── index.css
│   ├── .env.example
│   └── package.json
├── package.json
└── README.md
```

## Prerequisites

Install the following before starting:

- Node.js 18 or later
- npm
- PostgreSQL
- Git
- A running Judge0 instance or a compatible Judge0 API endpoint
- A Gemini API key only if live Company Prep research is required

## Configuration

### Backend environment

Create `backend/.env` from the example:

```powershell
Copy-Item backend\.env.example backend\.env
```

Then configure:

```env
PORT=8080
NODE_ENV=development

DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public
JWT_SECRET=replace_with_a_long_random_secret

JUDGE0_API_URL=http://localhost:2358

# Optional: enables grounded Company Prep research.
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
GEMINI_TIMEOUT_MS=60000
```

`GEMINI_TIMEOUT_MS` is optional. If omitted, the backend defaults to 60,000 milliseconds and clamps the configured value to a safe 10–120 second range.

### Frontend environment

Create `frontend/.env` from the example:

```powershell
Copy-Item frontend\.env.example frontend\.env
```

Configure the API base URL:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

Only variables prefixed with `VITE_` are exposed to the browser. Never put `GEMINI_API_KEY`, `DATABASE_URL`, or `JWT_SECRET` in the frontend environment.

## Installation and local development

### 1. Clone the repository

```powershell
git clone https://github.com/maurya-kavi/leetlab.git
cd leetlab
```

### 2. Install backend dependencies

```powershell
cd backend
npm install
```

### 3. Configure the backend

Create `backend/.env` and set the values described above.

### 4. Apply database migrations and generate Prisma client

For a new development database:

```powershell
npx prisma migrate dev
npx prisma generate
```

For deploying already-created migrations:

```powershell
npx prisma migrate deploy
npx prisma generate
```

### 5. Start the backend

```powershell
npm run dev
```

The API runs at:

```text
http://localhost:8080
```

### 6. Install and start the frontend

Open a second terminal:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

## Database and migrations

The Prisma schema is in [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma). Important models include:

- `User`
- `Problem`
- `Submission`
- `TestCaseResult`
- `ProblemSolved`
- `Playlist`
- `ProblemInPlaylist`
- `Discussion`
- `PrepPlan`

The migration history includes the original setup plus later changes for discussions, unique problem numbers, company tags, and Company Prep plans/research.

Useful Prisma commands:

```powershell
cd backend
npx prisma format
npx prisma validate
npx prisma generate
npx prisma migrate dev
npx prisma migrate deploy
```

Do not reset or delete the database when working with the existing problem bank. Use migrations to preserve existing records.

## Company Prep and Gemini

Company Prep is intentionally layered:

### Layer 1: deterministic database ranking

The backend ranks existing questions using:

- Exact company tags.
- Problem title, description, and topic tags.
- Role and job-description keywords.
- Preferred difficulty.
- Topic coverage and diversity.
- Solved state for display.

### Layer 2: optional Gemini enrichment

When `GEMINI_API_KEY` is configured:

- The backend sends Gemini a bounded list of real database candidates.
- Gemini may use Google Search grounding to find recent company interview reports.
- Gemini returns candidate IDs, reasons, evidence status, and source links.
- Returned IDs are validated against the original database candidate list.
- The frontend displays the research provider, status, summary, and sources.

### Layer 3: reliable fallback

If the key is missing, the request times out, the provider rejects a request, or Gemini returns invalid IDs, the deterministic plan remains available. The UI identifies the fallback state instead of presenting heuristic results as verified facts.

Gemini is called only by the backend. API keys are never sent to the browser.

## Application routes

### Frontend routes

| Route | Purpose | Access |
|---|---|---|
| `/` | Problem dashboard | Authenticated |
| `/problem/:id` | Problem details, editor, submissions, discussions | Authenticated |
| `/company-prep` | Company interview preparation plans | Authenticated |
| `/playlists` | User playlists | Authenticated |
| `/playlists/:playlistId` | Playlist details | Authenticated |
| `/profile` | User profile | Authenticated |
| `/login` | Sign in | Public |
| `/signup` | Create account | Public |
| `/add-problem` | Create problems | Admin |

### Backend API groups

The API prefix is `/api/v1`.

| Group | Examples |
|---|---|
| Auth | `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/check` |
| Problems | `/problems/get-all-problems`, `/problems/get-problem/:id` |
| Submissions | `/submission/get-submission/:problemId` |
| Code execution | `/execute-code/...` |
| Playlists | `/playlist`, `/playlist/create-playlist` |
| Discussions | `/discussions/:problemId` |
| Company Prep | `/company-prep/generate`, `/company-prep/plans` |

Most endpoints require the authenticated JWT cookie. Problem creation, update, and deletion additionally require an admin user.

## Useful commands

### Frontend

```powershell
cd frontend
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend

```powershell
cd backend
npm run dev
npm run sync:company-tags
npx prisma validate
npx prisma generate
npx prisma migrate dev
```

### Root package

The root package contains project metadata. Run frontend and backend commands from their respective directories.

## Security notes

- Never commit `.env` files or real API keys.
- Keep Gemini credentials on the backend only.
- Use a long, random `JWT_SECRET`.
- Use HTTPS and secure cookies in production.
- Restrict CORS to the deployed frontend origin.
- Do not expose private preparation plans across users.
- Do not execute untrusted code inside the Express process.
- Review Judge0 deployment and network security before exposing it publicly.
- Validate and limit all user-provided input before sending it to external services.

## Troubleshooting

### Gemini shows “fallback ranking used”

Check the backend terminal for the provider error. Confirm:

```env
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
GEMINI_TIMEOUT_MS=60000
```

Restart the backend after changing `.env`:

```powershell
Ctrl+C
npm run dev
```

Grounded web research may take longer than a normal API request. The fallback planner is expected behavior when Gemini is unavailable.

### Prisma reports an unknown field

Stop the running backend, then regenerate the client:

```powershell
cd backend
npx prisma migrate deploy
npx prisma generate
npm run dev
```

On Windows, a running Node/Nodemon process can lock Prisma's query engine. Stop the old process before running `prisma generate`.

### Frontend cannot reach the API

Verify that:

1. The backend is running on port `8080`.
2. `frontend/.env` contains `VITE_API_URL=http://localhost:8080/api/v1`.
3. The frontend dev server was restarted after changing `.env`.
4. The backend CORS origin matches the frontend URL.

---

## License and project status

LeetLab is an actively developed educational project. Check the repository's license and contribution policy before redistributing or deploying it publicly.
