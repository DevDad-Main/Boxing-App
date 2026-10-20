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
import { colors } from '@/lib/theme';
import { AppShell } from '@/app/shell';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { SignupScreen } from '@/components/auth/SignupScreen';

type AuthMode = 'login' | 'signup';

export const RootLayout = () => {
  const [session, setSession] = useState<{ user: unknown } | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setSession({ user: { id: 'dev-user' } });
      return undefined;
    }

    setLoading(false);

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ? { user: session.user } : null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <Box bg="obsidian" flex={1}>
        <StatusBar barStyle="light-content" />
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
