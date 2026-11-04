"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { FileUp, Save, Sparkles } from "lucide-react";
import type { PortfolioProfile } from "@/lib/portfolio-profile";

export function CvProfileEditor({ initialProfile }: { initialProfile: PortfolioProfile }) {
  const [tagline, setTagline] = useState(initialProfile.tagline);
  const [summary, setSummary] = useState(initialProfile.summary);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [hasDraft, setHasDraft] = useState(false);
  const inputClass = "w-full border border-white/10 bg-[#0d0f0e] px-3 py-3 text-sm leading-6 text-[#e1e5de] outline-none focus:border-[#8cba85]/70";

  async function createDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("cv") as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) { setError("Choose a PDF CV to continue."); return; }

    setBusy(true); setError(""); setNotice("");
    try {
      const data = new FormData();
      data.set("cv", file);
      const response = await fetch("/api/admin/cv", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "The CV could not be processed.");
      setTagline(result.profile.tagline);
      setSummary(result.profile.summary);
      setHasDraft(true);
      setNotice("AI draft ready. Review the wording, then publish it when it looks right.");
      form.reset();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The CV could not be processed.");
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tagline, summary }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "The profile could not be published.");
      setTagline(result.profile.tagline);
      setSummary(result.profile.summary);
      setHasDraft(false);
      setNotice("Profile published. The public portfolio refreshes within 30 minutes.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The profile could not be published.");
    } finally {
      setBusy(false);
    }
  }

  return <section aria-labelledby="profile-editor-heading" className="mt-8 border border-white/10 bg-[#111412] p-5 sm:p-7">
    <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end">
      <div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#8cba85]">Private source / Public profile</p><h2 id="profile-editor-heading" className="mt-2 text-xl font-medium">CV and profile summary</h2><p className="mt-2 max-w-xl text-sm leading-6 text-[#838b83]">Upload a PDF to create a draft. When you request an AI draft, the CV is sent securely to OpenAI and kept in your private Supabase storage; only the tagline and summary you publish appear on the site.</p></div>
      <form onSubmit={createDraft} className="flex flex-col gap-2 sm:min-w-[290px]">
        <label className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#8b948b]" htmlFor="cv-upload">PDF CV · up to 10 MB</label>
        <div className="flex gap-2"><input id="cv-upload" name="cv" type="file" accept="application/pdf,.pdf" required className="min-w-0 flex-1 text-xs text-[#9ca49c] file:mr-2 file:border-0 file:bg-white/10 file:px-3 file:py-2 file:font-mono file:text-[9px] file:uppercase file:text-[#d6dbd5]" /><motion.button disabled={busy} whileHover={{ y: -1 }} className="inline-flex shrink-0 items-center gap-2 bg-[#a6cb9e] px-3 font-mono text-[9px] uppercase tracking-wider text-[#101311] disabled:opacity-50"><FileUp size={13} />{busy ? "Working…" : "Draft with AI"}</motion.button></div>
      </form>
    </div>
    {notice && <p role="status" className="mt-5 border border-[#8cba85]/20 bg-[#8cba85]/5 px-4 py-3 text-sm text-[#b9d5b1]">{notice}</p>}
    {error && <p role="alert" className="mt-5 border border-[#e99386]/20 bg-[#e99386]/5 px-4 py-3 text-sm text-[#e9a79c]">{error}</p>}
    <div className="mt-5 grid gap-4">
      <label className="space-y-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#899189]">Tagline<input maxLength={120} required className={inputClass} value={tagline} onChange={(event) => setTagline(event.target.value)} /></label>
      <label className="space-y-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#899189]">Profile summary<textarea maxLength={1800} required rows={6} className={inputClass} value={summary} onChange={(event) => setSummary(event.target.value)} /></label>
    </div>
    <motion.button type="button" disabled={busy} whileHover={{ y: -1 }} onClick={() => void publish()} className="mt-4 inline-flex h-10 items-center gap-2 border border-[#8cba85]/30 px-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#b9d5b1] disabled:cursor-not-allowed disabled:opacity-40">{hasDraft && <Sparkles size={13} />}<Save size={13} />{busy ? "Publishing…" : hasDraft ? "Review and publish draft" : "Save profile changes"}</motion.button>
  </section>;
}
