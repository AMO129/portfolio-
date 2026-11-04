"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    const form = new FormData(event.currentTarget);
    const supabase = createSupabaseBrowserClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email: String(form.get("email")), password: String(form.get("password")) });
    setLoading(false);
    if (authError) { setError(authError.message); return; }
    window.location.assign("/admin");
  }
  return <main className="grid min-h-screen place-items-center bg-[#0f0f0f] px-6 py-16"><div className="w-full max-w-md border border-white/10 bg-[#121513] p-7 sm:p-9">
    <Link href="/" className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8cba85]">← Return to portfolio</Link>
    <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.2em] text-[#7f887f]">Restricted access / 01</p><h1 className="mt-3 text-3xl font-medium tracking-[-0.04em]">Operator sign in</h1><p className="mt-3 text-sm leading-6 text-[#828a82]">Authenticate with the Supabase account authorized to manage this project registry.</p>
    <form onSubmit={signIn} className="mt-8 space-y-5"><label className="block"><span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.16em] text-[#8a938a]">Email</span><input name="email" type="email" autoComplete="username" required className="h-12 w-full border border-white/10 bg-[#0d0f0e] px-3 text-sm text-white outline-none focus:border-[#8cba85]/70" /></label><label className="block"><span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.16em] text-[#8a938a]">Password</span><input name="password" type="password" autoComplete="current-password" required className="h-12 w-full border border-white/10 bg-[#0d0f0e] px-3 text-sm text-white outline-none focus:border-[#8cba85]/70" /></label>{error && <p role="alert" className="text-sm text-[#e99386]">{error}</p>}<motion.button whileHover={{ backgroundColor: "#c0dfb8" }} disabled={loading} className="h-12 w-full bg-[#a6cb9e] font-mono text-[10px] uppercase tracking-[0.16em] text-[#101311] disabled:opacity-50">{loading ? "Authenticating…" : "Authenticate"}</motion.button></form>
  </div></main>;
}

