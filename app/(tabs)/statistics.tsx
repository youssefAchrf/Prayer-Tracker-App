// // statistics.tsx
// import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
// import { usePrayer } from '@/contexts/PrayerContext';
// import { useAuth } from '@/contexts/AuthContext';
// import { useFocusEffect } from 'expo-router';
// import { Users, User, Clock, XCircle, Moon, Sun, Sunrise, Sunset, CloudSun, Calendar as CalendarIcon, ArrowLeft, ArrowRight } from 'lucide-react-native';
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { useTheme } from '@/contexts/ThemeContext';

// const PRAYER_STATUS_COLORS = {
//   jamaah: '#22c55e',
//   alone: '#3b82f6',
//   late: '#f59e0b',
//   missed: '#ef4444',
// };

// const getLocalYYYYMMDD = (date: Date): string => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

// const getSevenDayInterval = (start: Date) => {
//   const dates = [];
//   for (let i = 0; i < 7; i++) {
//     const d = new Date(start);
//     d.setDate(d.getDate() + i);
//     dates.push(d);
//   }
//   return dates;
// };

// export default function StatisticsScreen() {
//   const { theme, colors } = useTheme();
//   const { user } = useAuth();
//   const { getPrayerDataForDateRange } = usePrayer();

//   const [summaryStats, setSummaryStats] = useState({
//     statusSummary: {
//       jamaah: { count: 0, percentage: 0 },
//       onTime: { count: 0, percentage: 0 },
//       late: { count: 0, percentage: 0 },
//       notPrayed: { count: 0, percentage: 0 },
//     },
//     prayerSummary: [],
//   });
  
//   const [summaryLoading, setSummaryLoading] = useState(true);
//   const [heatmapLoading, setHeatmapLoading] = useState(true);
//   const [heatmapData, setHeatmapData] = useState([]);
//   const [intervalStartDate, setIntervalStartDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 6); return d; });
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//   const isInitialLoad = useRef(true);

//   const styles = useMemo(() => StyleSheet.create({
//     container: { flex: 1, backgroundColor: colors.background },
//     header: { paddingVertical: 20, paddingHorizontal: 20, backgroundColor: colors.background },
//     headerTitle: { fontSize: 24, fontFamily: 'Inter-Bold', textAlign: 'center', color: colors.text },
//     content: { paddingHorizontal: 16, paddingBottom: 32 },
//     card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
//     dateIntervalContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.background, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10, marginBottom: 16 },
//     arrowButton: { padding: 8 },
//     disabledArrowButton: { opacity: 0.4 },
//     dateDisplayButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//     dateDisplayText: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: colors.text },
//     sectionTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: colors.text, marginBottom: 16, marginTop: 16 },
//     heatmapContainer: { flexDirection: 'row', alignItems: 'center', minHeight: 120, position: 'relative' },
//     heatmapLoadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: theme === 'dark' ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)', zIndex: 10, borderRadius: 16 },
//     heatmapIcons: { marginRight: 10, gap: 4, alignItems: 'center' },
//     heatmapGrid: { flexDirection: 'row', flex: 1, justifyContent: 'space-around' },
//     dayColumn: { alignItems: 'center', gap: 4 },
//     dayHeader: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
//     dayCell: { width: 24, height: 24, borderRadius: 6 },
//     iconCell: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
//     summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
//     summaryCard: { width: '48%', backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
//     summaryCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
//     summaryCardTitle: { marginLeft: 8, fontSize: 14, fontFamily: 'Inter-SemiBold' },
//     summaryCardPercentage: { fontSize: 28, fontFamily: 'Inter-Bold', color: colors.text },
//     summaryCardCount: { fontSize: 12, fontFamily: 'Inter-Regular', color: colors.textSecondary, marginTop: 4 },
//     prayerCard: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
//     prayerCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
//     prayerName: { fontSize: 16, fontFamily: 'Inter-Bold', color: colors.text, marginLeft: 12 },
//     progressBarContainer: { height: 8, borderRadius: 4, backgroundColor: colors.border, flexDirection: 'row', overflow: 'hidden', marginBottom: 12 },
//     prayerStatsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
//     prayerStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//     prayerStatText: { fontSize: 12, fontFamily: 'Inter-Medium', color: colors.textSecondary },
//   }), [colors, theme]);

