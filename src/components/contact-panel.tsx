"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Link2, Mail } from "lucide-react";

export function ContactPanel({ linkedinUrl }: { linkedinUrl: string | null }) {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "moses.abraham@pau.edu.ng";
  return <div className="reveal-up mt-7 grid gap-10 border border-[color:var(--line)] bg-[var(--surface)] p-7 sm:p-10 md:grid-cols-[1fr_auto] md:items-end">
    <div><h2 className="max-w-2xl text-4xl font-medium leading-tight tracking-[-0.055em] sm:text-6xl">Let’s build something<br className="hidden sm:block" /> that holds up.</h2><p className="mt-5 max-w-lg text-sm leading-7 text-[color:var(--muted)]">For thoughtful systems work, product engineering, or a conversation about the next deployment.</p></div>
    <div className="flex flex-wrap items-center gap-3">{email ? <motion.a whileHover={{ backgroundColor: "var(--accent-hover)", y: -2 }} href={`mailto:${email}`} className="inline-flex h-12 items-center justify-center gap-5 bg-[color:var(--accent-strong)] px-5 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--accent-ink)]"><Mail size={14} />Send a message<ArrowUpRight size={14} /></motion.a> : <div aria-live="polite" className="inline-flex h-12 items-center gap-3 border border-[color:var(--line)] px-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[color:var(--dim)]"><Mail size={14} className="text-[color:var(--accent)]" />Contact endpoint pending</div>}{linkedinUrl && <a href={linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-3 border border-[color:var(--line)] px-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[color:var(--body)] transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"><Link2 size={14} />LinkedIn</a>}</div>
  </div>;
}


