"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadNotes = async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setNotes(data ?? []);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const addNote = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.from("notes").insert([{ content }]);
    setLoading(false);
    if (error) setError(error.message);
    setContent("");
    loadNotes();
  };

  return (
    <main className="min-h-screen mx-auto max-w-xl p-6">
      <h1 className="text-3xl font-bold mb-4">GiGX + Supabase ✅</h1>

      <form onSubmit={addNote} className="flex gap-2 mb-6">
        <input
          className="flex-1 border rounded p-2"
          placeholder="Type a note…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Adding…" : "Add"}
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">Error: {error}</p>}

      <ul className="space-y-2">
        {notes.map((n) => (
          <li key={n.id} className="border rounded p-3">
            <div className="text-sm text-gray-500">
              {new Date(n.created_at).toLocaleString()}
            </div>
            <div className="text-lg">{n.content}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}