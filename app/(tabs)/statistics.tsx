
// // import React, { useState, useCallback } from 'react';
// // import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
// // import { usePrayer } from '@/contexts/PrayerContext';
// // import { useFocusEffect } from 'expo-router';
// // import { PieChart } from 'react-native-chart-kit';
// // import { Moon, Sun, Sunrise, Sunset, CloudMoon } from 'lucide-react-native';

// // // Helper to get the last N days for the heatmap
// // const getLastNDates = (days: number) => {
// //   const dates = [];
// //   for (let i = 0; i < days; i++) {
// //     const d = new Date();
// //     d.setDate(d.getDate() - i);
// //     dates.push(d);
// //   }
// //   return dates.reverse(); // So today is on the right
// // };

// // // The new Prayer Heatmap component
// // const PrayerHeatmap = ({ prayerData, dates }) => {
// //   const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
// //   const prayerIcons = [<Sunrise size={18} />, <Sun size={18} />, <Sunset size={18} />, <Sunset size={18} />, <Moon size={18} />];

// //   const getStatusColor = (status) => {
// //     if (status === 'jamaah') return '#22c55e'; // Green
// //     if (status === 'alone') return '#a3e635'; // Lime
// //     if (status === 'late') return '#f59e0b'; // Yellow
// //     return '#e5e7eb'; // Gray for not prayed
// //   };

// //   return (
// //     <View style={styles.heatmapContainer}>
// //       <View style={styles.heatmapIcons}>
// //         {prayerIcons.map((icon, index) => <View key={index} style={styles.iconCell}>{icon}</View>)}
// //       </View>
// //       <View style={styles.heatmapGrid}>
// //         {dates.map(date => {
// //           const dateString = date.toISOString().split('T')[0];
// //           const prayersForDay = prayerData.filter(p => p.prayer_date === dateString);
// //           return (
// //             <View key={dateString} style={styles.dayColumn}>
// //               <Text style={styles.dayHeader}>{date.getDate()}</Text>
// //               {prayerOrder.map(prayerName => {
// //                 const prayer = prayersForDay.find(p => p.prayer_name === prayerName);
// //                 return <View key={prayerName} style={[styles.dayCell, { backgroundColor: getStatusColor(prayer?.status) }]} />;
// //               })}
// //             </View>
// //           );
// //         })}
// //       </View>
// //     </View>
// //   );
// // };

// // export default function StatisticsScreen() {
// //   const { getPrayerDataForDateRange } = usePrayer();
// //   const [loading, setLoading] = useState(true);
// //   const [prayerData, setPrayerData] = useState([]);
// //   const [pieData, setPieData] = useState([]);
  
// //   const dates = getLastNDates(7); // Show last 7 days

// //   useFocusEffect(
// //     useCallback(() => {
// //       const loadStats = async () => {
// //         setLoading(true);
// //         const startDate = dates[0].toISOString().split('T')[0];
// //         const endDate = dates[dates.length - 1].toISOString().split('T')[0];
// //         const data = await getPrayerDataForDateRange(startDate, endDate);
// //         setPrayerData(data);

// //         // Process data for Pie Chart
// //         const statusCounts = { "Jamaa'ah": 0, "Alone": 0, "Late": 0 };
// //         const colors = { "Jamaa'ah": "#10b981", "Alone": "#3b82f6", "Late": "#f59e0b" };
// //         data.forEach(p => {
// //           if (p.status === 'jamaah') statusCounts["Jamaa'ah"]++;
// //           else if (p.status === 'alone') statusCounts["Alone"]++;
// //           else if (p.status === 'late') statusCounts["Late"]++;
// //         });
// //         const chartData = Object.keys(statusCounts)
// //           .filter(key => statusCounts[key] > 0)
// //           .map(key => ({
// //             name: `% ${key}`,
// //             count: statusCounts[key],
// //             color: colors[key],
// //             legendFontColor: '#374151',
// //             legendFontSize: 14,
// //           }));
// //         setPieData(chartData);
// //         setLoading(false);
// //       };
// //       loadStats();
// //     }, [])
// //   );

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <ScrollView>
// //         <View style={styles.header}>
// //           <Text style={styles.headerTitle}>Prayer Summary</Text>
// //         </View>

