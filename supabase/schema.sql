-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null,
  phone text,
  location text,
  headline text,
  bio text,
  skills text[],
  technologies text[],
  links jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Jobs Table
create table public.jobs (
  id text primary key,
  external_id text,
  company text not null,
  role text not null,
  description text,
  requirements text[],
  skills text[],
  salary_min numeric,
  salary_max numeric,
  currency text,
  location text,
  remote_type text,
  employment_type text,
  posted_at text,
  application_url text,
  source text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Applications Table
create table public.applications (
  id text primary key,
  job_id text references public.jobs(id) on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  status text not null,
  applied_at timestamp with time zone,
  submission_mode text,
  match_score numeric,
  resume_version text,
  cover_letter text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;

-- Policies (Only user can see their own data)
create policy "Users can view their own profile." on profiles for select using (auth.uid() = id);
create policy "Users can update their own profile." on profiles for update using (auth.uid() = id);

create policy "Users can view all jobs." on jobs for select using (true);
create policy "Users can view their own applications." on applications for select using (auth.uid() = user_id);
create policy "Users can insert their own applications." on applications for insert with check (auth.uid() = user_id);
create policy "Users can update their own applications." on applications for update using (auth.uid() = user_id);
