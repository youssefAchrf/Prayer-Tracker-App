// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
// import { usePrayer } from '@/contexts/PrayerContext';
// import { MonthlyStats } from '@/types/prayer';
// import { ChevronLeft, ChevronRight } from 'lucide-react-native';
// // For the progress ring, you might need a library like 'react-native-progress'
// // For now, we will simulate it with a simple view.

// export default function StatisticsScreen() {
//   const { getMonthlyStats } = usePrayer();
//   const [stats, setStats] = useState<MonthlyStats | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [currentDate, setCurrentDate] = useState(new Date());

//   useEffect(() => {
//     const loadStats = async () => {
//       setLoading(true);
//       const year = currentDate.getFullYear();
//       const month = currentDate.getMonth();
//       const fetchedStats = await getMonthlyStats(year, month);
//       setStats(fetchedStats);
//       setLoading(false);
//     };

//     loadStats();
//   }, [currentDate]);

//   const changeMonth = (amount: number) => {
//     setCurrentDate(prev => {
//       const newDate = new Date(prev);
//       newDate.setMonth(prev.getMonth() + amount);
//       return newDate;
//     });
//   };

//   const monthName = currentDate.toLocaleString('default', { month: 'long' });
//   const yearName = currentDate.getFullYear();
//   const completionPercentage = stats && stats.totalPrayers > 0 ? (stats.onTime + stats.late) / stats.totalPrayers : 0;

//   if (loading) {
//     return <ActivityIndicator style={styles.container} size="large" />;
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navButton}>
//             <ChevronLeft size={24} color="#fff" />
//           </TouchableOpacity>
//           <View>
//             <Text style={styles.headerTitle}>Monthly Progress</Text>
//             <Text style={styles.headerSubtitle}>{monthName} {yearName}</Text>
//           </View>
//           <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navButton}>
//             <ChevronRight size={24} color="#fff" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.mainStatContainer}>
//           <View style={styles.progressCircle}>
//             {/* This is where a real progress circle component would go */}
//             <Text style={styles.progressText}>{`${Math.round(completionPercentage * 100)}%`}</Text>
//             <Text style={styles.progressLabel}>Completed</Text>
//           </View>
//         </View>

//         <View style={styles.detailedStats}>
//           <StatBar label="In Jamaa'ah" value={stats?.jamaah || 0} total={stats?.totalPrayers || 1} color="#059669" />
//           <StatBar label="On Time" value={stats?.onTime || 0} total={stats?.totalPrayers || 1} color="#34d399" />
//           <StatBar label="Late" value={stats?.late || 0} total={stats?.totalPrayers || 1} color="#f59e0b" />
//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// // A helper component to create the stat bars
// const StatBar = ({ label, value, total, color }) => {
//   const percentage = total > 0 ? (value / total) * 100 : 0;
//   return (
//     <View style={styles.statBarContainer}>
//       <View style={styles.statBarLabels}>
//         <Text style={styles.statBarLabel}>{label}</Text>
//         <Text style={styles.statBarValue}>{value}</Text>
//       </View>
//       <View style={styles.statBarBackground}>
//         <View style={[styles.statBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#f9fafb' },
//     header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#059669' },
//     navButton: { padding: 8 },
//     headerTitle: { fontSize: 24, fontFamily: 'Inter-Bold', color: '#ffffff', textAlign: 'center' },
//     headerSubtitle: { fontSize: 16, fontFamily: 'Inter-Regular', color: '#a7f3d0', textAlign: 'center' },
//     mainStatContainer: { padding: 30, alignItems: 'center', justifyContent: 'center' },
//     progressCircle: { width: 180, height: 180, borderRadius: 90, backgroundColor: '#fff', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 10, borderColor: '#ecfdf5' },
//     progressText: { fontSize: 48, fontFamily: 'Inter-Bold', color: '#059669' },
//     progressLabel: { fontSize: 16, fontFamily: 'Inter-Medium', color: '#6b7280', marginTop: 4 },
//     detailedStats: { paddingHorizontal: 20 },
//     statBarContainer: { marginBottom: 20 },
//     statBarLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
//     statBarLabel: { fontFamily: 'Inter-SemiBold', color: '#374151' },
//     statBarValue: { fontFamily: 'Inter-Regular', color: '#6b7280' },
//     statBarBackground: { height: 10, backgroundColor: '#e5e7eb', borderRadius: 5, overflow: 'hidden' },
//     statBarFill: { height: '100%', borderRadius: 5 },
// });
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { usePrayer } from '@/contexts/PrayerContext';
import { MonthlyStats } from '@/types/prayer';
import { Users, User, Clock, XCircle } from 'lucide-react-native';
import { useFocusEffect } from 'expo-router'; // <-- Import the special hook

