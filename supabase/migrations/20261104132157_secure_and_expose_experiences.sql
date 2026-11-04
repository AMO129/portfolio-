grant select on public.experiences to anon, authenticated;
grant insert, update, delete on public.experiences to authenticated;

drop policy if exists "Public can read experiences" on public.experiences;
create policy "Public can read experiences"
  on public.experiences for select to anon, authenticated
  using (true);

drop policy if exists "Portfolio owner can add experiences" on public.experiences;
create policy "Portfolio owner can add experiences"
  on public.experiences for insert to authenticated
  with check ((select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng');

drop policy if exists "Portfolio owner can update experiences" on public.experiences;
create policy "Portfolio owner can update experiences"
  on public.experiences for update to authenticated
  using ((select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng')
  with check ((select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng');

drop policy if exists "Portfolio owner can delete experiences" on public.experiences;
create policy "Portfolio owner can delete experiences"
  on public.experiences for delete to authenticated
  using ((select auth.jwt()->>'email') = 'moses.abraham@pau.edu.ng');
