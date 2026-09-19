import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/types/database.types';
import { getSupabaseEnv } from './env';

/**
 * Server-side Supabase client for Server Components, Server Actions, and
 * Route Handlers. Reads/writes the auth session via cookies and is subject
 * to RLS as the signed-in user — this is what every "own row" policy in
 * supabase/migrations/0004_row_level_security.sql is written against.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options as CookieOptions);
          });
        } catch {
          // Called from a Server Component render — middleware.ts already
          // refreshes the session on the request/response cycle, so this
          // can be safely ignored.
        }
      },
    },
  });
}
