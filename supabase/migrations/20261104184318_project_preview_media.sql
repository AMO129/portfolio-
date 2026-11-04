alter table public.projects
  add column if not exists preview_image_url text;

drop policy if exists "Portfolio owner can read portfolio media objects" on storage.objects;
create policy "Portfolio owner can read portfolio media objects"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] in ('profile', 'audio', 'projects')
    and (select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng'
  );

drop policy if exists "Portfolio owner can upload portfolio media" on storage.objects;
create policy "Portfolio owner can upload portfolio media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] in ('profile', 'audio', 'projects')
    and (select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng'
  );

drop policy if exists "Portfolio owner can replace portfolio media" on storage.objects;
create policy "Portfolio owner can replace portfolio media"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] in ('profile', 'audio', 'projects')
    and (select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng'
  )
  with check (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] in ('profile', 'audio', 'projects')
    and (select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng'
  );

drop policy if exists "Portfolio owner can remove portfolio media" on storage.objects;
create policy "Portfolio owner can remove portfolio media"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] in ('profile', 'audio', 'projects')
    and (select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng'
  );
