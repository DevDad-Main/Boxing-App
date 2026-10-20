/**
 * Root layout — the app shell.
 *
 * Provides StatusBar, SafeArea, and the auth gate. Unauthenticated users are
 * shown a minimal login placeholder; authenticated users see the tab shell
 * (bottom tabs on mobile, sidebar on desktop).
 */
import { StatusBar } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { colors } from '@/lib/theme';
import { AppShell } from '@/app/shell';

export const RootLayout = () => {
  const [session, setSession] = useState<{ user: unknown } | null>(null);
  const [loading, setLoading] = useState(true);

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
      {session ? <AppShell /> : <AuthPlaceholder />}
    </Box>
  );
};

const AuthPlaceholder = () => (
  <Box bg="obsidian" flex={1} p={24} style={{ backgroundColor: colors.obsidian }}>
    <Text variant="heading" style={{ color: colors.textPrimary, textAlign: 'center' }}>
      Boxing
    </Text>
    <Text variant="body-muted" style={{ textAlign: 'center', marginTop: 12 }}>
      Sign in to start training.
    </Text>
    <Box style={{ marginTop: 24 }}>
      <Button variant="primary" onPress={() => {}}>
        Sign in
      </Button>
      <Button variant="ghost" onPress={() => {}} style={{ marginTop: 12 }}>
        Create account
      </Button>
    </Box>
    {!isSupabaseConfigured && (
      <Text variant="caption" style={{ marginTop: 20, textAlign: 'center', color: colors.textMuted }}>
        Development mode: Supabase not configured.
      </Text>
    )}
  </Box>
);
