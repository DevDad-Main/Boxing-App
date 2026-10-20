/**
 * Root layout — diagnostic version showing supabase config state and error.
 */
import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const OBSIDIAN = '#151817';
const IVORY = '#F3F1E9';
const LIME = '#C8F169';
const SECONDARY = '#8A948F';
const DANGER = '#EF4444';

export const RootLayout = () => {
  const [session, setSession] = useState<{ user: unknown } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      console.log('init: isSupabaseConfigured =', isSupabaseConfigured);

      if (!isSupabaseConfigured) {
        if (!cancelled) {
          setLoading(false);
          setError('Supabase not configured — .env vars missing or empty');
        }
        return;
      }

      try {
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout after 8s')), 8000),
        );
        await Promise.race([supabase.auth.getSession(), timeout]);
        const { data, error: err } = await supabase.auth.getSession();
        console.log('getSession result:', { data: !!data, error: err?.message });
        if (!cancelled) {
          setSession(data.session ? { user: data.session.user } : null);
          setLoading(false);
        }
      } catch (err: any) {
        console.log('getSession caught error:', err.message);
        if (!cancelled) {
          setError('Supabase error: ' + err.message);
          setLoading(false);
        }
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const center = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: OBSIDIAN,
    color: IVORY,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  } as const;

  if (loading) {
    return (
      <div style={center}>
        <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
          Boxing
        </div>
        <div style={{ color: SECONDARY }}>Loading…</div>
      </div>
    );
  }

  return (
    <div style={center}>
      <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        {error ? 'Setup error' : 'Signed in'}
      </div>
      <div style={{ marginBottom: 20, color: error ? DANGER : LIME }}>
        {error || 'Supabase is working!'}
      </div>
      <div style={{ color: SECONDARY, fontSize: 12, marginBottom: 24 }}>
        Configured: {String(isSupabaseConfigured)}
      </div>
      <button
        onClick={() => window.location.reload()}
        style={{
          backgroundColor: LIME,
          color: OBSIDIAN,
          border: 'none',
          padding: '10px 20px',
          borderRadius: 10,
          fontSize: 16,
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        {error ? 'Try again' : 'Continue'}
      </button>
    </div>
  );
};
