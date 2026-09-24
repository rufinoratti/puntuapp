create table public.media_items (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('tmdb', 'rawg', 'openlibrary', 'sample')),
  provider_id text not null,
  media_type text not null check (media_type in ('movie', 'game', 'book')),
  slug text not null unique,
  title text not null check (char_length(btrim(title)) between 1 and 300),
  creator_label text,
  creator text,
  release_year text not null default '—',
  description text,
  genre text not null default '',
  image_url text,
  source_url text,
  external_rating numeric(4, 2),
  external_rating_scale smallint,
  external_rating_label text,
  runtime text,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint media_items_provider_id_unique unique (provider, provider_id),
  constraint media_items_external_rating_valid check (
    (external_rating is null and external_rating_scale is null)
    or (
      external_rating is not null
      and external_rating_scale is not null
      and external_rating_scale in (5, 10)
      and external_rating between 0 and external_rating_scale
    )
  )
);

create index media_items_type_title_idx on public.media_items (media_type, title);

create table public.user_library (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  media_item_id uuid not null references public.media_items (id) on delete cascade,
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_library_user_media_unique unique (user_id, media_item_id)
);

create index user_library_user_status_idx on public.user_library (user_id, status);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  media_item_id uuid not null references public.media_items (id) on delete cascade,
  author_name text not null default 'Usuario' check (char_length(btrim(author_name)) between 1 and 80),
  score numeric(2, 1) not null check (
    score between 0.5 and 5
    and score * 2 = trunc(score * 2)
  ),
  content text not null check (char_length(btrim(content)) between 1 and 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reviews_user_media_unique unique (user_id, media_item_id)
);

create index reviews_media_created_idx on public.reviews (media_item_id, created_at desc);

alter table public.media_items enable row level security;
alter table public.user_library enable row level security;
alter table public.reviews enable row level security;

create policy "Anyone can read media catalog"
  on public.media_items for select
  to anon, authenticated
  using (true);

create policy "Anyone can read reviews"
  on public.reviews for select
  to anon, authenticated
  using (true);

create policy "Users can create their own reviews"
  on public.reviews for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own reviews"
  on public.reviews for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own reviews"
  on public.reviews for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can read their own library"
  on public.user_library for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add to their own library"
  on public.user_library for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own library"
  on public.user_library for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can remove from their own library"
  on public.user_library for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- New public tables may not be exposed to the Data API by default, so grant only
-- the table operations required by the policies above.
grant select on table public.media_items to anon, authenticated;
grant select, insert on table public.media_items to service_role;

grant select on table public.reviews to anon, authenticated;
grant insert, update, delete on table public.reviews to authenticated;

grant select, insert, update, delete on table public.user_library to authenticated;
