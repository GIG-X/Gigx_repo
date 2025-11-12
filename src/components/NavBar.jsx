// components/NavBar.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export function NavBar() {
  const supabase = getSupabaseBrowserClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check user session on mount
  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    getUser();

    // Listen for login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  // Handle logout
  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  }

  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="text-xl font-semibold tracking-tight">
        GiGX
      </Link>

      {/* When still checking session */}
      {loading ? (
        <div className="text-sm text-neutral-500">Loading...</div>
      ) : user ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-700">
            {user.email}
          </span>
          <button
            onClick={handleLogout}
            className="inline-flex items-center rounded-xl px-4 py-2 border border-neutral-300 hover:bg-neutral-50 transition"
          >
            Log out
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          className="inline-flex items-center rounded-xl px-4 py-2 border border-neutral-300 hover:bg-neutral-50 transition"
        >
          Log in
        </Link>
      )}
    </header>
  );
}