//   const PRAYERS_CONFIG = [
//     { name: 'Fajr', Icon: <Sunrise size={24} /> }, { name: 'Dhuhr', Icon: <Sun size={24} /> },
//     { name: 'Asr', Icon: <CloudSun size={24} /> }, { name: 'Maghrib', Icon: <Sunset size={24} /> },
//     { name: 'Isha', Icon: <Moon size={24} /> },
//   ];
  
//   const loadSummaryData = useCallback(async () => {
//     if (!user) {
//       setSummaryLoading(false);
//       return;
//     }
//     setSummaryLoading(true);
//     try {
//         const allPrayers = await getPrayerDataForDateRange('2020-01-01', getLocalYYYYMMDD(new Date()));
        
//         const todayString = getLocalYYYYMMDD(new Date());
//         const pastPrayers = allPrayers.filter(p => p.prayer_date < todayString);

//         const uniquePastDays = new Set(pastPrayers.map(p => p.prayer_date));
//         const totalPossiblePastPrayers = uniquePastDays.size * 5;
//         const totalPastPrayersLogged = pastPrayers.filter(p => p.status).length;
//         const notPrayedCount = totalPossiblePastPrayers - totalPastPrayersLogged;
//         const notPrayedPercentage = totalPossiblePastPrayers > 0 ? Math.round((notPrayedCount / totalPossiblePastPrayers) * 100) : 0;
        
//         let jamaahCount = 0, aloneCount = 0, lateCount = 0;
//         allPrayers.forEach(p => {
//             if (p.status === 'jamaah') jamaahCount++;
//             else if (p.status === 'alone') aloneCount++;
//             else if (p.status === 'late') lateCount++;
//         });
//         const totalPrayed = jamaahCount + aloneCount + lateCount;
        
//         const statusSummary = {
//             jamaah: { count: jamaahCount, percentage: totalPrayed > 0 ? Math.round((jamaahCount / totalPrayed) * 100) : 0 },
//             onTime: { count: aloneCount, percentage: totalPrayed > 0 ? Math.round((aloneCount / totalPrayed) * 100) : 0 },
//             late: { count: lateCount, percentage: totalPrayed > 0 ? Math.round((lateCount / totalPrayed) * 100) : 0 },
//             notPrayed: { count: notPrayedCount, percentage: notPrayedPercentage },
//         };

//         const prayerSummary = PRAYERS_CONFIG.map(config => {
//             const allPrayersForThisType = allPrayers.filter(p => p.prayer_name === config.name);
//             const pastPrayersForThisType = pastPrayers.filter(p => p.prayer_name === config.name);
//             const totalForThisType = allPrayersForThisType.length;
            
//             const notPrayedForThisType = uniquePastDays.size - pastPrayersForThisType.length;
//             const totalPossibleForThisTypePast = uniquePastDays.size;

//             let typeJamaah = 0, typeAlone = 0, typeLate = 0;
//             allPrayersForThisType.forEach(p => {
//                 if (p.status === 'jamaah') typeJamaah++;
//                 else if (p.status === 'alone') typeAlone++;
//                 else if (p.status === 'late') typeLate++;
//             });
//             return {
//                 name: config.name, Icon: config.Icon,
//                 stats: [
//                     { status: 'jamaah', percentage: totalForThisType > 0 ? Math.round((typeJamaah / totalForThisType) * 100) : 0, color: PRAYER_STATUS_COLORS.jamaah },
//                     { status: 'alone', percentage: totalForThisType > 0 ? Math.round((typeAlone / totalForThisType) * 100) : 0, color: PRAYER_STATUS_COLORS.alone },
//                     { status: 'late', percentage: totalForThisType > 0 ? Math.round((typeLate / totalForThisType) * 100) : 0, color: PRAYER_STATUS_COLORS.late },
//                     { status: 'missed', percentage: totalPossibleForThisTypePast > 0 ? Math.round((notPrayedForThisType / totalPossibleForThisTypePast) * 100) : 0, color: PRAYER_STATUS_COLORS.missed },
//                 ]
//             }
//         });
//         setSummaryStats({ statusSummary, prayerSummary });
//     } catch (error) {
//       console.error("Error loading summary stats:", error);
//     } finally {
//       setSummaryLoading(false);
//     }
//   }, [user, getPrayerDataForDateRange]);

