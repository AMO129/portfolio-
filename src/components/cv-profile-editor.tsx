"use client";

import Image from "next/image";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { FileUp, ImageUp, Save, Sparkles } from "lucide-react";
import type { PortfolioProfile } from "@/lib/portfolio-profile";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function CvProfileEditor({ initialProfile }: { initialProfile: PortfolioProfile }) {
  const [tagline, setTagline] = useState(initialProfile.tagline);
  const [summary, setSummary] = useState(initialProfile.summary);
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatar_url);
  const [githubUrl, setGithubUrl] = useState(initialProfile.github_url ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(initialProfile.linkedin_url ?? "");
  const [busy, setBusy] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [hasDraft, setHasDraft] = useState(false);
  const inputClass = "w-full border border-white/10 bg-[#0d0f0e] px-3 py-3 text-sm leading-6 text-[#e1e5de] outline-none focus:border-[#8cba85]/70";

  async function uploadPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setError("Choose a JPG, PNG, or WebP image."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("The profile photo must be 5 MB or smaller."); return; }
    setUploadingPhoto(true); setError(""); setNotice("");
    try {
      const supabase = createSupabaseBrowserClient();
      const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const path = `profile/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("portfolio-media").upload(path, file, { contentType: file.type, cacheControl: "3600" });
      if (uploadError) throw new Error(uploadError.message);
      const { data } = supabase.storage.from("portfolio-media").getPublicUrl(path);
      setAvatarUrl(data.publicUrl);
      setNotice("Photo uploaded. Save profile changes to publish it.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The photo could not be uploaded.");
    } finally {
      setUploadingPhoto(false);
    }
  }

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
        body: JSON.stringify({ tagline, summary, avatar_url: avatarUrl, github_url: githubUrl, linkedin_url: linkedinUrl }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "The profile could not be published.");
      setTagline(result.profile.tagline);
      setSummary(result.profile.summary);
      setAvatarUrl(result.profile.avatar_url);
      setGithubUrl(result.profile.github_url ?? "");
      setLinkedinUrl(result.profile.linkedin_url ?? "");
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
      <div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#8cba85]">Private source / Public profile</p><h2 id="profile-editor-heading" className="mt-2 text-xl font-medium">Profile, links, and CV</h2><p className="mt-2 max-w-xl text-sm leading-6 text-[#838b83]">Manage your public portrait and profile links here. CV uploads stay private; only a summary you review and publish appears on the site.</p></div>
      <form onSubmit={createDraft} className="flex flex-col gap-2 sm:min-w-[290px]">
        <label className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#8b948b]" htmlFor="cv-upload">PDF CV · up to 10 MB</label>
        <div className="flex gap-2"><input id="cv-upload" name="cv" type="file" accept="application/pdf,.pdf" required className="min-w-0 flex-1 text-xs text-[#9ca49c] file:mr-2 file:border-0 file:bg-white/10 file:px-3 file:py-2 file:font-mono file:text-[9px] file:uppercase file:text-[#d6dbd5]" /><motion.button disabled={busy} className="inline-flex shrink-0 items-center gap-2 bg-[#a6cb9e] px-3 font-mono text-[9px] uppercase tracking-wider text-[#101311] disabled:opacity-50"><FileUp size={13} />{busy ? "Working…" : "Draft with AI"}</motion.button></div>
      </form>
    </div>
    {notice && <p role="status" className="mt-5 border border-[#8cba85]/20 bg-[#8cba85]/5 px-4 py-3 text-sm text-[#b9d5b1]">{notice}</p>}
    {error && <p role="alert" className="mt-5 border border-[#e99386]/20 bg-[#e99386]/5 px-4 py-3 text-sm text-[#e9a79c]">{error}</p>}
    <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
      <div className="flex flex-col items-start gap-4">
        <div className="relative grid size-40 place-items-center overflow-hidden rounded-full border border-[#8cba85]/40 bg-[#0d0f0e] text-2xl font-mono text-[#8cba85]">
          {avatarUrl ? <Image src={avatarUrl} alt="Current profile portrait" fill sizes="160px" className="object-cover" /> : <span>MA</span>}
        </div>
        <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 border border-[#8cba85]/30 px-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[#b9d5b1] transition-colors hover:bg-[#8cba85]/10">
          <ImageUp size={14} />{uploadingPhoto ? "Uploading…" : "Upload profile photo"}
          <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploadingPhoto || busy} onChange={(event) => void uploadPhoto(event)} className="sr-only" />
        </label>
        {avatarUrl && avatarUrl !== "/profile.jpg" && <button type="button" onClick={() => setAvatarUrl("/profile.jpg")} className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#bd8880]">Use the original portrait</button>}
        <p className="max-w-[200px] text-xs leading-5 text-[#788078]">JPG, PNG, or WebP · max 5 MB</p>
      </div>
      <div className="grid content-start gap-4">
        <label className="space-y-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#899189]">GitHub profile URL<input type="url" className={inputClass} value={githubUrl} onChange={(event) => setGithubUrl(event.target.value)} placeholder="https://github.com/AMO129" /></label>
        <label className="space-y-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#899189]">LinkedIn profile URL<input type="url" className={inputClass} value={linkedinUrl} onChange={(event) => setLinkedinUrl(event.target.value)} placeholder="https://www.linkedin.com/in/…" /></label>
        <label className="space-y-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#899189]">Tagline<input maxLength={120} required className={inputClass} value={tagline} onChange={(event) => setTagline(event.target.value)} /></label>
        <label className="space-y-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#899189]">Profile summary<textarea maxLength={1800} required rows={6} className={inputClass} value={summary} onChange={(event) => setSummary(event.target.value)} /></label>
      </div>
    </div>
    <motion.button type="button" disabled={busy || uploadingPhoto} whileHover={{ y: -1 }} onClick={() => void publish()} className="mt-5 inline-flex h-10 items-center gap-2 border border-[#8cba85]/30 px-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#b9d5b1] disabled:cursor-not-allowed disabled:opacity-40">{hasDraft && <Sparkles size={13} />}<Save size={13} />{busy ? "Publishing…" : hasDraft ? "Review and publish draft" : "Save profile changes"}</motion.button>
  </section>;
}
