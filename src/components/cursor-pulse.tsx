"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";
import { useThemePreference } from "@/components/theme-provider";

export function CursorPulse() {
  const { resolvedTheme } = useThemePreference();
  const x = useSpring(useMotionValue(-100), { stiffness: 500, damping: 40, mass: 0.35 });
  const y = useSpring(useMotionValue(-100), { stiffness: 500, damping: 40, mass: 0.35 });
  useEffect(() => {
    const move = (event: PointerEvent) => { x.set(event.clientX); y.set(event.clientY); };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);
  return <motion.span aria-hidden="true" className={`pointer-events-none fixed left-0 top-0 z-50 hidden size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border after:absolute after:inset-[10px] after:rounded-full after:blur-sm lg:block ${resolvedTheme === "dark" ? "border-[#9ccc91]/40 mix-blend-screen after:bg-[#a9d39d]/35" : "border-[#386b42]/45 after:bg-[#386b42]/20"}`} style={{ x, y }} />;
}

