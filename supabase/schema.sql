create extension if not exists pgcrypto;

create table if not exists public.organizer_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('non_monogamous', 'sex_positive')),
  event_date date not null,
  start_time time,
  end_time time,
  location text not null,
  description text not null,
  tags text[] not null default '{}',
  external_link text,
  price_text text,
  created_at timestamptz not null default now()
);

create index if not exists events_category_idx on public.events(category);
create index if not exists events_event_date_idx on public.events(event_date);
create index if not exists events_tags_idx on public.events using gin(tags);

alter table public.events enable row level security;
alter table public.organizer_accounts enable row level security;

create or replace function public.is_organizer()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.organizer_accounts oa
    where oa.user_id = auth.uid()
  );
$$;

create policy "Public can read events"
on public.events
for select
using (true);

create policy "Organizers can insert events"
on public.events
for insert
with check (public.is_organizer());

create policy "Organizers can update events"
on public.events
for update
using (public.is_organizer())
with check (public.is_organizer());

create policy "Organizers can delete events"
on public.events
for delete
using (public.is_organizer());

create policy "Organizers can read organizer_accounts"
on public.organizer_accounts
for select
using (public.is_organizer());

create policy "Service role manages organizer_accounts"
on public.organizer_accounts
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

insert into public.events (
  title,
  category,
  event_date,
  start_time,
  end_time,
  location,
  description,
  tags,
  external_link,
  price_text
)
values
  (
    'Polyamory Discussion Night',
    'non_monogamous',
    current_date + 5,
    '19:00',
    '22:00',
    'Neukölln, Berlin',
    'A community evening with facilitated conversation, mingling, and optional discussion prompts.',
    array['polyamory', 'discussion', 'community'],
    'https://example.com/polyamory-night',
    'Free'
  ),
  (
    'Consent & Play Workshop',
    'sex_positive',
    current_date + 9,
    '18:30',
    '21:30',
    'Friedrichshain, Berlin',
    'A skills-focused workshop on consent language, boundaries, and playful communication.',
    array['consent', 'workshop', 'education'],
    'https://example.com/consent-workshop',
    '€15'
  )
on conflict do nothing;

-- After creating your organizer in Supabase Auth, add that user manually:
-- insert into public.organizer_accounts (user_id)
-- values ('YOUR_AUTH_USER_UUID_HERE');