//   const loadHeatmapData = useCallback(async () => {
//     if (!user) {
//       setHeatmapLoading(false);
//       return;
//     }
//     setHeatmapLoading(true);
//     try {
//         const heatmapStartDate = getLocalYYYYMMDD(getSevenDayInterval(intervalStartDate)[0]);
//         const heatmapEndDate = getLocalYYYYMMDD(getSevenDayInterval(intervalStartDate)[6]);
//         const weeklyPrayers = await getPrayerDataForDateRange(heatmapStartDate, heatmapEndDate);
//         setHeatmapData(weeklyPrayers);
//     } catch (error) {
//         console.error("Error loading heatmap data:", error);
//     } finally {
//         setHeatmapLoading(false);
//     }
//   }, [user, intervalStartDate, getPrayerDataForDateRange]);
  
// useFocusEffect(
//   useCallback(() => {
//     loadSummaryData();
//     loadHeatmapData();
//   }, [])
// );

//  useEffect(() => {
//   if (isInitialLoad.current) {
//     isInitialLoad.current = false;
//     return;
//   }
//   loadHeatmapData();
// }, [intervalStartDate]);

//   const currentIntervalDates = getSevenDayInterval(intervalStartDate);
//   const displayStartDate = currentIntervalDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//   const displayEndDate = currentIntervalDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//   const isNextIntervalDisabled = getLocalYYYYMMDD(intervalStartDate) >= getLocalYYYYMMDD(new Date(new Date().setDate(new Date().getDate() - 6)));
//   const goToPreviousInterval = () => setIntervalStartDate(d => new Date(d.setDate(d.getDate() - 7)));
//   const goToNextInterval = () => setIntervalStartDate(d => new Date(d.setDate(d.getDate() + 7)));
//   const handleConfirmDate = (date) => { setIntervalStartDate(date); setDatePickerVisibility(false); };

