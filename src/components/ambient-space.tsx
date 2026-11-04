"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function AmbientSpaceBackdrop() {
  return <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_8%,rgba(194,149,101,0.055),transparent_31%),radial-gradient(ellipse_at_16%_76%,rgba(104,153,104,0.055),transparent_34%),radial-gradient(circle,rgba(202,213,193,0.24)_0.7px,transparent_1px)] bg-[size:auto,auto,83px_83px] opacity-70" />
    <motion.div animate={{ y: [0, 18, 0], x: [0, 7, 0] }} transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }} className="absolute left-[11vw] top-[37vh] size-14 rounded-full border border-[#c59a63]/20 bg-[radial-gradient(circle_at_34%_32%,rgba(220,175,120,0.3),rgba(115,80,58,0.12)_50%,rgba(0,0,0,0)_74%)] opacity-40 shadow-[0_0_46px_rgba(196,146,94,0.08)] sm:size-20" />
    <motion.div animate={{ y: [0, -14, 0], rotate: [0, 5, 0] }} transition={{ duration: 23, repeat: Infinity, ease: "easeInOut" }} className="absolute right-[7vw] top-[61vh] size-7 rounded-full border border-[#8cba85]/20 bg-[radial-gradient(circle_at_35%_30%,rgba(176,204,158,0.34),rgba(62,86,65,0.12)_58%,transparent_76%)] opacity-45 shadow-[0_0_32px_rgba(140,186,133,0.09)] sm:size-10">
      <span className="absolute -inset-x-2 top-1/2 h-2 -translate-y-1/2 rotate-[-24deg] rounded-[50%] border border-[#b5a17d]/25" />
    </motion.div>
    <motion.div animate={{ y: [0, 11, 0], x: [0, -5, 0], rotate: [0, 12, 0] }} transition={{ duration: 27, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[7vh] left-[34vw] size-3 rotate-45 border border-[#a6cb9e]/20 bg-[#8cba85]/10 opacity-50 sm:size-4" />
    <div className="absolute -right-36 top-[8vh] size-[24rem] rounded-full bg-[#bb885e]/[0.025] blur-3xl" />
  </div>;
}

export function SpaceQuoteBeacon({ quote, className = "" }: { quote: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function reveal() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function dismissSoon() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 220);
  }
  return <div className={`pointer-events-auto absolute z-20 ${className}`}>
    <motion.button type="button" aria-label="Reveal orbital field note" aria-expanded={open} onHoverStart={reveal} onHoverEnd={dismissSoon} onFocus={reveal} onBlur={dismissSoon} onClick={() => setOpen((value) => !value)} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }} className="relative grid size-9 place-items-center rounded-full border border-[#8cba85]/30 bg-[#111512]/80 shadow-[0_0_24px_rgba(140,186,133,0.12)] backdrop-blur-sm focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#8cba85]">
      <span className="size-2 rounded-full bg-[#a6cb9e] shadow-[0_0_12px_rgba(166,203,158,0.7)]" />
      <motion.span aria-hidden="true" animate={{ scale: [1, 1.3, 1], opacity: [0.45, 0.12, 0.45] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }} className="absolute -inset-1 rounded-full border border-[#8cba85]/25" />
    </motion.button>
    <AnimatePresence>{open && <motion.div onHoverStart={reveal} onHoverEnd={dismissSoon} onFocus={reveal} onBlur={dismissSoon} initial={{ opacity: 0, y: 6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.18 }} className="absolute bottom-12 right-0 w-64 border border-[#8cba85]/25 bg-[#0b0e0c]/95 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:w-72">
      <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#8cba85]">Orbital field note</p><p className="mt-2 text-xs leading-6 text-[#dce2d8]">{quote}</p>
    </motion.div>}</AnimatePresence>
  </div>;
}
