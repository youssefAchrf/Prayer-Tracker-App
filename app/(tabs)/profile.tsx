import React, { useState, useEffect } from 'react';
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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { User as UserIcon, Edit3 as EditIcon, Shield, Bell, Globe, Info, ChevronRight, Save, X, Mail } from 'lucide-react-native';
// --- IMPORT THE CORRECT CONTEXT ---
import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
import { useAuth } from '@/contexts/AuthContext'; // To sign out

export default function ProfileScreen() {
  // --- USE THE CORRECT HOOK TO GET REAL DATA FROM SUPABASE ---
  const { profile, updateProfile, loading: profileLoading } = useSupabaseUser();
  const { signOut } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile?.name || '');
  
  // The email from Supabase Auth is the source of truth, it shouldn't be edited here.
  const userEmail = profile?.email || 'Loading...';

  // This should also come from the database profile
  const [isPrivate, setIsPrivate] = useState(profile?.is_private || false);

  const [isSaving, setIsSaving] = useState(false);

  // When the profile data loads from Supabase, update the local state
  useEffect(() => {
    if (profile) {
      setEditedName(profile.name || '');
      setIsPrivate(profile.is_private || false);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    
    setIsSaving(true);
    try {
      await updateProfile({
        name: editedName.trim(),
        is_private: isPrivate,
      });
      Alert.alert('Success', 'Profile updated successfully.');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedName(profile?.name || '');
    setIsPrivate(profile?.is_private || false);
    setIsEditing(false);
  };

  if (profileLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{ flex: 1 }} size="large" />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Could not load profile. Please try logging in again.</Text>
         <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        {!isEditing && (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <EditIcon size={20} color="#059669" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}><UserIcon size={40} color="#6b7280" /></View>
          </View>

          {isEditing ? (
            <View style={styles.editingContainer}>
              <TextInput
                style={styles.nameInput}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Enter your name"
              />
              <Text style={styles.emailDisplay}>{userEmail}</Text>
              <View style={styles.editActions}>
                <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleCancel}>
                  <X size={16} color="#6b7280" />
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? <ActivityIndicator color="#ffffff" size="small"/> : <Save size={16} color="#ffffff" />}
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{profile.name}</Text>
              <Text style={styles.userEmail}>{userEmail}</Text>
            </View>
          )}
        </View>

        {/* Privacy Settings */}
        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Shield size={20} color="#6b7280" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Private Profile</Text>
                <Text style={styles.settingDesc}>Hide your prayer data from search</Text>
              </View>
            </View>
            <Switch
              value={isPrivate}
              onValueChange={isEditing ? setIsPrivate : (val) => {
                setIsPrivate(val);
                updateProfile({ is_private: val });
              }}
              trackColor={{ false: '#f3f4f6', true: '#86efac' }}
              thumbColor={isPrivate ? '#059669' : '#d1d5db'}
            />
          </View>
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutSection}>
          <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- PASTE YOUR FULL STYLES OBJECT HERE ---
// I am including some necessary styles, but you should use your full list.
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
  editButton: { padding: 8 },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
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
  editingContainer: {
    width: '100%',
    alignItems: 'center',
  },
  nameInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    color: '#1f2937',
    marginBottom: 12,
  },
  emailDisplay: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    color: '#6b7280',
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
  cancelButton: { backgroundColor: '#f3f4f6' },
  cancelButtonText: { color: '#6b7280' },
  saveButton: { backgroundColor: '#059669' },
  saveButtonText: { color: '#ffffff' },
  profileInfo: { alignItems: 'center' },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  settingsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
  settingText: { flex: 1 },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1f2937',
  },
  settingDesc: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  signOutSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  signOutButton: {
    backgroundColor: '#fee2e2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#dc2626',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
});