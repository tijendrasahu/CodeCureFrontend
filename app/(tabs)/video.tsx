import React from 'react';
import { Button, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../src/theme/ThemeProvider';
import { t } from '../../src/i18n';

export default function VideoScreen() {
  const { theme } = useTheme();
  const [open, setOpen] = React.useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {!open ? (
        <View style={{ padding: 16 }}>
          <Button title="Open Call" onPress={() => setOpen(true)} />
        </View>
      ) : (
        <WebView
          style={{ flex: 1 }}
          source={{ uri: 'https://example.com/doctor-call' }}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
        />
      )}
    </View>
  );
}


