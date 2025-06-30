
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
// import { Calendar as CalendarIcon, Sun, Moon } from 'lucide-react-native';
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { LinearGradient } from 'expo-linear-gradient';

// export default function PrayerTrackerScreen() {
//   const { displayedPrayers, loadPrayersForDate, updatePrayerStatus, loading } = usePrayer();
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

//   useEffect(() => {
//     loadPrayersForDate(selectedDate);
//   }, [selectedDate]);

//   const showDatePicker = () => setDatePickerVisibility(true);
//   const hideDatePicker = () => setDatePickerVisibility(false);

//   const handleConfirmDate = (date: Date) => {
//     setSelectedDate(date);
//     hideDatePicker();
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

//   const displayDate = selectedDate.toLocaleDateString('en-US', {
//     weekday: 'long',
//     month: 'long',
//     day: 'numeric',
//     year: 'numeric'
//   });

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Restored Gradient Header */}
//       <LinearGradient colors={['#059669', '#0d9488']} style={styles.header}>
//         <View style={styles.greetingContainer}>
//           {getGreetingIcon()}
//           <Text style={styles.greetingText}>{getGreeting()}</Text>
//         </View>
//         <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
//           <CalendarIcon size={20} color="#ffffff" />
//           <Text style={styles.headerDate}>{displayDate}</Text>
//         </TouchableOpacity>
//       </LinearGradient>

//       <DateTimePickerModal
//         isVisible={isDatePickerVisible}
//         mode="date"
//         onConfirm={handleConfirmDate}
//         onCancel={hideDatePicker}
//         date={selectedDate}
//       />
      
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
//         paddingHorizontal: 24,
//         paddingTop: 20,
//         paddingBottom: 24,
//         borderBottomLeftRadius: 24,
//         borderBottomRightRadius: 24,
//     },
//     greetingContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 10,
//         marginBottom: 12,
//     },
//     greetingText: {
//         fontSize: 24,
//         fontFamily: 'Inter-Bold',
//         color: '#ffffff',
//     },
//     datePickerButton: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: 8,
//       backgroundColor: 'rgba(255, 255, 255, 0.2)',
//       paddingHorizontal: 12,
//       paddingVertical: 8,
//       borderRadius: 99,
//       alignSelf: 'flex-start',
//     },
//     headerDate: {
//         fontSize: 16,
//         fontFamily: 'Inter-SemiBold',
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
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar
} from 'react-native';
import { usePrayer } from '@/contexts/PrayerContext';
import { PrayerCard } from '@/components/PrayerCard';
import { ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function PrayerTrackerScreen() {
  const { displayedPrayers, loadPrayersForDate, updatePrayerStatus, loading } = usePrayer();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (user) {
      loadPrayersForDate(selectedDate);
    }
  }, [selectedDate, user]);

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };
  
  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) return <Sun size={24} color="#f59e0b" />;
    return <Moon size={24} color="#6366f1" />;
  };

  const isToday = new Date().toDateString() === selectedDate.toDateString();
  const displayDate = isToday 
    ? 'Today' 
    : selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#059669', '#0d9488']} style={styles.header}>
        <View style={styles.greetingContainer}>
          {getGreetingIcon()}
          <Text style={styles.greetingText}>{getGreeting()}</Text>
        </View>
        <View style={styles.dateNavController}>
          <TouchableOpacity onPress={goToPreviousDay} style={styles.navButton}>
            <ChevronLeft size={28} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerDate}>{displayDate}</Text>
          <TouchableOpacity onPress={goToNextDay} style={styles.navButton} disabled={isToday}>
            <ChevronRight size={28} color={isToday ? '#ffffff50' : '#ffffff'} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#059669"/>
      ) : (
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Track Your Prayers</Text>
          {displayedPrayers.map(prayer => (
            <PrayerCard
              key={prayer.name}
              prayer={prayer}
              onStatusChange={(status) => updatePrayerStatus(prayer.name, status, selectedDate)}
            />
          ))}
        </ScrollView>
      )}
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
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    greetingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    greetingText: {
        fontSize: 24,
        fontFamily: 'Inter-Bold',
        color: '#ffffff',
    },
    dateNavController: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 99,
        paddingHorizontal: 8,
    },
    navButton: {
        padding: 8,
    },
    headerDate: {
        fontSize: 18,
        fontFamily: 'Inter-Bold',
        color: '#ffffff',
    },
    content: {
        padding: 16,
    },
    sectionTitle: {
      fontSize: 22,
      fontFamily: 'Inter-Bold',
      color: '#1f2937',
      marginBottom: 16,
      paddingHorizontal: 8,
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }
});