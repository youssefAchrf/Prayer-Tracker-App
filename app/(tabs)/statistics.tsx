import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp } from 'lucide-react-native';
import { ProgressCircle } from '@/components/ProgressCircle';
import { usePrayer } from '@/contexts/PrayerContext';

const screenWidth = Dimensions.get('window').width;

export default function StatisticsScreen() {
  const { getMonthlyStats, getPrayerHistory } = usePrayer();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthlyStats = getMonthlyStats(currentYear, currentMonth);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
  };

  const getWeeklyData = () => {
    const history = getPrayerHistory(7);
    const labels = history.reverse().map(day => {
      const date = new Date(day.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });

    const data = history.map(day => {
      const completed = day.prayers.filter(p => p.status && p.status !== 'missed').length;
      return completed;
    });

    return { labels, data };
  };

  const weeklyData = getWeeklyData();

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(5, 150, 105, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#059669',
    },
  };

  const barData = {
    labels: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'],
    datasets: [
      {
        data: [
          Math.floor(Math.random() * 30) + 15, // Random data for demo
          Math.floor(Math.random() * 30) + 15,
          Math.floor(Math.random() * 30) + 15,
          Math.floor(Math.random() * 30) + 15,
          Math.floor(Math.random() * 30) + 15,
        ],
        colors: [
          () => '#059669',
          () => '#0d9488',
          () => '#14b8a6',
          () => '#2dd4bf',
          () => '#5eead4',
        ],
      },
    ],
  };

  const getCompletionRate = () => {
    if (monthlyStats.totalPrayers === 0) return 0;
    return Math.round(((monthlyStats.onTime + monthlyStats.jamaah) / monthlyStats.totalPrayers) * 100);
  };

  const getJamaahRate = () => {
    if (monthlyStats.totalPrayers === 0) return 0;
    return Math.round((monthlyStats.jamaah / monthlyStats.totalPrayers) * 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Statistics</Text>
        <TrendingUp size={24} color="#059669" />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Month Navigator */}
        <View style={styles.monthNavigator}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateMonth('prev')}
          >
            <ChevronLeft size={20} color="#6b7280" />
          </TouchableOpacity>
          
          <View style={styles.monthDisplay}>
            <Calendar size={16} color="#059669" />
            <Text style={styles.monthText}>
              {monthNames[currentMonth]} {currentYear}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateMonth('next')}
          >
            <ChevronRight size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Monthly Overview */}
        <View style={styles.overviewCard}>
          <Text style={styles.cardTitle}>Monthly Overview</Text>
          <View style={styles.progressGrid}>
            <ProgressCircle
              percentage={getCompletionRate()}
              size={100}
              strokeWidth={8}
              color="#059669"
              label="Completion Rate"
              value={`${getCompletionRate()}%`}
            />
            <ProgressCircle
              percentage={getJamaahRate()}
              size={100}
              strokeWidth={8}
              color="#0d9488"
              label="Jamaa'ah Rate"
              value={`${getJamaahRate()}%`}
            />
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{monthlyStats.onTime}</Text>
              <Text style={styles.statLabel}>On Time</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{monthlyStats.jamaah}</Text>
              <Text style={styles.statLabel}>Jamaa'ah</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{monthlyStats.late}</Text>
              <Text style={styles.statLabel}>Late</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{monthlyStats.missed}</Text>
              <Text style={styles.statLabel}>Missed</Text>
            </View>
          </View>
        </View>

        {/* Weekly Trend */}
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Weekly Trend</Text>
          <LineChart
            data={{
              labels: weeklyData.labels,
              datasets: [
                {
                  data: weeklyData.data,
                },
              ],
            }}
            width={screenWidth - 60}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Prayer Distribution */}
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Prayer Distribution (This Month)</Text>
          <BarChart
            data={barData}
            width={screenWidth - 60}
            height={200}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
            withCustomBarColorFromData
            flatColor
          />
        </View>

        {/* Achievements */}
        <View style={styles.achievementsCard}>
          <Text style={styles.cardTitle}>Achievements</Text>
          <View style={styles.achievementsList}>
            <View style={styles.achievement}>
              <View style={[styles.achievementIcon, { backgroundColor: '#059669' }]}>
                <Text style={styles.achievementEmoji}>🎯</Text>
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>Perfect Week</Text>
                <Text style={styles.achievementDesc}>Complete all prayers for 7 days</Text>
              </View>
            </View>
            
            <View style={styles.achievement}>
              <View style={[styles.achievementIcon, { backgroundColor: '#0d9488' }]}>
                <Text style={styles.achievementEmoji}>🕌</Text>
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>Jamaa'ah Champion</Text>
                <Text style={styles.achievementDesc}>Pray 20 times in congregation</Text>
              </View>
            </View>
            
            <View style={styles.achievement}>
              <View style={[styles.achievementIcon, { backgroundColor: '#f59e0b' }]}>
                <Text style={styles.achievementEmoji}>⭐</Text>
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>Consistent</Text>
                <Text style={styles.achievementDesc}>Pray for 30 consecutive days</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  monthNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  monthDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  monthText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
  },
  overviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 16,
  },
  progressGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#059669',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chart: {
    borderRadius: 16,
  },
  achievementsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementsList: {
    gap: 16,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementEmoji: {
    fontSize: 20,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
});