/**
 * LoginScreen — email/password login.
 *
 * Connects to Supabase Auth. When Supabase is not configured, shows a
 * clearly labelled development-mode message instead of pretending a live
 * integration exists.
 *
 * Uses plain HTML inputs for reliable web rendering (react-native TextInput
 * can be inconsistent on web via react-dom).
 */
import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { colors } from '@/lib/theme';

interface LoginScreenProps {
  onLogin: () => void;
  onSignup: () => void;
}

const inputStyle = {
  backgroundColor: colors.graphite,
  border: `1px solid ${colors.border}`,
  borderRadius: 10,
  color: colors.textPrimary,
  padding: 12,
  fontSize: 16,
  width: '100%',
  boxSizing: 'border-box' as const,
  marginTop: 4,
  marginBottom: 16,
};

const labelStyle = {
  color: colors.textSecondary,
  fontSize: 14,
  fontWeight: '600' as const,
  marginBottom: 6,
  display: 'block' as const,
};

const primaryButtonStyle = {
  backgroundColor: colors.lime,
  color: colors.obsidian,
  border: 'none',
  borderRadius: 10,
  padding: 12,
  fontSize: 16,
  fontWeight: '700' as const,
  width: '100%',
  cursor: 'pointer' as const,
  marginTop: 8,
};

const ghostButtonStyle = {
  backgroundColor: 'transparent',
  color: colors.textPrimary,
  border: `1px solid ${colors.border}`,
  borderRadius: 10,
  padding: 12,
  fontSize: 16,
  fontWeight: '600' as const,
  width: '100%',
  cursor: 'pointer' as const,
  marginTop: 8,
};

export function LoginScreen({ onLogin, onSignup }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        throw new Error(
          'Supabase not configured. Set EXPO_PUBLIC_SUPABASE_URL and ' +
            'EXPO_PUBLIC_SUPABASE_ANON_KEY.',
        );
      }
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;
      onLogin();
    } catch (err: any) {
      // If user doesn't exist yet, try creating them (dev convenience)
      if (err.message?.includes('Invalid login') || err.message?.includes('Email not confirmed')) {
        try {
          const { error: signUpError } = await supabase.auth.signUp({ email, password });
          if (signUpError) throw signUpError;
          setError('Account created — please sign in.');
        } catch (signUpErr: any) {
          setError(signUpErr.message || 'Login failed. Please try again.');
        }
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: colors.obsidian,
        minHeight: '100vh',
        width: '100vw',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      <div style={{ color: colors.textPrimary, fontSize: 24, fontWeight: '700', marginBottom: 8 }}>
        Sign in
      </div>
      <div style={{ color: colors.textSecondary, marginBottom: 24 }}>
        Welcome back to your training.
      </div>

      {error && (
        <div
          style={{
            marginBottom: 16,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${colors.danger}`,
            borderRadius: 10,
            padding: 12,
            color: colors.danger,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      <label style={labelStyle}>Email address</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        style={inputStyle}
      />

      <label style={labelStyle}>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        style={inputStyle}
      />

      <button type="submit" style={primaryButtonStyle} disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

      <button
        type="button"
        onClick={onSignup}
        style={ghostButtonStyle}
      >
        Create account
      </button>

      {!isSupabaseConfigured && (
        <div
          style={{
            marginTop: 20,
            color: colors.textMuted,
            fontSize: 12,
            textAlign: 'center',
          }}
        >
          Development mode: Supabase not configured.
        </div>
      )}

      <div
        style={{
          marginTop: 24,
          paddingTop: 16,
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <div style={{ color: colors.textMuted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          Dev only
        </div>
        <button
          onClick={() => {
            setEmail('test@boxing.app');
            setPassword('test-password-123');
          }}
          style={{
            backgroundColor: 'transparent',
            color: colors.lime,
            border: `1px solid ${colors.lime}`,
            borderRadius: 10,
            padding: 10,
            fontSize: 13,
            fontWeight: '600' as const,
            width: '100%',
            cursor: 'pointer' as const,
            marginBottom: 8,
          }}
        >
          Load test user (test@boxing.app)
        </button>
        <div style={{ color: colors.textMuted, fontSize: 11, marginTop: 6 }}>
          Tries sign-in; if the user doesn't exist yet, sign up first.
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <div style={{ color: colors.textMuted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          Dev only — bypass Supabase
        </div>
        <button
          onClick={onLogin}
          style={{
            backgroundColor: colors.graphite,
            color: colors.textPrimary,
            border: `1px solid ${colors.border}`,
            borderRadius: 10,
            padding: 10,
            fontSize: 13,
            fontWeight: '600' as const,
            width: '100%',
            cursor: 'pointer' as const,
          }}
        >
          Dev mode: skip sign in (no Supabase)
        </button>
        <div style={{ color: colors.textMuted, fontSize: 11, marginTop: 6 }}>
          Enters the app without Supabase auth. Development only — not real authentication.
        </div>
      </div>
    </form>
  );
}
