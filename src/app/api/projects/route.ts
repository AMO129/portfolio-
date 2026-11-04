import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSameOriginRequest } from "@/lib/request-origin";

export const dynamic = "force-dynamic";

async function getAuthenticatedClient(request: NextRequest) {
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
  if (error || !user) return { error: "Authentication required.", status: 401 as const };
  return { supabase };
}

function validProject(input: Record<string, unknown>) {
  const projectUrlIsValid = input.project_url === null || input.project_url === "" || (
    typeof input.project_url === "string" && URL.canParse(input.project_url) &&
    ["https:", "http:"].includes(new URL(input.project_url).protocol)
  );
  const mediaBase = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const previewUrlIsValid = input.preview_image_url === undefined || input.preview_image_url === null || input.preview_image_url === "" || (
    typeof input.preview_image_url === "string" && (
      input.preview_image_url === "/projects/mindcare-dashboard.png" || input.preview_image_url === "/projects/snakevault-dashboard.png" ||
      Boolean(mediaBase && input.preview_image_url.startsWith(`${mediaBase}/storage/v1/object/public/portfolio-media/projects/`))
    )
  );
  return typeof input.title === "string" && input.title.trim().length > 0
    && ["Live", "In Development"].includes(String(input.status))
    && typeof input.role === "string" && input.role.trim().length > 0
    && typeof input.tech_stack === "string" && input.tech_stack.trim().length > 0
    && typeof input.description === "string" && input.description.trim().length > 0
    && projectUrlIsValid
    && previewUrlIsValid;
}

export async function POST(request: NextRequest) {
  const access = await getAuthenticatedClient(request);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: access.status });
  const body = await request.json().catch(() => null);
  if (!body || !validProject(body)) return NextResponse.json({ error: "Project fields are invalid." }, { status: 400 });
  const { data, error } = await access.supabase.from("projects").insert({ title: body.title.trim(), status: body.status, role: body.role.trim(), tech_stack: body.tech_stack.trim(), description: body.description.trim(), project_url: body.project_url || null, preview_image_url: body.preview_image_url || null }).select("id,title,status,role,tech_stack,description,project_url,preview_image_url,created_at").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 403 });
  return NextResponse.json({ project: data }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const access = await getAuthenticatedClient(request);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: access.status });
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== "string" || !validProject(body)) return NextResponse.json({ error: "Project fields are invalid." }, { status: 400 });
  const { data, error } = await access.supabase.from("projects").update({ title: body.title.trim(), status: body.status, role: body.role.trim(), tech_stack: body.tech_stack.trim(), description: body.description.trim(), project_url: body.project_url || null, preview_image_url: body.preview_image_url || null }).eq("id", body.id).select("id,title,status,role,tech_stack,description,project_url,preview_image_url,created_at").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 403 });
  return NextResponse.json({ project: data });
}

export async function DELETE(request: NextRequest) {
  const access = await getAuthenticatedClient(request);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: access.status });
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== "string") return NextResponse.json({ error: "A project ID is required." }, { status: 400 });
  const { error } = await access.supabase.from("projects").delete().eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 403 });
  return NextResponse.json({ ok: true });
}

