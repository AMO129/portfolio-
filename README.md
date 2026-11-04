# Tactical Portfolio

Next.js App Router portfolio for Moses Owalama Abraham. The public portfolio reads the `public.projects` table through the Supabase Data API and revalidates its static output every 30 minutes. The protected `/admin` console uses Supabase Auth and makes project changes through the signed-in user's session, so the existing RLS policies remain the authorization boundary.

## Local setup

1. Install Node.js 22 or newer.
2. Copy `.env.example` to `.env.local` and fill in the Supabase project URL and publishable key.
3. Keep the provided `NEXT_PUBLIC_CONTACT_EMAIL` value, or change it if the contact address changes.
4. Install dependencies with `npm install`.
5. Start the local app with `npm run dev`.

The public portfolio is static and read-only. Set the Supabase URL and publishable key in the deployment build environment so the projects can be fetched during generation. Set `NEXT_PUBLIC_CONTACT_EMAIL` to `moses.abraham@pau.edu.ng` in the deployment environment. Never add a Supabase secret or service-role key to a `NEXT_PUBLIC_` variable.

## Project table

The public read expects `public.projects` with `id`, `created_at`, `title`, `status`, `role`, `tech_stack`, `description`, and nullable `project_url`. An empty project URL removes the external project link. The admin console supports create, update, and delete operations. These use the authenticated user's publishable-key client and depend on the existing RLS policies granting only the intended authenticated operator access.

## Styling and motion

Tailwind utility classes are used directly in JSX. `src/app/globals.css` contains only Tailwind's framework import. Framer Motion handles UI transitions and the cursor pulse; GSAP is limited to scroll-triggered reveal motion; React Three Fiber renders the Saturn and drone hero scene.


