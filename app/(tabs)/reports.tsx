import React, { useState, useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View, ScrollView, Modal, Dimensions, Alert, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeProvider';
import { t } from '../../src/i18n';
import { AppLogo } from '../../src/components/AppLogo';
import { apiService, Report } from '../../src/services/apiService';
import * as DocumentPicker from 'expo-document-picker';

export default function ReportsScreen() {
  const { theme } = useTheme();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await apiService.getReports();
      setReports(response.reports);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadReport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setUploading(true);
        await apiService.uploadReport(result.assets[0]);
        Alert.alert('Success', 'Report uploaded successfully');
        await loadReports();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to upload report');
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension === 'pdf' ? 'document-text' : 'image';
  };

  const getFileColor = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension === 'pdf' ? theme.colors.error : theme.colors.success;
  };

  const handleReportPress = (report: Report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const handleDownload = async (report: Report) => {
    try {
      const blob = await apiService.downloadReport(report.filename);
      // For now, we'll show an alert. In a real app, you'd save the file
      Alert.alert('Download', `Report ${report.original_name} downloaded successfully`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to download the report.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const styles = {
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
      fontWeight: 'bold' as const,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    reportCard: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    reportContent: {
      padding: theme.spacing.lg,
    },
    reportHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginBottom: theme.spacing.md,
    },
    reportIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginRight: theme.spacing.md,
    },
    reportInfo: {
      flex: 1,
    },
    reportName: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    reportMeta: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    modalContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      margin: theme.spacing.lg,
      maxHeight: Dimensions.get('window').height * 0.9,
      width: Dimensions.get('window').width - theme.spacing.xl,
    },
    modalHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold' as const,
      color: theme.colors.text,
      flex: 1,
    },
    closeButton: {
      padding: theme.spacing.sm,
    },
    modalContent: {
      flex: 1,
    },
    webViewContainer: {
      flex: 1,
      minHeight: 400,
    },
    actionButtons: {
      flexDirection: 'row' as const,
      padding: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      gap: theme.spacing.md,
    },
    downloadButton: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center' as const,
    },
    downloadButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600' as const,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingHorizontal: theme.spacing.xl,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.surfaceVariant,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: theme.spacing.lg,
    },
    emptyText: {
      fontSize: 18,
      color: theme.colors.textSecondary,
      textAlign: 'center' as const,
      marginBottom: theme.spacing.sm,
    },
    emptySubtext: {
      fontSize: 14,
      color: theme.colors.muted,
      textAlign: 'center' as const,
    },
    uploadButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      marginTop: theme.spacing.md,
      alignSelf: 'flex-start',
    },
    uploadButtonDisabled: {
      opacity: 0.6,
    },
    uploadButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600' as const,
      marginLeft: theme.spacing.sm,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    loadingText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    reportInfo: {
      padding: theme.spacing.lg,
    },
    reportDetailLabel: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      marginTop: theme.spacing.md,
    },
    reportDetailValue: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppLogo size="medium" />
        <Text style={styles.title}>{t('reports.title')}</Text>
        <Text style={styles.subtitle}>{t('app.title')}</Text>
        
        <TouchableOpacity 
          style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
          onPress={handleUploadReport}
          disabled={uploading}
        >
          <Ionicons name="cloud-upload" size={20} color="#ffffff" />
          <Text style={styles.uploadButtonText}>
            {uploading ? 'Uploading...' : 'Upload Report'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.reportCard}>
              <TouchableOpacity 
                style={styles.reportContent} 
                activeOpacity={0.8}
                onPress={() => handleReportPress(item)}
              >
                <View style={styles.reportHeader}>
                  <View style={[styles.reportIcon, { backgroundColor: getFileColor(item.filename) + '20' }]}>
                    <Ionicons 
                      name={getFileIcon(item.filename) as any} 
                      size={24} 
                      color={getFileColor(item.filename)} 
                    />
                  </View>
                  <View style={styles.reportInfo}>
                    <Text style={styles.reportName}>{item.original_name}</Text>
                    <Text style={styles.reportMeta}>{formatDate(item.uploaded_at)}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                </View>
              </TouchableOpacity>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Ionicons name="document-outline" size={40} color={theme.colors.muted} />
              </View>
              <Text style={styles.emptyText}>No reports found</Text>
              <Text style={styles.emptySubtext}>Upload your first report to get started</Text>
            </View>
          }
        />
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedReport?.original_name}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <View style={styles.reportInfo}>
                <Text style={styles.reportDetailLabel}>Filename:</Text>
                <Text style={styles.reportDetailValue}>{selectedReport?.filename}</Text>
                
                <Text style={styles.reportDetailLabel}>Uploaded:</Text>
                <Text style={styles.reportDetailValue}>{selectedReport ? formatDate(selectedReport.uploaded_at) : ''}</Text>
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.downloadButton}
                onPress={() => selectedReport && handleDownload(selectedReport)}
              >
                <Text style={styles.downloadButtonText}>Download Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


