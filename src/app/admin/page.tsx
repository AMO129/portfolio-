import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/projects";
import { defaultPortfolioProfile } from "@/lib/portfolio-profile";
import type { PortfolioProfile } from "@/lib/portfolio-profile";
import type { Experience } from "@/lib/experiences";
import type { PortfolioAudioTrack } from "@/lib/portfolio-audio";

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
  const { data, error } = await supabase.from("projects").select("id,title,status,role,tech_stack,description,project_url,preview_image_url,created_at").order("created_at", { ascending: false });
  const { data: profileData } = await supabase.from("portfolio_profile").select("tagline,summary,avatar_url,github_url,linkedin_url").eq("id", true).maybeSingle();
  const { data: experienceData } = await supabase.from("experiences").select("id,role,organization,details,created_at").order("created_at", { ascending: false });
  const { data: audioData } = await supabase.from("portfolio_audio_tracks").select("id,title,storage_path,is_active,created_at").order("created_at", { ascending: false });
  const profile = (profileData ?? defaultPortfolioProfile) as PortfolioProfile;
  return <AdminDashboard email={user.email ?? "Authenticated operator"} initialProjects={(error ? [] : data ?? []) as Project[]} initialProfile={profile} initialExperiences={(experienceData ?? []) as Experience[]} initialAudioTracks={(audioData ?? []) as PortfolioAudioTrack[]} loadError={error?.message} />;
}

