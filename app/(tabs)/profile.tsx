import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Switch,
  Platform,
  StatusBar,
} from 'react-native';
import { User as UserIcon, CreditCard as Edit3, Shield, Bell, Globe, Info, ChevronRight, Save, X, Mail } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';

export default function ProfileScreen() {
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isPrivate, setIsPrivate] = useState(user?.isPrivate || false);

  const handleSave = () => {
    if (editedName.trim() && editedEmail.trim()) {
      updateUser({
        name: editedName.trim(),
        email: editedEmail.trim(),
        isPrivate: isPrivate,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedName(user?.name || '');
    setEditedEmail(user?.email || '');
    setIsPrivate(user?.isPrivate || false);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        {!isEditing && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Edit3 size={20} color="#059669" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <UserIcon size={40} color="#6b7280" />
            </View>
            {isEditing && (
              <TouchableOpacity style={styles.avatarEdit}>
                <Edit3 size={16} color="#ffffff" />
              </TouchableOpacity>
            )}
          </View>

          {isEditing ? (
            <View style={styles.editingContainer}>
              <TextInput
                style={styles.nameInput}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Enter your name"
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                style={styles.emailInput}
                value={editedEmail}
                onChangeText={setEditedEmail}
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <X size={16} color="#6b7280" />
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={handleSave}
                >
                  <Save size={16} color="#ffffff" />
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email || 'No email set'}</Text>
            </View>
          )}
        </View>

        {/* Friend Code Section */}
        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Connect with Friends</Text>
          
          <View style={styles.friendCodeContainer}>
            <View style={styles.friendCodeInfo}>
              <Mail size={20} color="#059669" />
              <View style={styles.friendCodeText}>
                <Text style={styles.friendCodeLabel}>Your Friend Code</Text>
                <Text style={styles.friendCodeValue}>
                  {user.email || 'Set your email to get a friend code'}
                </Text>
                <Text style={styles.friendCodeDesc}>
                  Share this email with friends so they can add you
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Privacy Settings */}
        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Shield size={20} color="#6b7280" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Private Profile</Text>
                <Text style={styles.settingDesc}>
                  Hide your prayer data from friends
                </Text>
              </View>
            </View>
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              trackColor={{ false: '#f3f4f6', true: '#86efac' }}
              thumbColor={isPrivate ? '#059669' : '#d1d5db'}
            />
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color="#6b7280" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Prayer Reminders</Text>
                <Text style={styles.settingDesc}>
                  Get notified before prayer times
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#f3f4f6', true: '#86efac' }}
              thumbColor={notificationsEnabled ? '#059669' : '#d1d5db'}
            />
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuInfo}>
              <Globe size={20} color="#6b7280" />
              <Text style={styles.menuLabel}>Language</Text>
            </View>
            <View style={styles.menuRight}>
              <Text style={styles.menuValue}>English</Text>
              <ChevronRight size={16} color="#6b7280" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuInfo}>
              <Info size={20} color="#6b7280" />
              <Text style={styles.menuLabel}>About</Text>
            </View>
            <View style={styles.menuRight}>
              <Text style={styles.menuValue}>v1.0.0</Text>
              <ChevronRight size={16} color="#6b7280" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Islamic Quote */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            "And whoever fears Allah - He will make for him a way out and provide for him from where he does not expect."
          </Text>
          <Text style={styles.quoteSource}>- Quran 65:2-3</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 40,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  editingContainer: {
    width: '100%',
    alignItems: 'center',
  },
  nameInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    color: '#1f2937',
    marginBottom: 12,
  },
  emailInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    color: '#1f2937',
    marginBottom: 16,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  saveButton: {
    backgroundColor: '#059669',
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  friendCodeContainer: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  friendCodeInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  friendCodeText: {
    flex: 1,
  },
  friendCodeLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
    marginBottom: 4,
  },
  friendCodeValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1f2937',
    marginBottom: 4,
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  friendCodeDesc: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  settingsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1f2937',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1f2937',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  quoteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  quoteText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
    lineHeight: 24,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  quoteSource: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#059669',
    textAlign: 'right',
  },
});