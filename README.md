# ClearStat Frontend

This project uses **React**, **Vite**, and **TypeScript** with Tailwind CSS.

## Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file based on `.env.example` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   # edit .env
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

Other scripts:

- `npm run build` – build for production
- `npm run preview` – preview the production build

Pre-commit hooks run ESLint and Prettier via husky/lint-staged.
