
// project/app/(tabs)/statistics.tsx

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { usePrayer } from '@/contexts/PrayerContext';
import { useAuth } from '@/contexts/AuthContext';
import { useFocusEffect } from 'expo-router';
import { Users, User, Clock, XCircle, Moon, Sun, Sunrise, Sunset, CloudSun, Calendar as CalendarIcon, ArrowLeft, ArrowRight } from 'lucide-react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const PRAYER_STATUS_COLORS = {
  jamaah: '#22c55e',
  alone: '#89CFF0',
  late: '#ffd700',
  missed: '#ae0303ff',
  not_prayed: '#e5e7eb',
};

// HELPER FUNCTIONS (No changes)
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

// UI COMPONENTS (No changes)
const PrayerHeatmap = ({ prayerData, dates, isLoading }) => {
  const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const prayerIcons = [<Sunrise key="Fajr" size={18} />, <Sun key="Dhuhr" size={18} />, <CloudSun key="Asr" size={18} />, <Sunset key="Maghrib" size={18} />, <Moon key="Isha" size={18} />];
  return (
    <View style={styles.heatmapContainer}>
      {isLoading ? (
        <View style={styles.heatmapLoadingOverlay}><ActivityIndicator color="#059669" /></View>
      ) : (
        <>
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
                    return <View key={prayerName} style={[styles.dayCell, { backgroundColor: PRAYER_STATUS_COLORS[prayer?.status] || PRAYER_STATUS_COLORS.not_prayed }]} />;
                  })}
                </View>
              );
            })}
          </View>
        </>
      )}
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
      {icon}
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

