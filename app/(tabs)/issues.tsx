import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, StyleSheet, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeProvider';
import { apiService, Issue } from '../../src/services/apiService';

export default function IssuesScreen() {
  const { theme } = useTheme();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      setLoading(true);
      const response = await apiService.getIssues();
      setIssues(response.issues);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadIssues();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderIssue = ({ item }: { item: Issue }) => (
    <View style={styles.issueCard}>
      <View style={styles.issueHeader}>
        <View style={styles.issueIcon}>
          <Ionicons 
            name={item.audio_filename ? "mic" : "chatbubble"} 
            size={20} 
            color={theme.colors.primary} 
          />
        </View>
        <View style={styles.issueInfo}>
          <Text style={styles.issueDate}>{formatDate(item.created_at)}</Text>
          {item.audio_filename && (
            <Text style={styles.issueType}>Voice Message</Text>
          )}
        </View>
      </View>
      
      {item.text && (
        <View style={styles.issueContent}>
          <Text style={styles.issueText}>{item.text}</Text>
          {item.translated && (
            <Text style={styles.translatedText}>Translated: {item.translated}</Text>
          )}
        </View>
      )}
      
      {item.audio_transcript && (
        <View style={styles.issueContent}>
          <Text style={styles.issueText}>Audio Transcript: {item.audio_transcript}</Text>
        </View>
      )}
    </View>
  );

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
    issueCard: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    issueHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    issueIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    issueInfo: {
      flex: 1,
    },
    issueDate: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontWeight: '500',
    },
    issueType: {
      fontSize: 12,
      color: theme.colors.primary,
      marginTop: theme.spacing.xs,
    },
    issueContent: {
      marginBottom: theme.spacing.sm,
    },
    issueText: {
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 22,
    },
    translatedText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
      marginTop: theme.spacing.xs,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
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

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Issues</Text>
          <Text style={styles.subtitle}>Your submitted health concerns</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading issues...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Issues</Text>
        <Text style={styles.subtitle}>Your submitted health concerns</Text>
      </View>
      
      <FlatList
        data={issues}
        keyExtractor={(item) => item._id}
        renderItem={renderIssue}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="chatbubble-outline" size={40} color={theme.colors.muted} />
            </View>
            <Text style={styles.emptyText}>No issues submitted yet</Text>
            <Text style={styles.emptySubtext}>Submit your first health concern to get started</Text>
          </View>
        }
      />
    </View>
  );
}
