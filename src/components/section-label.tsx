export function SectionLabel({ index, label }: { index: string; label: string }) {
  return <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--muted)]"><span className="text-[color:var(--accent)]">{index}</span><span aria-hidden="true" className="h-px w-8 bg-[color:var(--accent)]/50" />{label}</div>;
}