// //         {loading ? <ActivityIndicator size="large" color="#059669" /> : (
// //           <>
// //             <View style={styles.card}>
// //               <Text style={styles.sectionTitle}>Last 7 Days</Text>
// //               <PrayerHeatmap prayerData={prayerData} dates={dates} />
// //             </View>
            
// //             <View style={styles.card}>
// //               <Text style={styles.sectionTitle}>Status Breakdown</Text>
// //               {pieData.length > 0 ? (
// //                 <PieChart
// //                   data={pieData}
// //                   width={Dimensions.get('window').width - 64} // Adjusted for padding
// //                   height={220}
// //                   chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
// //                   accessor={"count"}
// //                   backgroundColor={"transparent"}
// //                   paddingLeft={"15"}
// //                   absolute
// //                 />
// //               ) : (
// //                 <Text style={styles.noDataText}>No prayer data to display.</Text>
// //               )}
// //             </View>
// //           </>
// //         )}
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#f9fafb' },
// //   header: { padding: 20, paddingTop: 40 },
// //   headerTitle: { fontSize: 28, fontFamily: 'Inter-Bold', textAlign: 'center', color: '#1f2937' },
// //   card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
// //   sectionTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: '#1f2937', marginBottom: 16 },
// //   heatmapContainer: { flexDirection: 'row', alignItems: 'center' },
// //   heatmapIcons: { marginRight: 10, gap: 4, alignItems: 'center' },
// //   heatmapGrid: { flexDirection: 'row', flex: 1, justifyContent: 'space-around' },
// //   dayColumn: { alignItems: 'center', gap: 4 },
// //   dayHeader: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: '#6b7280', marginBottom: 4 },
// //   dayCell: { width: 24, height: 24, borderRadius: 6 },
// //   iconCell: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
// //   noDataText: { textAlign: 'center', fontStyle: 'italic', color: '#6b7280', paddingVertical: 20 },
// // });
// import React, { useState, useCallback } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
// import { usePrayer } from '@/contexts/PrayerContext';
// import { useFocusEffect } from 'expo-router';
// import { PieChart } from 'react-native-chart-kit';
// import { Moon, Sun, Sunrise, Sunset, CloudMoon, Calendar as CalendarIcon, ArrowLeft, ArrowRight } from 'lucide-react-native';
// import DateTimePickerModal from "react-native-modal-datetime-picker";

// // 1. Define consistent colors centrally
// const PRAYER_STATUS_COLORS = {
//   'jamaah': '#22c55e', // Green
//   // 'alone': '#a3e635',  // Lime Green
//   'alone': '#89CFF0',  // Blue
//   'late': '#f59e0b',   // Amber/Yellow
//   'missed': '#ef4444', // Red (for potential future use, or heatmap only)
//   'not_prayed': '#e5e7eb', // Light Gray (for heatmap background)
// };

// // Helper to get dates for a 7-day interval starting from a given date
// const getSevenDayInterval = (start: Date) => {
//   const dates = [];
//   for (let i = 0; i < 7; i++) {
//     const d = new Date(start);
//     d.setDate(d.getDate() + i);
//     dates.push(d);
//   }
//   return dates;
// };

// const getLocalYYYYMMDD = (date: Date): string => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

// // The new Prayer Heatmap component
// const PrayerHeatmap = ({ prayerData, dates }) => {
//   const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
//   // Added keys to icons for better React performance
//   const prayerIcons = [<Sunrise key="Fajr" size={18} />, <Sun key="Dhuhr" size={18} />, <Sunset key="Asr" size={18} />, <Sunset key="Maghrib" size={18} />, <Moon key="Isha" size={18} />]; 

//   const getStatusColor = (status) => {
//     return PRAYER_STATUS_COLORS[status] || PRAYER_STATUS_COLORS['not_prayed'];
//   };

