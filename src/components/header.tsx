"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Monitor, Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";
import { useThemePreference } from "@/components/theme-provider";

const links = [["Profile", "#about"], ["Operations", "#work"], ["Experience", "#experience"], ["Contact", "#contact"]];

function ThemeControl() {
  const { preference, setPreference } = useThemePreference();
  const [open, setOpen] = useState(false);
  const Icon = preference === "system" ? Monitor : preference === "light" ? Sun : Moon;
  return <div className="relative">
    <button type="button" aria-label={`Theme: ${preference}`} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="inline-flex h-9 items-center gap-2 border border-[color:var(--line)] px-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[color:var(--body)] transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"><Icon size={13} /><span className="hidden lg:inline">{preference}</span></button>
    <AnimatePresence>{open && <motion.div role="menu" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute right-0 top-11 z-50 min-w-36 border border-[color:var(--line)] bg-[var(--surface-raised)] p-1 shadow-xl">
      {(["dark", "light", "system"] as const).map((theme) => <button key={theme} type="button" role="menuitemradio" aria-checked={preference === theme} onClick={() => { setPreference(theme); setOpen(false); }} className={`flex w-full items-center gap-2 px-3 py-2.5 text-left font-mono text-[9px] uppercase tracking-[0.12em] transition-colors ${preference === theme ? "text-[color:var(--accent)]" : "text-[color:var(--body)] hover:bg-[var(--surface-inset)]"}`}>
        {theme === "dark" ? <Moon size={13} /> : theme === "light" ? <Sun size={13} /> : <Monitor size={13} />}{theme}{preference === theme && <span className="ml-auto size-1.5 rounded-full bg-[color:var(--accent)]" />}
      </button>)}
    </motion.div>}</AnimatePresence>
  </div>;
}

export function Header({ avatarUrl }: { avatarUrl: string | null }) {
  const [open, setOpen] = useState(false);
  return <header className="absolute inset-x-0 top-0 z-30 border-b border-[color:var(--line-soft)] bg-[var(--canvas)]/80 backdrop-blur-xl">
    <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 md:px-10 lg:px-14">
      <motion.a href="#top" aria-label="Moses Abraham home" whileHover={{ color: "var(--accent)" }} className="flex items-center gap-3 font-mono text-xs tracking-[0.12em] text-[color:var(--ink)]"><motion.span whileHover={{ scale: 1.05, boxShadow: "0 0 28px color-mix(in srgb, var(--accent) 45%, transparent)" }} className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-[color:var(--accent)]/75 bg-[var(--surface)] text-[color:var(--accent)] shadow-[0_0_22px_color-mix(in_srgb,var(--accent)_22%,transparent)]">{avatarUrl ? <Image src={avatarUrl} alt="" fill sizes="48px" className="object-cover object-[50%_38%]" priority /> : <span className="font-mono text-xs">MA</span>}</motion.span><span className="hidden sm:block">M.O. ABRAHAM <span className="text-[color:var(--dim)]">/ PORTFOLIO</span></span></motion.a>
      <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">{links.map(([label, href], index) => <motion.a key={href} href={href} whileHover={{ color: "var(--accent)", y: -1 }} className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)]"><span className="mr-2 text-[color:var(--dim)]">0{index + 1}</span>{label}</motion.a>)}</nav>
      <div className="flex items-center gap-3"><div className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--accent)] sm:flex"><motion.span animate={{ scale: [0.85, 1.18, 0.85], opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} className="size-2 rounded-full bg-[color:var(--accent)]" />Available for select work</div><ThemeControl /></div>
      <button type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen(!open)} className="grid size-10 place-items-center border border-[color:var(--line)] text-[color:var(--body)] md:hidden">{open ? <X size={17} /> : <Menu size={17} />}</button>
    </div>
    <AnimatePresence>{open && <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-visible border-t border-[color:var(--line-soft)] bg-[var(--surface)] md:hidden"><div className="flex flex-col px-6 py-3">{links.map(([label, href], index) => <a key={href} href={href} onClick={() => setOpen(false)} className="border-b border-[color:var(--line-soft)] py-4 font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--body)]"><span className="mr-3 text-[color:var(--accent)]">0{index + 1}</span>{label}</a>)}</div></motion.nav>}</AnimatePresence>
  </header>;
}

