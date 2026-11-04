"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";

function isSafeProjectUrl(value: string | null): value is string {
  if (!value || !URL.canParse(value)) return false;
  return ["https:", "http:"].includes(new URL(value).protocol);
}

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <div className="reveal-up mt-12 border border-white/10 bg-[#141715] px-6 py-12 text-center"><p className="font-mono text-xs uppercase tracking-[0.16em] text-[#9acb91]">No deployments returned</p><p className="mt-3 text-sm text-[#7d857d]">Check the public projects read policy and build environment configuration.</p></div>;
  return <div className="mt-12 grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-3">{projects.map((project, index) => <motion.article key={project.id} whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="reveal-up group relative flex min-h-[310px] flex-col bg-[#111412] p-6 sm:p-7">
    <div className="flex items-start justify-between gap-4"><span className="font-mono text-[10px] tracking-[0.16em] text-[#697269]">OP / {String(index + 1).padStart(2, "0")}</span><span className={`inline-flex items-center gap-2 border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] ${project.status === "Live" ? "border-[#8cba85]/20 text-[#9acb91]" : "border-[#c59a63]/20 text-[#c7a77a]"}`}><span className={`size-1 rounded-full ${project.status === "Live" ? "bg-[#8cba85]" : "bg-[#c7a77a]"}`} />{project.status}</span></div>
    <div className="mt-8"><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#7f887f]">{project.role}</p><h3 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-[#e5e9e2]">{project.title}</h3><p className="mt-4 text-sm leading-7 text-[#8e968e]">{project.description}</p></div>
    <div className="mt-auto pt-8"><div className="flex flex-wrap gap-2">{project.tech_stack.split(",").map((tech) => <span key={tech.trim()} className="border border-white/[0.08] px-2 py-1 font-mono text-[9px] text-[#929b91]">{tech.trim()}</span>)}</div>{isSafeProjectUrl(project.project_url) && <motion.a whileHover={{ color: "#ffffff", x: 2 }} href={project.project_url} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 border-b border-[#8cba85]/30 pb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#a9d49f]">View project<ArrowUpRight size={13} /></motion.a>}</div>
  </motion.article>)}</div>;
}

