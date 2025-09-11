import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { t } from '../../src/i18n';

const mockReports = [
  { id: 'r1', name: 'Blood Test.pdf', url: 'https://example.com/report1.pdf' },
  { id: 'r2', name: 'X-Ray.png', url: 'https://example.com/xray.png' },
];

export default function ReportsScreen() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}>
      <FlatList
        data={mockReports}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Text style={{ color: theme.colors.muted }}>No reports available</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              // In a real app, open with WebView or Sharing
            }}
            style={{ padding: 12, borderRadius: 8, backgroundColor: theme.colors.surface, marginBottom: 8, borderColor: theme.colors.border, borderWidth: 1 }}
          >
            <Text style={{ color: theme.colors.text }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}


