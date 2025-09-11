import React, { useEffect, useRef, useState } from 'react';
import { Alert, TextInput, View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { t } from '../../src/i18n';
import { useTheme } from '../../src/theme/ThemeProvider';
import { AppLogo } from '../../src/components/AppLogo';

type QueuedIssue = {
  id: string;
  text?: string;
  audioUri?: string;
};

const QUEUE_KEY = 'offline_issue_queue_v1';

async function pushToQueue(item: QueuedIssue) {
  const raw = (await AsyncStorage.getItem(QUEUE_KEY)) || '[]';
  const list: QueuedIssue[] = JSON.parse(raw);
  list.push(item);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(list));
}

async function popAllFromQueue(): Promise<QueuedIssue[]> {
  const raw = (await AsyncStorage.getItem(QUEUE_KEY)) || '[]';
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify([]));
  return JSON.parse(raw);
}

async function submitIssue(item: QueuedIssue) {
  await new Promise((r) => setTimeout(r, 500));
  return { ok: true };
}

export default function SubmitIssueScreen() {
  const { theme } = useTheme();
  const [text, setText] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [hasAudio, setHasAudio] = useState(false);
  const audioUriRef = useRef<string | undefined>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsub = NetInfo.addEventListener(async (state) => {
      if (state.isConnected) {
        const toSend = await popAllFromQueue();
        for (const item of toSend) {
          await submitIssue(item);
        }
      }
    });
    return () => unsub();
  }, []);

  const handleSubmit = async () => {
    const id = Date.now().toString();
    const item: QueuedIssue = { id, text: text.trim() || undefined, audioUri: audioUriRef.current };

    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      await pushToQueue(item);
      Alert.alert('Saved offline. Will submit when online.');
      setText('');
      audioUriRef.current = undefined;
      return;
    }
    await submitIssue(item);
    Alert.alert('Submitted successfully');
    setText('');
    audioUriRef.current = undefined;
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await rec.startAsync();
      setRecording(rec);
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI() || undefined;
      audioUriRef.current = uri;
      setRecording(null);
      setIsRecording(false);
      setHasAudio(true);
      
      // Clear timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      Alert.alert('Recording Saved', 'Your voice message has been recorded successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to stop recording.');
    }
  };

  const deleteRecording = () => {
    audioUriRef.current = undefined;
    setHasAudio(false);
    setRecordingDuration(0);
    Alert.alert('Recording Deleted', 'Voice message has been removed.');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    textInputContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.lg,
    },
    textInput: {
      color: theme.colors.text,
      padding: theme.spacing.lg,
      minHeight: 120,
      textAlignVertical: 'top',
      fontSize: 16,
    },
    recordingSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    recordingTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    recordingControls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    recordButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      minWidth: 120,
      justifyContent: 'center',
    },
    recordButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: theme.spacing.sm,
    },
    stopButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.error,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      minWidth: 120,
      justifyContent: 'center',
    },
    stopButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: theme.spacing.sm,
    },
    durationText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    audioStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.success + '20',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginTop: theme.spacing.md,
    },
    audioStatusText: {
      color: theme.colors.success,
      fontSize: 14,
      fontWeight: '500',
      marginLeft: theme.spacing.sm,
      flex: 1,
    },
    deleteButton: {
      backgroundColor: theme.colors.error + '20',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    submitButtonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: '600',
    },
    submitButtonDisabled: {
      backgroundColor: theme.colors.muted,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppLogo size="medium" />
        <Text style={styles.title}>Submit Issue</Text>
        <Text style={styles.subtitle}>Report your health concerns or questions</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.textInputContainer}>
          <TextInput
            placeholder="Describe your health concern or question..."
            placeholderTextColor={theme.colors.muted}
            value={text}
            onChangeText={setText}
            style={styles.textInput}
            multiline
          />
        </View>

        <View style={styles.recordingSection}>
          <Text style={styles.recordingTitle}>Voice Recording</Text>
          
          <View style={styles.recordingControls}>
            {isRecording ? (
              <>
                <Text style={styles.durationText}>{formatDuration(recordingDuration)}</Text>
                <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
                  <Ionicons name="stop" size={20} color="#ffffff" />
                  <Text style={styles.stopButtonText}>Stop</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.durationText}>
                  {hasAudio ? formatDuration(recordingDuration) : '0:00'}
                </Text>
                <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
                  <Ionicons name="mic" size={20} color="#ffffff" />
                  <Text style={styles.recordButtonText}>Record</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {hasAudio && (
            <View style={styles.audioStatus}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
              <Text style={styles.audioStatusText}>Voice message recorded ({formatDuration(recordingDuration)})</Text>
              <TouchableOpacity style={styles.deleteButton} onPress={deleteRecording}>
                <Ionicons name="trash" size={16} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[
            styles.submitButton,
            (!text.trim() && !hasAudio) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!text.trim() && !hasAudio}
        >
          <Text style={styles.submitButtonText}>Submit Issue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


