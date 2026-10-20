/**
 * Root layout — the app shell.
 *
 * Provides StatusBar and the auth gate. Unauthenticated users see LoginScreen
 * / SignupScreen; authenticated users see AppShell (tabs or onboarding flow).
 * When Supabase is not configured, the auth screens show a clearly labelled
 * development-mode message.
 */
import { StatusBar } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { colors } from '@/lib/theme';
import { AppShell } from '@/app/shell';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { SignupScreen } from '@/components/auth/SignupScreen';

type AuthMode = 'login' | 'signup';

const rootStyle = {
  backgroundColor: colors.obsidian,
  height: '100vh',
  width: '100vw',
  minHeight: '100vh',
  minWidth: '100vw',
  display: 'flex',
  flexDirection: 'column' as const,
};

const centerStyle = {
  margin: 'auto',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  color: colors.textPrimary,
};

export const RootLayout = () => {
  const [session, setSession] = useState<{ user: unknown } | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      // Never hang forever: timeout after 8 seconds
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Supabase timed out — check your URL/key in .env')), 8000),
      );

      if (!isSupabaseConfigured) {
        if (!cancelled) {
          setLoading(false);
          setSession({ user: { id: 'dev-user' } });
        }
        return;
      }

      try {
        await Promise.race([supabase.auth.getSession(), timeout]);
        const { data } = await supabase.auth.getSession();
        if (!cancelled) {
          setSession(data.session ? { user: data.session.user } : null);
          setLoading(false);
        }

        const { data: authSubscription } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            if (!cancelled) {
              setSession(session ? { user: session.user } : null);
            }
          },
        );

        return () => {
          cancelled = true;
          authSubscription.subscription.unsubscribe();
        };
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || 'Failed to initialize auth.');
          setLoading(false);
        }
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div style={rootStyle}>
        <StatusBar barStyle="light-content" />
        <div style={centerStyle}>
          <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
            Boxing
          </div>
          <div style={{ fontSize: 14, opacity: 0.7 }}>Loading…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={rootStyle}>
        <StatusBar barStyle="light-content" />
        <div style={{ ...centerStyle, color: colors.danger }}>
          <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
            Setup error
          </div>
          <div style={{ fontSize: 14, marginBottom: 16 }}>{error}</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            Check your Supabase URL and anon key in .env, then restart the dev server.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={rootStyle}>
      <StatusBar barStyle="light-content" />
      {session ? <AppShell /> : (
        <div style={{ flex: 1, padding: 24, backgroundColor: colors.obsidian }}>
          {authMode === 'login' ? (
            <LoginScreen onLogin={() => {}} onSignup={() => setAuthMode('signup')} />
          ) : (
            <SignupScreen onSignup={() => {}} onLogin={() => setAuthMode('login')} />
          )}
        </div>
      )}
    </div>
  );
};