export default function StatisticsScreen() {
  const { user } = useAuth();
  const { getPrayerDataForDateRange } = usePrayer();
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [heatmapLoading, setHeatmapLoading] = useState(true);
  const [summaryStats, setSummaryStats] = useState({ statusSummary: { jamaah: 0, onTime: 0, late: 0, notPrayed: 0 }, prayerSummary: [] });
  const [heatmapData, setHeatmapData] = useState([]);
  const [intervalStartDate, setIntervalStartDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 6); return d; });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const isInitialLoad = useRef(true);

  const PRAYERS_CONFIG = [
    { name: 'Fajr', Icon: <Sunrise size={24} color="#4b5563" /> }, { name: 'Dhuhr', Icon: <Sun size={24} color="#4b5563" /> },
    { name: 'Asr', Icon: <CloudSun size={24} color="#4b5563" /> }, { name: 'Maghrib', Icon: <Sunset size={24} color="#4b5563" /> },
    { name: 'Isha', Icon: <Moon size={24} color="#4b5563" /> },
  ];

  const loadSummaryData = useCallback(async () => {
    if (!user) return;
    setSummaryLoading(true);
    const allPrayers = await getPrayerDataForDateRange('2020-01-01', getLocalYYYYMMDD(new Date()));
    if (allPrayers.length > 0) {
        let jamaahCount = 0, aloneCount = 0, lateCount = 0;
        allPrayers.forEach(p => {
            if (p.status === 'jamaah') jamaahCount++;
            else if (p.status === 'alone') aloneCount++;
            else if (p.status === 'late') lateCount++;
        });
        const totalPrayed = jamaahCount + aloneCount + lateCount;
        const uniqueDays = new Set(allPrayers.map(p => p.prayer_date));
        const totalPossiblePrayers = uniqueDays.size * 5;
        const notPrayedCount = totalPossiblePrayers - totalPrayed;
        const statusSummary = {
            jamaah: { count: jamaahCount, percentage: totalPrayed > 0 ? Math.round((jamaahCount / totalPrayed) * 100) : 0 },
            onTime: { count: aloneCount, percentage: totalPrayed > 0 ? Math.round((aloneCount / totalPrayed) * 100) : 0 },
            late: { count: lateCount, percentage: totalPrayed > 0 ? Math.round((lateCount / totalPrayed) * 100) : 0 },
            notPrayed: { count: notPrayedCount, percentage: totalPossiblePrayers > 0 ? Math.round((notPrayedCount / totalPossiblePrayers) * 100) : 0 },
        };
        const prayerSummary = PRAYERS_CONFIG.map(config => {
            const prayersForThisType = allPrayers.filter(p => p.prayer_name === config.name);
            const totalForThisType = prayersForThisType.length;
            const notPrayedForThisType = uniqueDays.size - totalForThisType;
            const totalPossibleForThisType = uniqueDays.size;
            let typeJamaah = 0, typeAlone = 0, typeLate = 0;
            prayersForThisType.forEach(p => {
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
                    { status: 'missed', percentage: totalPossibleForThisType > 0 ? Math.round((notPrayedForThisType / totalPossibleForThisType) * 100) : 0, color: PRAYER_STATUS_COLORS.missed },
                ]
            }
        });
        setSummaryStats({ statusSummary, prayerSummary });
    }
    setSummaryLoading(false);
  }, [user]);

  const loadHeatmapData = useCallback(async () => {
    if (!user) return;
    setHeatmapLoading(true);
    const heatmapStartDate = getLocalYYYYMMDD(getSevenDayInterval(intervalStartDate)[0]);
    const heatmapEndDate = getLocalYYYYMMDD(getSevenDayInterval(intervalStartDate)[6]);
    const weeklyPrayers = await getPrayerDataForDateRange(heatmapStartDate, heatmapEndDate);
    setHeatmapData(weeklyPrayers);
    setHeatmapLoading(false);
  }, [user, intervalStartDate]);

  // --- 1. FULL REFRESH WHEN TAB IS FOCUSED ---
  useFocusEffect(
    useCallback(() => {
      isInitialLoad.current = true; // Set flag to prevent second effect from running
      loadSummaryData();
      loadHeatmapData();
    }, [loadSummaryData, loadHeatmapData])
  );

  // --- 2. REFRESH ONLY HEATMAP WHEN DATE CHANGES ---
  useEffect(() => {
    // Skip the very first run because useFocusEffect already handled it
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    // Subsequent runs are triggered only by user changing the date interval
    loadHeatmapData();
  }, [intervalStartDate, loadHeatmapData]);

  // --- UI and Handlers ---
  const currentIntervalDates = getSevenDayInterval(intervalStartDate);
  const displayStartDate = currentIntervalDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const displayEndDate = currentIntervalDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const isNextIntervalDisabled = getLocalYYYYMMDD(intervalStartDate) >= getLocalYYYYMMDD(new Date(new Date().setDate(new Date().getDate() - 6)));
  const goToPreviousInterval = () => setIntervalStartDate(d => new Date(d.setDate(d.getDate() - 7)));
  const goToNextInterval = () => setIntervalStartDate(d => new Date(d.setDate(d.getDate() + 7)));
  const handleConfirmDate = (date) => { setIntervalStartDate(date); setDatePickerVisibility(false); };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Statistics</Text></View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Weekly Heatmap</Text>
            <View style={styles.dateIntervalContainer}>
                <TouchableOpacity onPress={goToPreviousInterval} style={styles.arrowButton}><ArrowLeft size={20} color="#374151" /></TouchableOpacity>
                <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.dateDisplayButton}>
                    <CalendarIcon size={20} color="#059669" />
                    <Text style={styles.dateDisplayText}>{displayStartDate} - {displayEndDate}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={goToNextInterval} disabled={isNextIntervalDisabled} style={[styles.arrowButton, isNextIntervalDisabled && styles.disabledArrowButton]}><ArrowRight size={20} color={isNextIntervalDisabled ? '#9ca3af' : '#374151'} /></TouchableOpacity>
            </View>
            <PrayerHeatmap prayerData={heatmapData} dates={currentIntervalDates} isLoading={heatmapLoading}/>
        </View>
        <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirmDate} onCancel={() => setDatePickerVisibility(false)} date={intervalStartDate}/>

        {summaryLoading ? <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#059669" /> : (
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

// STYLES (No changes)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { paddingVertical: 20, paddingHorizontal: 20 },
  headerTitle: { fontSize: 24, fontFamily: 'Inter-Bold', textAlign: 'center', color: '#1f2937' },
  content: { paddingHorizontal: 16, paddingBottom: 32 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  dateIntervalContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f3f4f6', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10, marginBottom: 16 },
  arrowButton: { padding: 8 },
  disabledArrowButton: { opacity: 0.4 },
  dateDisplayButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dateDisplayText: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: '#1f2937' },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: '#374155', marginBottom: 16, marginTop: 16 },
  heatmapContainer: { flexDirection: 'row', alignItems: 'center', minHeight: 120 },
  heatmapLoadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 10, borderRadius: 16 },
  heatmapIcons: { marginRight: 10, gap: 4, alignItems: 'center' },
  heatmapGrid: { flexDirection: 'row', flex: 1, justifyContent: 'space-around' },
  dayColumn: { alignItems: 'center', gap: 4 },
  dayHeader: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: '#6b7280', marginBottom: 4 },
  dayCell: { width: 24, height: 24, borderRadius: 6 },
  iconCell: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  summaryCard: { width: '48%', backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  summaryCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  summaryCardTitle: { marginLeft: 8, fontSize: 14, fontFamily: 'Inter-SemiBold' },
  summaryCardPercentage: { fontSize: 28, fontFamily: 'Inter-Bold', color: '#1f2937' },
  summaryCardCount: { fontSize: 12, fontFamily: 'Inter-Regular', color: '#6b7280', marginTop: 4 },
  prayerCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  prayerCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  prayerName: { fontSize: 16, fontFamily: 'Inter-Bold', color: '#1f2937', marginLeft: 12 },
  progressBarContainer: { height: 8, borderRadius: 4, backgroundColor: '#e5e7eb', flexDirection: 'row', overflow: 'hidden', marginBottom: 12 },
  prayerStatsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  prayerStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  prayerStatText: { fontSize: 12, fontFamily: 'Inter-Medium', color: '#4b5563' },
});