# Supabase Setup Guide

## Quick Start

Follow these steps to enable contact creation in your app.

### 1. Create the Contacts Table

Go to your Supabase project dashboard:

1. Navigate to **SQL Editor**
2. Click **New query**
3. Copy and paste the entire SQL block below:

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

4. Click **Run**
5. Wait for the query to complete successfully

### 2. Enable RLS (Optional but Recommended)

To restrict direct access and only allow writes via your API:

```sql
alter table public.contacts enable row level security;

create policy "Allow authenticated reads"
  on public.contacts for select
  to authenticated
  using (true);

create policy "Allow authenticated inserts"
  on public.contacts for insert
  to authenticated
  with check (true);
```

### 3. Verify the Setup

After the table is created:

1. In Supabase, go to the **Table Editor**
2. You should see the `contacts` table in the left sidebar
3. Refresh your local app (http://localhost:3000)
4. The error messages should disappear and you should be able to create contacts

### 4. For Vercel Deployment

Make sure these environment variables are set in your Vercel project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Then redeploy from Vercel dashboard.

## Troubleshooting

**"Could not find table 'public.contacts' in the schema cache"**
- Run the SQL above and wait for it to complete
- If the error persists, run the `notify pgrst, 'reload schema';` line again

**Contact creation still fails after table creation**
- Check that `SUPABASE_SERVICE_ROLE_KEY` is set correctly in your environment
- Check Supabase logs in the Functions section for detailed error messages
- Ensure the `contacts` table has the correct columns

## File Reference

- Migration SQL: `supabase/migrations/20260415120000_create_contacts.sql`
- API route: `src/app/api/contacts/route.ts`
- Data loader: `src/lib/dashboard-data.ts`