//   const PrayerHeatmap = ({ prayerData, dates, isLoading }) => {
//     const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
//     const prayerIcons = [
//         <Sunrise key="Fajr" size={18} color={colors.textSecondary}/>, 
//         <Sun key="Dhuhr" size={18} color={colors.textSecondary}/>, 
//         <CloudSun key="Asr" size={18} color={colors.textSecondary}/>, 
//         <Sunset key="Maghrib" size={18} color={colors.textSecondary}/>, 
//         <Moon key="Isha" size={18} color={colors.textSecondary}/>
//     ];
//     return (
//       <View style={styles.heatmapContainer}>
//         {isLoading && (
//           <View style={styles.heatmapLoadingOverlay}><ActivityIndicator color={colors.primary} /></View>
//         )}
//         <View style={styles.heatmapIcons}>{prayerIcons.map((icon, index) => <View key={index} style={styles.iconCell}>{icon}</View>)}</View>
//         <View style={styles.heatmapGrid}>
//           {dates.map(date => {
//             const dateString = getLocalYYYYMMDD(date);
//             const prayersForDay = prayerData.filter(p => p.prayer_date === dateString);
//             return (
//               <View key={dateString} style={styles.dayColumn}>
//                 <Text style={styles.dayHeader}>{date.getDate()}</Text>
//                 {prayerOrder.map(prayerName => {
//                   const prayer = prayersForDay.find(p => p.prayer_name === prayerName);
//                   return <View key={prayerName} style={[styles.dayCell, { backgroundColor: PRAYER_STATUS_COLORS[prayer?.status] || colors.border }]} />;
//                 })}
//               </View>
//             );
//           })}
//         </View>
//       </View>
//     );
//   };
//   const StatusSummaryCard = ({ icon, title, percentage, count, color }) => (
//     <View style={styles.summaryCard}>
//       <View style={styles.summaryCardHeader}>
//         {icon}
//         <Text style={[styles.summaryCardTitle, { color }]}>{title}</Text>
//       </View>
//       <Text style={styles.summaryCardPercentage}>{percentage}%</Text>
//       <Text style={styles.summaryCardCount}>{count} times</Text>
//     </View>
//   );
//   const MultiSegmentProgressBar = ({ segments }) => (
//     <View style={styles.progressBarContainer}>
//       {segments.map((segment, index) => {
//         if (segment.percentage === 0) return null;
//         return <View key={index} style={{ backgroundColor: segment.color, width: `${segment.percentage}%`, height: '100%' }} />;
//       })}
//     </View>
//   );
//   const PrayerSummaryCard = ({ prayerName, icon, stats }) => (
//     <View style={styles.prayerCard}>
//       <View style={styles.prayerCardHeader}>
//         {React.cloneElement(icon, { color: colors.textSecondary })}
//         <Text style={styles.prayerName}>{prayerName}</Text>
//       </View>
//       <MultiSegmentProgressBar segments={stats} />
//       <View style={styles.prayerStatsRow}>
//         <View style={styles.prayerStat}><Users size={14} color={PRAYER_STATUS_COLORS.jamaah} /><Text style={styles.prayerStatText}>{stats.find(s => s.status === 'jamaah')?.percentage || 0}%</Text></View>
//         <View style={styles.prayerStat}><User size={14} color={PRAYER_STATUS_COLORS.alone} /><Text style={styles.prayerStatText}>{stats.find(s => s.status === 'alone')?.percentage || 0}%</Text></View>
//         <View style={styles.prayerStat}><Clock size={14} color={PRAYER_STATUS_COLORS.late} /><Text style={styles.prayerStatText}>{stats.find(s => s.status === 'late')?.percentage || 0}%</Text></View>
//         <View style={styles.prayerStat}><XCircle size={14} color={PRAYER_STATUS_COLORS.missed} /><Text style={styles.prayerStatText}>{stats.find(s => s.status === 'missed')?.percentage || 0}%</Text></View>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Statistics</Text>
//       </View>
//       <ScrollView contentContainerStyle={styles.content}>
//         <View style={styles.card}>
//             <Text style={styles.sectionTitle}>Weekly Heatmap</Text>
//             <View style={styles.dateIntervalContainer}>
//                 <TouchableOpacity onPress={goToPreviousInterval} style={styles.arrowButton}><ArrowLeft size={20} color={colors.text} /></TouchableOpacity>
//                 <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.dateDisplayButton}>
//                     <CalendarIcon size={20} color={colors.primary} />
//                     <Text style={styles.dateDisplayText}>{displayStartDate} - {displayEndDate}</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={goToNextInterval} disabled={isNextIntervalDisabled} style={[styles.arrowButton, isNextIntervalDisabled && styles.disabledArrowButton]}><ArrowRight size={20} color={isNextIntervalDisabled ? colors.textSecondary : colors.text} /></TouchableOpacity>
//             </View>
//             <PrayerHeatmap prayerData={heatmapData} dates={currentIntervalDates} isLoading={heatmapLoading}/>
//         </View>
//         <DateTimePickerModal 
//           isVisible={isDatePickerVisible} 
//           mode="date" 
//           onConfirm={handleConfirmDate} 
//           onCancel={() => setDatePickerVisibility(false)} 
//           date={intervalStartDate}
//           isDarkModeEnabled={theme === 'dark'}
//         />

//         {summaryLoading ? <ActivityIndicator style={{ marginTop: 40 }} size="large" color={colors.primary} /> : (
//             <>
//                 <Text style={styles.sectionTitle}>All-Time Status Summary</Text>
//                 <View style={styles.summaryGrid}>
//                     <StatusSummaryCard icon={<Users size={24} color={PRAYER_STATUS_COLORS.jamaah} />} title="In Jamaa'ah" percentage={summaryStats.statusSummary.jamaah.percentage} count={summaryStats.statusSummary.jamaah.count} color={PRAYER_STATUS_COLORS.jamaah} />
//                     <StatusSummaryCard icon={<User size={24} color={PRAYER_STATUS_COLORS.alone} />} title="On Time" percentage={summaryStats.statusSummary.onTime.percentage} count={summaryStats.statusSummary.onTime.count} color={PRAYER_STATUS_COLORS.alone} />
//                     <StatusSummaryCard icon={<Clock size={24} color={PRAYER_STATUS_COLORS.late} />} title="Late" percentage={summaryStats.statusSummary.late.percentage} count={summaryStats.statusSummary.late.count} color={PRAYER_STATUS_COLORS.late} />
//                     <StatusSummaryCard icon={<XCircle size={24} color={PRAYER_STATUS_COLORS.missed} />} title="Not Prayed" percentage={summaryStats.statusSummary.notPrayed.percentage} count={summaryStats.statusSummary.notPrayed.count} color={PRAYER_STATUS_COLORS.missed} />
//                 </View>

