export type Experience = {
  id: string;
  role: string;
  organization: string;
  details: string | null;
  created_at?: string | null;
};

export async function getExperiences(): Promise<Experience[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  try {
    const response = await fetch(`${url}/rest/v1/experiences?select=id,role,organization,details,created_at&order=created_at.desc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "force-cache",
      next: { revalidate: 1800 },
    });
    if (!response.ok) return [];
    const rows: unknown = await response.json();
    return Array.isArray(rows) ? rows as Experience[] : [];
  } catch {
    return [];
  }
}
