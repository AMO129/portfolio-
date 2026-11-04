export type Project = {
  id: string;
  title: string;
  status: "Live" | "In Development" | string;
  role: string;
  tech_stack: string;
  description: string;
  project_url: string | null;
  created_at?: string;
};

const select = "id,title,status,role,tech_stack,description,project_url,created_at";

export async function getProjects(): Promise<Project[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  try {
    const response = await fetch(`${url}/rest/v1/projects?select=${select}&order=created_at.desc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "force-cache",
      next: { revalidate: 1800 },
    });
    if (!response.ok) return [];
    const data: unknown = await response.json();
    return Array.isArray(data) ? (data as Project[]) : [];
  } catch {
    return [];
  }
}

