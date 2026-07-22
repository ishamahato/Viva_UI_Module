# AI Viva — UI Module (Frontend)

The **web interface** of the AI Viva System: a React application with separate portals for **Students** (take the viva, see results and feedback), **Faculty** (manage question banks, monitor live vivas, view analytics and reports), and **Admin** (manage faculty/students, system analytics).

> **Current status — UI prototype:** the interface currently runs on **mock data** (`src/services/mockData.ts`) and browser localStorage. It is **not yet connected** to the backend modules (Question Bank :8000, Validation :8001, Result & Storage :8010). Wiring those APIs in is the next integration step — see "Connecting to the backends" below.

## Tech stack

- **React 19** + **TypeScript** — UI framework
- **Vite 8** — dev server and build tool
- **Tailwind CSS 4** — styling
- **Radix UI** + shadcn-style components (`src/components/ui/`) — accessible primitives
- **React Router 7** — the 20+ routes across the three portals
- **Recharts** — analytics charts · **Framer Motion** — animations · **Lucide** — icons
- Custom hooks: `useVoiceRecorder` (microphone capture for viva answers), `useTimer`, `useLocalStorage`

## Project structure

```
src/
├── App.tsx                 # All routes (student / faculty / admin)
├── pages/
│   ├── LandingPage.tsx
│   ├── student/            # Login, Register, Dashboard, Instructions,
│   │                       # VivaExamination (the exam screen), Completion,
│   │                       # ResultDashboard, FeedbackPage
│   ├── faculty/            # Login, Register, Dashboard, QuestionBank,
│   │                       # LiveMonitoring, AnalyticsDashboard, ReportsPage
│   └── admin/              # Login, Dashboard (+ faculty/students/analytics/reports)
├── layouts/                # Shell layouts per role + auth layout
├── components/
│   ├── common/             # Sidebar, Topbar, PageHeader, StatCard
│   └── ui/                 # Button, Card, Dialog, Tabs, ... (Radix-based)
├── contexts/AuthContext.tsx # Mock auth state (localStorage)
├── hooks/                  # useVoiceRecorder, useTimer, useLocalStorage
├── services/mockData.ts    # ← ALL data currently comes from here
└── utils/
```

## Prerequisites

- **Node.js 20.19+ or 22.12+** (Vite 8 requirement). Check with `node --version`.
  - macOS: `brew install node` (or download from [nodejs.org](https://nodejs.org))
  - Windows: download the LTS installer from [nodejs.org](https://nodejs.org) (includes npm)
- No Python, no database, no `.env` — this is a pure frontend.

## How to run on macOS (MacBook)

```bash
# 1. Open Terminal and go into the project folder
cd ~/Downloads/Viva_UI_Module-main

# 2. Install dependencies (first time only, ~1 minute)
npm install

# 3. Start the development server
npm run dev
```

You'll see:

```
  VITE v8.x.x  ready in ~1s
  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser. Stop the server with `Ctrl + C`.

## How to run on Windows

```powershell
# 1. Open PowerShell and go into the project folder
cd path\to\Viva_UI_Module-main

# 2. Install dependencies (first time only)
npm install

# 3. Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser. Stop with `Ctrl + C`. (Commands are identical on both systems — npm is cross-platform.)

## URLs and ports

- Dev server: **http://localhost:5173** — if 5173 is busy, Vite automatically uses 5174, 5175, … (it prints the actual URL).
- Key pages to demo: `/` (landing) · `/student/login` · `/student/viva` (the exam screen with voice recording) · `/faculty/dashboard` · `/admin/login`.
- The microphone (voice recorder) works on `localhost` without HTTPS; the browser will ask for mic permission on the viva screen.

## Other commands

```bash
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
npm run lint       # run ESLint
```

## Connecting to the backends (next integration step)

All data currently comes from `src/services/mockData.ts`. To wire the real system:

| UI area | Replace mock with | Backend |
|---|---|---|
| Faculty login/register, QuestionBank page | `POST /auth/*`, `/questions/*` | Question Bank — http://127.0.0.1:8000 |
| Viva answer checking | `POST /api/v1/validate` | Validation — http://127.0.0.1:8001 |
| Results & feedback pages | `GET /api/results/latest`, `POST /api/attempts` | Result & Storage — http://127.0.0.1:8010 |

All three backends already send permissive CORS headers, so `fetch()` calls from localhost:5173 will work without proxy configuration.

## Troubleshooting

| Problem | Fix |
|---|---|
| `node: command not found` | Install Node.js (see Prerequisites) and reopen the terminal |
| `npm install` is very slow / fails on network | Retry; check internet. Delete `node_modules` and `package-lock.json` only as a last resort |
| Vite starts on 5174 instead of 5173 | Something else uses 5173 — harmless; use the URL Vite prints |
| Blank page after start | Check the terminal and the browser console (F12) for the first red error |
| Port truly stuck (macOS) | `lsof -ti:5173 \| xargs kill` |
| Mic not working on the viva page | Allow microphone permission in the browser; must be on `localhost` or HTTPS |
| `EACCES` / permission errors on npm (macOS) | Don't use `sudo`; fix npm's folder ownership or reinstall Node via Homebrew |
