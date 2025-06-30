// // import React, { useState, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ScrollView,
// //   SafeAreaView,
// //   TouchableOpacity,
// //   Platform,
// //   StatusBar,
// //   ActivityIndicator,
// // } from 'react-native';
// // import { useLocalSearchParams, router } from 'expo-router';
// // import { LinearGradient } from 'expo-linear-gradient';
// // import { ArrowLeft, Calendar, Moon, Sun, User as UserIcon } from 'lucide-react-native';
// // import { PrayerCard } from '@/components/PrayerCard';
// // import { ProgressCircle } from '@/components/ProgressCircle';
// // import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
// // import { Prayer } from '@/types/prayer';
// // import { supabase } from '@/lib/supabase';

// // const DEFAULT_PRAYERS: Prayer[] = [
// //   { name: 'Fajr', arabicName: 'الفجر', time: '05:30' },
// //   { name: 'Dhuhr', arabicName: 'الظهر', time: '12:30' },
// //   { name: 'Asr', arabicName: 'العصر', time: '15:45' },
// //   { name: 'Maghrib', arabicName: 'المغرب', time: '18:15' },
// //   { name: 'Isha', arabicName: 'العشاء', time: '19:45' },
// // ];

// // export default function FriendPrayerDetailScreen() {
// //   const { friendId } = useLocalSearchParams<{ friendId: string }>();
// //   const { friends } = useSupabaseUser();
  
// //   const [friendPrayers, setFriendPrayers] = useState<Prayer[]>(DEFAULT_PRAYERS);
// //   const [loading, setLoading] = useState(true);

// //   const friendship = friends.find(f => f.requester.id === friendId || f.addressee.id === friendId);
// //   const friendProfile = friendship 
// //     ? (friendship.requester.id === friendId ? friendship.requester : friendship.addressee) 
// //     : null;

// //   useEffect(() => {
// //     if (!friendId) {
// //       setLoading(false);
// //       return;
// //     }

// //     // --- THIS IS THE CORRECTED DATE LOGIC ---
// //     // It builds the date string from your phone's local timezone.
// //     const getLocalYYYYMMDD = (date) => {
// //       const year = date.getFullYear();
// //       const month = String(date.getMonth() + 1).padStart(2, '0');
// //       const day = String(date.getDate()).padStart(2, '0');
// //       return `${year}-${month}-${day}`;
// //     };
// //     const today = getLocalYYYYMMDD(new Date());
// //     // --- END OF DATE FIX ---

// //     const fetchInitialData = async () => {
// //       setLoading(true);
// //       const { data, error } = await supabase
// //         .from('prayers')
// //         .select('prayer_name, status')
// //         .eq('user_id', friendId)
// //         .eq('prayer_date', today);

// //       if (error) {
// //         console.error("Error fetching friend's prayer data:", error);
// //       } else if (data) {
// //         const updatedPrayers = DEFAULT_PRAYERS.map(defaultPrayer => {
// //           const fetchedPrayer = data.find(p => p.prayer_name === defaultPrayer.name);
// //           return { ...defaultPrayer, status: fetchedPrayer?.status };
// //         });
// //         setFriendPrayers(updatedPrayers);
// //       }
// //       setLoading(false);
// //     };

// //     fetchInitialData();

// //     const channel = supabase
// //       .channel(`friend-prayers-${friendId}`)
// //       .on('postgres_changes', { event: '*', schema: 'public', table: 'prayers', filter: `user_id=eq.${friendId}` },
// //         () => fetchInitialData()
// //       )
// //       .subscribe();

// //     return () => {
// //       supabase.removeChannel(channel);
// //     };
// //   }, [friendId]);

// //   // The rest of your UI code...
// //   const getGreeting = () => {
// //     const hour = new Date().getHours();
// //     if (hour < 12) return 'Good morning';
// //     if (hour < 17) return 'Good afternoon';
// //     return 'Good evening';
// //   };
  
