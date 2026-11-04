"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";

export function ContactPanel() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  return <div className="reveal-up mt-7 grid gap-10 border border-white/10 bg-[#121513] p-7 sm:p-10 md:grid-cols-[1fr_auto] md:items-end">
    <div><h2 className="max-w-2xl text-4xl font-medium leading-tight tracking-[-0.055em] sm:text-6xl">Let’s build something<br className="hidden sm:block" /> that holds up.</h2><p className="mt-5 max-w-lg text-sm leading-7 text-[#858d85]">For thoughtful systems work, product engineering, or a conversation about the next deployment.</p></div>
    {email ? <motion.a whileHover={{ backgroundColor: "#c0dfb8", y: -2 }} href={`mailto:${email}`} className="inline-flex h-12 items-center justify-center gap-5 bg-[#a6cb9e] px-5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#101311]"><Mail size={14} />Send a message<ArrowUpRight size={14} /></motion.a> : <div aria-live="polite" className="inline-flex h-12 items-center gap-3 border border-white/10 px-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#727b73]"><Mail size={14} className="text-[#8cba85]" />Contact endpoint pending</div>}
  </div>;
}

