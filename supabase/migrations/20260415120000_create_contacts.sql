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