// //   const getGreetingIcon = () => {
// //     const hour = new Date().getHours();
// //     if (hour >= 6 && hour < 18) return <Sun size={20} color="#f59e0b" />;
// //     return <Moon size={20} color="#6366f1" />;
// //   };

// //   const getTodayStats = () => {
// //     const completed = friendPrayers.filter(p => p.status && p.status !== 'missed').length;
// //     const jamaah = friendPrayers.filter(p => p.status === 'jamaah').length;
// //     const onTime = friendPrayers.filter(p => p.status === 'jamaah' || p.status === 'alone').length;
    
// //     return {
// //       completed: (completed / 5) * 100,
// //       jamaah: (jamaah / 5) * 100,
// //       onTime: (onTime / 5) * 100,
// //     };
// //   };

// //   const formatDate = () => {
// //     return new Date().toLocaleDateString('en-US', {
// //       weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
// //     });
// //   };

// //   if (loading) {
// //     return <ActivityIndicator style={{ flex: 1 }} size="large" color="#059669" />;
// //   }

// //   if (!friendProfile) {
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <Text>Friend not found.</Text>
// //       </SafeAreaView>
// //     );
// //   }

// //   const stats = getTodayStats();

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <LinearGradient colors={['#059669', '#0d9488']} style={styles.header}>
// //         <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
// //           <ArrowLeft size={24} color="#ffffff" />
// //         </TouchableOpacity>
// //         <View style={styles.headerContent}>
// //           <View style={styles.friendInfo}>
// //             <View style={styles.avatar}><UserIcon size={24} color="#6b7280" /></View>
// //             <View>
// //               <Text style={styles.friendName}>{friendProfile.name}</Text>
// //               <View style={styles.greetingContainer}>
// //                 {getGreetingIcon()}
// //                 <Text style={styles.greeting}>{getGreeting()}</Text>
// //               </View>
// //             </View>
// //           </View>
// //           <View style={styles.dateContainer}>
// //             <Calendar size={16} color="#ffffff" />
// //             <Text style={styles.date}>{formatDate()}</Text>
// //           </View>
// //         </View>
// //       </LinearGradient>

// //       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
// //         <View style={styles.statsContainer}>
// //           <Text style={styles.sectionTitle}>{friendProfile.name}'s Progress Today</Text>
// //           <View style={styles.progressRow}>
// //             <ProgressCircle
// //               percentage={stats.completed}
// //               size={80} strokeWidth={6} color="#059669" label="Completed"
// //               value={`${friendPrayers.filter(p => p.status && p.status !== 'missed').length}/5`}
// //             />
// //             <ProgressCircle
// //               percentage={stats.jamaah}
// //               size={80} strokeWidth={6} color="#0d9488" label="Jamaa'ah"
// //               value={`${friendPrayers.filter(p => p.status === 'jamaah').length}/5`}
// //             />
// //             <ProgressCircle
// //               percentage={stats.onTime}
// //               size={80} strokeWidth={6} color="#f59e0b" label="On Time"
// //               value={`${friendPrayers.filter(p => p.status === 'jamaah' || p.status === 'alone').length}/5`}
// //             />
// //           </View>
// //         </View>

