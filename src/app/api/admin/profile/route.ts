import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
const OPERATOR_EMAIL = "moses.abraham@pau.edu.ng";

export async function PUT(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
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
  const { data, error } = await supabase.from("portfolio_profile").update({ tagline, summary, updated_at: new Date().toISOString() }).eq("id", true).select("tagline,summary").single();
  if (error) return NextResponse.json({ error: "The profile was not published. Check the portfolio profile table and RLS policy." }, { status: 403 });
  return NextResponse.json({ profile: data });
}
