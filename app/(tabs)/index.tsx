
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Platform,
//   StatusBar
// } from 'react-native';
// import { usePrayer } from '@/contexts/PrayerContext';
// import { PrayerCard } from '@/components/PrayerCard';
// import { ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react-native';
// import { useAuth } from '@/contexts/AuthContext';
// import { LinearGradient } from 'expo-linear-gradient';
// //import { useSupabaseUser } from '@/contexts/SupabaseUserContext';

// export default function PrayerTrackerScreen() {
//   const { displayedPrayers, loadPrayersForDate, updatePrayerStatus, loading } = usePrayer();
//   const { user } = useAuth();
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   //const { isPrayerLockingEnabled } = useSupabaseUser();

//   useEffect(() => {
//     if (user) {
//       loadPrayersForDate(selectedDate);
//     }
//   }, [selectedDate, user]);

//   const goToPreviousDay = () => {
//     const newDate = new Date(selectedDate);
//     newDate.setDate(selectedDate.getDate() - 1);
//     setSelectedDate(newDate);
//   };

//   const goToNextDay = () => {
//     const today = new Date();
//     today.setHours(0,0,0,0); // Normalize today's date
//     const currentDate = new Date(selectedDate);
//     currentDate.setHours(0,0,0,0); // Normalize selected date

//     // Prevent going into the future
//     if (currentDate < today) {
//         const newDate = new Date(selectedDate);
//         newDate.setDate(selectedDate.getDate() + 1);
//         //setSelectedDate(newDate);
//     }
//   };

//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return 'Good morning';
//     if (hour < 17) return 'Good afternoon';
//     return 'Good evening';
//   };
  
//   const getGreetingIcon = () => {
//     const hour = new Date().getHours();
//     if (hour >= 6 && hour < 18) return <Sun size={24} color="#f59e0b" />;
//     return <Moon size={24} color="#6366f1" />;
//   };

//   const isToday = new Date().toDateString() === selectedDate.toDateString();
//   const displayDate = isToday 
//     ? 'Today' 
//     : selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

//   return (
//     <SafeAreaView style={styles.container}>
//       <LinearGradient colors={['#059669', '#0d9488']} style={styles.header}>
//         <View style={styles.greetingContainer}>
//           {getGreetingIcon()}
//           <Text style={styles.greetingText}>{getGreeting()}</Text>
//         </View>
//         <View style={styles.dateNavController}>
//           <TouchableOpacity onPress={goToPreviousDay} style={styles.navButton}>
//             <ChevronLeft size={28} color="#ffffff" />
//           </TouchableOpacity>
//           <Text style={styles.headerDate}>{displayDate}</Text>
//           <TouchableOpacity onPress={goToNextDay} style={styles.navButton} disabled={isToday}>
//             <ChevronRight size={28} color={isToday ? '#ffffff50' : '#ffffff'} />
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>
      
//       {loading ? (
//         <ActivityIndicator style={styles.loader} size="large" color="#059669"/>
//       ) : (
//         <ScrollView style={styles.content}>
//           <Text style={styles.sectionTitle}>Track Your Prayers</Text>
//           {displayedPrayers.map(prayer => (
//             <PrayerCard
//               key={prayer.name}
//               prayer={prayer}
//               onStatusChange={(status) => updatePrayerStatus(prayer.name, status, selectedDate)}
//               viewingDate={selectedDate} // Pass the date to the card
//               //isLockingEnabled={isPrayerLockingEnabled}

//             />
//           ))}
//         </ScrollView>
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f9fafb',
//         paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
//     },
//     header: {
//         paddingHorizontal: 20,
//         paddingTop: 20,
//         paddingBottom: 20,
//         borderBottomLeftRadius: 24,
//         borderBottomRightRadius: 24,
//     },
//     greetingContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 10,
//         marginBottom: 16,
//     },
//     greetingText: {
//         fontSize: 24,
//         fontFamily: 'Inter-Bold',
//         color: '#ffffff',
//     },
//     dateNavController: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         backgroundColor: 'rgba(255, 255, 255, 0.2)',
//         borderRadius: 99,
//         paddingHorizontal: 8,
//     },
//     navButton: {
//         padding: 8,
//     },
//     headerDate: {
//         fontSize: 18,
//         fontFamily: 'Inter-Bold',
//         color: '#ffffff',
//     },
//     content: {
//         padding: 16,
//     },
//     sectionTitle: {
//       fontSize: 22,
//       fontFamily: 'Inter-Bold',
//       color: '#1f2937',
//       marginBottom: 16,
//       paddingHorizontal: 8,
//     },
//     loader: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//     }
// });
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Sun, Moon, User as UserIcon } from 'lucide-react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { usePrayer } from '@/contexts/PrayerContext';
import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
import { PrayerCard } from '@/components/PrayerCard';
import { Prayer } from '@/types/prayer';

const getLocalYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function PrayerScreen() {
  const { displayedPrayers, updatePrayerStatus, loadPrayersForDate, loading: prayersLoading } = usePrayer();
  const { profile, loading: userLoading, appSettings } = useSupabaseUser();
  
  const [viewingDate, setViewingDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const isLockingEnabled = appSettings.get('restrict_late_prayer_logging') ?? false;

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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {displayedPrayers.map((prayer, index) => (
            <PrayerCard
              key={index}
              prayer={prayer}
              onStatusChange={(status) => updatePrayerStatus(prayer.name, status, viewingDate)}
              viewingDate={viewingDate}
              isLockingEnabled={isLockingEnabled}
            />
          ))}
        </ScrollView>
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
});
