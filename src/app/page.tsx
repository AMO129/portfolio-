import { ContactPanel } from "@/components/contact-panel";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { FloatingNavigation } from "@/components/floating-navigation";
import { ProjectsGrid } from "@/components/projects-grid";
import { ScrollEffects } from "@/components/scroll-effects";
import { SectionLabel } from "@/components/section-label";
import { getProjects } from "@/lib/projects";
import { getPortfolioProfile } from "@/lib/portfolio-profile";
import { getExperiences } from "@/lib/experiences";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { AudioEntryGate } from "@/components/audio-entry-gate";
import { AmbientSpaceBackdrop, SpaceQuoteBeacon } from "@/components/ambient-space";
import { getActivePortfolioAudio } from "@/lib/portfolio-audio";

export const dynamic = "force-static";
export const revalidate = 1800;

export default async function Home() {
  const [projects, profile, experiences, audioTrack] = await Promise.all([getProjects(), getPortfolioProfile(), getExperiences(), getActivePortfolioAudio()]);

  return (
    <AudioEntryGate audioTrack={audioTrack}><main className="relative min-h-screen overflow-hidden bg-[var(--canvas)] text-[color:var(--ink)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_10%,color-mix(in_srgb,var(--accent)_9%,transparent),transparent_40%),linear-gradient(180deg,transparent_0%,color-mix(in_srgb,var(--canvas)_80%,transparent)_100%)]" />
      <AmbientSpaceBackdrop />
      <div className="relative z-10">
      <Header avatarUrl={profile.avatar_url} />
      <Hero tagline={profile.tagline} />

      <section id="about" className="relative mx-auto grid max-w-7xl scroll-mt-28 gap-10 px-6 py-28 md:grid-cols-[0.7fr_1.3fr] md:px-10 lg:px-14">
        <div className="reveal-up">
          <SectionLabel index="01" label="Operator profile" />
          <h2 className="mt-6 max-w-sm text-4xl font-medium leading-tight tracking-[-0.055em] sm:text-5xl">Built for systems that matter.</h2>
        </div>
        <div className="reveal-up max-w-3xl md:pt-12">
          <p className="text-xl leading-9 text-[color:var(--body)] sm:text-2xl sm:leading-10">{profile.summary}</p>
          <div className="mt-10 grid grid-cols-2 gap-px border border-[color:var(--line)] bg-[color:var(--line)] sm:grid-cols-3">
            {[["01", "Systems thinking"], ["02", "Applied AI"], ["03", "Product design"]].map(([number, label]) => <div key={number} className="bg-[var(--surface)] px-4 py-5"><span className="font-mono text-xs text-[color:var(--accent)]">{number}</span><p className="mt-3 text-sm text-[color:var(--body)]">{label}</p></div>)}
          </div>
        </div>
        <SpaceQuoteBeacon quote="System Maxim: Have fun, but don't allow fun have you." className="bottom-6 right-7 md:bottom-10 md:right-12" />
      </section>

      <section id="work" className="relative scroll-mt-24 border-y border-[color:var(--line-soft)] bg-[var(--surface)]/90 px-6 py-24 md:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="reveal-up flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div><SectionLabel index="02" label="Selected deployments" /><h2 className="mt-6 text-4xl font-medium tracking-[-0.055em] sm:text-5xl">Work in the field<span className="text-[color:var(--accent)]">.</span></h2></div>
            <div className="flex flex-col gap-3"><p className="max-w-sm text-sm leading-7 text-[color:var(--muted)]">A live feed of systems, prototypes, and products from the portfolio database.</p>{profile.github_url && <a href={profile.github_url} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 border-b border-[color:var(--accent)]/40 pb-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[color:var(--accent)] transition-colors hover:text-[color:var(--accent-hover)]">Browse all GitHub repositories <span aria-hidden="true">↗</span></a>}</div>
          </div>
          <ProjectsGrid projects={projects} />
        </div>
      </section>

      <ExperienceTimeline experiences={experiences} />

      <section id="contact" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-24 md:px-10 lg:px-14">
        <SectionLabel index="04" label="Secure channel" />
        <ContactPanel linkedinUrl={profile.linkedin_url} />
      </section>

      <Footer />
      <FloatingNavigation />
      <ScrollEffects />
      </div>
    </main></AudioEntryGate>
  );
}

