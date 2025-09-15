import React from 'react';
import { Tabs } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../../src/theme/ThemeProvider';
import { t } from '../../src/i18n';
import { Ionicons } from '@expo/vector-icons';
import { AppLogo } from '../../src/components/AppLogo';
import { Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { subscribeToLocale } from '../../src/i18n';

function InnerTabs() {
  const { theme } = useTheme();
  const [localeTick, setLocaleTick] = React.useState(0);
  React.useEffect(() => {
    const unsub = subscribeToLocale(() => setLocaleTick((x) => x + 1));
    return unsub;
  }, []);
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerStyle: { 
          backgroundColor: theme.colors.background,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerLeft: () => (
          <AppLogo size="small" showText={false} />
        ),
        headerLeftContainerStyle: { paddingLeft: 12 },
        // Replace logo with user avatar leading to profile
        headerRight: () => (
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
              style={{ width: 28, height: 28, borderRadius: 14 }}
            />
          </TouchableOpacity>
        ),
        headerRightContainerStyle: { paddingRight: 12 },
        tabBarStyle: { 
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'ellipse';
          switch (route.name) {
            case 'index':
              iconName = 'calendar';
              break;
            case 'submit':
              iconName = 'mic';
              break;
            case 'issues':
              iconName = 'chatbubbles';
              break;
            case 'reports':
              iconName = 'document-text';
              break;
            case 'ai-assistance':
              iconName = 'sparkles';
              break;
            case 'video':
              iconName = 'videocam';
              break;
            case 'settings':
              iconName = 'settings';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: t('nav.events') }} />
      <Tabs.Screen name="submit" options={{ title: t('nav.submitIssue') }} />
      <Tabs.Screen name="issues" options={{ title: 'My Issues' }} />
      <Tabs.Screen name="reports" options={{ title: t('nav.reports') }} />
      <Tabs.Screen name="ai-assistance" options={{ title: t('nav.aiAssistant') }} />
      <Tabs.Screen name="video" options={{ title: t('nav.videoCall') }} />
      <Tabs.Screen name="settings" options={{ title: t('nav.settings') }} />
      {/* Hidden profile route; navigable via header avatar */}
      <Tabs.Screen name="profile" options={{ href: null, title: 'Profile' }} />
    </Tabs>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <InnerTabs />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}