//   return (
//     <View style={styles.heatmapContainer}>
//       <View style={styles.heatmapIcons}>
//         {prayerIcons.map((icon, index) => <View key={index} style={styles.iconCell}>{icon}</View>)}
//       </View>
//       <View style={styles.heatmapGrid}>
//         {dates.map(date => {
//           const dateString = getLocalYYYYMMDD(date);
//           const prayersForDay = prayerData.filter(p => p.prayer_date === dateString);
//           return (
//             <View key={dateString} style={styles.dayColumn}>
//               <Text style={styles.dayHeader}>{date.getDate()}</Text>
//               {prayerOrder.map(prayerName => {
//                 const prayer = prayersForDay.find(p => p.prayer_name === prayerName);
//                 return <View key={prayerName} style={[styles.dayCell, { backgroundColor: getStatusColor(prayer?.status) }]} />;
//               })}
//             </View>
//           );
//         })}
//       </View>
//     </View>
//   );
// };

// export default function StatisticsScreen() {
//   const { getPrayerDataForDateRange } = usePrayer();
//   const [loading, setLoading] = useState(true);
//   const [prayerData, setPrayerData] = useState([]);
//   const [pieData, setPieData] = useState([]);
  
//   // State for the start date of the 7-day interval
//   const [intervalStartDate, setIntervalStartDate] = useState(() => { 
//     const d = new Date();
//     d.setDate(d.getDate() - 6); // Default: 7 days ending today
//     return d;
//   });
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false); // State for date picker modal visibility

//   // Derive the end date and the actual dates array for the current interval
//   const currentIntervalDates = getSevenDayInterval(intervalStartDate);
//   const displayStartDate = currentIntervalDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//   const displayEndDate = currentIntervalDates[currentIntervalDates.length - 1].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

//   // useFocusEffect will re-fetch data whenever the screen comes into focus
//   useFocusEffect(
//     useCallback(() => {
//       const loadStats = async () => {
//         setLoading(true);
//         const fetchStartDateString = getLocalYYYYMMDD(currentIntervalDates[0]);
//         const fetchEndDateString = getLocalYYYYMMDD(currentIntervalDates[currentIntervalDates.length - 1]);
//         const data = await getPrayerDataForDateRange(fetchStartDateString, fetchEndDateString);
//         setPrayerData(data);

//         // Process data for Pie Chart
//         // Change keys to directly match PRAYER_STATUS_COLORS keys for consistency
//         const statusCounts = { "jamaah": 0, "alone": 0, "late": 0 }; 
//         // Ensure all data points have a valid status to prevent division by zero in percentage calculation
//         const totalPrayedCount = data.filter(p => p.status && (p.status === 'jamaah' || p.status === 'alone' || p.status === 'late')).length;

//         data.forEach(p => {
//           // Populate statusCounts using keys that match PRAYER_STATUS_COLORS
//           if (p.status === 'jamaah') statusCounts.jamaah++; 
//           else if (p.status === 'alone') statusCounts.alone++; 
//           else if (p.status === 'late') statusCounts.late++;   
//         });

//         const chartData = Object.keys(statusCounts) // Now keys are 'jamaah', 'alone', 'late'
//           .filter(key => statusCounts[key as keyof typeof statusCounts] > 0) // Only include slices that have data
//           .map(key => ({
//             // Reconstruct original name for legend display (e.g., 'jamaah' -> "Jamaa'ah")
//             name: `${Math.round((statusCounts[key as keyof typeof statusCounts] / (totalPrayedCount || 1)) * 100)}% ${
//                 key === 'jamaah' ? "Jamaa'ah" : key.charAt(0).toUpperCase() + key.slice(1)
//             }`, 
//             count: statusCounts[key as keyof typeof statusCounts],
//             // Use consistent colors for Pie Chart by mapping to the common color object
//             color: PRAYER_STATUS_COLORS[key as keyof typeof PRAYER_STATUS_COLORS], 
//             legendFontColor: '#374151',
//             legendFontSize: 14,
//           }));
//         setPieData(chartData);
//         setLoading(false);
//       };
//       loadStats();
//     }, [intervalStartDate]) // Re-run effect when intervalStartDate changes
//   );

//   // Functions for DatePickerModal
//   const showDatePicker = () => setDatePickerVisibility(true);
//   const hideDatePicker = () => setDatePickerVisibility(false);

//   const handleConfirmDate = (date: Date) => {
//     // Set the selected date as the START of the 7-day interval
//     setIntervalStartDate(date);
//     hideDatePicker();
//   };

