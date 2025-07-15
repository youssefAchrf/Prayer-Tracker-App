import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Platform, StatusBar, Image } from 'react-native';
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Sun, Moon, User as UserIcon, PauseCircle } from 'lucide-react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { usePrayer } from '@/contexts/PrayerContext';
import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
import { PrayerCard } from '@/components/PrayerCard';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme, colors } = useTheme();
  const { displayedPrayers, updatePrayerStatus, loadPrayersForDate, loading: prayersLoading } = usePrayer();
  const { profile, loading: userLoading, appSettings, currentExemption } = useSupabaseUser();
  
  const [viewingDate, setViewingDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const isLockingEnabled = appSettings.get('restrict_late_prayer_logging') ?? false;

  const isViewingDateExempt = useMemo(() => {
    if (!currentExemption) return false;
    const checkDateString = getUTCDateString(viewingDate);
    const { start_date, end_date } = currentExemption;
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
    return { text: "Good Evening", icon: <Moon size={24} color={colors.textSecondary} /> };
  };
  const greeting = getGreeting();

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, backgroundColor: colors.background, borderBottomColor: colors.border },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    greetingContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    greetingText: { fontSize: 22, fontFamily: 'Inter-Regular', color: colors.text },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    avatarImage: { width: '100%', height: '100%' },
    userName: { fontSize: 22, fontFamily: 'Inter-Bold', color: colors.text },
    dateSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingVertical: 12, paddingHorizontal: 20, backgroundColor: colors.background, borderBottomColor: colors.border, marginBottom: 8 },
    arrowButton: { padding: 8 },
    dateDisplay: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    dateText: { color: colors.text, fontSize: 16, fontFamily: 'Inter-SemiBold' },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 16 },
    exemptionBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: theme === 'dark' ? '#4a2c0d' : '#fffbeb', paddingVertical: 10, paddingHorizontal: 16, marginHorizontal: 16, marginBottom: 8, borderRadius: 12, borderWidth: 1, borderColor: '#b45309' },
    exemptionBannerText: { fontFamily: 'Inter-Medium', color: '#fcd34d', fontSize: 14 },
  }), [colors, theme]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.greetingContainer}>
            {greeting.icon}
            <Text style={styles.greetingText}>{greeting.text},</Text>
          </View>
          <View style={styles.avatar}>
            {profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
            ) : (
              <UserIcon size={24} color={colors.textSecondary} />
            )}
          </View>
        </View>
        <Text style={styles.userName}>{profile?.name || 'User'}</Text>
      </View>

      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={goToPreviousDay} style={styles.arrowButton}><ArrowLeft size={20} color={colors.text} /></TouchableOpacity>
        <TouchableOpacity onPress={showDatePicker} style={styles.dateDisplay}>
          <CalendarIcon size={20} color={colors.primary} />
          <Text style={styles.dateText}>{formattedDate}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNextDay} disabled={isToday} style={[styles.arrowButton, isToday && { opacity: 0.3 }]}><ArrowRight size={20} color={colors.text} /></TouchableOpacity>
      </View>

      <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirmDate} onCancel={hideDatePicker} maximumDate={new Date()} isDarkModeEnabled={theme === 'dark'} />

      {isLoading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} />
      ) : (
        <>
          {isViewingDateExempt && (
            <View style={styles.exemptionBanner}>
              <PauseCircle size={18} color="#fcd34d" />
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
                isExempted={isViewingDateExempt}
              />
            ))}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}