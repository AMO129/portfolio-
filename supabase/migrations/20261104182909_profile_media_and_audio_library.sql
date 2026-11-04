alter table public.portfolio_profile
  add column if not exists avatar_url text,
  add column if not exists github_url text,
  add column if not exists linkedin_url text;

update public.portfolio_profile
set github_url = coalesce(github_url, 'https://github.com/AMO129'),
    linkedin_url = coalesce(linkedin_url, 'https://www.linkedin.com/in/moses-abraham-314897380/'),
    avatar_url = coalesce(avatar_url, '/profile.jpg');

create table if not exists public.portfolio_audio_tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 100),
  storage_path text not null unique check (storage_path like 'audio/%'),
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists portfolio_audio_single_active_idx
  on public.portfolio_audio_tracks (is_active)
  where is_active = true;

alter table public.portfolio_audio_tracks enable row level security;
grant select on public.portfolio_audio_tracks to anon, authenticated;
grant insert, update, delete on public.portfolio_audio_tracks to authenticated;

drop policy if exists "Public can read active portfolio audio" on public.portfolio_audio_tracks;
create policy "Public can read active portfolio audio"
  on public.portfolio_audio_tracks for select to anon
  using (is_active = true);

drop policy if exists "Portfolio owner can manage audio tracks" on public.portfolio_audio_tracks;
create policy "Portfolio owner can manage audio tracks"
  on public.portfolio_audio_tracks for all to authenticated
  using ((select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng')
  with check ((select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  26214400,
  array['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/wav', 'audio/ogg', 'audio/webm']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Portfolio owner can read portfolio media objects" on storage.objects;
create policy "Portfolio owner can read portfolio media objects"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] in ('profile', 'audio')
    and (select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng'
  );

drop policy if exists "Portfolio owner can upload portfolio media" on storage.objects;
create policy "Portfolio owner can upload portfolio media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] in ('profile', 'audio')
    and (select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng'
  );

drop policy if exists "Portfolio owner can replace portfolio media" on storage.objects;
create policy "Portfolio owner can replace portfolio media"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] in ('profile', 'audio')
    and (select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng'
  )
  with check (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] in ('profile', 'audio')
    and (select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng'
  );

drop policy if exists "Portfolio owner can remove portfolio media" on storage.objects;
create policy "Portfolio owner can remove portfolio media"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] in ('profile', 'audio')
    and (select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng'
  );
