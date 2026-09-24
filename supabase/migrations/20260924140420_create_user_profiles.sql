create schema if not exists private;

revoke all on schema private from public, anon, authenticated;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  username text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (
    username is null or username ~ '^[a-z0-9._]{3,20}$'
  )
);

create unique index profiles_username_unique_idx
  on public.profiles (username)
  where username is not null;

alter table public.profiles enable row level security;

revoke all on table public.profiles from public, anon, authenticated;
grant select, update on table public.profiles to authenticated;

create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

with auth_profile_rows as (
  select
    id,
    nullif(btrim(raw_user_meta_data ->> 'first_name'), '') as first_name,
    nullif(btrim(raw_user_meta_data ->> 'last_name'), '') as last_name,
    case
      when lower(btrim(raw_user_meta_data ->> 'username')) ~ '^[a-z0-9._]{3,20}$'
      then lower(btrim(raw_user_meta_data ->> 'username'))
      else null
    end as candidate_username
  from auth.users
), ranked_usernames as (
  select
    *,
    count(*) over (partition by candidate_username) as candidate_count
  from auth_profile_rows
)
insert into public.profiles (id, first_name, last_name, username)
select
  id,
  first_name,
  last_name,
  case when candidate_username is not null and candidate_count = 1 then candidate_username else null end
from ranked_usernames
on conflict (id) do nothing;

create or replace function private.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name, username)
  values (
    new.id,
    nullif(btrim(new.raw_user_meta_data ->> 'first_name'), ''),
    nullif(btrim(new.raw_user_meta_data ->> 'last_name'), ''),
    nullif(lower(btrim(new.raw_user_meta_data ->> 'username')), '')
  );

  return new;
end;
$$;

revoke all on function private.handle_new_user_profile() from public, anon, authenticated;

create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute procedure private.handle_new_user_profile();
