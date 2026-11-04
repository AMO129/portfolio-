"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Eye, X } from "lucide-react";
import { useState } from "react";
import type { Project } from "@/lib/projects";

const designPreviews: Record<string, string> = {
  RrCJrQEOTPwJaHaGPkOUYN: "/projects/mindcare-dashboard.png",
  K22SYRAsq47dNw7NFwWUdA: "/projects/snakevault-dashboard.png",
};

const originStories: Record<string, string> = {
  "Worship Audio Room": "Conceived during a discipleship meeting when the leader struggled to play a background song. Engineered to integrate a native audio console directly into a WebRTC room.",
  Chronos: "Born from a personal need for an automated, high-performance daily scheduler to optimize timing, routines, and resource allocation.",
  "Salary Predictor ML": "Developed during a Machine Learning Engineering bootcamp by TechCrush as a practical application of regression modeling.",
  "UGDF AI Surveillance": "A foundational prototype for a broader vision: a centralized, AI-driven security and early-warning framework designed to promote global peace.",
  SnakeVault: "Collaborative academic projects built with peers. MindCare explored psychological UI/UX, while SnakeVault tackled local desktop encryption.",
  MindCare: "Collaborative academic projects built with peers. MindCare explored psychological UI/UX, while SnakeVault tackled local desktop encryption.",
};

function isSafeProjectUrl(value: string | null): value is string {
  if (!value || !URL.canParse(value)) return false;
  return ["https:", "http:"].includes(new URL(value).protocol);
}

