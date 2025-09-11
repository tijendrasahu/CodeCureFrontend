import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, ScrollView, Modal, Dimensions, Alert, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeProvider';
import { t } from '../../src/i18n';
import { AppLogo } from '../../src/components/AppLogo';

const mockReports = [
  { 
    id: 'r1', 
    name: 'Blood Test Report.pdf', 
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    type: 'pdf',
    date: '2024-01-15',
    size: '2.3 MB'
  },
  { 
    id: 'r2', 
    name: 'Chest X-Ray.png', 
    url: 'https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Chest+X-Ray',
    type: 'image',
    date: '2024-01-10',
    size: '1.8 MB'
  },
  { 
    id: 'r3', 
    name: 'MRI Scan Report.pdf', 
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    type: 'pdf',
    date: '2024-01-08',
    size: '3.1 MB'
  },
  { 
    id: 'r4', 
    name: 'ECG Report.pdf', 
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    type: 'pdf',
    date: '2024-01-05',
    size: '1.2 MB'
  },
];

export default function ReportsScreen() {
  const { theme } = useTheme();
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getFileIcon = (type: string) => {
    return type === 'pdf' ? 'document-text' : 'image';
  };

  const getFileColor = (type: string) => {
    return type === 'pdf' ? theme.colors.error : theme.colors.success;
  };

  const handleReportPress = (report: any) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const handleDownload = async (report: any) => {
    try {
      const supported = await Linking.canOpenURL(report.url);
      if (supported) {
        await Linking.openURL(report.url);
        Alert.alert('Download Started', 'The report will be downloaded to your device.');
      } else {
        Alert.alert('Error', 'Cannot open this file type.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to download the report.');
    }
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppLogo size="medium" />
        <Text style={styles.title}>Medical Reports</Text>
        <Text style={styles.subtitle}>View and download your medical reports</Text>
      </View>
      
      <FlatList
        data={mockReports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reportCard}>
            <TouchableOpacity 
              style={styles.reportContent} 
              activeOpacity={0.8}
              onPress={() => handleReportPress(item)}
            >
              <View style={styles.reportHeader}>
                <View style={[styles.reportIcon, { backgroundColor: getFileColor(item.type) + '20' }]}>
                  <Ionicons 
                    name={getFileIcon(item.type) as any} 
                    size={24} 
                    color={getFileColor(item.type)} 
                  />
                </View>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportName}>{item.name}</Text>
                  <Text style={styles.reportMeta}>{item.date} • {item.size}</Text>
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
            <Text style={styles.emptyText}>No reports available</Text>
            <Text style={styles.emptySubtext}>Your medical reports will appear here</Text>
          </View>
        }
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedReport?.name}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <View style={styles.webViewContainer}>
                <WebView
                  source={{ uri: selectedReport?.url }}
                  style={{ flex: 1 }}
                  onError={(error) => {
                    console.log('WebView error:', error);
                  }}
                />
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.downloadButton}
                onPress={() => handleDownload(selectedReport)}
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


