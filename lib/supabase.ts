import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

declare global {
  // Reuse the client during Next.js development hot reloads.
  // eslint-disable-next-line no-var
  var __mfSupabaseAdmin: SupabaseClient | undefined;
}

export function supabaseAdmin(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY must be configured on the server");
  }

  if (!globalThis.__mfSupabaseAdmin) {
    globalThis.__mfSupabaseAdmin = createClient(url, secretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return globalThis.__mfSupabaseAdmin;
}