//   // Functions for arrow navigation
//   const goToPreviousInterval = () => {
//     setIntervalStartDate(prevDate => {
//       const newDate = new Date(prevDate);
//       newDate.setDate(newDate.getDate() - 7); // Go back 7 days
//       return newDate;
//     });
//   };

//   const goToNextInterval = () => {
//     setIntervalStartDate(prevDate => {
//       const newDate = new Date(prevDate);
//       newDate.setDate(newDate.getDate() + 7); // Go forward 7 days
//       return newDate;
//     });
//   };

//   // Check if the current interval includes today to disable "Next" button
//   const today = new Date();
//   today.setHours(0, 0, 0, 0); // Normalize today to start of day
//   const latestPossibleStartDate = new Date(today);
//   latestPossibleStartDate.setDate(latestPossibleStartDate.getDate() - 6); // The latest possible start date for an interval ending today

//   const isNextIntervalDisabled = intervalStartDate >= latestPossibleStartDate;

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView>
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Statistics</Text>
//         </View>

//         {/* Date Interval Selector UI */}
//         <View style={styles.dateIntervalContainer}>
//           <TouchableOpacity onPress={goToPreviousInterval} style={styles.arrowButton}>
//             <ArrowLeft size={20} color="#374151" />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={showDatePicker} style={styles.dateDisplayButton}>
//             <CalendarIcon size={20} color="#059669" />
//             <Text style={styles.dateDisplayText}>{displayStartDate} - {displayEndDate}</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={goToNextInterval} disabled={isNextIntervalDisabled} style={[styles.arrowButton, isNextIntervalDisabled && styles.disabledArrowButton]}>
//             <ArrowRight size={20} color={isNextIntervalDisabled ? '#9ca3af' : '#374151'} />
//           </TouchableOpacity>
//         </View>

//         {/* DateTimePickerModal for selecting interval start date */}
//         <DateTimePickerModal
//           isVisible={isDatePickerVisible}
//           mode="date"
//           onConfirm={handleConfirmDate}
//           onCancel={hideDatePicker}
//           date={intervalStartDate} // Set initial date for picker to current interval's start
//         />

//         {loading ? <ActivityIndicator style={{ flex: 1 }} size="large" color="#059669" /> : (
//           <>
//             <View style={styles.card}>
//               <Text style={styles.sectionTitle}>Prayer Heatmap</Text>
//               <PrayerHeatmap prayerData={prayerData} dates={currentIntervalDates} />
//             </View>
            
//             <View style={styles.card}>
//               <Text style={styles.sectionTitle}>Status Breakdown</Text>
//               {pieData.length > 0 ? (
//                 <PieChart
//                   data={pieData}
//                   width={Dimensions.get('window').width - 64} // Adjusted for padding
//                   height={220}
//                   chartConfig={{ 
//                     color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Base color for labels
//                     decimalPlaces: 0, // No decimal places for percentage
//                   }}
//                   accessor={"count"}
//                   backgroundColor={"transparent"}
//                   paddingLeft={"15"}
//                   absolute
//                 />
//               ) : (
//                 <Text style={styles.noDataText}>No prayer data to display for this period.</Text>
//               )}
//             </View>
//           </>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f9fafb' },
//   header: { padding: 20, paddingTop: 40 },
//   headerTitle: { fontSize: 28, fontFamily: 'Inter-Bold', textAlign: 'center', color: '#1f2937' },
  
//   // Date Interval Selector Styles
//   dateIntervalContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     marginHorizontal: 16,
//     marginBottom: 20,
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//   },
//   arrowButton: {
//     padding: 8,
//   },
//   disabledArrowButton: {
//     opacity: 0.4,
//   },
//   dateDisplayButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     paddingVertical: 4,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//   },
//   dateDisplayText: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1f2937',
//   },