export default function StatisticsScreen() {
  const { getAllTimeStats } = usePrayer();
  const [stats, setStats] = useState<MonthlyStats | null>(null);
  const [loading, setLoading] = useState(true);

  // --- THIS IS THE FIX ---
  // useFocusEffect runs every time you navigate TO this screen.
  useFocusEffect(
    useCallback(() => {
      const loadStats = async () => {
        setLoading(true);
        console.log("Fetching latest stats from server...");
        const fetchedStats = await getAllTimeStats();
        setStats(fetchedStats);
        setLoading(false);
      };

      loadStats();

      // Optional: return a cleanup function if needed
      return () => {
        // This can be used to cancel any pending actions if the user navigates away
      };
    }, []) // The dependency array for useCallback is usually empty here
  );

  const totalPrayed = (stats?.onTime || 0) + (stats?.late || 0);
  const totalPossible = stats?.totalPrayers || 0;
  // Calculate missed prayers based on total possible prayers for the period logged
  const missedPrayers = Math.max(0, totalPossible - totalPrayed);

  if (loading) {
    return <ActivityIndicator style={styles.container} size="large" color="#059669" />;
  }

  return (
    <SafeAreaView style={styles.container}>
       <ScrollView>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Statistics</Text>
        </View>
        <View style={styles.pillsContainer}>
            <TouchableOpacity style={styles.pillActive}>
            <Text style={styles.pillTextActive}>All time</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.grid}>
            <StatCard 
            icon={<Users size={24} color="#10b981" />}
            label="In Jamaa'ah"
            value={stats?.jamaah || 0}
            total={totalPrayed}
            color="#10b981"
            />
            <StatCard 
            icon={<User size={24} color="#3b82f6" />}
            label="On Time"
            value={stats?.onTime || 0}
            total={totalPrayed}
            color="#3b82f6"
            />
            <StatCard 
            icon={<Clock size={24} color="#f59e0b" />}
            label="Late"
            value={stats?.late || 0}
            total={totalPrayed}
            color="#f59e0b"
            />
            <StatCard 
            icon={<XCircle size={24} color="#ef4444" />}
            label="Missed"
            value={missedPrayers}
            total={totalPossible > 0 ? totalPossible : 1} // Avoid division by zero
            color="#ef4444"
            />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper component for the stat cards
const StatCard = ({ icon, label, value, total, color }) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}1A` }]}>{icon}</View>
      </View>
      <Text style={styles.percentageText}>{percentage}%</Text>
      <Text style={styles.valueText}>{value} times</Text>
      <Text style={styles.labelText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, },
  header: { padding: 20 },
  headerTitle: { fontSize: 28, fontFamily: 'Inter-Bold', textAlign: 'center', color: '#1f2937' },
  pillsContainer: { flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 20, marginBottom: 20 },
  pillActive: { backgroundColor: '#059669', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 99 },
  pillTextActive: { color: '#ffffff', fontFamily: 'Inter-SemiBold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 10 },
  card: { backgroundColor: '#ffffff', width: '45%', aspectRatio: 1, margin: '2.5%', borderRadius: 20, padding: 16, justifyContent: 'space-between', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  cardHeader: { alignSelf: 'flex-start' },
  iconContainer: { padding: 8, borderRadius: 99 },
  percentageText: { fontSize: 36, fontFamily: 'Inter-Bold', color: '#1f2937' },
  valueText: { fontSize: 14, fontFamily: 'Inter-Regular', color: '#6b7280', marginTop: -5 },
  labelText: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: '#374151' },
});