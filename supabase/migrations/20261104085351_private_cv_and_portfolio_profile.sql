create table if not exists public.portfolio_profile (
  id boolean primary key default true check (id),
  tagline text not null,
  summary text not null,
  updated_at timestamptz not null default now()
);

alter table public.portfolio_profile enable row level security;
grant select on public.portfolio_profile to anon, authenticated;
grant update on public.portfolio_profile to authenticated;

drop policy if exists "Public can read portfolio profile" on public.portfolio_profile;
create policy "Public can read portfolio profile"
  on public.portfolio_profile for select to anon, authenticated
  using (true);

drop policy if exists "Portfolio owner can update profile" on public.portfolio_profile;
create policy "Portfolio owner can update profile"
  on public.portfolio_profile for update to authenticated
  using ((select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng')
  with check ((select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng');

insert into public.portfolio_profile (id, tagline, summary)
values (
  true,
  'Building resilient systems. Making complexity clear.',
  'I’m Moses Owalama Abraham, a Software Engineering student at Pan-Atlantic University. I build practical web, desktop, and AI products with a focus on dependable engineering, thoughtful security, and clear interfaces. My work spans computer-vision prototypes, machine-learning tools, cloud-connected desktop software, and transparent funding systems. Using Python, Next.js, and Supabase where they fit, I aim to build secure, resilient infrastructure with efficient code and interfaces that make complex systems feel clear.'
)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('private-cv-files', 'private-cv-files', false, 10485760, array['application/pdf'])
on conflict (id) do update
set public = false, file_size_limit = 10485760, allowed_mime_types = array['application/pdf'];

drop policy if exists "Portfolio owner can read private CV" on storage.objects;
create policy "Portfolio owner can read private CV"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'private-cv-files'
    and name = 'current/cv.pdf'
    and (select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng'
  );

drop policy if exists "Portfolio owner can upload private CV" on storage.objects;
create policy "Portfolio owner can upload private CV"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'private-cv-files'
    and name = 'current/cv.pdf'
    and (select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng'
  );

drop policy if exists "Portfolio owner can replace private CV" on storage.objects;
create policy "Portfolio owner can replace private CV"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'private-cv-files'
    and name = 'current/cv.pdf'
    and (select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng'
  )
  with check (
    bucket_id = 'private-cv-files'
    and name = 'current/cv.pdf'
    and (select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng'
  );

drop policy if exists "Portfolio owner can remove private CV" on storage.objects;
create policy "Portfolio owner can remove private CV"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'private-cv-files'
    and name = 'current/cv.pdf'
    and (select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng'
  );
