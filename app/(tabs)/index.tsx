import React from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeProvider';

const mockEvents = [
  { 
    id: '1', 
    title: 'Health Camp - City Center', 
    date: '2025-09-22',
    time: '9:00 AM - 5:00 PM',
    location: 'City Center Plaza',
    type: 'health_camp'
  },
  { 
    id: '2', 
    title: 'Free Checkup - Community Hall', 
    date: '2025-10-01',
    time: '10:00 AM - 3:00 PM',
    location: 'Community Hall',
    type: 'checkup'
  },
  { 
    id: '3', 
    title: 'Vaccination Drive', 
    date: '2025-10-15',
    time: '8:00 AM - 4:00 PM',
    location: 'Medical Center',
    type: 'vaccination'
  },
];

const getEventIcon = (type: string) => {
  switch (type) {
    case 'health_camp': return 'medical';
    case 'checkup': return 'fitness';
    case 'vaccination': return 'shield-checkmark';
    default: return 'calendar';
  }
};

const getEventColor = (type: string, theme: any) => {
  switch (type) {
    case 'health_camp': return theme.colors.primary;
    case 'checkup': return theme.colors.success;
    case 'vaccination': return theme.colors.warning;
    default: return theme.colors.accent;
  }
};

export default function EventsScreen() {
  const { theme } = useTheme();

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
    eventCard: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    eventContent: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
    },
    eventHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    eventIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    eventTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      flex: 1,
    },
    eventDate: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    eventTime: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    eventLocation: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      flexDirection: 'row',
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
    emptyText: {
      fontSize: 18,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    emptySubtext: {
      fontSize: 14,
      color: theme.colors.muted,
      textAlign: 'center',
    },
  });

  const renderEvent = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.eventCard}>
      <TouchableOpacity style={styles.eventContent} activeOpacity={0.8}>
        <View style={styles.eventHeader}>
          <LinearGradient
            colors={[getEventColor(item.type, theme), getEventColor(item.type, theme) + '80']}
            style={styles.eventIcon}
          >
            <Ionicons 
              name={getEventIcon(item.type) as any} 
              size={24} 
              color="#ffffff" 
            />
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDate}>{item.date}</Text>
          </View>
        </View>
        <Text style={styles.eventTime}>
          <Ionicons name="time" size={14} color={theme.colors.textSecondary} /> {item.time}
        </Text>
        <Text style={styles.eventLocation}>
          <Ionicons name="location" size={14} color={theme.colors.textSecondary} /> {item.location}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Events</Text>
        <Text style={styles.subtitle}>Stay updated with health events</Text>
      </View>
      
      <FlatList
        data={mockEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="calendar-outline" size={40} color={theme.colors.muted} />
            </View>
            <Text style={styles.emptyText}>No upcoming events</Text>
            <Text style={styles.emptySubtext}>Check back later for new health events</Text>
          </View>
        }
      />
    </View>
  );
}


