# Business OS

A modern personal productivity and business management workspace — projects,
tasks, time tracking, goals, earnings, notes and analytics in one fast,
beautiful dashboard.

Built to portfolio quality with a scalable, feature-based architecture that can
grow into a public SaaS product. See [`project.md`](./docs/project.md) for the
full product specification (the single source of truth).

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19, Server Components)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 (OKLCH design tokens, dark-mode first)
- **Backend:** Next.js Server Actions
- **Database & Auth:** Supabase (Postgres + Row Level Security, Google OAuth)
- **Validation:** Zod
- **Icons:** Lucide · **Charts:** Recharts
- **Testing:** Vitest + Testing Library (unit), Playwright (e2e)
- **Tooling:** ESLint, Prettier, Husky, lint-staged
- **Deployment:** Vercel

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local   # then fill in your Supabase credentials

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script              | Description                       |
| ------------------- | --------------------------------- |
| `npm run dev`       | Start the development server      |
| `npm run build`     | Production build                  |
| `npm run start`     | Serve the production build        |
| `npm run lint`      | Lint with ESLint                  |
| `npm run typecheck` | Type-check with `tsc --noEmit`    |
| `npm run format`    | Format the codebase with Prettier |
| `npm run test`      | Run unit tests (Vitest)           |
| `npm run test:e2e`  | Run end-to-end tests (Playwright) |

## Project Structure

```
src/
├── app/                 # Next.js App Router routes & root layout
├── components/
│   ├── providers/       # App-wide context providers (theme, ...)
│   └── ui/              # Reusable design-system components
├── config/              # Site + navigation configuration
├── features/            # Feature-based modules (auth, projects, tasks, ...)
├── hooks/               # Shared React hooks
├── lib/
│   ├── supabase/        # Browser / server / proxy Supabase clients
│   ├── utils/           # Pure utilities (cn, ...)
│   ├── validations/     # Shared Zod schemas
│   └── env.ts           # Type-safe environment access
├── styles/              # Global styles (if needed beyond app/globals.css)
└── types/               # Shared TypeScript types
```
