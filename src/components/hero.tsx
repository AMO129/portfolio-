"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Crosshair } from "lucide-react";
import { LagosClock } from "@/components/lagos-clock";
import { CursorPulse } from "@/components/cursor-pulse";

const SaturnScene = dynamic(() => import("@/components/saturn-scene"), { ssr: false, loading: () => <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(122,154,121,0.15),transparent_54%)]" /> });

export function Hero() {
  return <section id="top" className="relative min-h-[760px] overflow-hidden border-b border-white/[0.07] pt-[76px] lg:min-h-[810px]">
    <CursorPulse />
    <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
    <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_44%,rgba(99,137,94,0.16),transparent_34%)]" />
    <div className="absolute inset-y-0 right-0 w-full md:w-[72%]"><SaturnScene /></div>
    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/95 to-transparent md:via-[#0f0f0f]/70" />
    <div className="relative mx-auto flex min-h-[684px] max-w-7xl flex-col justify-between px-6 py-16 md:px-10 md:py-20 lg:min-h-[734px] lg:px-14">
      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.19em] text-[#7c857c]"><span className="flex items-center gap-2"><Crosshair size={13} className="text-[#8cba85]" /> Portfolio / Personal systems</span><span className="hidden sm:block">Sector 06 — Lagos, Nigeria</span></div>
      <div className="grid items-end gap-10 lg:grid-cols-[1fr_240px]">
        <div className="max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mb-7 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#a8b0a7]"><span className="size-1.5 bg-[#8cba85]" /> Software Engineering student <span className="text-white/20">/</span> systems builder</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }} className="text-[clamp(3.4rem,9vw,8.2rem)] font-medium leading-[0.88] tracking-[-0.075em] text-[#f2f3ee]">Moses<br /><span className="text-[#a9b9a4]">Abraham</span><span className="text-[#8cba85]">.</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.22 }} className="mt-8 max-w-xl text-base leading-7 text-[#a5aca4] sm:text-lg sm:leading-8">Building secure, resilient systems.<br className="hidden sm:block" /> Making complex products feel clear.</motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }} className="mt-9 flex flex-wrap items-center gap-3"><motion.a whileHover={{ backgroundColor: "#c0dfb8", y: -2 }} href="#work" className="inline-flex h-12 items-center gap-5 bg-[#a6cb9e] px-5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#101311]">Explore deployments<motion.span whileHover={{ x: 2, y: -2 }}><ArrowUpRight size={14} /></motion.span></motion.a><motion.a whileHover={{ borderColor: "rgba(140,186,133,0.6)", color: "#b6dda9", y: -2 }} href="#contact" className="inline-flex h-12 items-center gap-4 border border-white/15 px-5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#c0c6be]">Open a channel<ArrowDownRight size={14} /></motion.a></motion.div>
        </div>
        <div className="hidden lg:block"><LagosClock /></div>
      </div>
      <div className="flex items-end justify-between gap-6"><div className="lg:hidden"><LagosClock /></div><div className="ml-auto flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em] text-[#828a82]"><span>Scroll to inspect</span><motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}><ArrowDownRight size={15} className="text-[#8cba85]" /></motion.span></div></div>
    </div>
  </section>;
}

