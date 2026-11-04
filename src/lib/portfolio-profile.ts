export type PortfolioProfile = {
  tagline: string;
  summary: string;
  avatar_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
};

export const defaultPortfolioProfile: PortfolioProfile = {
  tagline: "Building resilient systems. Making complexity clear.",
  summary: "I’m Moses Owalama Abraham, a Software Engineering student at Pan-Atlantic University. I build practical web, desktop, and AI products with a focus on dependable engineering, thoughtful security, and clear interfaces. My work spans computer-vision prototypes, machine-learning tools, cloud-connected desktop software, and transparent funding systems. Using Python, Next.js, and Supabase where they fit, I aim to build secure, resilient infrastructure with efficient code and interfaces that make complex systems feel clear.",
  avatar_url: "/profile.jpg",
  github_url: "https://github.com/AMO129",
  linkedin_url: "https://www.linkedin.com/in/moses-abraham-314897380/",
};

export async function getPortfolioProfile(): Promise<PortfolioProfile> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return defaultPortfolioProfile;

  try {
    const response = await fetch(`${url}/rest/v1/portfolio_profile?select=tagline,summary,avatar_url,github_url,linkedin_url&id=eq.true&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "force-cache",
      next: { revalidate: 1800 },
    });
    if (!response.ok) return defaultPortfolioProfile;
    const data: unknown = await response.json();
    if (!Array.isArray(data) || !data[0]) return defaultPortfolioProfile;
    const profile = data[0] as Partial<PortfolioProfile>;
    return typeof profile.tagline === "string" && typeof profile.summary === "string"
      ? {
          tagline: profile.tagline,
          summary: profile.summary,
          avatar_url: typeof profile.avatar_url === "string" ? profile.avatar_url : defaultPortfolioProfile.avatar_url,
          github_url: typeof profile.github_url === "string" ? profile.github_url : defaultPortfolioProfile.github_url,
          linkedin_url: typeof profile.linkedin_url === "string" ? profile.linkedin_url : defaultPortfolioProfile.linkedin_url,
        }
      : defaultPortfolioProfile;
  } catch {
    return defaultPortfolioProfile;
  }
}
