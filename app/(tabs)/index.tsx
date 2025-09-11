import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity, ScrollView, Modal, Dimensions, Animated, Easing, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeProvider';
import { Video, ResizeMode } from 'expo-av';
import { router } from 'expo-router';
import { AppLogo } from '../../src/components/AppLogo';

const mockEvents = [
  { 
    id: '1', 
    title: 'Health Camp - City Center', 
    date: '2025-09-22',
    time: '9:00 AM - 5:00 PM',
    location: 'City Center Plaza',
    type: 'health_camp',
    description: 'A comprehensive health camp offering free medical checkups, blood pressure monitoring, diabetes screening, and basic health consultations. Qualified doctors and medical professionals will be available throughout the day.',
    services: ['Blood Pressure Check', 'Diabetes Screening', 'General Consultation', 'Health Education'],
    contact: '+91 98765 43210',
    organizer: 'City Health Department',
    requirements: 'Bring valid ID proof and previous medical reports if available'
  },
  { 
    id: '2', 
    title: 'Free Checkup - Community Hall', 
    date: '2025-10-01',
    time: '10:00 AM - 3:00 PM',
    location: 'Community Hall',
    type: 'checkup',
    description: 'Free health checkup camp organized by local medical practitioners. Includes basic health screening, consultation with doctors, and health awareness sessions.',
    services: ['General Health Check', 'Eye Examination', 'Dental Checkup', 'Nutrition Counseling'],
    contact: '+91 98765 43211',
    organizer: 'Community Health Initiative',
    requirements: 'No prior appointment needed, walk-ins welcome'
  },
  { 
    id: '3', 
    title: 'Vaccination Drive', 
    date: '2025-10-15',
    time: '8:00 AM - 4:00 PM',
    location: 'Medical Center',
    type: 'vaccination',
    description: 'Mass vaccination drive for COVID-19 booster shots and routine immunizations. Safe and efficient vaccination process with proper medical supervision.',
    services: ['COVID-19 Booster', 'Flu Vaccination', 'Child Immunization', 'Travel Vaccines'],
    contact: '+91 98765 43212',
    organizer: 'District Health Office',
    requirements: 'Bring vaccination card and valid ID proof'
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
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

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
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    },
    headerAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      margin: theme.spacing.lg,
      maxHeight: Dimensions.get('window').height * 0.8,
      width: Dimensions.get('window').width - theme.spacing.xl,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      flex: 1,
    },
    closeButton: {
      padding: theme.spacing.sm,
    },
    modalContent: {
      padding: theme.spacing.lg,
    },
    detailRow: {
      marginBottom: theme.spacing.md,
    },
    detailLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    detailValue: {
      fontSize: 16,
      color: theme.colors.text,
    },
    servicesList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing.xs,
    },
    serviceTag: {
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    serviceText: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: '500',
    },
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true })
    ]).start();
  }, []);

  const handleEventPress = (event: any) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const renderEvent = ({ item, index }: { item: any; index: number }) => (
    <Animated.View style={[styles.eventCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <TouchableOpacity 
        style={styles.eventContent} 
        activeOpacity={0.8}
        onPress={() => handleEventPress(item)}
      >
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
    </Animated.View>
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
        ListHeaderComponent={
          <View style={{ marginHorizontal: theme.spacing.lg, marginBottom: theme.spacing.md, borderRadius: theme.borderRadius.lg, overflow: 'hidden' }}>
            <Video
              source={{ uri: 'https://nhm.gov.in/images/video/mhs/HWC.mp4' }}
              style={{ width: '100%', height: 180 }}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping
              isMuted
            />
          </View>
        }
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

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <LinearGradient
                colors={[getEventColor(selectedEvent?.type, theme), getEventColor(selectedEvent?.type, theme) + '80']}
                style={styles.modalIcon}
              >
                <Ionicons 
                  name={getEventIcon(selectedEvent?.type) as any} 
                  size={30} 
                  color="#ffffff" 
                />
              </LinearGradient>
              <Text style={styles.modalTitle}>{selectedEvent?.title}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailValue}>{selectedEvent?.date} • {selectedEvent?.time}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{selectedEvent?.location}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Description</Text>
                <Text style={styles.detailValue}>{selectedEvent?.description}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Services Offered</Text>
                <View style={styles.servicesList}>
                  {selectedEvent?.services?.map((service: string, index: number) => (
                    <View key={index} style={styles.serviceTag}>
                      <Text style={styles.serviceText}>{service}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Organizer</Text>
                <Text style={styles.detailValue}>{selectedEvent?.organizer}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Contact</Text>
                <Text style={styles.detailValue}>{selectedEvent?.contact}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Requirements</Text>
                <Text style={styles.detailValue}>{selectedEvent?.requirements}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}


