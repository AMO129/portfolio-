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
  const previewImage = projectDesignPreview(project.project_url);
  const safeUrl = isSafeProjectUrl(project.project_url) ? project.project_url : null;
  const isFigmaLink = safeUrl ? new URL(safeUrl).hostname.includes("figma.com") : false;
  const isLocalDesktop = /customtkinter/i.test(project.tech_stack);

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="reveal-up group relative flex min-h-[310px] flex-col overflow-hidden bg-[#111412] p-6 sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-[10px] tracking-[0.16em] text-[#697269]">OP / {String(index + 1).padStart(2, "0")}</span>
        <span className={`inline-flex items-center gap-2 border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] ${isLocalDesktop ? "border-[#c59a63]/20 text-[#d8b57e]" : project.status === "Live" ? "border-[#8cba85]/20 text-[#9acb91]" : "border-[#c59a63]/20 text-[#c7a77a]"}`}>
          <span className={`size-1 rounded-full ${isLocalDesktop ? "bg-[#c7a77a]" : project.status === "Live" ? "bg-[#8cba85]" : "bg-[#c7a77a]"}`} />
          {isLocalDesktop ? "Local desktop app" : project.status}
        </span>
      </div>

      <div className="mt-8">
        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#7f887f]">{project.role}</p>
        <h3 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-[#e5e9e2]">{project.title}</h3>
        <p className="mt-4 text-sm leading-7 text-[#8e968e]">{project.description}</p>
      </div>

      {originStories[project.title] && <div className="mt-4 border-y border-white/[0.07] py-3">
        <button type="button" aria-expanded={storyOpen} onClick={() => setStoryOpen((open) => !open)} className="flex w-full items-center justify-between gap-3 text-left font-mono text-[9px] uppercase tracking-[0.15em] text-[#9fa89e] transition-colors hover:text-[#c0dfb8]"><span>Origin story</span><motion.span animate={{ rotate: storyOpen ? 180 : 0 }}><ChevronDown size={14} /></motion.span></button>
        <AnimatePresence initial={false}>{storyOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.24, ease: "easeInOut" }} className="overflow-hidden"><p className="pt-3 text-xs leading-6 text-[#90988f]">{originStories[project.title]}</p></motion.div>}</AnimatePresence>
      </div>}

      <div className="mt-auto pt-8">
        <div className="flex flex-wrap gap-2">
          {project.tech_stack.split(",").map((tech) => <span key={tech.trim()} className="border border-white/[0.08] px-2 py-1 font-mono text-[9px] text-[#929b91]">{tech.trim()}</span>)}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          {safeUrl && <motion.a whileHover={{ color: "#ffffff", x: 2 }} href={safeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border-b border-[#8cba85]/30 pb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#a9d49f]">{isFigmaLink ? "View design" : "View project"}<ArrowUpRight size={13} /></motion.a>}
          {safeUrl && <button type="button" aria-expanded={previewOpen} onClick={() => setPreviewOpen((open) => !open)} className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-[#7f897f] transition-colors hover:text-[#c0dfb8]"><Eye size={13} />Preview</button>}
        </div>
      </div>

      <AnimatePresence>
        {previewOpen && safeUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="pointer-events-none absolute inset-0 z-20 flex flex-col border border-[#8cba85]/25 bg-[#0b0d0c]/95 p-4 backdrop-blur-md sm:p-5"
            aria-label={`${project.title} preview`}
          >
            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-[#a7b2a6]">
              <span>{previewImage ? "Figma design preview" : "Live project preview"}</span>
              <button type="button" onClick={() => setPreviewOpen(false)} className="pointer-events-auto grid size-7 place-items-center border border-white/10 text-[#aab2a9]" aria-label="Close preview"><X size={13} /></button>
            </div>
            <div className="relative mt-3 min-h-0 flex-1 overflow-hidden border border-white/10 bg-[#111312]">
              {previewImage ? (
                <Image src={previewImage} alt={`${project.title} interface`} fill sizes="(max-width: 768px) 90vw, 420px" className="object-contain" />
              ) : !isFigmaLink ? (
                <iframe src={safeUrl} title={`${project.title} live preview`} loading="lazy" sandbox="allow-scripts allow-same-origin" referrerPolicy="no-referrer" className="h-full w-full border-0" />
              ) : (
                <div className="grid h-full place-items-center px-5 text-center font-mono text-[10px] uppercase tracking-[0.13em] text-[#8cba85]">Preview image not available</div>
              )}
            </div>
            <div className="pointer-events-auto flex items-center justify-between gap-3 pt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[#727d73]">
              <span>{isLocalDesktop ? "Local desktop software · design only" : previewImage ? "Interface concept · Figma" : "Embedded site · may restrict previews"}</span>
              <a href={safeUrl} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 text-[#a9d49f]">Open {isFigmaLink ? "design" : "project"}<ArrowUpRight size={12} /></a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <div className="reveal-up mt-12 border border-white/10 bg-[#141715] px-6 py-12 text-center"><p className="font-mono text-xs uppercase tracking-[0.16em] text-[#9acb91]">No deployments returned</p><p className="mt-3 text-sm text-[#7d857d]">Check the public projects read policy and build environment configuration.</p></div>;
  return <div className="mt-12 grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-3">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>;
}
