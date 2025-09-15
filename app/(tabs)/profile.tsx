import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, TextInput, Modal, Platform } from 'react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useProfile } from '../../src/context/ProfileContext';
import { Ionicons } from '@expo/vector-icons';
import { apiService, ProfileResponse, ProfileUpdateRequest } from '../../src/services/apiService';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { profile, loading, refreshProfile, updateProfileImage } = useProfile();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState<ProfileUpdateRequest>({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    checkPendingImageResult();
  }, []);

  const checkPendingImageResult = async () => {
    try {
      const result = await ImagePicker.getPendingResultAsync();
      if (result && !result.canceled && result.assets[0]) {
        console.log('Found pending image result:', result);
        setEditData(prev => ({
          ...prev,
          profile_image: result.assets[0]
        }));
      }
    } catch (error) {
      console.log('No pending image result or error:', error);
    }
  };

  const testImagePicker = async () => {
    try {
      console.log('Testing ImagePicker availability...');
      console.log('ImagePicker object:', ImagePicker);
      console.log('ImagePicker methods:', Object.keys(ImagePicker));
      
      // Test permission request
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission test result:', status);
      
      Alert.alert('Test Result', `ImagePicker is working. Permission status: ${status}`);
    } catch (error) {
      console.error('ImagePicker test failed:', error);
      Alert.alert('Test Failed', `ImagePicker test failed: ${error.message}`);
    }
  };



  const handleEditProfile = () => {
    setEditData({
      blood_group: profile?.profile?.blood_group || '',
      email: profile?.profile?.email || '',
      category: profile?.profile?.category || '',
      father: profile?.profile?.father || '',
      mother: profile?.profile?.mother || '',
      address: profile?.profile?.address || '',
    });
    setEditModalVisible(true);
  };

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true);
      await apiService.updateProfile(editData);
      setEditModalVisible(false);
      await refreshProfile();
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const pickImage = async () => {
    try {
      console.log('Starting image picker...');
      Alert.alert(
        'Select Profile Picture',
        'Choose how you want to set your profile picture',
        [
          {
            text: 'Camera',
            onPress: () => {
              console.log('Camera option selected');
              takePicture();
            },
          },
          {
            text: 'Photo Library',
            onPress: () => {
              console.log('Photo Library option selected');
              selectFromLibrary();
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', `Failed to open image picker: ${error.message || 'Unknown error'}`);
    }
  };

  const takePicture = async () => {
    try {
      console.log('Requesting camera permissions...');
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log('Camera permission status:', status);
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera permissions to take a profile picture.',
          [{ text: 'OK' }]
        );
        return;
      }

      console.log('Launching camera...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets[0]) {
        console.log('Setting image data:', result.assets[0]);
        setEditData(prev => ({
          ...prev,
          profile_image: result.assets[0]
        }));
        Alert.alert('Success', 'Image selected successfully!');
      } else {
        console.log('Camera operation was canceled');
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', `Failed to take picture: ${error.message || 'Unknown error'}`);
    }
  };

  const selectFromLibrary = async () => {
    try {
      console.log('Requesting media library permissions...');
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Media library permission status:', status);
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need photo library permissions to select a profile picture.',
          [{ text: 'OK' }]
        );
        return;
      }

      console.log('Launching image library...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('Library result:', result);

      if (!result.canceled && result.assets[0]) {
        console.log('Setting image data:', result.assets[0]);
        setEditData(prev => ({
          ...prev,
          profile_image: result.assets[0]
        }));
        Alert.alert('Success', 'Image selected successfully!');
      } else {
        console.log('Library operation was canceled');
      }
    } catch (error) {
      console.error('Library picker error:', error);
      Alert.alert('Error', `Failed to select image: ${error.message || 'Unknown error'}`);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginRight: theme.spacing.md,
    },
    name: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
    },
    email: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginTop: theme.spacing.lg,
    },
    actionText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: theme.spacing.sm,
    },
    section: {
      marginTop: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    rowLabel: {
      color: theme.colors.text,
      fontSize: 15,
    },
    rowValue: {
      color: theme.colors.textSecondary,
      fontSize: 14,
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
    modalContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    modalContent: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    inputContainer: {
      marginBottom: theme.spacing.lg,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    textArea: {
      minHeight: 100,
    },
    imagePickerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.lg,
    },
    imagePickerText: {
      fontSize: 16,
      color: theme.colors.primary,
      marginLeft: theme.spacing.sm,
      fontWeight: '500',
    },
    updateButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    updateButtonDisabled: {
      opacity: 0.6,
    },
    updateButtonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: '600',
    },
    imagePreviewContainer: {
      marginBottom: theme.spacing.lg,
      alignItems: 'center',
    },
    imagePreview: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginTop: theme.spacing.sm,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Image 
              source={{ 
                uri: profile?.profile?.profile_image 
                  ? `https://xbll7p88-5000.inc1.devtunnels.ms/patients/uploads/${profile.profile.profile_image}`
                  : undefined
              }} 
              style={styles.avatar} 
              defaultSource={require('../../assets/icon.png')}
            />
            <View>
              <Text style={styles.name}>
                {profile ? `${profile.first_name} ${profile.last_name}` : 'Loading...'}
              </Text>
              <Text style={styles.email}>{profile?.mobile || 'Loading...'}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
            <Ionicons name="pencil" size={18} color="#fff" />
            <Text style={styles.actionText}>Edit Profile</Text>
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Details</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Mobile</Text>
              <Text style={styles.rowValue}>{profile?.mobile || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Age</Text>
              <Text style={styles.rowValue}>{profile?.age || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Date of Birth</Text>
              <Text style={styles.rowValue}>{profile?.dob || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Sex</Text>
              <Text style={styles.rowValue}>{profile?.sex || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Blood Group</Text>
              <Text style={styles.rowValue}>{profile?.profile?.blood_group || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Email</Text>
              <Text style={styles.rowValue}>{profile?.profile?.email || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Category</Text>
              <Text style={styles.rowValue}>{profile?.profile?.category || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Father's Name</Text>
              <Text style={styles.rowValue}>{profile?.profile?.father || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Mother's Name</Text>
              <Text style={styles.rowValue}>{profile?.profile?.mother || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Address</Text>
              <Text style={styles.rowValue}>{profile?.profile?.address || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Blood Group</Text>
              <TextInput
                style={styles.input}
                value={editData.blood_group || ''}
                onChangeText={(text) => setEditData(prev => ({ ...prev, blood_group: text }))}
                placeholder="e.g., O+, A-, B+"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={editData.email || ''}
                onChangeText={(text) => setEditData(prev => ({ ...prev, email: text }))}
                placeholder="your.email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                value={editData.category || ''}
                onChangeText={(text) => setEditData(prev => ({ ...prev, category: text }))}
                placeholder="e.g., General, SC, ST, OBC"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Father's Name</Text>
              <TextInput
                style={styles.input}
                value={editData.father || ''}
                onChangeText={(text) => setEditData(prev => ({ ...prev, father: text }))}
                placeholder="Father's full name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mother's Name</Text>
              <TextInput
                style={styles.input}
                value={editData.mother || ''}
                onChangeText={(text) => setEditData(prev => ({ ...prev, mother: text }))}
                placeholder="Mother's full name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editData.address || ''}
                onChangeText={(text) => setEditData(prev => ({ ...prev, address: text }))}
                placeholder="Your complete address"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {editData.profile_image && (
              <View style={styles.imagePreviewContainer}>
                <Text style={styles.label}>Selected Image Preview</Text>
                <Image 
                  source={{ uri: editData.profile_image.uri }} 
                  style={styles.imagePreview}
                />
              </View>
            )}

            <TouchableOpacity style={styles.imagePickerButton} onPress={selectFromLibrary}>
              <Ionicons name="image" size={20} color={theme.colors.primary} />
              <Text style={styles.imagePickerText}>Select from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.imagePickerButton} onPress={takePicture}>
              <Ionicons name="camera" size={20} color={theme.colors.primary} />
              <Text style={styles.imagePickerText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.imagePickerButton, { backgroundColor: theme.colors.error || '#ff6b6b' }]} onPress={testImagePicker}>
              <Ionicons name="bug" size={20} color="#fff" />
              <Text style={[styles.imagePickerText, { color: '#fff' }]}>Test ImagePicker</Text>
            </TouchableOpacity>


            <TouchableOpacity 
              style={[styles.updateButton, updating && styles.updateButtonDisabled]}
              onPress={handleUpdateProfile}
              disabled={updating}
            >
              <Text style={styles.updateButtonText}>
                {updating ? 'Updating...' : 'Update Profile'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}


