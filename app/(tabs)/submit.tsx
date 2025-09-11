import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, TextInput, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { t } from '../../src/i18n';
import { useTheme } from '../../src/theme/ThemeProvider';

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
  const audioUriRef = useRef<string | undefined>();

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
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
    await rec.startAsync();
    setRecording(rec);
  };

  const stopRecording = async () => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI() || undefined;
    audioUriRef.current = uri;
    setRecording(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16, gap: 12 }}>
      <TextInput
        placeholder="Type your issue..."
        placeholderTextColor={theme.colors.muted}
        value={text}
        onChangeText={setText}
        style={{ backgroundColor: theme.colors.surface, color: theme.colors.text, padding: 12, borderRadius: 8, borderColor: theme.colors.border, borderWidth: 1 }}
        multiline
      />
      {recording ? (
        <Button title="Stop" onPress={stopRecording} />
      ) : (
        <Button title="Record Audio" onPress={startRecording} />
      )}
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}


