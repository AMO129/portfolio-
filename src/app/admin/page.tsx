import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return <main className="grid min-h-screen place-items-center bg-[#0f0f0f] p-6 text-center text-[#bbc2ba]"><div><p className="font-mono text-xs uppercase tracking-[0.16em] text-[#9acb91]">Admin / Configuration</p><h1 className="mt-4 text-2xl">Supabase environment is not configured.</h1><p className="mt-3 text-sm text-[#7e877e]">Add the project URL and publishable key to the local environment.</p></div></main>;
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data, error } = await supabase.from("projects").select("id,title,status,role,tech_stack,description,project_url,created_at").order("created_at", { ascending: false });
  return <AdminDashboard email={user.email ?? "Authenticated operator"} initialProjects={(error ? [] : data ?? []) as Project[]} loadError={error?.message} />;
}