// //         <View style={styles.prayersContainer}>
// //           <Text style={styles.sectionTitle}>Today's Prayers</Text>
// //           {friendPrayers.map((prayer, index) => (
// //             <View key={`${prayer.name}-${index}`} style={styles.prayerCardWrapper}>
// //               <PrayerCard
// //                 prayer={prayer}
// //                 onStatusChange={() => {}} // Read-only
// //                 readOnly={true}
// //               />
// //             </View>
// //           ))}
// //         </View>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: '#f9fafb',
// //         paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
// //       },
// //       header: {
// //         paddingHorizontal: 20,
// //         paddingVertical: 24,
// //         borderBottomLeftRadius: 24,
// //         borderBottomRightRadius: 24,
// //       },
// //       backButton: {
// //         width: 40,
// //         height: 40,
// //         borderRadius: 20,
// //         backgroundColor: 'rgba(255, 255, 255, 0.2)',
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         marginBottom: 16,
// //       },
// //       headerContent: { gap: 8 },
// //       friendInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
// //       avatar: {
// //         width: 48,
// //         height: 48,
// //         borderRadius: 24,
// //         backgroundColor: 'rgba(255, 255, 255, 0.2)',
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //       },
// //       friendName: { fontSize: 24, fontFamily: 'Inter-Bold', color: '#ffffff', marginBottom: 4 },
// //       greetingContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
// //       greeting: { fontSize: 16, fontFamily: 'Inter-Medium', color: '#ffffff', opacity: 0.9 },
// //       dateContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
// //       date: { fontSize: 14, fontFamily: 'Inter-Medium', color: '#ffffff', opacity: 0.9 },
// //       content: { flex: 1, paddingHorizontal: 20 },
// //       statsContainer: { marginTop: 24, marginBottom: 32 },
// //       sectionTitle: { fontSize: 20, fontFamily: 'Inter-Bold', color: '#1f2937', marginBottom: 16 },
// //       progressRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16 },
// //       prayersContainer: { marginBottom: 32 },
// //       prayerCardWrapper: { opacity: 0.9 },
// // });
// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Platform, StatusBar, ActivityIndicator } from 'react-native';
// import { useLocalSearchParams, router } from 'expo-router';
// import { LinearGradient } from 'expo-linear-gradient';
// import { ArrowLeft, Calendar as CalendarIcon, Moon, Sun, User as UserIcon } from 'lucide-react-native';
// import { PrayerCard } from '@/components/PrayerCard';
// import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
// import { Prayer } from '@/types/prayer';
// import { supabase } from '@/lib/supabase';
// import DateTimePickerModal from "react-native-modal-datetime-picker";

// const DEFAULT_PRAYERS: Prayer[] = [
//     { name: 'Fajr', arabicName: 'الفجر', time: '05:30' },
//     // ... other prayers
// ];

// const getLocalYYYYMMDD = (date: Date): string => {
//     // ... (This function remains the simple version)
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
// };

// export default function FriendPrayerDetailScreen() {
//   const { friendId } = useLocalSearchParams<{ friendId: string }>();
//   const { friends } = useSupabaseUser();
  
//   const [friendPrayers, setFriendPrayers] = useState<Prayer[]>(DEFAULT_PRAYERS);
//   const [loading, setLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

//   const friendship = friends.find(f => f.requester.id === friendId || f.addressee.id === friendId);
//   const friendProfile = friendship 
//     ? (friendship.requester.id === friendId ? friendship.requester : friendship.addressee) 
//     : null;

//   useEffect(() => {
//     if (!friendId) return;

//     const fetchInitialData = async () => {
//       setLoading(true);
//       const dateString = getLocalYYYYMMDD(selectedDate);
//       const { data, error } = await supabase
//         .from('prayers')
//         .select('prayer_name, status')
//         .eq('user_id', friendId)
//         .eq('prayer_date', dateString);
      
//       if (data) {
//         const updatedPrayers = DEFAULT_PRAYERS.map(dp => ({
//           ...dp,
//           status: data.find(p => p.prayer_name === dp.name)?.status || null
//         }));
//         setFriendPrayers(updatedPrayers);
//       }
//       setLoading(false);
//     };

//     fetchInitialData();
//   }, [friendId, selectedDate]); // Re-fetch when friendId or selectedDate changes

//   const showDatePicker = () => setDatePickerVisibility(true);
//   const hideDatePicker = () => setDatePickerVisibility(false);

//   const handleConfirmDate = (date: Date) => {
//     setSelectedDate(date);
//     hideDatePicker();
//   };

//   const displayDate = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

//   if (loading) {
//     return <ActivityIndicator style={{ flex: 1 }} size="large" />;
//   }

