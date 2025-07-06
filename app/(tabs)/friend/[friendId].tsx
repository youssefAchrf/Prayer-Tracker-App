import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon } from 'lucide-react-native'; // Removed Sun, Moon, UserIcon imports as no longer needed for header design
import { PrayerCard } from '@/components/PrayerCard';
import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
import { Prayer } from '@/types/prayer';
import { supabase } from '@/lib/supabase';

// This now correctly has all 5 prayers, without hardcoded times
const DEFAULT_PRAYERS: Omit<Prayer, 'time'>[] = [
    { name: 'Fajr', arabicName: 'الفجر' },
    { name: 'Dhuhr', arabicName: 'الظهر' },
    { name: 'Asr', arabicName: 'العصر' },
    { name: 'Maghrib', arabicName: 'المغرب' },
    { name: 'Isha', arabicName: 'العشاء' },
];

const getLocalYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const fetchPrayerTimes = async (date: Date) => {
    const dateString = getLocalYYYYMMDD(date);
    const city = 'Cairo'; 
    const country = 'Egypt'; 
    try {
      const response = await fetch(`https://api.aladhan.com/v1/timingsByCity/${dateString}?city=${city}&country=${country}&method=5`);
      const data = await response.json();
      if (data.code === 200) return data.data.timings;
    } catch (error) {
      console.error("Failed to fetch prayer times:", error);
    }
    return null;
  };

const formatTo12Hour = (time24: string): string => {
    if (!time24) return '--:--';
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
};

export default function FriendPrayerDetailScreen() {
  const { friendId } = useLocalSearchParams<{ friendId: string }>();
  const { friends } = useSupabaseUser();
  
  const [friendPrayers, setFriendPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayedDate, setDisplayedDate] = useState(new Date()); 

  const friendship = friends.find(f => f.requester.id === friendId || f.addressee.id === friendId);
  const friendProfile = friendship 
    ? (friendship.requester.id === friendId ? friendship.requester : friendship.addressee) 
    : null;

  useEffect(() => {
    if (!friendId) return;

    const loadDataForDate = async () => {
      setLoading(true);
      const dateString = getLocalYYYYMMDD(displayedDate); 
      
      const [times, statusesResponse] = await Promise.all([
        fetchPrayerTimes(displayedDate), 
        supabase.from('prayers').select('prayer_name, status').eq('user_id', friendId).eq('prayer_date', dateString)
      ]);
      console.log(`[Friend Detail Page] Raw prayer data for ${friendId} on ${dateString}:`, statusesResponse.data);
      const { data: prayerStatuses } = statusesResponse;
      const updatedPrayers = DEFAULT_PRAYERS.map(dp => ({
        ...dp,
        time: times ? formatTo12Hour(times[dp.name]) : '--:--',
        status: prayerStatuses?.find(p => p.prayer_name === dp.name)?.status || null,
      }));

      setFriendPrayers(updatedPrayers);
      setLoading(false);
    };

    loadDataForDate();
  }, [friendId, displayedDate]); 

  // Date navigation functions
  const goToPreviousDay = () => {
    setDisplayedDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const goToNextDay = () => {
    setDisplayedDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  // Check if displayedDate is today to disable "Next Day" button
  const isToday = getLocalYYYYMMDD(displayedDate) === getLocalYYYYMMDD(new Date());

  const formattedDisplayedDate = displayedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  if (!friendProfile) return <View style={styles.container}><Text>Friend not found.</Text></View>

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#059669', '#0d9488']} style={styles.header}>
        {/* Back button, positioned absolutely to the top-left */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>

        {/* Friend's Name Title - Centered below back button */}
        <Text style={styles.friendNameTitle}>{friendProfile.name}'s Prayers</Text>
        
        {/* Date Navigation UI - Centered below the title */}
        <View style={styles.dateNavigationContainer}>
          <TouchableOpacity onPress={goToPreviousDay} style={styles.dateArrowButton}>
            <ArrowLeft size={20} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.dateText}>{formattedDisplayedDate}</Text>
          <TouchableOpacity onPress={goToNextDay} disabled={isToday} style={[styles.dateArrowButton, isToday && styles.disabledArrowButton]}>
            <ArrowRight size={20} color={isToday ? '#ffffff80' : '#ffffff'} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {loading ? (
        <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" />
      ) : (
      <ScrollView style={styles.content}>
        {friendPrayers.map((prayer, index) => (
          <PrayerCard key={index} prayer={prayer} onStatusChange={() => {}} readOnly={true}/>
        ))}
      </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, },
    header: { 
      padding: 20, 
      paddingTop: 40, 
      alignItems: 'center', 
      minHeight: 160, // Adjusted minHeight to give space for content
      justifyContent: 'space-between', // Distribute content vertically
      borderBottomLeftRadius: 24, // Added for curvature
      borderBottomRightRadius: 24, // Added for curvature
    }, 
    
    backButton: { 
      position: 'absolute', 
      top: 40, 
      left: 20, 
      zIndex: 1, 
      padding: 8 
    },
    
    friendNameTitle: { 
      color: '#fff', 
      fontSize: 24, 
      fontFamily: 'Inter-Bold',
      textAlign: 'center',
      marginBottom: 16, // Space below title
    },
    
    dateNavigationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12, 
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 99,
    },
    dateArrowButton: {
        padding: 4, 
    },
    disabledArrowButton: {
        opacity: 0.5, 
    },
    dateText: { 
        color: '#fff', 
        fontSize: 16, 
        fontFamily: 'Inter-Medium',
        minWidth: 150, 
        textAlign: 'center',
    },
    
    content: { padding: 16 },
});