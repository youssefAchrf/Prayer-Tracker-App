import React, { useState, useEffect, useMemo } from 'react'; // Import useMemo
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Platform, StatusBar } from 'react-native';
// Add PauseCircle to imports
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Sun, Moon, User as UserIcon, PauseCircle } from 'lucide-react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { usePrayer } from '@/contexts/PrayerContext';
import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
import { PrayerCard } from '@/components/PrayerCard';

// Helper to get UTC date string for accurate comparison
const getUTCDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const getLocalYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function PrayerScreen() {
  const { displayedPrayers, updatePrayerStatus, loadPrayersForDate, loading: prayersLoading } = usePrayer();
  // Get currentExemption from the context
  const { profile, loading: userLoading, appSettings, currentExemption } = useSupabaseUser();
  
  const [viewingDate, setViewingDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const isLockingEnabled = appSettings.get('restrict_late_prayer_logging') ?? false;

  // NEW: Check if the currently viewed date is within the exemption period.
  const isViewingDateExempt = useMemo(() => {
    if (!currentExemption) return false;
    
    // Use the UTC helper for correct date-only comparison
    const checkDateString = getUTCDateString(viewingDate);
    const { start_date, end_date } = currentExemption;

    // Check if the viewing date is on or after the start, and on or before the end.
    // Handles open-ended exemptions where end_date is null.
    return checkDateString >= start_date && (end_date === null || checkDateString <= end_date);
  }, [viewingDate, currentExemption]);


  useEffect(() => {
    loadPrayersForDate(viewingDate);
  }, [viewingDate]);

  const goToPreviousDay = () => setViewingDate(d => new Date(d.setDate(d.getDate() - 1)));
  const goToNextDay = () => setViewingDate(d => new Date(d.setDate(d.getDate() + 1)));

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirmDate = (date: Date) => {
    setViewingDate(date);
    hideDatePicker();
  };

  const isToday = getLocalYYYYMMDD(viewingDate) === getLocalYYYYMMDD(new Date());
  const formattedDate = viewingDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const isLoading = prayersLoading || userLoading;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", icon: <Sun size={24} color="#f59e0b" /> };
    if (hour < 18) return { text: "Good Afternoon", icon: <Sun size={24} color="#f59e0b" /> };
    return { text: "Good Evening", icon: <Moon size={24} color="#4b5563" /> };
  };
  const greeting = getGreeting();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.greetingContainer}>
            {greeting.icon}
            <Text style={styles.greetingText}>{greeting.text},</Text>
          </View>
          <View style={styles.avatar}>
            <UserIcon size={24} color="#6b7280" />
          </View>
        </View>
        <Text style={styles.userName}>{profile?.name || 'User'}</Text>
      </View>

      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={goToPreviousDay} style={styles.arrowButton}><ArrowLeft size={20} color="#374151" /></TouchableOpacity>
        <TouchableOpacity onPress={showDatePicker} style={styles.dateDisplay}>
          <CalendarIcon size={20} color="#059669" />
          <Text style={styles.dateText}>{formattedDate}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNextDay} disabled={isToday} style={[styles.arrowButton, isToday && { opacity: 0.3 }]}><ArrowRight size={20} color="#374151" /></TouchableOpacity>
      </View>

      <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirmDate} onCancel={hideDatePicker} maximumDate={new Date()} />

      {isLoading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#059669" />
      ) : (
        <>
          {/* NEW: Display a banner if the day is exempt */}
          {isViewingDateExempt && (
            <View style={styles.exemptionBanner}>
              <PauseCircle size={18} color="#b45309" />
              <Text style={styles.exemptionBannerText}>Streak is paused for this day.</Text>
            </View>
          )}
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {displayedPrayers.map((prayer, index) => (
              <PrayerCard
                key={index}
                prayer={prayer}
                onStatusChange={(status) => updatePrayerStatus(prayer.name, status, viewingDate)}
                viewingDate={viewingDate}
                isLockingEnabled={isLockingEnabled}
                // NEW: Pass the exemption status to the card
                isExempted={isViewingDateExempt}
              />
            ))}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 16, 
    backgroundColor: '#ffffff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#e5e7eb' 
  },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 4 
  },
  greetingContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  greetingText: { 
    fontSize: 22, 
    fontFamily: 'Inter-Regular', 
    color: '#374151' 
  },
  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#f3f4f6', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  userName: { 
    fontSize: 22, 
    fontFamily: 'Inter-Bold', 
    color: '#1f2937' 
  },
  dateSelector: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    width: '100%', 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 8
  },
  arrowButton: { padding: 8, },
  dateDisplay: { flexDirection: 'row', alignItems: 'center', gap: 8, },
  dateText: { color: '#1f2937', fontSize: 16, fontFamily: 'Inter-SemiBold', },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 16 },
  // NEW: Styles for the exemption banner
  exemptionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fffbeb',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  exemptionBannerText: {
    fontFamily: 'Inter-Medium',
    color: '#b45309',
    fontSize: 14,
  },
});