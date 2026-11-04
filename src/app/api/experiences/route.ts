import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSameOriginRequest } from "@/lib/request-origin";

export const dynamic = "force-dynamic";
const OPERATOR_EMAIL = "moses.abraham@pau.edu.ng";

async function getAdminClient(request: NextRequest) {
  if (!isSameOriginRequest(request)) return { error: "Cross-origin request rejected.", status: 403 as const };
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { error: "Supabase is not configured.", status: 503 as const };
  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, { cookies: {
    getAll: () => cookieStore.getAll(),
    setAll: (items) => items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
  } });
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || user?.email?.toLowerCase() !== OPERATOR_EMAIL) return { error: "Authorized admin access is required.", status: 401 as const };
  return { supabase };
}

function validFields(input: Record<string, unknown>) {
  return typeof input.role === "string" && input.role.trim().length > 0 && input.role.trim().length <= 160
    && typeof input.organization === "string" && input.organization.trim().length > 0 && input.organization.trim().length <= 160
    && (input.details === undefined || input.details === null || (typeof input.details === "string" && input.details.length <= 1500));
}

function values(input: Record<string, unknown>) {
  return {
    role: (input.role as string).trim(),
    organization: (input.organization as string).trim(),
    details: typeof input.details === "string" && input.details.trim() ? input.details.trim() : null,
  };
}

export async function POST(request: NextRequest) {
  const access = await getAdminClient(request);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: access.status });
  const body = await request.json().catch(() => null);
  if (!body || !validFields(body)) return NextResponse.json({ error: "Role, organization, or details are invalid." }, { status: 400 });
  const { data, error } = await access.supabase.from("experiences").insert(values(body)).select("id,role,organization,details,created_at").single();
  if (error) return NextResponse.json({ error: "The experience record could not be saved." }, { status: 403 });
  return NextResponse.json({ experience: data }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const access = await getAdminClient(request);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: access.status });
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== "string" || !validFields(body)) return NextResponse.json({ error: "An experience ID, role, and organization are required." }, { status: 400 });
  const { data, error } = await access.supabase.from("experiences").update(values(body)).eq("id", body.id).select("id,role,organization,details,created_at").single();
  if (error) return NextResponse.json({ error: "The experience record could not be updated." }, { status: 403 });
  return NextResponse.json({ experience: data });
}

export async function DELETE(request: NextRequest) {
  const access = await getAdminClient(request);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: access.status });
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== "string") return NextResponse.json({ error: "An experience ID is required." }, { status: 400 });
  const { error } = await access.supabase.from("experiences").delete().eq("id", body.id);
  if (error) return NextResponse.json({ error: "The experience record could not be deleted." }, { status: 403 });
  return NextResponse.json({ ok: true });
}
