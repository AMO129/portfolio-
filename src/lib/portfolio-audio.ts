export type PortfolioAudioTrack = {
  id: string;
  title: string;
  storage_path: string;
  is_active: boolean;
  created_at?: string;
};

function publicAudioUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return null;
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `${base}/storage/v1/object/public/portfolio-media/${encodedPath}`;
}

export async function getActivePortfolioAudio(): Promise<{ title: string; url: string } | null> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!base || !key) return null;
  try {
    const response = await fetch(`${base}/rest/v1/portfolio_audio_tracks?select=title,storage_path&is_active=eq.true&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "force-cache",
      next: { revalidate: 1800 },
    });
    if (!response.ok) return null;
    const records: unknown = await response.json();
    if (!Array.isArray(records) || !records[0] || typeof records[0].title !== "string" || typeof records[0].storage_path !== "string") return null;
    const url = publicAudioUrl(records[0].storage_path);
    return url ? { title: records[0].title, url } : null;
  } catch {
    return null;
  }
}

export function portfolioAudioUrl(path: string) {
  return publicAudioUrl(path);
}