//   if (!friendProfile) {
//     return <Text>Friend not found.</Text>;
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <LinearGradient colors={['#059669', '#0d9488']} style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//           <ArrowLeft size={24} color="#ffffff" />
//         </TouchableOpacity>
//         <View style={styles.friendInfo}>
//           <UserIcon size={24} color="#fff" />
//           <Text style={styles.friendName}>{friendProfile.name}</Text>
//         </View>
//         <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
//             <CalendarIcon size={16} color="#ffffff" />
//             <Text style={styles.date}>{displayDate}</Text>
//         </TouchableOpacity>
//       </LinearGradient>

//       <DateTimePickerModal
//         isVisible={isDatePickerVisible}
//         mode="date"
//         onConfirm={handleConfirmDate}
//         onCancel={hideDatePicker}
//         date={selectedDate}
//       />
      
//       <ScrollView style={styles.content}>
//         <Text style={styles.sectionTitle}>{friendProfile.name}'s Prayers</Text>
//         {friendPrayers.map((prayer, index) => (
//           <PrayerCard
//             key={index}
//             prayer={prayer}
//             onStatusChange={() => {}}
//             readOnly={true}
//           />
//         ))}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//     // Add your full styles object here
//     container: { flex: 1, backgroundColor: '#f9fafb' },
//     header: { padding: 20, paddingTop: 50, },
//     backButton: { position: 'absolute', top: 50, left: 20, zIndex: 1 },
//     friendInfo: { alignItems: 'center', marginBottom: 10 },
//     friendName: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
//     datePickerButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 },
//     date: { color: '#fff', fontSize: 16 },
//     content: { padding: 20 },
//     sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 }
// });
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react-native';
import { PrayerCard } from '@/components/PrayerCard';
import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
import { Prayer } from '@/types/prayer';
import { supabase } from '@/lib/supabase';
import DateTimePickerModal from "react-native-modal-datetime-picker";

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

// We add the time fetching logic here as well
const fetchPrayerTimes = async (date: Date) => {
    const dateString = getLocalYYYYMMDD(date);
    try {
      const response = await fetch(`https://api.aladhan.com/v1/timingsByCity/${dateString}?city=Cairo&country=Egypt&method=5`);
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const friendship = friends.find(f => f.requester.id === friendId || f.addressee.id === friendId);
  const friendProfile = friendship 
    ? (friendship.requester.id === friendId ? friendship.requester : friendship.addressee) 
    : null;

  useEffect(() => {
    if (!friendId) return;

    const loadDataForDate = async () => {
      setLoading(true);
      const dateString = getLocalYYYYMMDD(selectedDate);
      
      // 1. Fetch times and statuses concurrently
      const [times, statusesResponse] = await Promise.all([
        fetchPrayerTimes(selectedDate),
        supabase.from('prayers').select('prayer_name, status').eq('user_id', friendId).eq('prayer_date', dateString)
      ]);

      // 2. Combine the data
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
  }, [friendId, selectedDate]);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirmDate = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const displayDate = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  if (!friendProfile) return <View style={styles.container}><Text>Friend not found.</Text></View>

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#059669', '#0d9488']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.friendName}>{friendProfile.name}'s Prayers</Text>
        <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
            <CalendarIcon size={16} color="#ffffff" />
            <Text style={styles.date}>{displayDate}</Text>
        </TouchableOpacity>
      </LinearGradient>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        date={selectedDate}
      />
      
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
    header: { padding: 20, paddingTop: 40, alignItems: 'center' },
    backButton: { position: 'absolute', top: 40, left: 20, zIndex: 1, padding: 8 },
    friendName: { color: '#fff', fontSize: 24, fontFamily: 'Inter-Bold' },
    datePickerButton: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 99 },
    date: { color: '#fff', fontSize: 16, fontFamily: 'Inter-Medium' },
    content: { padding: 16 },
});