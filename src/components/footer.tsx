export function Footer() {
  return <footer className="border-t border-[color:var(--line-soft)] bg-[var(--surface-inset)] px-6 py-7 md:px-10 lg:px-14"><div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[color:var(--dim)]"><span className="text-[color:var(--accent)]">System Online:</span> Have fun, but don&apos;t allow fun have you.</div>
    <div className="flex items-center gap-5 font-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--dim)]"><span>© {new Date().getFullYear()} Moses Abraham</span><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-[color:var(--accent)]" />Operational</span></div>
  </div></footer>;
}

