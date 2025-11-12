// app/register/page.jsx
"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const supabase = getSupabaseBrowserClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setMsg("");

    try {
      // 1) Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }, // stores in user.user_metadata
          // emailRedirectTo: "http://localhost:3000/login" // if email confirm is on
        },
      });

      if (error) throw error;

      // 2) Optional: also create a profile row (if you have a profiles table)
      // await supabase.from("profiles").insert({ id: data.user.id, name });

      setMsg("Account created. You can sign in now.");
      // Send to login (if you use email confirmations, consider waiting for confirm)
      window.location.href = "/login?registered=1";
    } catch (e) {
      setErr(e.message || "Could not register.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <h1 className="text-3xl font-bold">Create account</h1>
      <p className="mt-2 text-neutral-600">Join GiGX to continue</p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm">Name</span>
          <input className="rounded-xl border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} minLength={2} required />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Email</span>
          <input type="email" className="rounded-xl border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Password</span>
          <input type="password" className="rounded-xl border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
        </label>

        {err && <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}
        {msg && <div className="rounded-xl border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-700">{msg}</div>}

        <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-white bg-black hover:opacity-90 transition disabled:opacity-60">
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>
    </div>
  );
}
