/**
 * Root layout — test: render LoginScreen directly, no session check.
 */
import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { colors } from '@/lib/theme';
import { LoginScreen } from '@/components/auth/LoginScreen';

const OBSIDIAN = '#151817';

export const RootLayout = () => {
  const [error, setError] = useState<string | null>(null);

  console.log('RootLayout: configured =', isSupabaseConfigured);

  return (
    <div
      style={{
        backgroundColor: OBSIDIAN,
        height: '100vh',
        width: '100vw',
        minHeight: '100vh',
        minWidth: '100vw',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ color: colors.textPrimary, fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Sign in
      </div>
      {error && (
        <div style={{ color: colors.danger, marginBottom: 16 }}>{error}</div>
      )}
      <LoginScreen onLogin={() => {}} onSignup={() => {}} />
    </div>
  );
};