//                 <Text style={styles.sectionTitle}>All-Time Prayer Summary</Text>
//                 {summaryStats.prayerSummary.map((prayer, index) => <PrayerSummaryCard key={index} prayerName={prayer.name} icon={prayer.Icon} stats={prayer.stats} />)}
//             </>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }




import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { usePrayer } from '@/contexts/PrayerContext';
import { useAuth } from '@/contexts/AuthContext';
import { useFocusEffect } from 'expo-router';
import { Users, User, Clock, XCircle, Moon, Sun, Sunrise, Sunset, CloudSun, Calendar as CalendarIcon, ArrowLeft, ArrowRight } from 'lucide-react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useTheme } from '@/contexts/ThemeContext';

const PRAYER_STATUS_COLORS = {
  jamaah: '#22c55e',
  alone: '#3b82f6',
  late: '#f59e0b',
  missed: '#ef4444',
};

const getLocalYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getSevenDayInterval = (start: Date) => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
};

export default function StatisticsScreen() {
  const { theme, colors } = useTheme();
  const { user } = useAuth();
  const { getPrayerDataForDateRange } = usePrayer();

  const [summaryStats, setSummaryStats] = useState({
    statusSummary: {
      jamaah: { count: 0, percentage: 0 },
      onTime: { count: 0, percentage: 0 },
      late: { count: 0, percentage: 0 },
      notPrayed: { count: 0, percentage: 0 },
    },
    prayerSummary: [],
  });
  
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [heatmapLoading, setHeatmapLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState([]);
  const [intervalStartDate, setIntervalStartDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 6); return d; });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // This stable userId is the key to fixing the loops and refresh issues.
  const userId = user?.id;

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingVertical: 20, paddingHorizontal: 20, backgroundColor: colors.background },
    headerTitle: { fontSize: 24, fontFamily: 'Inter-Bold', textAlign: 'center', color: colors.text },
    content: { paddingHorizontal: 16, paddingBottom: 32 },
    card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
    dateIntervalContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.background, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10, marginBottom: 16 },
    arrowButton: { padding: 8 },
    disabledArrowButton: { opacity: 0.4 },
    dateDisplayButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    dateDisplayText: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: colors.text },
    sectionTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: colors.text, marginBottom: 16, marginTop: 16 },
    heatmapContainer: { flexDirection: 'row', alignItems: 'center', minHeight: 120, position: 'relative' },
    heatmapLoadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: theme === 'dark' ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)', zIndex: 10, borderRadius: 16 },
    heatmapIcons: { marginRight: 10, gap: 4, alignItems: 'center' },
    heatmapGrid: { flexDirection: 'row', flex: 1, justifyContent: 'space-around' },
    dayColumn: { alignItems: 'center', gap: 4 },
    dayHeader: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
    dayCell: { width: 24, height: 24, borderRadius: 6 },
    iconCell: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
    summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    summaryCard: { width: '48%', backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
    summaryCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    summaryCardTitle: { marginLeft: 8, fontSize: 14, fontFamily: 'Inter-SemiBold' },
    summaryCardPercentage: { fontSize: 28, fontFamily: 'Inter-Bold', color: colors.text },
    summaryCardCount: { fontSize: 12, fontFamily: 'Inter-Regular', color: colors.textSecondary, marginTop: 4 },
    prayerCard: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
    prayerCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    prayerName: { fontSize: 16, fontFamily: 'Inter-Bold', color: colors.text, marginLeft: 12 },
    progressBarContainer: { height: 8, borderRadius: 4, backgroundColor: colors.border, flexDirection: 'row', overflow: 'hidden', marginBottom: 12 },
    prayerStatsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    prayerStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    prayerStatText: { fontSize: 12, fontFamily: 'Inter-Medium', color: colors.textSecondary },
  }), [colors, theme]);

  const PRAYERS_CONFIG = [
    { name: 'Fajr', Icon: <Sunrise size={24} /> }, { name: 'Dhuhr', Icon: <Sun size={24} /> },
    { name: 'Asr', Icon: <CloudSun size={24} /> }, { name: 'Maghrib', Icon: <Sunset size={24} /> },
    { name: 'Isha', Icon: <Moon size={24} /> },
  ];
  
  const loadSummaryData = useCallback(async () => {
    if (!userId) {
      setSummaryLoading(false);
      return;
    }
    setSummaryLoading(true);
    try {
        const allPrayers = await getPrayerDataForDateRange('2020-01-01', getLocalYYYYMMDD(new Date()));
        
        const todayString = getLocalYYYYMMDD(new Date());
        const pastPrayers = allPrayers.filter(p => p.prayer_date < todayString);

        const uniquePastDays = new Set(pastPrayers.map(p => p.prayer_date));
        const totalPossiblePastPrayers = uniquePastDays.size * 5;
        const totalPastPrayersLogged = pastPrayers.filter(p => p.status).length;
        const notPrayedCount = totalPossiblePastPrayers - totalPastPrayersLogged;
        const notPrayedPercentage = totalPossiblePastPrayers > 0 ? Math.round((notPrayedCount / totalPossiblePastPrayers) * 100) : 0;
        
        let jamaahCount = 0, aloneCount = 0, lateCount = 0;
        allPrayers.forEach(p => {
            if (p.status === 'jamaah') jamaahCount++;
            else if (p.status === 'alone') aloneCount++;
            else if (p.status === 'late') lateCount++;
        });
        const totalPrayed = jamaahCount + aloneCount + lateCount;
        
        const statusSummary = {
            jamaah: { count: jamaahCount, percentage: totalPrayed > 0 ? Math.round((jamaahCount / totalPrayed) * 100) : 0 },
            onTime: { count: aloneCount, percentage: totalPrayed > 0 ? Math.round((aloneCount / totalPrayed) * 100) : 0 },
            late: { count: lateCount, percentage: totalPrayed > 0 ? Math.round((lateCount / totalPrayed) * 100) : 0 },
            notPrayed: { count: notPrayedCount, percentage: notPrayedPercentage },
        };

        const prayerSummary = PRAYERS_CONFIG.map(config => {
            const allPrayersForThisType = allPrayers.filter(p => p.prayer_name === config.name);
            const pastPrayersForThisType = pastPrayers.filter(p => p.prayer_name === config.name);
            const totalForThisType = allPrayersForThisType.length;
            
            const notPrayedForThisType = uniquePastDays.size - pastPrayersForThisType.length;
            const totalPossibleForThisTypePast = uniquePastDays.size;

            let typeJamaah = 0, typeAlone = 0, typeLate = 0;
            allPrayersForThisType.forEach(p => {
                if (p.status === 'jamaah') typeJamaah++;
                else if (p.status === 'alone') typeAlone++;
                else if (p.status === 'late') typeLate++;
            });
            return {
                name: config.name, Icon: config.Icon,
                stats: [
                    { status: 'jamaah', percentage: totalForThisType > 0 ? Math.round((typeJamaah / totalForThisType) * 100) : 0, color: PRAYER_STATUS_COLORS.jamaah },
                    { status: 'alone', percentage: totalForThisType > 0 ? Math.round((typeAlone / totalForThisType) * 100) : 0, color: PRAYER_STATUS_COLORS.alone },
                    { status: 'late', percentage: totalForThisType > 0 ? Math.round((typeLate / totalForThisType) * 100) : 0, color: PRAYER_STATUS_COLORS.late },
                    { status: 'missed', percentage: totalPossibleForThisTypePast > 0 ? Math.round((notPrayedForThisType / totalPossibleForThisTypePast) * 100) : 0, color: PRAYER_STATUS_COLORS.missed },
                ]
            }
        });
        setSummaryStats({ statusSummary, prayerSummary });
    } catch (error) {
      console.error("Error loading summary stats:", error);
    } finally {
      setSummaryLoading(false);
    }
  }, [userId, getPrayerDataForDateRange]);

  const loadHeatmapData = useCallback(async () => {
    if (!userId) {
      setHeatmapLoading(false);
      return;
    }
    setHeatmapLoading(true);
    try {
        const heatmapStartDate = getLocalYYYYMMDD(getSevenDayInterval(intervalStartDate)[0]);
        const heatmapEndDate = getLocalYYYYMMDD(getSevenDayInterval(intervalStartDate)[6]);
        const weeklyPrayers = await getPrayerDataForDateRange(heatmapStartDate, heatmapEndDate);
        setHeatmapData(weeklyPrayers);
    } catch (error) {
        console.error("Error loading heatmap data:", error);
    } finally {
        setHeatmapLoading(false);
    }
  }, [userId, intervalStartDate, getPrayerDataForDateRange]);
  
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        loadSummaryData();
        loadHeatmapData();
      }
    }, [userId, loadSummaryData, loadHeatmapData])
  );

  useEffect(() => {
    if (userId) {
        loadHeatmapData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalStartDate]);

  const currentIntervalDates = getSevenDayInterval(intervalStartDate);
  const displayStartDate = currentIntervalDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const displayEndDate = currentIntervalDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const isNextIntervalDisabled = getLocalYYYYMMDD(intervalStartDate) >= getLocalYYYYMMDD(new Date(new Date().setDate(new Date().getDate() - 6)));
  const goToPreviousInterval = () => setIntervalStartDate(d => new Date(d.setDate(d.getDate() - 7)));
  const goToNextInterval = () => setIntervalStartDate(d => new Date(d.setDate(d.getDate() + 7)));
  const handleConfirmDate = (date) => { setIntervalStartDate(date); setDatePickerVisibility(false); };

  const PrayerHeatmap = ({ prayerData, dates, isLoading }) => {
    const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const prayerIcons = [
        <Sunrise key="Fajr" size={18} color={colors.textSecondary}/>, 
        <Sun key="Dhuhr" size={18} color={colors.textSecondary}/>, 
        <CloudSun key="Asr" size={18} color={colors.textSecondary}/>, 
        <Sunset key="Maghrib" size={18} color={colors.textSecondary}/>, 
        <Moon key="Isha" size={18} color={colors.textSecondary}/>
    ];
    return (
      <View style={styles.heatmapContainer}>
        {isLoading && (
          <View style={styles.heatmapLoadingOverlay}><ActivityIndicator color={colors.primary} /></View>
        )}
        <View style={styles.heatmapIcons}>{prayerIcons.map((icon, index) => <View key={index} style={styles.iconCell}>{icon}</View>)}</View>
        <View style={styles.heatmapGrid}>
          {dates.map(date => {
            const dateString = getLocalYYYYMMDD(date);
            const prayersForDay = prayerData.filter(p => p.prayer_date === dateString);
            return (
              <View key={dateString} style={styles.dayColumn}>
                <Text style={styles.dayHeader}>{date.getDate()}</Text>
                {prayerOrder.map(prayerName => {
                  const prayer = prayersForDay.find(p => p.prayer_name === prayerName);
                  return <View key={prayerName} style={[styles.dayCell, { backgroundColor: PRAYER_STATUS_COLORS[prayer?.status] || colors.border }]} />;
                })}
              </View>
            );
          })}
        </View>
      </View>
    );
  };
  const StatusSummaryCard = ({ icon, title, percentage, count, color }) => (
    <View style={styles.summaryCard}>
      <View style={styles.summaryCardHeader}>
        {icon}
        <Text style={[styles.summaryCardTitle, { color }]}>{title}</Text>
      </View>
      <Text style={styles.summaryCardPercentage}>{percentage}%</Text>
      <Text style={styles.summaryCardCount}>{count} times</Text>
    </View>
  );
  const MultiSegmentProgressBar = ({ segments }) => (
    <View style={styles.progressBarContainer}>
      {segments.map((segment, index) => {
        if (segment.percentage === 0) return null;
        return <View key={index} style={{ backgroundColor: segment.color, width: `${segment.percentage}%`, height: '100%' }} />;
      })}
    </View>
  );
  const PrayerSummaryCard = ({ prayerName, icon, stats }) => (
    <View style={styles.prayerCard}>
      <View style={styles.prayerCardHeader}>
        {React.cloneElement(icon, { color: colors.textSecondary })}
        <Text style={styles.prayerName}>{prayerName}</Text>
      </View>
      <MultiSegmentProgressBar segments={stats} />
      <View style={styles.prayerStatsRow}>
        <View style={styles.prayerStat}><Users size={14} color={PRAYER_STATUS_COLORS.jamaah} /><Text style={styles.prayerStatText}>{stats.find(s => s.status === 'jamaah')?.percentage || 0}%</Text></View>
        <View style={styles.prayerStat}><User size={14} color={PRAYER_STATUS_COLORS.alone} /><Text style={styles.prayerStatText}>{stats.find(s => s.status === 'alone')?.percentage || 0}%</Text></View>
        <View style={styles.prayerStat}><Clock size={14} color={PRAYER_STATUS_COLORS.late} /><Text style={styles.prayerStatText}>{stats.find(s => s.status === 'late')?.percentage || 0}%</Text></View>
        <View style={styles.prayerStat}><XCircle size={14} color={PRAYER_STATUS_COLORS.missed} /><Text style={styles.prayerStatText}>{stats.find(s => s.status === 'missed')?.percentage || 0}%</Text></View>
      </View>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Statistics</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Weekly Heatmap</Text>
            <View style={styles.dateIntervalContainer}>
                <TouchableOpacity onPress={goToPreviousInterval} style={styles.arrowButton}><ArrowLeft size={20} color={colors.text} /></TouchableOpacity>
                <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.dateDisplayButton}>
                    <CalendarIcon size={20} color={colors.primary} />
                    <Text style={styles.dateDisplayText}>{displayStartDate} - {displayEndDate}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={goToNextInterval} disabled={isNextIntervalDisabled} style={[styles.arrowButton, isNextIntervalDisabled && styles.disabledArrowButton]}><ArrowRight size={20} color={isNextIntervalDisabled ? colors.textSecondary : colors.text} /></TouchableOpacity>
            </View>
            <PrayerHeatmap prayerData={heatmapData} dates={currentIntervalDates} isLoading={heatmapLoading}/>
        </View>
        <DateTimePickerModal 
          isVisible={isDatePickerVisible} 
          mode="date" 
          onConfirm={handleConfirmDate} 
          onCancel={() => setDatePickerVisibility(false)} 
          date={intervalStartDate}
          isDarkModeEnabled={theme === 'dark'}
        />

        {summaryLoading ? <ActivityIndicator style={{ marginTop: 40 }} size="large" color={colors.primary} /> : (
            <>
                <Text style={styles.sectionTitle}>All-Time Status Summary</Text>
                <View style={styles.summaryGrid}>
                    <StatusSummaryCard icon={<Users size={24} color={PRAYER_STATUS_COLORS.jamaah} />} title="In Jamaa'ah" percentage={summaryStats.statusSummary.jamaah.percentage} count={summaryStats.statusSummary.jamaah.count} color={PRAYER_STATUS_COLORS.jamaah} />
                    <StatusSummaryCard icon={<User size={24} color={PRAYER_STATUS_COLORS.alone} />} title="On Time" percentage={summaryStats.statusSummary.onTime.percentage} count={summaryStats.statusSummary.onTime.count} color={PRAYER_STATUS_COLORS.alone} />
                    <StatusSummaryCard icon={<Clock size={24} color={PRAYER_STATUS_COLORS.late} />} title="Late" percentage={summaryStats.statusSummary.late.percentage} count={summaryStats.statusSummary.late.count} color={PRAYER_STATUS_COLORS.late} />
                    <StatusSummaryCard icon={<XCircle size={24} color={PRAYER_STATUS_COLORS.missed} />} title="Not Prayed" percentage={summaryStats.statusSummary.notPrayed.percentage} count={summaryStats.statusSummary.notPrayed.count} color={PRAYER_STATUS_COLORS.missed} />
                </View>
                <Text style={styles.sectionTitle}>All-Time Prayer Summary</Text>
                {summaryStats.prayerSummary.map((prayer, index) => <PrayerSummaryCard key={index} prayerName={prayer.name} icon={prayer.Icon} stats={prayer.stats} />)}
            </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

