"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [["Profile", "#about"], ["Operations", "#work"], ["Experience", "#experience"], ["Contact", "#contact"]];

export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="absolute inset-x-0 top-0 z-30 border-b border-white/[0.07] bg-[#0f0f0f]/60 backdrop-blur-xl">
    <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 md:px-10 lg:px-14">
      <motion.a href="#top" aria-label="Moses Abraham home" whileHover={{ color: "#a9d49f" }} className="flex items-center gap-3 font-mono text-xs tracking-[0.12em] text-[#e6e9e3]"><motion.span whileHover={{ backgroundColor: "#8cba85", color: "#0f0f0f" }} className="grid size-8 place-items-center border border-[#8cba85]/50 text-[#8cba85]">MA</motion.span><span className="hidden sm:block">M.O. ABRAHAM <span className="text-[#687168]">/ PORTFOLIO</span></span></motion.a>
      <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">{links.map(([label, href], index) => <motion.a key={href} href={href} whileHover={{ color: "#a8d79e", y: -1 }} className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9aa099]"><span className="mr-2 text-[#58635a]">0{index + 1}</span>{label}</motion.a>)}</nav>
      <div className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#8cba85] sm:flex"><motion.span animate={{ scale: [0.85, 1.18, 0.85], opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} className="size-2 rounded-full bg-[#8cba85]" />Available for select work</div>
      <button type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen(!open)} className="grid size-10 place-items-center border border-white/10 text-[#d2d7d0] md:hidden">{open ? <X size={17} /> : <Menu size={17} />}</button>
    </div>
    <AnimatePresence>{open && <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden border-t border-white/[0.07] bg-[#101311] md:hidden"><div className="flex flex-col px-6 py-3">{links.map(([label, href], index) => <a key={href} href={href} onClick={() => setOpen(false)} className="border-b border-white/[0.06] py-4 font-mono text-xs uppercase tracking-[0.18em] text-[#aab0a9]"><span className="mr-3 text-[#8cba85]">0{index + 1}</span>{label}</a>)}</div></motion.nav>}</AnimatePresence>
  </header>;
}

