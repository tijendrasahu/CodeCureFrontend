import React from 'react';
import { View, Text, Switch, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { setLocale, t, type SupportedLocale } from '../../src/i18n';
import { useTheme } from '../../src/theme/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const { theme, mode, setMode } = useTheme();
  const [lang, setLang] = React.useState<SupportedLocale>('en');

  const languages = [
    { label: 'English', value: 'en' as SupportedLocale, flag: '🇺🇸' },
    { label: 'हिन्दी', value: 'hi' as SupportedLocale, flag: '🇮🇳' },
    { label: 'ਪੰਜਾਬੀ', value: 'pa' as SupportedLocale, flag: '🇮🇳' },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('user_authenticated');
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    section: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    settingItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    settingSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    languageOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    selectedLanguage: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '10',
    },
    languageFlag: {
      fontSize: 20,
      marginRight: theme.spacing.sm,
    },
    languageLabel: {
      fontSize: 16,
      color: theme.colors.text,
      flex: 1,
    },
    logoutButton: {
      backgroundColor: theme.colors.error,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      alignItems: 'center',
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    logoutText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your experience</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language</Text>
        {languages.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => {
              setLang(option.value);
              setLocale(option.value);
            }}
            style={[
              styles.languageOption,
              lang === option.value && styles.selectedLanguage
            ]}
          >
            <Text style={styles.languageFlag}>{option.flag}</Text>
            <Text style={styles.languageLabel}>{option.label}</Text>
            {lang === option.value && (
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Ionicons name="moon" size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Dark Mode</Text>
            <Text style={styles.settingSubtitle}>Switch between light and dark themes</Text>
          </View>
          <Switch 
            value={mode === 'dark'} 
            onValueChange={(v) => setMode(v ? 'dark' : 'light')}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={mode === 'dark' ? '#ffffff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


