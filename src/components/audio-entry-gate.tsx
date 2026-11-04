"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

export function AudioEntryGate({ children, audioTrack }: { children: ReactNode; audioTrack: { title: string; url: string } | null }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [entered, setEntered] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioNotice, setAudioNotice] = useState("");

  async function enter(withAudio: boolean) {
    if (withAudio && audioRef.current) {
      audioRef.current.volume = 0.18;
      try {
        await audioRef.current.play();
        setAudioEnabled(true);
      } catch {
        setAudioNotice("Audio could not start. Check the active track in the admin console.");
      }
    }
    setEntered(true);
  }

  async function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audioEnabled) {
      audio.pause();
      setAudioEnabled(false);
      return;
    }
    try {
      audio.volume = 0.18;
      await audio.play();
      setAudioEnabled(true);
      setAudioNotice("");
    } catch {
      setAudioNotice("Audio could not start. Check the active track in the admin console.");
    }
  }

  return <>
    <audio ref={audioRef} src={audioTrack?.url ?? "/bg-audio.mp3"} loop preload="none" />
    {children}
    <AnimatePresence>
      {!entered && <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, y: -24, filter: "blur(8px)" }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-0 z-[100] grid place-items-center bg-[var(--canvas)] px-5">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(140,186,133,0.12),transparent_52%),linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:auto,64px_64px,64px_64px]" />
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }} className="relative w-full max-w-xl border border-[color:var(--line)] bg-[var(--surface)]/95 p-6 shadow-[0_24px_100px_var(--shade)] backdrop-blur-xl sm:p-10">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[color:var(--accent)]">M.O. Abraham / personal systems</p>
          <h1 className="mt-6 text-3xl font-medium tracking-[-0.055em] text-[color:var(--ink)] sm:text-5xl">Choose your entry mode<span className="text-[color:var(--accent)]">.</span></h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-[color:var(--muted)]">Audio is optional, starts only after your choice, and can be turned off at any time.{audioTrack && <span className="mt-2 block font-mono text-[9px] uppercase tracking-[0.12em] text-[color:var(--accent)]">Active track / {audioTrack.title}</span>}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <motion.button whileHover={{ y: -2, backgroundColor: "var(--accent-hover)" }} whileTap={{ scale: 0.98 }} onClick={() => void enter(true)} className="min-h-14 border border-[color:var(--accent)]/50 bg-[color:var(--accent-strong)] px-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[color:var(--accent-ink)]">[ Enter System: Audio Enabled ]</motion.button>
            <motion.button whileHover={{ y: -2, borderColor: "var(--accent)", color: "var(--accent)" }} whileTap={{ scale: 0.98 }} onClick={() => void enter(false)} className="min-h-14 border border-[color:var(--line)] bg-[var(--surface-inset)] px-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[color:var(--body)]">[ Enter System: Silent Mode ]</motion.button>
          </div>
          {audioNotice && <p role="status" className="mt-4 font-mono text-[10px] text-[#a44937]">{audioNotice}</p>}
          <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.15em] text-[color:var(--dim)]">Secure channel / Lagos, Nigeria</p>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
    {entered && <div className="fixed bottom-20 right-4 z-40 sm:bottom-6 sm:right-6"><motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => void toggleAudio()} aria-label={audioEnabled ? "Turn background audio off" : "Turn background audio on"} className="grid size-11 place-items-center border border-[color:var(--line)] bg-[var(--surface-raised)]/95 text-[color:var(--body)] shadow-lg backdrop-blur-xl">{audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}</motion.button>{audioNotice && <p role="status" className="mt-2 max-w-56 border border-[#a44937]/20 bg-[var(--surface-raised)]/95 p-2 font-mono text-[9px] text-[#a44937]">{audioNotice}</p>}</div>}
  </>;
}
