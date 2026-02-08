# Task Manager App

A modern, responsive task management application built with **Next.js 16**, **React 19**, and **TypeScript**. Features Kanban/List views, dark mode, i18n (English/French), and full CRUD operations powered by the DummyJSON API.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5.7
- **Styling:** Tailwind CSS 3.4 + shadcn/ui
- **State:** Zustand (global) + TanStack React Query (server)
- **Animations:** Framer Motion
- **i18n:** i18next + react-i18next (EN/FR)
- **API:** DummyJSON (https://dummyjson.com)
- **Testing:** Jest + React Testing Library
- **Deployment:** Netlify

## Features

- **Kanban Board** with 4 status columns (To-do, In Progress, Need Review, Done)
- **List View** with grouped tasks and table layout
- **Dark/Light theme** toggle with system preference detection
- **Internationalization** (English and French)
- **CRUD operations** — Create, read, update, delete tasks
- **Delete confirmation dialog** with toast notifications
- **Task form** with validation (Zod + React Hook Form)
- **Search** and filter functionality
- **Responsive design** — mobile-first with sidebar drawer
- **Smooth animations** — Framer Motion transitions

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd task-management-app

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

The default API URL (`https://dummyjson.com`) is already configured. No changes needed for local development.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Running Tests

### Unit & Component Tests

```bash
# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:ci
```

**Test coverage includes:**

| Area       | File                           | What's tested                                                    |
| ---------- | ------------------------------ | ---------------------------------------------------------------- |
| Components | `TaskCard.test.tsx`            | Rendering, interactions, accessibility                           |
| Components | `DeleteConfirmDialog.test.tsx` | Dialog state, confirm/cancel actions                             |
| Services   | `taskService.test.ts`          | API calls, data mapping, filtering, sorting                      |
| Utilities  | `utils.test.ts`                | `cn()`, `formatDate()`, `getPriorityLabel()`, `getStatusLabel()` |
| Store      | `taskStore.test.ts`            | Zustand actions, state mutations, error handling                 |

### E2E Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

---

## Deployment (Netlify)

### Option 1: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize the project
netlify init

# Deploy
netlify deploy --prod
```

### Option 2: Deploy via Netlify Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [app.netlify.com](https://app.netlify.com) and click **"Add new site"**
3. Select **"Import an existing project"**
4. Connect your repository
5. Netlify will auto-detect the settings from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
6. Click **"Deploy site"**

### Environment Variables on Netlify

In the Netlify dashboard, add:

| Key                   | Value                   |
| --------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | `https://dummyjson.com` |

The `netlify.toml` file is preconfigured with the `@netlify/plugin-nextjs` plugin for optimal Next.js deployment.

---

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Dashboard page
│   └── globals.css         # Global styles + CSS variables
├── components/
│   ├── layout/             # Sidebar, Header, MainLayout
│   ├── tasks/              # KanbanBoard, TaskCard, ListView, Dialogs
│   └── ui/                 # shadcn/ui components
├── hooks/                  # Custom React hooks
├── store/                  # Zustand store
├── lib/
│   ├── api/                # API client + task service
│   ├── i18n/               # i18n config + locale files
│   ├── providers/          # Theme + Sidebar context
│   ├── constants.ts        # App constants
│   └── utils.ts            # Utility functions
├── types/                  # TypeScript type definitions
└── Configuration files     # next.config, tailwind, jest, netlify, etc.
```

---

## Scripts Reference

| Command            | Description                 |
| ------------------ | --------------------------- |
| `npm run dev`      | Start development server    |
| `npm run build`    | Build for production        |
| `npm start`        | Start production server     |
| `npm test`         | Run unit tests (watch mode) |
| `npm run test:ci`  | Run unit tests once         |
| `npm run test:e2e` | Run Playwright E2E tests    |
| `npm run lint`     | Run ESLint                  |
