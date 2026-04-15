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
		 - `SUPABASE_SERVICE_ROLE_KEY`

3. Run development server:

	npm run dev

4. Open:

	http://localhost:3000

## Supabase Setup

1. Create a Supabase project.
2. In Authentication > Providers, keep Email enabled.
3. In Authentication > URL Configuration, add your local and production URLs.
4. Use the project URL and anon key in `.env.local`.

## Contacts Storage (Vercel-safe)

Contacts are stored in the Supabase table `public.contacts` (not the filesystem).

Run the included migration in Supabase SQL editor or with the Supabase CLI:

- `supabase/migrations/20260415120000_create_contacts.sql`

If you prefer to paste it manually, use:

```sql
create table if not exists public.contacts (
	id bigint generated always as identity primary key,
	name text not null,
	role text not null,
	avatar text not null,
	email text,
	phone text,
	location text,
	section_id integer not null default 1,
	created_at timestamptz not null default now()
);

notify pgrst, 'reload schema';
```

If Supabase still reports a schema cache error after creating the table, rerun the SQL once or refresh the API schema cache from the project dashboard.

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
2. Add these env vars in Vercel project settings:
	- `NEXT_PUBLIC_SUPABASE_URL`
	- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
	- `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy.

## Submission Checklist

- Public GitHub repository URL
- Live Vercel preview URL
- Test account email/password
