"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Crosshair } from "lucide-react";
import { LagosClock } from "@/components/lagos-clock";
import { CursorPulse } from "@/components/cursor-pulse";

const SaturnScene = dynamic(() => import("@/components/saturn-scene"), { ssr: false, loading: () => <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(122,154,121,0.15),transparent_54%)]" /> });

function Portrait({ avatarUrl, mobile = false }: { avatarUrl: string | null; mobile?: boolean }) {
  return <div className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full border border-[color:var(--accent)]/50 bg-[var(--surface)] shadow-[0_0_56px_color-mix(in_srgb,var(--accent)_18%,transparent)] ${mobile ? "size-24 sm:size-32 lg:hidden" : "hidden size-56 lg:grid"}`}>
    {avatarUrl ? <Image src={avatarUrl} alt="Moses Abraham" fill sizes="(max-width: 1024px) 128px, 224px" className="object-cover" /> : <span className="font-mono text-3xl tracking-[-0.08em] text-[color:var(--accent)]">MA</span>}
  </div>;
}

export function Hero({ tagline, avatarUrl }: { tagline: string; avatarUrl: string | null }) {
  return <section id="top" className="relative min-h-[760px] overflow-hidden border-b border-[color:var(--line-soft)] pt-[76px] lg:min-h-[810px]">
    <CursorPulse />
    <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
    <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_44%,rgba(99,137,94,0.16),transparent_34%)]" />
    <div className="absolute inset-y-0 right-0 w-full md:w-[72%]"><SaturnScene /></div>
    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[var(--canvas)] via-[var(--canvas)]/95 to-transparent md:via-[var(--canvas)]/70" />
    <div className="relative mx-auto flex min-h-[684px] max-w-7xl flex-col justify-between px-6 py-16 md:px-10 md:py-20 lg:min-h-[734px] lg:px-14">
      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.19em] text-[color:var(--muted)]"><span className="flex items-center gap-2"><Crosshair size={13} className="text-[color:var(--accent)]" /> Portfolio / Personal systems</span><span className="hidden sm:block">Sector 06 — Lagos, Nigeria</span></div>
      <div className="grid items-end gap-10 lg:grid-cols-[1fr_260px]">
        <div className="max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mb-7 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)]"><span className="size-1.5 bg-[color:var(--accent)]" /> Software Engineering student <span className="text-[color:var(--dim)]">/</span> systems builder</motion.div>
          <div className="mb-7 flex items-center gap-4 lg:hidden"><Portrait avatarUrl={avatarUrl} mobile /><span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--muted)]">Operator profile</span></div>
          <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }} className="text-[clamp(3.4rem,9vw,8.2rem)] font-medium leading-[0.88] tracking-[-0.075em] text-[color:var(--ink)]">Moses<br /><span className="text-[color:var(--muted)]">Abraham</span><span className="text-[color:var(--accent)]">.</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.22 }} className="mt-8 max-w-xl text-base leading-7 text-[color:var(--body)] sm:text-lg sm:leading-8">{tagline}</motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }} className="mt-9 flex flex-wrap items-center gap-3"><motion.a whileHover={{ backgroundColor: "var(--accent-hover)", y: -2 }} href="#work" className="inline-flex h-12 items-center gap-5 bg-[color:var(--accent-strong)] px-5 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--accent-ink)]">Explore deployments<motion.span whileHover={{ x: 2, y: -2 }}><ArrowUpRight size={14} /></motion.span></motion.a><motion.a whileHover={{ borderColor: "var(--accent)", color: "var(--accent)", y: -2 }} href="#contact" className="inline-flex h-12 items-center gap-4 border border-[color:var(--line)] px-5 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--body)]">Open a channel<ArrowDownRight size={14} /></motion.a></motion.div>
        </div>
        <div className="hidden flex-col items-end gap-5 lg:flex"><Portrait avatarUrl={avatarUrl} /><div className="text-right"><p className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--muted)]">Operator / Moses Abraham</p><LagosClock /></div></div>
      </div>
      <div className="flex items-end justify-between gap-6"><div className="lg:hidden"><LagosClock /></div><div className="ml-auto flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--muted)]"><span>Scroll to inspect</span><motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}><ArrowDownRight size={15} className="text-[color:var(--accent)]" /></motion.span></div></div>
    </div>
  </section>;
}
