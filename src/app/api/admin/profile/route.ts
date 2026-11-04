import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSameOriginRequest } from "@/lib/request-origin";

export const dynamic = "force-dynamic";
const OPERATOR_EMAIL = "moses.abraham@pau.edu.ng";

export async function PUT(request: NextRequest) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (items) => items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
    },
  });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || user?.email?.toLowerCase() !== OPERATOR_EMAIL) return NextResponse.json({ error: "Authorized admin access is required." }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body.tagline !== "string" || typeof body.summary !== "string") return NextResponse.json({ error: "A tagline and summary are required." }, { status: 400 });
  const tagline = body.tagline.trim();
  const summary = body.summary.trim();
  if (!tagline || tagline.length > 120 || !summary || summary.length > 1800) return NextResponse.json({ error: "Keep the tagline under 120 characters and the summary under 1,800." }, { status: 400 });
  const optionalUrl = (value: unknown, hosts: string[]) => {
    if (value === null || value === "") return { value: null, valid: true };
    if (typeof value !== "string" || value.length > 320) return { value: null, valid: false };
    try {
      const url = new URL(value);
      if (url.protocol !== "https:" || !hosts.includes(url.hostname.toLowerCase())) return { value: null, valid: false };
      url.search = "";
      url.hash = "";
      return { value: url.toString().replace(/\/$/, ""), valid: true };
    } catch { return { value: null, valid: false }; }
  };
  const github = optionalUrl(body.github_url, ["github.com", "www.github.com"]);
  const linkedin = optionalUrl(body.linkedin_url, ["linkedin.com", "www.linkedin.com"]);
  const avatarUrl = body.avatar_url;
  const avatarValid = avatarUrl === null || avatarUrl === "/profile.jpg" || (typeof avatarUrl === "string" && avatarUrl.startsWith(`${url.replace(/\/$/, "")}/storage/v1/object/public/portfolio-media/profile/`));
  if (!github.valid || !linkedin.valid || !avatarValid) return NextResponse.json({ error: "Use valid GitHub and LinkedIn profile links and an image uploaded to portfolio storage." }, { status: 400 });
  const { data, error } = await supabase.from("portfolio_profile").update({
    tagline,
    summary,
    avatar_url: avatarUrl,
    github_url: github.value,
    linkedin_url: linkedin.value,
    updated_at: new Date().toISOString(),
  }).eq("id", true).select("tagline,summary,avatar_url,github_url,linkedin_url").single();
  if (error) return NextResponse.json({ error: "The profile was not published. Check the portfolio profile table and RLS policy." }, { status: 403 });
  return NextResponse.json({ profile: data });
}
