import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Prayer, DayPrayers, PrayerStatus, MonthlyStats } from '@/types/prayer';

interface PrayerContextType {
  todayPrayers: Prayer[];
  updatePrayerStatus: (prayerName: string, status: PrayerStatus) => void;
  getMonthlyStats: (year: number, month: number) => MonthlyStats;
  getPrayerHistory: (days: number) => DayPrayers[];
  loading: boolean;
}

const PrayerContext = createContext<PrayerContextType | undefined>(undefined);

const DEFAULT_PRAYERS: Prayer[] = [
  { name: 'Fajr', arabicName: 'الفجر', time: '05:30' },
  { name: 'Dhuhr', arabicName: 'الظهر', time: '12:30' },
  { name: 'Asr', arabicName: 'العصر', time: '15:45' },
  { name: 'Maghrib', arabicName: 'المغرب', time: '18:15' },
  { name: 'Isha', arabicName: 'العشاء', time: '19:45' },
];

export function PrayerProvider({ children }: { children: React.ReactNode }) {
  const [prayerData, setPrayerData] = useState<Record<string, DayPrayers>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrayerData();
  }, []);

  const loadPrayerData = async () => {
    try {
      const stored = await AsyncStorage.getItem('prayerData');
      if (stored) {
        setPrayerData(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load prayer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePrayerData = async (data: Record<string, DayPrayers>) => {
    try {
      await AsyncStorage.setItem('prayerData', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save prayer data:', error);
    }
  };

  const getTodayKey = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getTodayPrayers = (): Prayer[] => {
    const today = getTodayKey();
    const todayData = prayerData[today];
    
    if (todayData) {
      return todayData.prayers;
    }
    
    return DEFAULT_PRAYERS.map(prayer => ({ ...prayer }));
  };

  const updatePrayerStatus = (prayerName: string, status: PrayerStatus) => {
    const today = getTodayKey();
    const todayPrayers = getTodayPrayers();
    
    const updatedPrayers = todayPrayers.map(prayer =>
      prayer.name === prayerName ? { ...prayer, status } : prayer
    );

    const newData = {
      ...prayerData,
      [today]: {
        date: today,
        prayers: updatedPrayers,
      },
    };

    setPrayerData(newData);
    savePrayerData(newData);
  };

  const getMonthlyStats = (year: number, month: number): MonthlyStats => {
    const stats: MonthlyStats = {
      totalPrayers: 0,
      onTime: 0,
      jamaah: 0,
      late: 0,
      missed: 0,
    };

    Object.values(prayerData).forEach(day => {
      const date = new Date(day.date);
      if (date.getFullYear() === year && date.getMonth() === month) {
        day.prayers.forEach(prayer => {
          stats.totalPrayers++;
          if (prayer.status === 'jamaah') {
            stats.jamaah++;
            stats.onTime++;
          } else if (prayer.status === 'alone') {
            stats.onTime++;
          } else if (prayer.status === 'late') {
            stats.late++;
          } else {
            stats.missed++;
          }
        });
      }
    });

    return stats;
  };

  const getPrayerHistory = (days: number): DayPrayers[] => {
    const history: DayPrayers[] = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      const dayData = prayerData[dateKey];
      if (dayData) {
        history.push(dayData);
      } else {
        history.push({
          date: dateKey,
          prayers: DEFAULT_PRAYERS.map(prayer => ({ ...prayer })),
        });
      }
    }

    return history;
  };

  return (
    <PrayerContext.Provider value={{
      todayPrayers: getTodayPrayers(),
      updatePrayerStatus,
      getMonthlyStats,
      getPrayerHistory,
      loading,
    }}>
      {children}
    </PrayerContext.Provider>
  );
}

export function usePrayer() {
  const context = useContext(PrayerContext);
  if (context === undefined) {
    throw new Error('usePrayer must be used within a PrayerProvider');
  }
  return context;
}