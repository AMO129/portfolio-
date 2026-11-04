"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
const dateFormatter = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", day: "2-digit", month: "short", year: "numeric" });

export function LagosClock() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const initialTick = window.setTimeout(() => setNow(Date.now()), 0);
    const timer = window.setInterval(() => setNow(Date.now()), 47);
    return () => {
      window.clearTimeout(initialTick);
      window.clearInterval(timer);
    };
  }, []);
  if (now === null) return <div className="h-[72px] w-[224px] border border-[color:var(--line)] bg-[var(--surface)]/90" aria-label="Nigeria local time loading" />;
  const instant = new Date(now);
  return <div className="border border-[color:var(--line)] bg-[var(--surface)]/90 p-4 backdrop-blur-md">
    <div className="flex items-center justify-between gap-6 font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--dim)]"><span>Local time</span><span className="text-[color:var(--accent)]">Lagos / WAT</span></div>
    <div className="mt-2 flex items-baseline gap-1 font-mono tabular-nums text-[23px] tracking-[0.04em] text-[color:var(--ink)]" aria-live="off">{formatter.format(instant)}<span className="text-sm text-[color:var(--accent)]">.{String(instant.getMilliseconds()).padStart(3, "0")}</span></div>
    <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-[color:var(--dim)]">{dateFormatter.format(instant)} <span className="text-[color:var(--accent)]">UTC+01</span></div>
  </div>;
}

