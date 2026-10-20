/**
 * Supabase client.
 *
 * Reads SUPABASE_URL and SUPABASE_ANON_KEY from environment.
 * If either is missing (e.g. before the developer has provisioned a project),
 * we return a clearly labelled development-mode client so the app still boots
 * instead of silently pretending a live integration exists.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let supabase: SupabaseClient;

if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl!, supabaseAnonKey!);
} else {
  // Development-mode stub: typed like a Supabase client but every call
  // returns a clear error explaining that Supabase must be configured.
  supabase = new Proxy(
    {},
    {
      get() {
        return () => {
          throw new Error(
            'Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and ' +
              'EXPO_PUBLIC_SUPABASE_ANON_KEY in .env, then restart the dev server.',
          );
        };
      },
    },
  ) as SupabaseClient;
}

export { supabase };
export type { SupabaseClient } from '@supabase/supabase-js';
