export type PortfolioProfile = {
  tagline: string;
  summary: string;
};

export const defaultPortfolioProfile: PortfolioProfile = {
  tagline: "Building resilient systems. Making complexity clear.",
  summary: "I’m Moses Owalama Abraham, a Software Engineering student at Pan-Atlantic University. I build practical web, desktop, and AI products with a focus on dependable engineering, thoughtful security, and clear interfaces. My work spans computer-vision prototypes, machine-learning tools, cloud-connected desktop software, and transparent funding systems. Using Python, Next.js, and Supabase where they fit, I aim to build secure, resilient infrastructure with efficient code and interfaces that make complex systems feel clear.",
};

export async function getPortfolioProfile(): Promise<PortfolioProfile> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return defaultPortfolioProfile;

  try {
    const response = await fetch(`${url}/rest/v1/portfolio_profile?select=tagline,summary&id=eq.true&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "force-cache",
      next: { revalidate: 1800 },
    });
    if (!response.ok) return defaultPortfolioProfile;
    const data: unknown = await response.json();
    if (!Array.isArray(data) || !data[0]) return defaultPortfolioProfile;
    const profile = data[0] as Partial<PortfolioProfile>;
    return typeof profile.tagline === "string" && typeof profile.summary === "string"
      ? { tagline: profile.tagline, summary: profile.summary }
      : defaultPortfolioProfile;
  } catch {
    return defaultPortfolioProfile;
  }
}
