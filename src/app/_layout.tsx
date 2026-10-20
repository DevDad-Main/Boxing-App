/**
 * Root layout — zero external imports except React. Hardcoded colors.
 * setTimeout forces loading off after 3s so we can never get stuck.
 */
import { useState, useEffect } from 'react';

const OBSIDIAN = '#151817';
const IVORY = '#F3F1E9';
const LIME = '#C8F169';
const SECONDARY = '#8A948F';

export const RootLayout = () => {
  const [session, setSession] = useState<{ user: unknown } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Force loading off after 3s so we never get stuck
  useEffect(() => {
    const t = setTimeout(() => {
      console.log('FORCE timeout: setting loading false');
      setLoading(false);
      setError('Supabase did not respond — check .env credentials');
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    console.log('rendering loading state');
    return (
      <div
        style={{
          backgroundColor: OBSIDIAN,
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ color: IVORY, fontSize: 24, fontWeight: 'bold' }}>
          Boxing
        </div>
        <div style={{ color: SECONDARY, marginTop: 8 }}>Loading…</div>
      </div>
    );
  }

  if (error) {
    console.log('rendering error state:', error);
    return (
      <div
        style={{
          backgroundColor: OBSIDIAN,
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ color: '#EF4444', fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
          Setup error
        </div>
        <div style={{ color: SECONDARY, marginBottom: 16 }}>{error}</div>
      </div>
    );
  }

  console.log('rendering auth shell, session =', session ? 'yes' : 'no');

  return (
    <div
      style={{
        backgroundColor: OBSIDIAN,
        height: '100vh',
        width: '100vw',
        padding: 24,
      }}
    >
      {session ? (
        <div style={{ color: IVORY }}>Authenticated — AppShell</div>
      ) : (
        <div style={{ color: IVORY }}>
          <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
            Sign in
          </div>
          <button
            onClick={() => {}}
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
            Sign in
          </button>
        </div>
      )}
    </div>
  );
};
