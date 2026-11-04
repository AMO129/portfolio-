"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import type { Experience } from "@/lib/experiences";

type ExperienceFields = { role: string; organization: string; details: string };
const blank: ExperienceFields = { role: "", organization: "", details: "" };

export function ExperienceManager({ initialExperiences }: { initialExperiences: Experience[] }) {
  const [experiences, setExperiences] = useState(initialExperiences);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [fields, setFields] = useState(blank);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const inputClass = "h-11 w-full border border-white/10 bg-[#0d0f0e] px-3 text-sm text-[#e1e5de] outline-none focus:border-[#8cba85]/70";

  function startNew() { setEditing(null); setFields(blank); setNotice(""); setError(""); setOpen(true); }
  function startEdit(row: Experience) { setEditing(row); setFields({ role: row.role, organization: row.organization, details: row.details ?? "" }); setNotice(""); setError(""); setOpen(true); }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setNotice(""); setError("");
    try {
      const response = await fetch("/api/experiences", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing ? { ...fields, id: editing.id } : fields) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "The experience record could not be saved.");
      const row = result.experience as Experience;
      setExperiences((current) => editing ? current.map((item) => item.id === row.id ? row : item) : [row, ...current]);
      setOpen(false); setNotice("Experience record saved.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "The experience record could not be saved."); }
    finally { setBusy(false); }
  }

  async function remove(row: Experience) {
    if (!window.confirm(`Delete “${row.role} — ${row.organization}”?`)) return;
    setBusy(true); setNotice(""); setError("");
    try {
      const response = await fetch("/api/experiences", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: row.id }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "The experience record could not be deleted.");
      setExperiences((current) => current.filter((item) => item.id !== row.id)); setNotice("Experience record removed.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "The experience record could not be deleted."); }
    finally { setBusy(false); }
  }

  return <section className="mt-10 border border-white/10 bg-[#111412] p-5 sm:p-7" aria-labelledby="experience-admin-title">
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5"><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#8cba85]">Operational experience / {experiences.length} records</p><h2 id="experience-admin-title" className="mt-2 text-xl font-medium">Experience registry</h2></div><motion.button whileHover={{ y: -1 }} onClick={startNew} className="inline-flex h-10 items-center gap-2 bg-[#a6cb9e] px-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#101311]"><Plus size={14} />Add experience</motion.button></div>
    {notice && <p role="status" className="mt-5 border border-[#8cba85]/20 bg-[#8cba85]/5 px-4 py-3 text-sm text-[#b9d5b1]">{notice}</p>}{error && <p role="alert" className="mt-5 border border-[#e99386]/20 bg-[#e99386]/5 px-4 py-3 text-sm text-[#e9a79c]">{error}</p>}
    {open && <motion.form initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onSubmit={save} className="mt-6 border border-white/10 bg-[#0d0f0e] p-4 sm:p-6"><div className="mb-5 flex items-center justify-between"><h3 className="font-medium">{editing ? "Edit experience" : "Add experience"}</h3><button type="button" onClick={() => setOpen(false)} aria-label="Close form" className="text-[#889088]"><X size={18} /></button></div><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-2 font-mono text-[9px] uppercase tracking-widest text-[#899189]">Role<input required maxLength={160} className={inputClass} value={fields.role} onChange={(event) => setFields({ ...fields, role: event.target.value })} /></label><label className="space-y-2 font-mono text-[9px] uppercase tracking-widest text-[#899189]">Organization<input required maxLength={160} className={inputClass} value={fields.organization} onChange={(event) => setFields({ ...fields, organization: event.target.value })} /></label><label className="space-y-2 font-mono text-[9px] uppercase tracking-widest text-[#899189] sm:col-span-2">Details<textarea maxLength={1500} rows={4} className={`${inputClass} h-auto py-3`} value={fields.details} onChange={(event) => setFields({ ...fields, details: event.target.value })} /></label></div><button disabled={busy} className="mt-5 inline-flex h-10 items-center gap-2 bg-[#a6cb9e] px-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#101311] disabled:opacity-50"><Save size={13} />{busy ? "Saving…" : "Save experience"}</button></motion.form>}
    <div className="mt-5 divide-y divide-white/[0.08]">{experiences.map((row) => <article key={row.id} className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center"><div><h3 className="text-base font-medium">{row.role}</h3><p className="mt-1 font-mono text-[9px] uppercase tracking-[0.13em] text-[#899189]">{row.organization}</p>{row.details && <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7f887f]">{row.details}</p>}</div><div className="flex gap-2"><button onClick={() => startEdit(row)} className="inline-flex h-9 items-center gap-2 border border-white/10 px-3 font-mono text-[9px] uppercase tracking-wider text-[#c0c7bf]"><Pencil size={12} />Edit</button><button disabled={busy} onClick={() => void remove(row)} aria-label={`Delete ${row.role} at ${row.organization}`} className="grid size-9 place-items-center border border-white/10 text-[#bd8880] disabled:opacity-50"><Trash2 size={14} /></button></div></article>)}</div>
  </section>;
}
