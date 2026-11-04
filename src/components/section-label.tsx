export function SectionLabel({ index, label }: { index: string; label: string }) {
  return <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[#808981]"><span className="text-[#8cba85]">{index}</span><span aria-hidden="true" className="h-px w-8 bg-[#8cba85]/50" />{label}</div>;
}

