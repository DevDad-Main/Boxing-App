/**
 * AppShell — authenticated app shell.
 *
 * Mobile: bottom tab bar (Home, Academy, Library, Calendar, Profile).
 * Desktop: persistent left sidebar + content area.
 * Same routes, different layout via Platform.OS.
 */
import { Platform, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { colors, breakpoints } from '@/lib/theme';
import { OnboardingFlow, OnboardingData } from '@/components/onboarding/OnboardingFlow';

type Tab = 'home' | 'academy' | 'library' | 'calendar' | 'profile';

const tabLabels: Record<Tab, string> = {
  home: 'Home',
  academy: 'Academy',
  library: 'Library',
  calendar: 'Calendar',
  profile: 'Profile',
};

export function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const isDesktop =
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    window.innerWidth >= breakpoints.md;

  const handleOnboardingComplete = (data: OnboardingData) => {
    // TODO: persist to Supabase profiles table once connected
    console.log('Onboarding complete:', data);
    setOnboardingComplete(true);
  };

  // Until onboarding is complete, show the onboarding flow full-screen.
  if (!onboardingComplete) {
    return (
      <Box bg="obsidian" flex={1}>
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </Box>
    );
  }

  return (
    <Box style={styles.container} bg="obsidian" flex={1}>
      {isDesktop ? <DesktopShell activeTab={activeTab} setActiveTab={setActiveTab} /> : <MobileShell activeTab={activeTab} setActiveTab={setActiveTab} />}
    </Box>
  );
}

function MobileShell({ activeTab, setActiveTab }: { activeTab: Tab; setActiveTab: (t: Tab) => void }) {
  return (
    <Box style={styles.mobileContainer} flex={1}>
      <Box style={styles.content} flex={1}>
        {renderTabContent(activeTab)}
      </Box>
      <Box style={styles.tabBar}>
        {Object.keys(tabLabels).map((key) => {
          const t = key as Tab;
          const active = activeTab === t;
          return (
            <Button
              key={t}
              variant={active ? 'primary' : 'ghost'}
              onPress={() => setActiveTab(t)}
              style={{
                flex: 1,
                backgroundColor: active ? colors.lime : 'transparent',
                borderRadius: 0,
                paddingVertical: 12,
                paddingHorizontal: 0,
              }}
            >
              <Text
                variant="caption"
                style={{
                  color: active ? colors.obsidian : colors.textSecondary,
                  textAlign: 'center',
                  fontWeight: '600' as const,
                }}
              >
                {tabLabels[t]}
              </Text>
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}

function DesktopShell({ activeTab, setActiveTab }: { activeTab: Tab; setActiveTab: (t: Tab) => void }) {
  return (
    <Box style={styles.desktopContainer} flex={1}>
      <Box style={styles.sidebar} bg="obsidian">
        <Box style={styles.sidebarHeader} p={20}>
          <Text variant="heading-sm" style={{ color: colors.textPrimary }}>
            Boxing
          </Text>
        </Box>
        <Box style={styles.sidebarNav} p={12}>
          {Object.keys(tabLabels).map((key) => {
            const t = key as Tab;
            const active = activeTab === t;
            return (
              <Button
                key={t}
                variant={active ? 'primary' : 'ghost'}
                onPress={() => setActiveTab(t)}
                style={{
                  width: '100%',
                  alignItems: 'flex-start',
                  backgroundColor: active ? colors.graphite : 'transparent',
                  borderRadius: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  marginBottom: 8,
                }}
              >
                <Text
                  variant="body"
                  style={{
                    color: active ? colors.lime : colors.textPrimary,
                    fontWeight: '600' as const,
                  }}
                >
                  {tabLabels[t]}
                </Text>
              </Button>
            );
          })}
        </Box>
      </Box>
      <Box style={styles.desktopContent} flex={1}>
        {renderTabContent(activeTab)}
      </Box>
    </Box>
  );
}

function renderTabContent(tab: Tab) {
  switch (tab) {
    case 'home':
      return <HomeScreen />;
    case 'academy':
      return <PlaceholderScreen title="Boxing Academy" body="Curriculum browser coming soon." />;
    case 'library':
      return <PlaceholderScreen title="Exercise Library" body="Searchable exercise library coming soon." />;
    case 'calendar':
      return <PlaceholderScreen title="Training Calendar" body="Your training schedule coming soon." />;
    case 'profile':
      return <PlaceholderScreen title="Profile" body="Preferences and account settings coming soon." />;
    default:
      return <HomeScreen />;
  }
}

function HomeScreen() {
  return (
    <EmptyScreen
      title="Training Dashboard"
      body="Complete onboarding to see what to work on today."
      actionLabel="Get started"
      onAction={() => {}}
    />
  );
}

function PlaceholderScreen({ title, body }: { title: string; body: string }) {
  return <EmptyScreen title={title} body={body} />;
}

function EmptyScreen({
  title,
  body,
  actionLabel,
  onAction,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <Box style={styles.emptyContainer} bg="graphite" p={24}>
      <Text variant="heading-sm" style={{ color: colors.textPrimary, marginBottom: 8 }}>
        {title}
      </Text>
      <Text variant="body-muted" style={{ color: colors.textSecondary, marginBottom: 20 }}>
        {body}
      </Text>
      {actionLabel && onAction && <Button variant="primary" onPress={onAction}>{actionLabel}</Button>}
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.obsidian,
  },
  mobileContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 6,
  },
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 280,
    backgroundColor: colors.obsidian,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  sidebarHeader: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sidebarNav: {},
  desktopContent: {
    flex: 1,
    backgroundColor: colors.graphite,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