function projectDesignPreview(value: string | null) {
  if (!isSafeProjectUrl(value)) return null;
  const url = new URL(value);
  if (url.hostname !== "www.figma.com" && url.hostname !== "figma.com") return null;
  const [, , fileKey] = url.pathname.split("/");
  return designPreviews[fileKey] ?? null;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const previewImage = project.preview_image_url ?? projectDesignPreview(project.project_url);
  const safeUrl = isSafeProjectUrl(project.project_url) ? project.project_url : null;
  const canPreview = Boolean(previewImage || safeUrl);
  const isFigmaLink = safeUrl ? new URL(safeUrl).hostname.includes("figma.com") : false;
  const isLocalDesktop = /customtkinter/i.test(project.tech_stack);

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => {
        if (canPreview) setPreviewOpen(true);
      }}
      onHoverEnd={() => setPreviewOpen(false)}
      onFocusCapture={() => {
        if (canPreview) setPreviewOpen(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPreviewOpen(false);
        }
      }}
      className="reveal-up group relative flex min-h-[310px] flex-col overflow-hidden bg-[var(--surface)] p-6 sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-[10px] tracking-[0.16em] text-[color:var(--dim)]">OP / {String(index + 1).padStart(2, "0")}</span>
        <span className={`inline-flex items-center gap-2 border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] ${isLocalDesktop ? "border-[color:var(--warm-accent)]/25 text-[color:var(--warm-accent)]" : project.status === "Live" ? "border-[color:var(--accent)]/25 text-[color:var(--accent)]" : "border-[color:var(--warm-accent)]/25 text-[color:var(--warm-accent)]"}`}>
          <span className={`size-1 rounded-full ${isLocalDesktop ? "bg-[color:var(--warm-accent)]" : project.status === "Live" ? "bg-[color:var(--accent)]" : "bg-[color:var(--warm-accent)]"}`} />
          {isLocalDesktop ? "Local desktop app" : project.status}
        </span>
      </div>

      <div className="mt-8">
        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[color:var(--muted)]">{project.role}</p>
        <h3 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-[color:var(--ink)]">{project.title}</h3>
        <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{project.description}</p>
      </div>

      {originStories[project.title] && <div className="mt-4 border-y border-[color:var(--line-soft)] py-3">
        <button type="button" aria-expanded={storyOpen} onClick={() => setStoryOpen((open) => !open)} className="flex w-full items-center justify-between gap-3 text-left font-mono text-[9px] uppercase tracking-[0.15em] text-[color:var(--muted)] transition-colors hover:text-[color:var(--accent)]"><span>Origin story</span><motion.span animate={{ rotate: storyOpen ? 180 : 0 }}><ChevronDown size={14} /></motion.span></button>
        <AnimatePresence initial={false}>{storyOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.24, ease: "easeInOut" }} className="overflow-hidden"><p className="pt-3 text-xs leading-6 text-[color:var(--muted)]">{originStories[project.title]}</p></motion.div>}</AnimatePresence>
      </div>}

      <div className="mt-auto pt-8">
        <div className="flex flex-wrap gap-2">
          {project.tech_stack.split(",").map((tech) => <span key={tech.trim()} className="border border-[color:var(--line-soft)] px-2 py-1 font-mono text-[9px] text-[color:var(--muted)]">{tech.trim()}</span>)}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          {safeUrl && <motion.a whileHover={{ color: "var(--accent-hover)", x: 2 }} href={safeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border-b border-[color:var(--accent)]/30 pb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--accent)]">{isFigmaLink ? "View design" : "View project"}<ArrowUpRight size={13} /></motion.a>}
          {canPreview && <button type="button" aria-expanded={previewOpen} onClick={() => setPreviewOpen((open) => !open)} className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-[color:var(--muted)] transition-colors hover:text-[color:var(--accent)]"><Eye size={13} />Preview</button>}
        </div>
      </div>

      <AnimatePresence>
        {previewOpen && canPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="pointer-events-none absolute inset-0 z-20 flex flex-col border border-[color:var(--accent)]/25 bg-[var(--surface-raised)]/95 p-4 text-[color:var(--ink)] backdrop-blur-md sm:p-5"
            aria-label={`${project.title} preview`}
          >
            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--body)]">
              <span>{previewImage ? "Project interface preview" : "Live project preview"}</span>
              <button type="button" onClick={() => setPreviewOpen(false)} className="pointer-events-auto grid size-7 place-items-center border border-[color:var(--line)] text-[color:var(--body)]" aria-label="Close preview"><X size={13} /></button>
            </div>
            <div className="relative mt-3 min-h-0 flex-1 overflow-hidden border border-[color:var(--line)] bg-[var(--surface)]">
              {previewImage ? (
                <Image src={previewImage} alt={`${project.title} interface`} fill sizes="(max-width: 768px) 90vw, 420px" className="object-contain" />
              ) : safeUrl && !isFigmaLink ? (
                <iframe src={safeUrl} title={`${project.title} live preview`} loading="lazy" sandbox="allow-scripts allow-same-origin" referrerPolicy="no-referrer" className="h-full w-full border-0" />
              ) : (
                <div className="grid h-full place-items-center px-5 text-center font-mono text-[10px] uppercase tracking-[0.13em] text-[color:var(--accent)]">Preview image not available</div>
              )}
            </div>
            <div className="pointer-events-auto flex items-center justify-between gap-3 pt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[color:var(--dim)]">
              <span>{isLocalDesktop ? "Local desktop software · interface preview" : previewImage ? isFigmaLink ? "Interface concept · Figma" : "Uploaded project interface" : "Embedded site · may restrict previews"}</span>
              {safeUrl && <a href={safeUrl} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 text-[color:var(--accent)]">Open {isFigmaLink ? "design" : "project"}<ArrowUpRight size={12} /></a>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <div className="reveal-up mt-12 border border-[color:var(--line)] bg-[var(--surface-raised)] px-6 py-12 text-center"><p className="font-mono text-xs uppercase tracking-[0.16em] text-[color:var(--accent)]">No deployments returned</p><p className="mt-3 text-sm text-[color:var(--muted)]">Check the public projects read policy and build environment configuration.</p></div>;
  return <div className="mt-12 grid gap-px border border-[color:var(--line)] bg-[color:var(--line)] md:grid-cols-2 xl:grid-cols-3">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>;
}
