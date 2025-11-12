// lib/supabaseClient.js
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

let browserClient;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserSupabaseClient({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });
  }
  return browserClient;
}