//   card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
//   sectionTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: '#1f2937', marginBottom: 16 },
//   heatmapContainer: { flexDirection: 'row', alignItems: 'center' },
//   heatmapIcons: { marginRight: 10, gap: 4, alignItems: 'center' },
//   heatmapGrid: { flexDirection: 'row', flex: 1, justifyContent: 'space-around' },
//   dayColumn: { alignItems: 'center', gap: 4 },
//   dayHeader: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: '#6b7280', marginBottom: 4 },
//   dayCell: { width: 24, height: 24, borderRadius: 6 },
//   iconCell: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
//   noDataText: { textAlign: 'center', fontStyle: 'italic', color: '#6b7280', paddingVertical: 20 },
// });
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { usePrayer } from '@/contexts/PrayerContext';
import { useFocusEffect } from 'expo-router';
import { PieChart } from 'react-native-chart-kit';
import { Moon, Sun, Sunrise, Sunset, CloudMoon, Calendar as CalendarIcon, ArrowLeft, ArrowRight } from 'lucide-react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSupabaseUser } from '@/contexts/SupabaseUserContext'; // Import useSupabaseUser

// Define consistent colors centrally
const PRAYER_STATUS_COLORS = {
  'jamaah': '#22c55e', // Green
  //'alone': '#a3e635',  // Lime Green
  'alone': '#89CFF0',  // Blue
  'late': '#f59e0b',   // Amber/Yellow
  'missed': '#ef4444', // Red (for potential future use, or heatmap only)
  'not_prayed': '#e5e7eb', // Light Gray (for heatmap background)
};

