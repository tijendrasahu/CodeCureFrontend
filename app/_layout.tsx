import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import { ProfileProvider } from '../src/context/ProfileContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

const AUTH_KEY = 'user_authenticated';
const USERS_KEY = 'app_users_v1';
const CURRENT_USER_KEY = 'current_user_v1';

export default function Root() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    seedDummyUserIfNeeded().finally(checkAuthStatus);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authStatus = await AsyncStorage.getItem(AUTH_KEY);
      setIsAuthenticated(authStatus === 'true');
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const seedDummyUserIfNeeded = async () => {
    try {
      const existing = await AsyncStorage.getItem(USERS_KEY);
      if (!existing) {
        const dummy = [{
          id: 'u_demo',
          firstName: 'John',
          lastName: 'Doe',
          email: 'demo@codecure.app',
          phone: '+91 90000 00000',
          password: 'Demo@123',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        }];
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(dummy));
      }
    } catch {}
  };

  if (isAuthenticated === null) {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' }}>
            <ActivityIndicator size="large" color="#60a5fa" />
          </View>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ProfileProvider>
          <Stack screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
              <Stack.Screen name="(tabs)" />
            ) : (
              <Stack.Screen name="auth" />
            )}
          </Stack>
        </ProfileProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}


