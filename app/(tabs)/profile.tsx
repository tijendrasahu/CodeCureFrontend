import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
};

export default function ProfileScreen() {
  const { theme } = useTheme();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('current_user_v1');
        if (raw) setUser(JSON.parse(raw));
      } catch {}
    })();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      marginRight: theme.spacing.md,
    },
    name: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
    },
    email: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginTop: theme.spacing.lg,
    },
    actionText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: theme.spacing.sm,
    },
    section: {
      marginTop: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    rowLabel: {
      color: theme.colors.text,
      fontSize: 15,
    },
    rowValue: {
      color: theme.colors.textSecondary,
      fontSize: 14,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Image source={{ uri: user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.avatar} />
          <View>
            <Text style={styles.name}>{user ? `${user.firstName} ${user.lastName}` : 'John Doe'}</Text>
            <Text style={styles.email}>{user?.email || 'john.doe@example.com'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="pencil" size={18} color="#fff" />
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Phone</Text>
            <Text style={styles.rowValue}>{user?.phone || '+91 98765 43210'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Age</Text>
            <Text style={styles.rowValue}>29</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Blood Group</Text>
            <Text style={styles.rowValue}>O+</Text>
          </View>
        </View>
      </View>
    </View>
  );
}