// Helper to get dates for a 7-day interval starting from a given date
const getSevenDayInterval = (start: Date) => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const getLocalYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// The new Prayer Heatmap component
const PrayerHeatmap = ({ prayerData, dates }) => {
  const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const prayerIcons = [<Sunrise key="Fajr" size={18} />, <Sun key="Dhuhr" size={18} />, <Sunset key="Asr" size={18} />, <Sunset key="Maghrib" size={18} />, <Moon key="Isha" size={18} />]; 

  const getStatusColor = (status) => {
    return PRAYER_STATUS_COLORS[status] || PRAYER_STATUS_COLORS['not_prayed'];
  };

  return (
    <View style={styles.heatmapContainer}>
      <View style={styles.heatmapIcons}>
        {prayerIcons.map((icon, index) => <View key={index} style={styles.iconCell}>{icon}</View>)}
      </View>
      <View style={styles.heatmapGrid}>
        {dates.map(date => {
          const dateString = getLocalYYYYMMDD(date);
          const prayersForDay = prayerData.filter(p => p.prayer_date === dateString);
          return (
            <View key={dateString} style={styles.dayColumn}>
              <Text style={styles.dayHeader}>{date.getDate()}</Text>
              {prayerOrder.map(prayerName => {
                const prayer = prayersForDay.find(p => p.prayer_name === prayerName);
                return <View key={prayerName} style={[styles.dayCell, { backgroundColor: getStatusColor(prayer?.status) }]} />;
              })}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default function StatisticsScreen() {
  const { getPrayerDataForDateRange } = usePrayer();
  const { loading: userLoading } = useSupabaseUser(); // Get user loading state
  
  const [loading, setLoading] = useState(true); // Local loading state for statistics data
  const [prayerData, setPrayerData] = useState([]);
  const [pieData, setPieData] = useState([]);
  
  const [intervalStartDate, setIntervalStartDate] = useState(() => { 
    const d = new Date();
    d.setDate(d.getDate() - 6); 
    return d;
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const currentIntervalDates = getSevenDayInterval(intervalStartDate);
  const displayStartDate = currentIntervalDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const displayEndDate = currentIntervalDates[currentIntervalDates.length - 1].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  useFocusEffect(
    useCallback(() => {
      // Only load statistics data if the user data is not currently loading
      if (!userLoading) { 
        const loadStats = async () => {
          setLoading(true);
          const fetchStartDateString = getLocalYYYYMMDD(currentIntervalDates[0]);
          const fetchEndDateString = getLocalYYYYMMDD(currentIntervalDates[currentIntervalDates.length - 1]);
          const data = await getPrayerDataForDateRange(fetchStartDateString, fetchEndDateString);
          setPrayerData(data);

          // Process data for Pie Chart
          const statusCounts = { "jamaah": 0, "alone": 0, "late": 0 }; 
          const totalPrayedCount = data.filter(p => p.status && (p.status === 'jamaah' || p.status === 'alone' || p.status === 'late')).length;

          data.forEach(p => {
            if (p.status === 'jamaah') statusCounts.jamaah++; 
            else if (p.status === 'alone') statusCounts.alone++; 
            else if (p.status === 'late') statusCounts.late++;   
          });

          const chartData = Object.keys(statusCounts)
            .filter(key => statusCounts[key as keyof typeof statusCounts] > 0)
            .map(key => ({
                name: `${Math.round((statusCounts[key as keyof typeof statusCounts] / (totalPrayedCount || 1)) * 100)}% ${
                    key === 'jamaah' ? "Jamaa'ah" : key.charAt(0).toUpperCase() + key.slice(1)
                }`, 
                count: statusCounts[key as keyof typeof statusCounts],
                color: PRAYER_STATUS_COLORS[key as keyof typeof PRAYER_STATUS_COLORS], 
                legendFontColor: '#374151',
                legendFontSize: 14,
            }));
          setPieData(chartData);
          setLoading(false);
        };
        loadStats();
      }
    }, [intervalStartDate, userLoading]) // Add userLoading to dependencies
  );

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirmDate = (date: Date) => {
    setIntervalStartDate(date);
    hideDatePicker();
  };

  const goToPreviousInterval = () => {
    setIntervalStartDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 7); 
      return newDate;
    });
  };

  const goToNextInterval = () => {
    setIntervalStartDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 7); 
      return newDate;
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  const latestPossibleStartDate = new Date(today);
  latestPossibleStartDate.setDate(latestPossibleStartDate.getDate() - 6); 

  const isNextIntervalDisabled = intervalStartDate >= latestPossibleStartDate;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Statistics</Text>
        </View>

        <View style={styles.dateIntervalContainer}>
          <TouchableOpacity onPress={goToPreviousInterval} style={styles.arrowButton}>
            <ArrowLeft size={20} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity onPress={showDatePicker} style={styles.dateDisplayButton}>
            <CalendarIcon size={20} color="#059669" />
            <Text style={styles.dateDisplayText}>{displayStartDate} - {displayEndDate}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToNextInterval} disabled={isNextIntervalDisabled} style={[styles.arrowButton, isNextIntervalDisabled && styles.disabledArrowButton]}>
            <ArrowRight size={20} color={isNextIntervalDisabled ? '#9ca3af' : '#374151'} />
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
          date={intervalStartDate}
        />

        {/* Show loading indicator if either user data is loading OR statistics data is loading */}
        {(loading || userLoading) ? <ActivityIndicator style={{ flex: 1 }} size="large" color="#059669" /> : (
          <>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Prayer Heatmap</Text>
              <PrayerHeatmap prayerData={prayerData} dates={currentIntervalDates} />
            </View>
            
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Status Breakdown</Text>
              {pieData.length > 0 ? (
                <PieChart
                  data={pieData}
                  width={Dimensions.get('window').width - 64}
                  height={220}
                  chartConfig={{ 
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, 
                    decimalPlaces: 0, 
                  }}
                  accessor={"count"}
                  backgroundColor={"transparent"}
                  paddingLeft={"15"}
                  absolute
                />
              ) : (
                <Text style={styles.noDataText}>No prayer data to display for this period.</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { padding: 20, paddingTop: 40 },
  headerTitle: { fontSize: 28, fontFamily: 'Inter-Bold', textAlign: 'center', color: '#1f2937' },
  
  dateIntervalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  arrowButton: {
    padding: 8,
  },
  disabledArrowButton: {
    opacity: 0.4,
  },
  dateDisplayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dateDisplayText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
  },

  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: '#1f2937', marginBottom: 16 },
  heatmapContainer: { flexDirection: 'row', alignItems: 'center' },
  heatmapIcons: { marginRight: 10, gap: 4, alignItems: 'center' },
  heatmapGrid: { flexDirection: 'row', flex: 1, justifyContent: 'space-around' },
  dayColumn: { alignItems: 'center', gap: 4 },
  dayHeader: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: '#6b7280', marginBottom: 4 },
  dayCell: { width: 24, height: 24, borderRadius: 6 },
  iconCell: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  noDataText: { textAlign: 'center', fontStyle: 'italic', color: '#6b7280', paddingVertical: 20 },
});