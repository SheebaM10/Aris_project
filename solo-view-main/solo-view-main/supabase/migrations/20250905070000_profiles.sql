create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  department text,
  role text,
  location text,
  availability text,
  experience text,
  phone text,
  current_projects text[],
  completed_projects text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy if not exists "profiles_select_own" on public.profiles
  for select using (auth.uid() = user_id);

create policy if not exists "profiles_update_own" on public.profiles
  for update using (auth.uid() = user_id);

create or replace function public.set_profiles_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute procedure public.set_profiles_updated_at();


