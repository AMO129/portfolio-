"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ImageUp, LogOut, Plus, Save, Trash2, X } from "lucide-react";
import type { Project } from "@/lib/projects";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { CvProfileEditor } from "@/components/cv-profile-editor";
import type { PortfolioProfile } from "@/lib/portfolio-profile";
import { ExperienceManager } from "@/components/experience-manager";
import type { Experience } from "@/lib/experiences";
import { AudioTrackManager } from "@/components/audio-track-manager";
import type { PortfolioAudioTrack } from "@/lib/portfolio-audio";

type Fields = Omit<Project, "id" | "created_at" | "project_url" | "preview_image_url"> & { project_url: string; preview_image_url: string };
const empty: Fields = { title: "", status: "In Development", role: "", tech_stack: "", description: "", project_url: "", preview_image_url: "" };

export function AdminDashboard({ email, initialProjects, initialProfile, initialExperiences, initialAudioTracks, loadError }: { email: string; initialProjects: Project[]; initialProfile: PortfolioProfile; initialExperiences: Experience[]; initialAudioTracks: PortfolioAudioTrack[]; loadError?: string }) {
  const [projects, setProjects] = useState(initialProjects);
  const [editing, setEditing] = useState<Project | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [fields, setFields] = useState<Fields>(empty);

  function startNew() { setEditing(null); setFields(empty); setMessage(""); setFormOpen(true); }
  function startEdit(project: Project) { setEditing(project); setFields({ title: project.title, status: project.status, role: project.role, tech_stack: project.tech_stack, description: project.description, project_url: project.project_url ?? "", preview_image_url: project.preview_image_url ?? "" }); setMessage(""); setFormOpen(true); }

  async function uploadProjectPreview(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setMessage("Choose a JPG, PNG, or WebP project image."); return; }
    if (file.size > 5 * 1024 * 1024) { setMessage("Project images must be 5 MB or smaller."); return; }
    setBusy(true); setMessage("");
    try {
      const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const path = `projects/${crypto.randomUUID()}.${extension}`;
      const supabase = createSupabaseBrowserClient();
      const { error: uploadError } = await supabase.storage.from("portfolio-media").upload(path, file, { contentType: file.type, cacheControl: "3600" });
      if (uploadError) throw uploadError;
      setFields((current) => ({ ...current, preview_image_url: supabase.storage.from("portfolio-media").getPublicUrl(path).data.publicUrl }));
      setMessage("Preview image uploaded. Save the project to publish it.");
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "The project image could not be uploaded.");
    } finally {
      setBusy(false);
    }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const payload = { ...fields, project_url: fields.project_url.trim() || null, preview_image_url: fields.preview_image_url.trim() || null };
    const response = await fetch("/api/projects", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing ? { ...payload, id: editing.id } : payload) });
    const result = await response.json(); setBusy(false);
    if (!response.ok) { setMessage(result.error ?? "The change could not be saved."); return; }
    const updated = result.project as Project;
    setProjects((current) => editing ? current.map((item) => item.id === updated.id ? updated : item) : [updated, ...current]);
    setFormOpen(false); setMessage("Registry updated.");
  }

  async function remove(project: Project) {
    if (!window.confirm(`Delete “${project.title}” from the project registry?`)) return;
    setBusy(true); setMessage("");
    const response = await fetch("/api/projects", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: project.id }) });
    const result = await response.json(); setBusy(false);
    if (!response.ok) { setMessage(result.error ?? "The project could not be deleted."); return; }
    setProjects((current) => current.filter((item) => item.id !== project.id)); setMessage("Registry updated.");
  }

  async function signOut() { const supabase = createSupabaseBrowserClient(); await supabase.auth.signOut(); window.location.assign("/admin/login"); }
  const inputClass = "h-11 w-full border border-white/10 bg-[#0d0f0e] px-3 text-sm text-[#e1e5de] outline-none focus:border-[#8cba85]/70";

  return <main className="min-h-screen bg-[#0f0f0f] px-5 py-10 text-[#e8ebe5] sm:px-8 lg:px-12"><div className="mx-auto max-w-6xl">
    <header className="flex flex-col justify-between gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-center"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8cba85]">Command / Project registry</p><h1 className="mt-2 text-3xl font-medium tracking-[-0.05em]">Admin console</h1><p className="mt-2 text-xs text-[#7c857c]">Signed in as {email}</p></div><div className="flex gap-3"><motion.button whileHover={{ backgroundColor: "#c0dfb8", y: -1 }} onClick={startNew} className="inline-flex h-10 items-center gap-2 bg-[#a6cb9e] px-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#101311]"><Plus size={14} />New project</motion.button><motion.button whileHover={{ borderColor: "rgba(255,255,255,0.3)" }} onClick={signOut} className="inline-flex h-10 items-center gap-2 border border-white/10 px-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#aeb5ad]"><LogOut size={13} />Sign out</motion.button></div></header>
    <div className="mt-7 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-[#727b73]"><span>Database rows / {projects.length}</span><span className="text-[#8cba85]">Auth session active</span></div>
    {message && <p role="status" className="mt-5 border border-[#8cba85]/20 bg-[#8cba85]/5 px-4 py-3 text-sm text-[#b9d5b1]">{message}</p>}{loadError && <p role="alert" className="mt-5 border border-[#e99386]/20 px-4 py-3 text-sm text-[#e9a79c]">Could not read projects: {loadError}</p>}
    <CvProfileEditor initialProfile={initialProfile} />
    <AudioTrackManager initialTracks={initialAudioTracks} />
    <ExperienceManager initialExperiences={initialExperiences} />
    {formOpen && <motion.form initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onSubmit={save} className="mt-7 border border-white/10 bg-[#131614] p-5 sm:p-7"><div className="mb-6 flex items-center justify-between"><h2 className="font-medium">{editing ? "Update project" : "Register project"}</h2><button type="button" onClick={() => setFormOpen(false)} aria-label="Close form" className="text-[#889088]"><X size={18} /></button></div><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-2 text-[10px] font-mono uppercase tracking-widest text-[#899189]">Title<input required className={inputClass} value={fields.title} onChange={(e) => setFields({ ...fields, title: e.target.value })} /></label><label className="space-y-2 text-[10px] font-mono uppercase tracking-widest text-[#899189]">Status<select className={inputClass} value={fields.status} onChange={(e) => setFields({ ...fields, status: e.target.value })}><option>Live</option><option>In Development</option></select></label><label className="space-y-2 text-[10px] font-mono uppercase tracking-widest text-[#899189]">Role<input required className={inputClass} value={fields.role} onChange={(e) => setFields({ ...fields, role: e.target.value })} /></label><label className="space-y-2 text-[10px] font-mono uppercase tracking-widest text-[#899189]">Technology stack<input required className={inputClass} value={fields.tech_stack} onChange={(e) => setFields({ ...fields, tech_stack: e.target.value })} /></label><label className="space-y-2 text-[10px] font-mono uppercase tracking-widest text-[#899189] sm:col-span-2">Project URL<input type="url" className={inputClass} value={fields.project_url ?? ""} onChange={(e) => setFields({ ...fields, project_url: e.target.value })} /></label><label className="space-y-2 text-[10px] font-mono uppercase tracking-widest text-[#899189] sm:col-span-2"><span className="inline-flex items-center gap-2"><ImageUp size={13} />Preview image</span><div className="flex flex-col gap-3 border border-white/10 bg-[#0d0f0e] p-3 sm:flex-row sm:items-center"><div className="relative h-28 w-full overflow-hidden bg-[#111412] sm:w-48">{fields.preview_image_url ? <Image src={fields.preview_image_url} alt="Project preview" fill sizes="192px" className="object-cover" /> : <div className="grid h-full place-items-center text-[9px] text-[#727b73]">No uploaded image</div>}</div><div><input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(event) => void uploadProjectPreview(event)} className="block max-w-full text-xs text-[#9ca49c] file:mr-2 file:border-0 file:bg-white/10 file:px-3 file:py-2 file:font-mono file:text-[9px] file:uppercase file:text-[#d6dbd5]" /><p className="mt-2 text-[10px] normal-case text-[#727b73]">JPG, PNG, WebP · up to 5 MB · appears on hover</p>{fields.preview_image_url && <button type="button" onClick={() => setFields({ ...fields, preview_image_url: "" })} className="mt-2 text-[9px] uppercase tracking-wider text-[#bd8880]">Remove image</button>}</div></div></label><label className="space-y-2 text-[10px] font-mono uppercase tracking-widest text-[#899189] sm:col-span-2">Description<textarea required rows={4} className="w-full border border-white/10 bg-[#0d0f0e] p-3 text-sm text-[#e1e5de] outline-none focus:border-[#8cba85]/70" value={fields.description} onChange={(e) => setFields({ ...fields, description: e.target.value })} /></label></div>{message && <p role="alert" className="mt-4 text-sm text-[#e9a79c]">{message}</p>}<button disabled={busy} className="mt-5 inline-flex h-10 items-center gap-2 bg-[#a6cb9e] px-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#101311] disabled:opacity-50"><Save size={13} />{busy ? "Saving…" : "Save registry row"}</button></motion.form>}
    <div className="mt-7 divide-y divide-white/[0.08] border-y border-white/[0.08]">{projects.map((project) => <article key={project.id} className="flex flex-col justify-between gap-5 py-5 sm:flex-row sm:items-center"><div><h2 className="text-lg">{project.title}</h2><p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#808981]">{project.status} <span className="mx-2 text-white/20">/</span> {project.role}</p><p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-[#818981]">{project.description}</p></div><div className="flex gap-2"><motion.button whileHover={{ borderColor: "rgba(140,186,133,0.4)" }} onClick={() => startEdit(project)} className="h-9 border border-white/10 px-3 font-mono text-[9px] uppercase tracking-wider text-[#c0c7bf]">Edit</motion.button><motion.button whileHover={{ borderColor: "rgba(233,147,134,0.4)" }} disabled={busy} onClick={() => void remove(project)} aria-label={`Delete ${project.title}`} className="grid size-9 place-items-center border border-white/10 text-[#bd8880]"><Trash2 size={14} /></motion.button></div></article>)}</div>
  </div></main>;
}

