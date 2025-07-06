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
import { User as UserIcon, Edit3 as EditIcon, Shield, Save, X, Flame, Settings as SettingsIcon } from 'lucide-react-native';
import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
import { useAuth } from '@/contexts/AuthContext';
import { ConfirmModal } from '@/components/ConfirmModal';
import { StreakBadge } from '@/components/StreakBadge'; // Import the new StreakBadge component

export default function ProfileScreen() {
  const { profile, updateProfile, loading: profileLoading, personalStreak, appSettings, updateAppSetting } = useSupabaseUser();
  const { signOut } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile?.name || '');
  const userEmail = profile?.email || 'Loading...';
  const [isPrivate, setIsPrivate] = useState(profile?.is_private || false);
  const [isSaving, setIsSaving] = useState(false);
  const [location, setLocation] = useState({ city: profile?.timezone_city || 'Cairo', country: profile?.timezone_country || 'Egypt' });
  
  const [isSignOutModalVisible, setSignOutModalVisible] = useState(false);

  const isLockingEnabled = appSettings.get('restrict_late_prayer_logging') ?? false;
  const [isLockingSwitchEnabled, setIsLockingSwitchEnabled] = useState(isLockingEnabled);

  useEffect(() => {
    if (profile) {
      setEditedName(profile.name || '');
      setIsPrivate(profile.is_private || false);
      setLocation({ city: profile.timezone_city || 'Cairo', country: profile.timezone_country || 'Egypt' });
    }
  }, [profile]);

  useEffect(() => {
    setIsLockingSwitchEnabled(isLockingEnabled);
  }, [isLockingEnabled]);

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      await updateProfile({
        name: editedName.trim(),
        is_private: isPrivate,
        timezone_city: location.city,
        timezone_country: location.country,
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
    setLocation({ city: profile?.timezone_city || 'Cairo', country: profile?.timezone_country || 'Egypt' });
    setIsEditing(false);
  };

  const handleLocationChange = (city, country) => {
    setLocation({ city, country });
    if (!isEditing) {
      updateProfile({ timezone_city: city, timezone_country: country });
    }
  };

  const handleToggleLocking = async (newValue: boolean) => {
    setIsLockingSwitchEnabled(newValue);
    try {
        await updateAppSetting('restrict_late_prayer_logging', newValue);
        Alert.alert('Setting Updated', `Late prayer logging is now ${newValue ? 'restricted' : 'allowed'}.`);
    } catch (error) {
        Alert.alert("Error", "Failed to update setting.");
        setIsLockingSwitchEnabled(!newValue);
    }
  };


  if (profileLoading && !profile) {
    return <SafeAreaView style={styles.container}><ActivityIndicator style={{ flex: 1 }} size="large" /></SafeAreaView>;
  }
  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Could not load profile.</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={() => setSignOutModalVisible(true)}><Text style={styles.signOutButtonText}>Sign Out</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ConfirmModal
        visible={isSignOutModalVisible}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        confirmColor="#dc2626"
        onClose={() => setSignOutModalVisible(false)}
        onConfirm={() => {
          setSignOutModalVisible(false);
          signOut();
        }}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        {!isEditing && (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <EditIcon size={20} color="#059669" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
            <View style={styles.avatar}><UserIcon size={40} color="#6b7280" /></View>
            {isEditing ? (
              <View style={styles.editingContainer}>
                <TextInput style={styles.nameInput} value={editedName} onChangeText={setEditedName} placeholder="Enter your name" />
                <Text style={styles.emailDisplay}>{userEmail}</Text>
                <View style={styles.editActions}>
                  <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleCancel}><X size={16} color="#6b7280" /><Text style={styles.cancelButtonText}>Cancel</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleSave} disabled={isSaving}>
                    {isSaving ? <ActivityIndicator color="#ffffff" size="small"/> : <Save size={16} color="#ffffff" />}
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.profileInfo}>
                <View style={styles.nameContainer}>
                    <Text style={styles.userName}>{profile.name}</Text>
                    {/* Use the StreakBadge component with the live personal streak */}
                    <StreakBadge streak={personalStreak} />
                </View>
                <Text style={styles.userEmail}>{userEmail}</Text>
              </View>
            )}
        </View>

        <View style={styles.streakCard}>
            <View style={styles.streakIconContainer}><Flame size={24} color="#f97316" /></View>
            <View>
                <Text style={styles.streakNumber}>{personalStreak}</Text>
                <Text style={styles.streakLabel}>Perfect Day Streak</Text>
            </View>
        </View>

        {profile.is_admin && (
            <View style={styles.settingsCard}>
                <Text style={styles.sectionTitle}>Admin Settings</Text>
                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <SettingsIcon size={20} color="#6b7280" />
                        <View style={styles.settingText}>
                            <Text style={styles.settingLabel}>Restrict Late Logging</Text>
                            <Text style={styles.settingDesc}>Enforce 12-hour limit for all users</Text>
                        </View>
                    </View>
                    <Switch 
                        value={isLockingSwitchEnabled} 
                        onValueChange={handleToggleLocking} 
                        trackColor={{ false: '#f3f4f6', true: '#86efac' }} 
                        thumbColor={isLockingSwitchEnabled ? '#059669' : '#d1d5db'} 
                    />
                </View>
            </View>
        )}

        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Location for Prayer Times</Text>
          <View style={styles.locationSelector}>
            <TouchableOpacity style={[styles.locationButton, location.city === 'Cairo' && styles.locationButtonActive]} onPress={() => handleLocationChange('Cairo', 'Egypt')}><Text style={[styles.locationButtonText, location.city === 'Cairo' && styles.locationButtonTextActive]}>Cairo</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.locationButton, location.city === 'Munich' && styles.locationButtonActive]} onPress={() => handleLocationChange('Munich', 'Germany')}><Text style={[styles.locationButtonText, location.city === 'Munich' && styles.locationButtonTextActive]}>Munich</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.locationButton, location.city === 'Kuwait' && styles.locationButtonActive]} onPress={() => handleLocationChange('Kuwait', 'Kuwait')}><Text style={[styles.locationButtonText, location.city === 'Kuwait' && styles.locationButtonTextActive]}>Kuwait</Text></TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}><Shield size={20} color="#6b7280" /><View style={styles.settingText}><Text style={styles.settingLabel}>Private Profile</Text><Text style={styles.settingDesc}>Hide your prayer data from search</Text></View></View>
            <Switch value={isPrivate} onValueChange={isEditing ? setIsPrivate : (val) => { setIsPrivate(val); updateProfile({ is_private: val }); }} trackColor={{ false: '#f3f4f6', true: '#86efac' }} thumbColor={isPrivate ? '#059669' : '#d1d5db'} />
          </View>
        </View>

        <View style={styles.signOutSection}>
            <TouchableOpacity style={styles.signOutButton} onPress={() => setSignOutModalVisible(true)}>
                <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', },
  headerTitle: { fontSize: 24, fontFamily: 'Inter-Bold', color: '#1f2937', },
  editButton: { padding: 8 },
  content: { flex: 1, paddingHorizontal: 20, },
  loadingText: { textAlign: 'center', marginTop: 50, fontSize: 16, },
  profileCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 24, alignItems: 'center', marginTop: 20, marginBottom: 20, elevation: 4, },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center', marginBottom: 16, },
  editingContainer: { width: '100%', alignItems: 'center', },
  nameInput: { width: '100%', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 12, fontSize: 18, fontFamily: 'Inter-SemiBold', textAlign: 'center', color: '#1f2937', marginBottom: 12, },
  emailDisplay: { fontSize: 16, fontFamily: 'Inter-Regular', textAlign: 'center', color: '#6b7280', marginBottom: 16, },
  editActions: { flexDirection: 'row', gap: 12, },
  actionButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, gap: 6, },
  cancelButton: { backgroundColor: '#f3f4f6' },
  cancelButtonText: { color: '#6b7280' },
  saveButton: { backgroundColor: '#059669' },
  saveButtonText: { color: '#ffffff' },
  profileInfo: { alignItems: 'center' },
  nameContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  userName: { fontSize: 24, fontFamily: 'Inter-Bold', color: '#1f2937', },
  userEmail: { fontSize: 14, fontFamily: 'Inter-Regular', color: '#6b7280', },
  settingsCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginBottom: 16, elevation: 4, },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: '#1f2937', marginBottom: 16, },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, },
  settingInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12, },
  settingText: { flex: 1 },
  settingLabel: { fontSize: 16, fontFamily: 'Inter-Medium', color: '#1f2937', },
  settingDesc: { fontSize: 12, fontFamily: 'Inter-Regular', color: '#6b7280', },
  signOutSection: { marginTop: 20, marginBottom: 40, },
  signOutButton: { backgroundColor: '#fee2e2', paddingVertical: 14, borderRadius: 12, alignItems: 'center', },
  signOutButtonText: { color: '#dc2626', fontFamily: 'Inter-SemiBold', fontSize: 16, },
  locationSelector: { flexDirection: 'row', backgroundColor: '#f3f4f6', borderRadius: 12, padding: 4, },
  locationButton: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', },
  locationButtonActive: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2, },
  locationButtonText: { fontFamily: 'Inter-SemiBold', color: '#6b7280', },
  locationButtonTextActive: { color: '#059669', },
  streakCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff7ed', borderRadius: 16, padding: 20, marginBottom: 16, gap: 16, },
  streakIconContainer: { backgroundColor: '#fed7aa', padding: 12, borderRadius: 99 },
  streakNumber: { fontSize: 24, fontFamily: 'Inter-Bold', color: '#9a3412' },
  streakLabel: { fontSize: 14, fontFamily: 'Inter-Medium', color: '#c2410c' },
});

