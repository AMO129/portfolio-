export function Footer() {
  return <footer className="border-t border-white/[0.07] bg-[#0b0d0c] px-6 py-7 md:px-10 lg:px-14"><div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#6f786f]"><span className="text-[#8cba85]">System Online:</span> Have fun, but don&apos;t allow fun have you.</div>
    <div className="flex items-center gap-5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#707970]"><span>© {new Date().getFullYear()} Moses Abraham</span><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#8cba85]" />Operational</span></div>
  </div></footer>;
}

