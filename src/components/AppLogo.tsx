import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

interface AppLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  style?: any;
}

export const AppLogo: React.FC<AppLogoProps> = ({ 
  size = 'medium', 
  showText = true, 
  style 
}) => {
  const { theme } = useTheme();

  const getSize = () => {
    switch (size) {
      case 'small': return { icon: 24, text: 16, container: 40 };
      case 'large': return { icon: 48, text: 24, container: 80 };
      default: return { icon: 32, text: 20, container: 60 };
    }
  };

  const sizes = getSize();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    },
    logoContainer: {
      width: sizes.container,
      height: sizes.container,
      borderRadius: sizes.container / 2,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: showText ? theme.spacing.sm : 0,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
    logoText: {
      fontSize: sizes.text,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
    },
    logoSubtext: {
      fontSize: sizes.text * 0.7,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Ionicons 
          name="medical" 
          size={sizes.icon} 
          color="#ffffff" 
        />
      </View>
      {showText && (
        <>
          <Text style={styles.logoText}>CodeCure</Text>
          <Text style={styles.logoSubtext}>Health Assistant</Text>
        </>
      )}
    </View>
  );
};


