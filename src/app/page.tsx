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

export const dynamic = "force-static";
export const revalidate = 1800;

export default async function Home() {
  const [projects, profile] = await Promise.all([getProjects(), getPortfolioProfile()]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0f0f0f] text-[#f2f3ee]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_10%,rgba(104,153,104,0.11),transparent_40%),linear-gradient(180deg,transparent_0%,rgba(7,9,8,0.55)_100%)]" />
      <Header />
      <Hero tagline={profile.tagline} />

      <section id="about" className="relative mx-auto grid max-w-7xl scroll-mt-28 gap-10 px-6 py-28 md:grid-cols-[0.7fr_1.3fr] md:px-10 lg:px-14">
        <div className="reveal-up">
          <SectionLabel index="01" label="Operator profile" />
          <h2 className="mt-6 max-w-sm text-4xl font-medium leading-tight tracking-[-0.055em] sm:text-5xl">Built for systems that matter.</h2>
        </div>
        <div className="reveal-up max-w-3xl md:pt-12">
          <p className="text-xl leading-9 text-[#b4b9b2] sm:text-2xl sm:leading-10">{profile.summary}</p>
          <div className="mt-10 grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
            {[["01", "Systems thinking"], ["02", "Applied AI"], ["03", "Product design"]].map(([number, label]) => <div key={number} className="bg-[#111412] px-4 py-5"><span className="font-mono text-xs text-[#8cba85]">{number}</span><p className="mt-3 text-sm text-[#c7cbc5]">{label}</p></div>)}
          </div>
        </div>
      </section>

      <section id="work" className="relative scroll-mt-24 border-y border-white/[0.07] bg-[#111312]/80 px-6 py-24 md:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="reveal-up flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div><SectionLabel index="02" label="Selected deployments" /><h2 className="mt-6 text-4xl font-medium tracking-[-0.055em] sm:text-5xl">Work in the field<span className="text-[#8cba85]">.</span></h2></div>
            <p className="max-w-sm text-sm leading-7 text-[#858c85]">A live feed of systems, prototypes, and products from the portfolio database.</p>
          </div>
          <ProjectsGrid projects={projects} />
        </div>
      </section>

      <section id="contact" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-24 md:px-10 lg:px-14">
        <SectionLabel index="03" label="Secure channel" />
        <ContactPanel />
      </section>

      <Footer />
      <FloatingNavigation />
      <ScrollEffects />
    </main>
  );
}

