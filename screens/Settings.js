import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = () => {
    console.log('Logging out...');
    navigation.navigate('Login');
  };

  const handleAppShare = async () => {
    try {
      const result = await Share.share({
        message: 'Check out this amazing app: [Your App Link Here]',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while sharing the app.');
    }
  };

  const handleHelp = () => {
    console.log('Showing help...');
  };

  const handleNotificationToggle = () => {
    console.log('Toggling notifications...');
  };

  const handleLanguageChange = () => {
    Alert.alert('Language change', 'Language selection feature is not yet implemented.');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Privacy Policy details go here.');
  };

  const handleTermsOfService = () => {
    Alert.alert('Terms of Service', 'Terms of Service details go here.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Exit Here</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleNotificationToggle}>
        <Text style={styles.settingsItem}>Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLanguageChange}>
        <Text style={styles.settingsItem}>Change Language</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleAppShare}>
        <Text style={styles.settingsItem}>Share App</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleHelp}>
        <Text style={styles.settingsItem}>Help</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handlePrivacyPolicy}>
        <Text style={styles.settingsItem}>Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleTermsOfService}>
        <Text style={styles.settingsItem}>Terms of Service</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Changes saved successfully!</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // Default background color
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#000', // Default text color
  },
  logoutButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#2196F3',
  },
  settingsItem: {
    fontSize: 16,
    marginVertical: 10,
    color: '#000', // Default text color
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});