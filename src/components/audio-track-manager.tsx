"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { FileAudio, Play, Trash2, Upload } from "lucide-react";
import { portfolioAudioUrl } from "@/lib/portfolio-audio";
import type { PortfolioAudioTrack } from "@/lib/portfolio-audio";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const maxAudioBytes = 25 * 1024 * 1024;
const allowedAudioTypes = ["audio/mpeg", "audio/mp4", "audio/aac", "audio/wav", "audio/ogg", "audio/webm"];

export function AudioTrackManager({ initialTracks }: { initialTracks: PortfolioAudioTrack[] }) {
  const [tracks, setTracks] = useState(initialTracks);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [activateOnUpload, setActivateOnUpload] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function activateTrack(track: PortfolioAudioTrack) {
    setBusy(true); setNotice(""); setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: clearError } = await supabase.from("portfolio_audio_tracks").update({ is_active: false }).eq("is_active", true);
      if (clearError) throw clearError;
      const { data, error: activateError } = await supabase.from("portfolio_audio_tracks").update({ is_active: true }).eq("id", track.id).select("id,title,storage_path,is_active,created_at").single();
      if (activateError) throw activateError;
      setTracks((current) => current.map((item) => ({ ...item, is_active: item.id === data.id })));
      setNotice(`“${track.title}” is now the active background track.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The track could not be activated.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadTrack(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!file || !title.trim()) { setError("Add a song title and choose an audio file."); return; }
    if (!allowedAudioTypes.includes(file.type)) { setError("Choose an MP3, M4A, AAC, WAV, OGG, or WebM audio file."); return; }
    if (file.size > maxAudioBytes) { setError("Audio files must be 25 MB or smaller."); return; }
    setBusy(true); setError(""); setNotice("");
    const supabase = createSupabaseBrowserClient();
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-").slice(-80);
    const path = `audio/${crypto.randomUUID()}-${safeName}`;
    try {
      const { error: uploadError } = await supabase.storage.from("portfolio-media").upload(path, file, { contentType: file.type, cacheControl: "3600" });
      if (uploadError) throw uploadError;
      if (activateOnUpload) {
        const { error: clearError } = await supabase.from("portfolio_audio_tracks").update({ is_active: false }).eq("is_active", true);
        if (clearError) throw clearError;
      }
      const { data, error: insertError } = await supabase.from("portfolio_audio_tracks").insert({ title: title.trim(), storage_path: path, is_active: activateOnUpload }).select("id,title,storage_path,is_active,created_at").single();
      if (insertError) {
        await supabase.storage.from("portfolio-media").remove([path]);
        throw insertError;
      }
      setTracks((current) => [{ ...data }, ...current.map((track) => ({ ...track, is_active: activateOnUpload ? false : track.is_active }))]);
      setTitle(""); setFile(null); form.reset();
      setNotice(activateOnUpload ? "Track uploaded and set as active." : "Track added to your audio library.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The track could not be uploaded.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteTrack(track: PortfolioAudioTrack) {
    setBusy(true); setError(""); setNotice("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: fileError } = await supabase.storage.from("portfolio-media").remove([track.storage_path]);
      if (fileError) throw fileError;
      const { error: rowError } = await supabase.from("portfolio_audio_tracks").delete().eq("id", track.id);
      if (rowError) throw rowError;
      const remaining = tracks.filter((item) => item.id !== track.id);
      setTracks(remaining);
      if (track.is_active && remaining[0]) await activateTrack(remaining[0]);
      setNotice(track.is_active && remaining.length ? "Track removed and the next track is active." : "Track removed from your library.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The track could not be removed.");
    } finally {
      setBusy(false);
    }
  }

  return <section aria-labelledby="audio-manager-heading" className="mt-8 border border-white/10 bg-[#111412] p-5 sm:p-7">
    <div className="border-b border-white/10 pb-5"><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#8cba85]">Public media / Audio</p><h2 id="audio-manager-heading" className="mt-2 text-xl font-medium">Background music</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#838b83]">Upload and manage your tracks here. Visitors can choose whether to listen when they enter; only the active song plays.</p></div>
    {notice && <p role="status" className="mt-5 border border-[#8cba85]/20 bg-[#8cba85]/5 px-4 py-3 text-sm text-[#b9d5b1]">{notice}</p>}
    {error && <p role="alert" className="mt-5 border border-[#e99386]/20 bg-[#e99386]/5 px-4 py-3 text-sm text-[#e9a79c]">{error}</p>}
    <form onSubmit={uploadTrack} className="mt-5 grid gap-4 border border-white/[0.07] bg-[#0d0f0e] p-4 sm:grid-cols-2">
      <label className="space-y-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#899189]">Track title<input maxLength={100} required value={title} onChange={(event) => setTitle(event.target.value)} className="h-11 w-full border border-white/10 bg-[#111412] px-3 text-sm normal-case text-[#e1e5de] outline-none focus:border-[#8cba85]/70" placeholder="Ambient field recording" /></label>
      <label className="space-y-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#899189]">Audio file<input type="file" accept="audio/*,.mp3,.m4a,.aac,.wav,.ogg,.webm" required onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="block w-full text-xs text-[#9ca49c] file:mr-2 file:border-0 file:bg-white/10 file:px-3 file:py-2 file:font-mono file:text-[9px] file:uppercase file:text-[#d6dbd5]" /></label>
      <label className="flex items-center gap-3 text-xs text-[#aeb6ad] sm:col-span-2"><input type="checkbox" checked={activateOnUpload} onChange={(event) => setActivateOnUpload(event.target.checked)} className="accent-[#8cba85]" />Set this as the active background track</label>
      <button type="submit" disabled={busy} className="inline-flex h-10 w-fit items-center gap-2 bg-[#a6cb9e] px-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#101311] disabled:opacity-50"><Upload size={13} />{busy ? "Saving…" : "Add audio track"}</button>
    </form>
    <div className="mt-5 divide-y divide-white/[0.08] border-y border-white/[0.08]">
      {tracks.length ? tracks.map((track) => <article key={track.id} className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center"><div className="flex flex-wrap items-center gap-3"><span className="grid size-9 place-items-center border border-white/10 text-[#9da79d]"><FileAudio size={15} /></span><div><h3 className="text-sm font-medium text-[#e1e5de]">{track.title}</h3><p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#808981]">{track.is_active ? "Active background track" : "Library track"}</p></div><audio controls preload="none" src={portfolioAudioUrl(track.storage_path) ?? undefined} aria-label={`Preview ${track.title}`} className="h-8 max-w-[220px]" /></div><div className="flex gap-2"><button type="button" disabled={busy || track.is_active} onClick={() => void activateTrack(track)} className="inline-flex h-9 items-center gap-2 border border-white/10 px-3 font-mono text-[9px] uppercase tracking-wider text-[#c0c7bf] disabled:opacity-40"><Play size={12} />{track.is_active ? "Active" : "Make active"}</button><button type="button" disabled={busy} onClick={() => void deleteTrack(track)} aria-label={`Delete ${track.title}`} className="grid size-9 place-items-center border border-white/10 text-[#bd8880] disabled:opacity-40"><Trash2 size={14} /></button></div></article>) : <p className="py-5 text-sm text-[#818981]">No songs uploaded yet. The portfolio will keep using its bundled background track until you add one.</p>}
    </div>
  </section>;
}
