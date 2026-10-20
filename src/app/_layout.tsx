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
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { colors } from '@/lib/theme';
import { AppShell } from '@/app/shell';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { SignupScreen } from '@/components/auth/SignupScreen';

type AuthMode = 'login' | 'signup';

export const RootLayout = () => {
  const [session, setSession] = useState<{ user: unknown } | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (!isSupabaseConfigured) {
        if (!cancelled) {
          setLoading(false);
          setSession({ user: { id: 'dev-user' } });
        }
        return;
      }

      try {
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
      <Box bg="obsidian" flex={1}>
        <StatusBar barStyle="light-content" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box bg="obsidian" flex={1} p={24} style={{ backgroundColor: colors.obsidian }}>
        <StatusBar barStyle="light-content" />
        <Text variant="heading" style={{ color: colors.textPrimary, textAlign: 'center', marginBottom: 16 }}>
          Setup error
        </Text>
        <Text variant="body" style={{ color: colors.textSecondary, textAlign: 'center', marginBottom: 16 }}>
          {error}
        </Text>
        <Text variant="caption" style={{ color: colors.textMuted, textAlign: 'center' }}>
          Check your Supabase URL and anon key in .env, then restart the dev server.
        </Text>
      </Box>
    );
  }

  return (
    <Box bg="obsidian" flex={1}>
      <StatusBar barStyle="light-content" />
      {session ? <AppShell /> : (
        <Box flex={1} p={24} style={{ backgroundColor: colors.obsidian }}>
          {authMode === 'login' ? (
            <LoginScreen onLogin={() => {}} onSignup={() => setAuthMode('signup')} />
          ) : (
            <SignupScreen onSignup={() => {}} onLogin={() => setAuthMode('login')} />
          )}
        </Box>
      )}
    </Box>
  );
};
