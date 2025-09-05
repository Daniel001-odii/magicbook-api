-- Example schema for Supabase

-- users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  title text,
  company_name text,
  address text,
  bio text,
  skills text[],
  email text not null unique,
  phone_number text,
  urls text[],
  password text not null,
  image_url text,
  created_at timestamptz default now()
);

-- qrcodes
create table if not exists qrcodes (
  id uuid primary key default gen_random_uuid(),
  uid text not null unique,
  owner uuid references users(id) on delete cascade,
  is_active boolean default false,
  no_of_scans int default 0,
  created_at timestamptz default now()
);
