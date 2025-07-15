
import React, { useState, useEffect, useMemo } from 'react';
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
  Image,
  Modal,
} from 'react-native';
import { User as UserIcon, Edit3 as EditIcon, Shield, Save, X, Flame, Settings as SettingsIcon, Calendar as CalendarIcon, PauseCircle, PlayCircle, Camera, Sun, Moon } from 'lucide-react-native';
import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
import { useAuth } from '@/contexts/AuthContext';
import { ConfirmModal } from '@/components/ConfirmModal';
import { StreakBadge } from '@/components/StreakBadge';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/contexts/ThemeContext';

// Helper to format date to YYYY-MM-DD
const getYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// EXEMPTION PERIOD MODAL
// Now takes theme colors as props to style itself correctly
const ExemptionPeriodModal = ({ visible, onClose, onConfirm, colors, theme, initialDuration = 7 }) => {
  const [duration, setDuration] = useState(initialDuration);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    if (visible) {
      setDuration(initialDuration);
      setSelectedDate(null);
    }
  }, [visible, initialDuration]);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirmDate = (date: Date) => {
    setSelectedDate(date);
    setDuration(0);
    hideDatePicker();
  };

  const today = new Date();
  today.setHours(0,0,0,0);

  const confirmAction = () => {
    const startDateString = getYYYYMMDD(today);
    let endDateString: string | null = null;
    let finalDuration: number | null = null;

    if (selectedDate) {
      endDateString = getYYYYMMDD(selectedDate);
      const diffTime = Math.abs(selectedDate.getTime() - today.getTime());
      finalDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } else {
      finalDuration = duration;
      const calculatedEndDate = new Date(today.getTime() + duration * 24 * 60 * 60 * 1000);
      endDateString = getYYYYMMDD(calculatedEndDate);
    }

    onConfirm(startDateString, endDateString, finalDuration);
  };
  
  // Use a dynamic stylesheet for the modal
  const modalStyles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: { width: '100%', maxWidth: 400, backgroundColor: colors.card, borderRadius: 16, padding: 24, alignItems: 'center', elevation: 5 },
    modalTitle: { fontSize: 20, fontFamily: 'Inter-Bold', marginBottom: 12, textAlign: 'center', color: colors.text },
    modalMessage: { fontSize: 14, fontFamily: 'Inter-Regular', textAlign: 'center', color: colors.textSecondary, marginBottom: 20, lineHeight: 20 },
    durationButtons: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    durationButton: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, backgroundColor: colors.buttonDisabled },
    durationButtonActive: { backgroundColor: colors.primary },
    durationButtonText: { fontFamily: 'Inter-Medium', color: colors.textSecondary },
    durationButtonTextActive: { color: '#ffffff' },
    datePickerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 20 },
    datePickerButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
    datePickerButtonText: { fontFamily: 'Inter-Medium', color: colors.text },
    modalButtonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10 },
    modalButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginHorizontal: 8 },
    modalCancelButton: { backgroundColor: colors.buttonDisabled },
    modalCancelButtonText: { color: colors.textSecondary, fontFamily: 'Inter-SemiBold' },
    modalConfirmButton: { backgroundColor: colors.primary },
    modalConfirmButtonText: { color: '#ffffff', fontFamily: 'Inter-SemiBold' },
  });

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContent}>
          <Text style={modalStyles.modalTitle}>Start Exemption Period</Text>
          <Text style={modalStyles.modalMessage}>Choose how long you need your prayer tracking paused:</Text>
          <View style={modalStyles.durationButtons}>
            {[7, 10, 14].map(days => (
              <TouchableOpacity
                key={days}
                style={[modalStyles.durationButton, duration === days && !selectedDate && modalStyles.durationButtonActive]}
                onPress={() => { setDuration(days); setSelectedDate(null); }}
              >
                <Text style={[modalStyles.durationButtonText, duration === days && !selectedDate && modalStyles.durationButtonTextActive]}>{days} Days</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={modalStyles.datePickerContainer}>
            <TouchableOpacity onPress={showDatePicker} style={modalStyles.datePickerButton}>
              <CalendarIcon size={20} color={selectedDate ? colors.primary : colors.textSecondary} />
              <Text style={modalStyles.datePickerButtonText}>
                {selectedDate ? `Until: ${selectedDate.toLocaleDateString()}` : 'Or Pick an End Date'}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirmDate}
              onCancel={hideDatePicker}
              minimumDate={new Date()}
              date={selectedDate || new Date()}
              isDarkModeEnabled={theme === 'dark'}
            />
          </View>
          <View style={modalStyles.modalButtonRow}>
            <TouchableOpacity style={[modalStyles.modalButton, modalStyles.modalCancelButton]} onPress={onClose}>
              <Text style={modalStyles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[modalStyles.modalButton, modalStyles.modalConfirmButton]} onPress={confirmAction}>
              <Text style={modalStyles.modalConfirmButtonText}>Start Pause</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


export default function ProfileScreen() {
  const { theme, colors, toggleTheme } = useTheme();
  const { profile, updateProfile, loading: profileLoading, personalStreak, appSettings, updateAppSetting,
          currentExemption, isExemptedToday, startExemption, endExemption, loadCurrentExemption, updatePublicAvatar } = useSupabaseUser();
  const { signOut } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile?.name || '');
  const userEmail = profile?.email || 'Loading...';
  const [isPrivate, setIsPrivate] = useState(profile?.is_private || false);
  const [isSaving, setIsSaving] = useState(false);
  const [location, setLocation] = useState({ city: profile?.timezone_city || 'Cairo', country: profile?.timezone_country || 'Egypt' });
  const [selectedGender, setSelectedGender] = useState<string | undefined>(profile?.gender || undefined);

  const [isSignOutModalVisible, setSignOutModalVisible] = useState(false);
  const [isExemptionModalVisible, setExemptionModalVisible] = useState(false);

  const isLockingEnabled = appSettings.get('restrict_late_prayer_logging') ?? false;
  const [isLockingSwitchEnabled, setIsLockingSwitchEnabled] = useState(isLockingEnabled);

  useEffect(() => {
    if (profile) {
      setEditedName(profile.name || '');
      setIsPrivate(profile.is_private || false);
      setLocation({ city: profile.timezone_city || 'Cairo', country: profile.timezone_country || 'Egypt' });
      setSelectedGender(profile.gender || undefined);
    }
  }, [profile]);

  useEffect(() => {
    if (isExemptedToday && isExemptionModalVisible) {
        setExemptionModalVisible(false);
    }
  }, [isExemptedToday, isExemptionModalVisible]);

  useEffect(() => {
    setIsLockingSwitchEnabled(isLockingEnabled);
  }, [isLockingEnabled]);
  
  const handleUpdateAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to update your profile picture.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const { error } = await updatePublicAvatar(result.assets[0].uri);
      if (error) {
        Alert.alert('Upload Failed', error.message);
      } else {
        Alert.alert('Success', 'Your profile picture has been updated.');
      }
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      await updateProfile({
        name: editedName.trim(),
        is_private: isPrivate,
        timezone_city: location.city,
        timezone_country: location.country,
        gender: selectedGender,
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
    setSelectedGender(profile?.gender || undefined);
    setIsEditing(false);
  };

  const handleLocationChange = (city: string, country: string) => {
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

  const handleStartExemption = async (startDate: string, endDate: string | null, durationDays: number | null) => {
    try {
      await startExemption(startDate, endDate, durationDays, 'menses');
      let message = `Your prayer streak is now paused.`;
      if (endDate) {
        message += ` It will resume on ${new Date(endDate + 'T00:00:00').toLocaleDateString()}.`;
      } else if (durationDays) {
        message += ` It is paused for ${durationDays} days.`;
      }
      Alert.alert('Streak Paused', message);
      loadCurrentExemption();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to start exemption period.');
      setExemptionModalVisible(false);
    }
  };

  const handleEndExemption = async () => {
    if (!currentExemption) return;
    try {
      await endExemption(currentExemption.id);
      Alert.alert('Streak Resumed', 'Prayer tracking has been resumed. Remember to log your prayers!');
      loadCurrentExemption();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to end exemption period.');
    }
  };
  
  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20, backgroundColor: colors.background},
    headerTitle: { fontSize: 24, fontFamily: 'Inter-Bold', textAlign: 'center', color: colors.text },
    editButton: { padding: 8 },
    content: { flex: 1, paddingHorizontal: 20, },
    loadingText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: colors.text },
    profileCard: { backgroundColor: colors.card, borderRadius: 16, padding: 24, alignItems: 'center', marginTop: 20, marginBottom: 20 },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', marginBottom: 16, },
    cameraButton: { position: 'absolute', bottom: 12, right: -4, backgroundColor: colors.primary, padding: 6, borderRadius: 99, borderWidth: 2, borderColor: colors.card },
    editingContainer: { width: '100%', alignItems: 'center', },
    nameInput: { width: '100%', borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, fontSize: 18, fontFamily: 'Inter-SemiBold', textAlign: 'center', color: colors.text, marginBottom: 12, },
    emailDisplay: { fontSize: 16, fontFamily: 'Inter-Regular', textAlign: 'center', color: colors.textSecondary, marginBottom: 16 },
    editActions: { flexDirection: 'row', gap: 12 },
    actionButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, gap: 6 },
    cancelButton: { backgroundColor: colors.buttonDisabled },
    cancelButtonText: { color: colors.textSecondary, fontFamily: 'Inter-SemiBold' },
    saveButton: { backgroundColor: colors.primary },
    saveButtonText: { color: '#ffffff' },
    profileInfo: { alignItems: 'center' },
    nameContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
    userName: { fontSize: 24, fontFamily: 'Inter-Bold', color: colors.text },
    userEmail: { fontSize: 14, fontFamily: 'Inter-Regular', color: colors.textSecondary },
    genderDisplay: { fontSize: 14, fontFamily: 'Inter-Regular', color: colors.textSecondary, marginTop: 4 },
    settingsCard: { backgroundColor: colors.card, borderRadius: 16, padding: 20, marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: colors.text, marginBottom: 16 },
    settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
    settingInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
    settingText: { flex: 1 },
    settingLabel: { fontSize: 16, fontFamily: 'Inter-Medium', color: colors.text },
    settingDesc: { fontSize: 12, fontFamily: 'Inter-Regular', color: colors.textSecondary },
    signOutSection: { marginTop: 20, marginBottom: 40 },
    signOutButton: { backgroundColor: theme === 'dark' ? 'rgba(220, 38, 38, 0.15)' : '#fee2e2', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    signOutButtonText: { color: '#dc2626', fontFamily: 'Inter-SemiBold', fontSize: 16 },
    locationSelector: { flexDirection: 'row', backgroundColor: colors.background, borderRadius: 12, padding: 4 },
    locationButton: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    locationButtonActive: { backgroundColor: colors.card, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: theme === 'dark' ? 0.3 : 0.1, shadowRadius: 2, elevation: 2 },
    locationButtonText: { fontFamily: 'Inter-SemiBold', color: colors.textSecondary },
    locationButtonTextActive: { color: colors.primary },
    streakCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff7ed', borderRadius: 16, padding: 20, marginBottom: 16, gap: 16 },
    streakIconContainer: { backgroundColor: '#fed7aa', padding: 12, borderRadius: 99 },
    streakNumber: { fontSize: 24, fontFamily: 'Inter-Bold', color: '#9a3412' },
    streakLabel: { fontSize: 14, fontFamily: 'Inter-Medium', color: '#c2410c' },
    genderSelectorContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12, marginBottom: 16, width: '100%', justifyContent: 'center' },
    genderLabel: { fontSize: 16, fontFamily: 'Inter-Medium', color: colors.text, marginRight: 10 },
    genderButtons: { flexDirection: 'row', backgroundColor: colors.background, borderRadius: 12, padding: 4, flex: 1 },
    genderButton: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    genderButtonActive: { backgroundColor: colors.card, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: theme === 'dark' ? 0.3 : 0.1, shadowRadius: 2, elevation: 2 },
    genderButtonText: { fontFamily: 'Inter-SemiBold', color: colors.textSecondary },
    genderButtonTextActive: { color: colors.primary },
    startExemptionButton: { flexDirection: 'row', backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 8 },
    startExemptionButtonText: { color: '#ffffff', fontFamily: 'Inter-SemiBold', fontSize: 16 },
    exemptionActiveContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#4a2c0d', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#b45309', gap: 12 },
    exemptionTextContainer: { flex: 1 },
    exemptionStatusText: { fontSize: 16, fontFamily: 'Inter-Bold', color: '#f59e0b' },
    exemptionMessage: { fontSize: 13, fontFamily: 'Inter-Medium', color: '#fed7aa' },
    endExemptionButton: { backgroundColor: theme === 'dark' ? 'rgba(5, 150, 105, 0.2)' : '#ecfdf5', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: colors.primary },
    endExemptionButtonText: { color: colors.primary, fontFamily: 'Inter-SemiBold', fontSize: 14 },
  }), [colors, theme]);

  if (profileLoading && !profile) {
    return <SafeAreaView style={styles.container}><ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} /></SafeAreaView>;
  }
  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Could not load profile.</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={() => setSignOutModalVisible(true)}><Text style={styles.signOutButtonText}>Sign Out</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }

  const exemptionEndDateDisplay = currentExemption?.end_date 
    ? new Date(currentExemption.end_date + 'T00:00:00').toLocaleDateString() 
    : 'manually ended';

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
      <ExemptionPeriodModal
        visible={isExemptionModalVisible && profile.gender === 'female' && !isExemptedToday}
        onClose={() => setExemptionModalVisible(false)}
        onConfirm={handleStartExemption}
        colors={colors}
        theme={theme}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        {!isEditing && (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <EditIcon size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
            <View>
              {profile.avatar_url ? (
                <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
              ) : (
                <View style={styles.avatar}>
                  <UserIcon size={40} color={colors.textSecondary} />
                </View>
              )}
              <TouchableOpacity style={styles.cameraButton} onPress={handleUpdateAvatar}>
                <Camera size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
            
            {isEditing ? (
              <View style={styles.editingContainer}>
                <TextInput style={styles.nameInput} value={editedName} onChangeText={setEditedName} placeholder="Enter your name" />
                <Text style={styles.emailDisplay}>{userEmail}</Text>
                <View style={styles.genderSelectorContainer}>
                  <Text style={styles.genderLabel}>Gender:</Text>
                  <View style={styles.genderButtons}>
                    <TouchableOpacity
                      style={[styles.genderButton, selectedGender === 'male' && styles.genderButtonActive]}
                      onPress={() => setSelectedGender('male')}
                    >
                      <Text style={[styles.genderButtonText, selectedGender === 'male' && styles.genderButtonTextActive]}>Male</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.genderButton, selectedGender === 'female' && styles.genderButtonActive]}
                      onPress={() => setSelectedGender('female')}
                    >
                      <Text style={[styles.genderButtonText, selectedGender === 'female' && styles.genderButtonTextActive]}>Female</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.editActions}>
                  <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleCancel}><X size={16} color={colors.textSecondary} /><Text style={styles.cancelButtonText}>Cancel</Text></TouchableOpacity>
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
                    <StreakBadge streak={personalStreak} />
                </View>
                <Text style={styles.userEmail}>{userEmail}</Text>
                {profile.gender && (
                  <Text style={styles.genderDisplay}>Gender: {profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}</Text>
                )}
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
        
        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              {theme === 'dark' ? <Moon size={20} color={colors.textSecondary} /> : <Sun size={20} color={colors.textSecondary} />}
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Light Mode</Text>
              </View>
            </View>
            <Switch 
                value={theme === 'light'} 
                onValueChange={toggleTheme} 
                trackColor={{ false: '#333', true: '#86efac' }} 
                thumbColor={theme === 'light' ? colors.primary : '#f4f3f4'} 
            />
          </View>
        </View>

        {profile.gender === 'female' && (
          <View style={styles.settingsCard}>
            <Text style={styles.sectionTitle}>Streak Exemption</Text>
            {isExemptedToday ? (
              <View style={styles.exemptionActiveContainer}>
                <PauseCircle size={24} color="#f59e0b" />
                <View style={styles.exemptionTextContainer}>
                  <Text style={styles.exemptionStatusText}>Streak Paused!</Text>
                  <Text style={styles.exemptionMessage}>Your streak of {personalStreak} days is safe.</Text>
                  {currentExemption?.end_date && (
                    <Text style={styles.exemptionMessage}>Resumes: {exemptionEndDateDisplay}</Text>
                  )}
                </View>
                <TouchableOpacity style={styles.endExemptionButton} onPress={handleEndExemption}>
                  <PlayCircle size={20} color={colors.primary} />
                  <Text style={styles.endExemptionButtonText}>Resume Now</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.startExemptionButton} onPress={() => setExemptionModalVisible(true)}>
                <PauseCircle size={20} color="#ffffff" />
                <Text style={styles.startExemptionButtonText}>Start Exemption Period</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {profile.is_admin && (
            <View style={styles.settingsCard}>
                <Text style={styles.sectionTitle}>Admin Settings</Text>
                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <SettingsIcon size={20} color={colors.textSecondary} />
                        <View style={styles.settingText}>
                            <Text style={styles.settingLabel}>Restrict Late Logging</Text>
                            <Text style={styles.settingDesc}>Enforce 12-hour limit for all users</Text>
                        </View>
                    </View>
                    <Switch 
                        value={isLockingSwitchEnabled} 
                        onValueChange={handleToggleLocking} 
                        trackColor={{ false: '#333', true: '#86efac' }} 
                        thumbColor={isLockingSwitchEnabled ? colors.primary : '#f4f3f4'} 
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
            <View style={styles.settingInfo}><Shield size={20} color={colors.textSecondary} /><View style={styles.settingText}><Text style={styles.settingLabel}>Private Profile</Text><Text style={styles.settingDesc}>Hide your prayers progress</Text></View></View>
            <Switch value={isPrivate} onValueChange={isEditing ? setIsPrivate : (val) => { setIsPrivate(val); updateProfile({ is_private: val }); }} trackColor={{ false: '#333', true: '#86efac' }} thumbColor={isPrivate ? colors.primary : '#f4f3f4'} />
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