# Techneth Dashboard

Responsive CRM-style dashboard built with Next.js, Tailwind CSS, and Supabase authentication.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Supabase Auth
- Recharts

## Local Setup

1. Install dependencies:

	npm install

2. Create environment file:

	- Copy `.env.example` to `.env.local`
	- Fill in your Supabase values:
	  - `NEXT_PUBLIC_SUPABASE_URL`
	  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Run development server:

	npm run dev

4. Open:

	http://localhost:3000

## Supabase Setup

1. Create a Supabase project.
2. In Authentication > Providers, keep Email enabled.
3. In Authentication > URL Configuration, add your local and production URLs.
4. Use the project URL and anon key in `.env.local`.

## Routes

- `/login` for sign in
- `/signup` for account creation
- `/dashboard` for the protected dashboard view

## Data Source

All dashboard content is driven from a single JSON source:

- `src/data/dashboard.json`

## Deployment

Deploy with Vercel:

1. Import the repository in Vercel.
2. Add the same Supabase env vars in Vercel project settings.
3. Deploy.

## Submission Checklist

- Public GitHub repository URL
- Live Vercel preview URL
- Test account email/password
