import type { Experience } from "@/lib/experiences";
import { SectionLabel } from "@/components/section-label";
import { SpaceQuoteBeacon } from "@/components/ambient-space";

export function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  return <section id="experience" className="relative scroll-mt-24 border-y border-white/[0.07] bg-[#0d100f] px-6 py-24 md:px-10 lg:px-14">
    <div className="mx-auto max-w-7xl">
      <div className="reveal-up flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div><SectionLabel index="03" label="Operational experience" /><h2 className="mt-6 text-4xl font-medium tracking-[-0.055em] sm:text-5xl">Time in the field<span className="text-[#8cba85]">.</span></h2></div>
        <p className="max-w-sm text-sm leading-7 text-[#858c85]">Roles, teams, and the work behind each deployment.</p>
      </div>
      {experiences.length ? <div className="mt-12 border-y border-white/[0.08]">{experiences.map((item, index) => <article key={item.id} className="reveal-up grid gap-4 border-b border-white/[0.08] py-6 last:border-b-0 md:grid-cols-[100px_1fr] md:gap-8">
        <span className="font-mono text-[10px] tracking-[0.16em] text-[#8cba85]">OPS / {String(index + 1).padStart(2, "0")}</span>
        <div><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline"><h3 className="text-xl font-medium tracking-[-0.03em] text-[#e5e9e2]">{item.role}</h3><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9ba49a]">{item.organization}</p></div>{item.details && <p className="mt-3 max-w-3xl text-sm leading-7 text-[#858d85]">{item.details}</p>}</div>
      </article>)}</div> : <div className="reveal-up mt-12 border border-white/10 bg-[#111412] px-6 py-10"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#899189]">Experience records pending</p><p className="mt-3 text-sm leading-6 text-[#777f78]">Operational experience will appear here when records are added in the admin console.</p></div>}
    </div>
    <SpaceQuoteBeacon quote="Directive: Engineering robust intelligence and tactical architecture." className="bottom-6 right-7 md:bottom-10 md:right-12" />
  </section>;
}
