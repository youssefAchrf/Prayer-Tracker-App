import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Moon, Sun } from 'lucide-react-native';
import { PrayerCard } from '@/components/PrayerCard';
import { ProgressCircle } from '@/components/ProgressCircle';
import { usePrayer } from '@/contexts/PrayerContext';

export default function HomeScreen() {
  const { todayPrayers, updatePrayerStatus, loading } = usePrayer();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
      return <Sun size={24} color="#f59e0b" />;
    }
    return <Moon size={24} color="#6366f1" />;
  };

  const getTodayStats = () => {
    const completed = todayPrayers.filter(p => p.status && p.status !== 'missed').length;
    const jamaah = todayPrayers.filter(p => p.status === 'jamaah').length;
    const onTime = todayPrayers.filter(p => p.status === 'jamaah' || p.status === 'alone').length;
    
    return {
      completed: (completed / 5) * 100,
      jamaah: (jamaah / 5) * 100,
      onTime: (onTime / 5) * 100,
    };
  };

  const stats = getTodayStats();

  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#059669', '#0d9488']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.greetingContainer}>
            {getGreetingIcon()}
            <Text style={styles.greeting}>{getGreeting()}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Calendar size={16} color="#ffffff" />
            <Text style={styles.date}>{formatDate()}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <View style={styles.progressRow}>
            <ProgressCircle
              percentage={stats.completed}
              size={80}
              strokeWidth={6}
              color="#059669"
              label="Completed"
              value={`${todayPrayers.filter(p => p.status && p.status !== 'missed').length}/5`}
            />
            <ProgressCircle
              percentage={stats.jamaah}
              size={80}
              strokeWidth={6}
              color="#0d9488"
              label="Jamaa'ah"
              value={`${todayPrayers.filter(p => p.status === 'jamaah').length}/5`}
            />
            <ProgressCircle
              percentage={stats.onTime}
              size={80}
              strokeWidth={6}
              color="#f59e0b"
              label="On Time"
              value={`${todayPrayers.filter(p => p.status === 'jamaah' || p.status === 'alone').length}/5`}
            />
          </View>
        </View>

        <View style={styles.prayersContainer}>
          <Text style={styles.sectionTitle}>Today's Prayers</Text>
          {todayPrayers.map((prayer, index) => (
            <PrayerCard
              key={`${prayer.name}-${index}`}
              prayer={prayer}
              onStatusChange={(status) => updatePrayerStatus(prayer.name, status)}
            />
          ))}
        </View>

        <View style={styles.motivationContainer}>
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.motivationCard}
          >
            <Text style={styles.motivationText}>
              "Verily, in the remembrance of Allah do hearts find rest." - Quran 13:28
            </Text>
          </LinearGradient>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    gap: 8,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  prayersContainer: {
    marginBottom: 32,
  },
  motivationContainer: {
    marginBottom: 32,
  },
  motivationCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  motivationText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
  },
});