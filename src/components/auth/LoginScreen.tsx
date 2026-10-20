/**
 * LoginScreen — email/password login.
 *
 * Connects to Supabase Auth. When Supabase is not configured, shows a
  development-mode message instead of pretending a live integration exists.
 */
import { TextInput } from 'react-native';
import { useState } from 'react';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { colors } from '@/lib/theme';

interface LoginScreenProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function LoginScreen({ onLogin, onSignup }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
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
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="obsidian" flex={1} p={24} style={{ backgroundColor: colors.obsidian }}>
      <Text variant="heading" style={{ color: colors.textPrimary, textAlign: 'center', marginBottom: 8 }}>
        Sign in
      </Text>
      <Text variant="body-muted" style={{ color: colors.textSecondary, textAlign: 'center', marginBottom: 24 }}>
        Welcome back to your training.
      </Text>

      {error && (
        <Box style={{ marginBottom: 16, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: colors.danger, borderRadius: 10, padding: 12 }}>
          <Text variant="caption" style={{ color: colors.danger }}>
            {error}
          </Text>
        </Box>
      )}

      <Box style={{ marginBottom: 16 }}>
        <Text variant="label" style={{ color: colors.textSecondary, marginBottom: 6 }}>Email address</Text>
        <Box style={{ backgroundColor: colors.graphite, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12 }}>
          <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor={colors.textMuted} style={{ color: colors.textPrimary, paddingVertical: 12 }} />
        </Box>
      </Box>

      <Box style={{ marginBottom: 20 }}>
        <Text variant="label" style={{ color: colors.textSecondary, marginBottom: 6 }}>Password</Text>
        <Box style={{ backgroundColor: colors.graphite, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12 }}>
          <TextInput value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor={colors.textMuted} secureTextEntry style={{ color: colors.textPrimary, paddingVertical: 12 }} />
        </Box>
      </Box>

      <Button variant="primary" onPress={handleSubmit} loading={loading} disabled={loading} style={{ width: '100%', marginBottom: 16 }}>
        <Text variant="body" style={{ color: colors.obsidian }}>Sign in</Text>
      </Button>

      <Button variant="ghost" onPress={onSignup} style={{ width: '100%' }}>
        <Text variant="body" style={{ color: colors.textPrimary }}>Create account</Text>
      </Button>

      {!isSupabaseConfigured && (
        <Text variant="caption" style={{ marginTop: 20, textAlign: 'center', color: colors.textMuted }}>
          Development mode: Supabase not configured.
        </Text>
      )}
    </Box>
  );
}
