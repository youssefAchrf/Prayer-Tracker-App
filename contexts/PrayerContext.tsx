// contexts/PrayerContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
import { Prayer, PrayerStatus, MonthlyStats } from '@/types/prayer';
import { Alert } from 'react-native';

interface PrayerContextType {
  displayedPrayers: Prayer[];
  updatePrayerStatus: (prayerName: string, status: PrayerStatus, date: Date) => void;
  loadPrayersForDate: (date: Date) => Promise<void>;
  getPrayerDataForMonth: (year: number, month: number) => Promise<Array<{ prayer_date: string; status: PrayerStatus }>>;
  getPrayerDataForDateRange: (startDate: string, endDate: string) => Promise<Array<{ prayer_date: string; prayer_name: string; status: PrayerStatus }>>;
  loading: boolean;
}

const PrayerContext = createContext<PrayerContextType | undefined>(undefined);

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

const formatTo12Hour = (time24: string): string => {
    if (!time24) return '--:--';
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
};

export function PrayerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { profile } = useSupabaseUser();
  const [displayedPrayers, setDisplayedPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (profile) {
      loadPrayersForDate(currentDate);
    }
  }, [profile?.timezone_city, profile?.timezone_country]);

  const fetchPrayerTimes = async (date: Date) => {
    const dateString = getLocalYYYYMMDD(date);
    const city = profile?.timezone_city || 'Cairo';
    const country = profile?.timezone_country || 'Egypt';

    try {
      const response = await fetch(`https://api.aladhan.com/v1/timingsByCity/${dateString}?city=${city}&country=${country}&method=5`);
      const data = await response.json();
      if (data.code === 200) return data.data.timings;
    } catch (error) {
      console.error("Failed to fetch prayer times:", error);
    }
    return null;
  };

  const loadPrayersForDate = async (date: Date) => {
    setCurrentDate(date);
    if (!user) { setLoading(false); return; };
    setLoading(true);

    const prayerTimes = await fetchPrayerTimes(date);
    const dateString = getLocalYYYYMMDD(date);
    const { data: prayerStatuses, error } = await supabase.from('prayers').select('prayer_name, status').eq('user_id', user.id).eq('prayer_date', dateString);
    if (error) console.error("Error fetching prayer statuses:", error);

    const updatedPrayers = DEFAULT_PRAYERS.map(prayerInfo => ({
        ...prayerInfo,
        time: prayerTimes ? formatTo12Hour(prayerTimes[prayerInfo.name]) : '--:--',
        status: prayerStatuses?.find(p => p.prayer_name === prayerInfo.name)?.status || null,
    }));

    setDisplayedPrayers(updatedPrayers);
    setLoading(false);
  };
  
  const updatePrayerStatus = async (prayerName: string, status: PrayerStatus, date: Date) => {
    if (!user) return;
    const dateString = getLocalYYYYMMDD(date);
    let newStatus: PrayerStatus | null = status;

    const currentPrayer = displayedPrayers.find(p => p.name === prayerName);
    if (currentPrayer && currentPrayer.status === status) {
      newStatus = null;
    }

    const updatedPrayers = displayedPrayers.map(p =>
      p.name === prayerName ? { ...p, status: newStatus } : p
    );
    setDisplayedPrayers(updatedPrayers);
    
    const { error } = await supabase.from('prayers').upsert({
      user_id: user.id,
      prayer_date: dateString,
      prayer_name: prayerName,
      status: newStatus,
    }, { onConflict: 'user_id, prayer_date, prayer_name' });

    if (error) {
      Alert.alert("Error", "Could not save your prayer.");
      loadPrayersForDate(date);
    }
  };

  const getPrayerDataForMonth = async (year: number, month: number): Promise<Array<{ prayer_date: string; status: PrayerStatus }>> => {
    if (!user) return [];
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const nextMonth = new Date(year, month + 1, 1);
    const endDate = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-01`;
    const { data, error } = await supabase.from('prayers').select('prayer_date, status').eq('user_id', user.id).gte('prayer_date', startDate).lt('prayer_date', endDate).not('status', 'is', null);
    if (error) { console.error("Error fetching monthly prayer data:", error); return []; }
    return data || [];
  };

  const getPrayerDataForDateRange = async (startDate: string, endDate: string) => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('prayers')
      .select('prayer_date, prayer_name, status')
      .eq('user_id', user.id)
      .gte('prayer_date', startDate)
      .lte('prayer_date', endDate)
      .not('status', 'is', null)
      .order('prayer_date', { ascending: false });
    if (error) {
      console.error("Error fetching prayer data for range:", error);
      return [];
    }
    return data || [];
  };

  return (
    <PrayerContext.Provider value={{ displayedPrayers, updatePrayerStatus, loadPrayersForDate, getPrayerDataForMonth, getPrayerDataForDateRange, loading }}>
      {children}
    </PrayerContext.Provider>
  );
}

export function usePrayer() {
  const context = useContext(PrayerContext);
  if (context === undefined) throw new Error('usePrayer must be used within a PrayerProvider');
  return context;
}
