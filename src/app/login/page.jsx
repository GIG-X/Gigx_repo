// app/login/page.jsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const supabase = getSupabaseBrowserClient();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // session cookies are now set (sb-...), redirect
      const next = searchParams.get("next");
      window.location.href = next || "/dashboard";
    } catch (e) {
      setErr(e.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <h1 className="text-3xl font-bold">Sign in</h1>
      <p className="mt-2 text-neutral-600">Use your account credentials.</p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm">Email</span>
          <input type="email" className="rounded-xl border px-3 py-2" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Password</span>
          <input type="password" className="rounded-xl border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Remember me
        </label>

        {err && <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}

        <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-white bg-black hover:opacity-90 transition disabled:opacity-60">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-4 text-sm text-neutral-700">
        Don’t have an account? <a href="/register" className="underline underline-offset-4">Create one</a>
      </p>
    </div>
  );
}
