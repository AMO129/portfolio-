"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUp, BriefcaseBusiness, Mail, UserRound, Radar } from "lucide-react";
import { useState } from "react";

const links = [
  { label: "Top", href: "#top", icon: ArrowUp },
  { label: "Profile", href: "#about", icon: UserRound },
  { label: "Work", href: "#work", icon: BriefcaseBusiness },
  { label: "Experience", href: "#experience", icon: Radar },
  { label: "Contact", href: "#contact", icon: Mail },
];

export function FloatingNavigation() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (position) => {
    setVisible(position > 420);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="Quick section navigation"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-4 left-1/2 z-40 flex max-w-[calc(100vw-1rem)] -translate-x-1/2 items-center gap-1 overflow-x-auto border border-[color:var(--line)] bg-[var(--surface-raised)]/95 p-1.5 shadow-[0_12px_48px_var(--shade)] backdrop-blur-xl sm:gap-2 sm:p-2"
        >
          {links.map(({ label, href, icon: Icon }) => (
            <motion.a
              key={href}
              href={href}
              whileHover={{ y: -2, color: "var(--accent-hover)", backgroundColor: "var(--surface-inset)" }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex min-h-10 shrink-0 items-center gap-2 px-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[color:var(--body)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--accent)] sm:px-4"
            >
              <Icon size={13} aria-hidden="true" />
              <span>{label}</span>
            </motion.a>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
