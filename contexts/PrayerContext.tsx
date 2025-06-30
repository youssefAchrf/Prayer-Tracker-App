
// import React, { createContext, useContext, useState } from 'react';
// import { supabase } from '@/lib/supabase';
// import { useAuth } from '@/contexts/AuthContext';
// import { Prayer, PrayerStatus, MonthlyStats } from '@/types/prayer';
// import { Alert } from 'react-native';

// interface PrayerContextType {
//   displayedPrayers: Prayer[];
//   updatePrayerStatus: (prayerName: string, status: PrayerStatus, date: Date) => void;
//   loadPrayersForDate: (date: Date) => Promise<void>;
//   getAllTimeStats: () => Promise<MonthlyStats>;
//   loading: boolean;
// }

// const PrayerContext = createContext<PrayerContextType | undefined>(undefined);

// const DEFAULT_PRAYERS: Prayer[] = [
//     { name: 'Fajr', arabicName: 'الفجر', time: '05:30' },
//     { name: 'Dhuhr', arabicName: 'الظهر', time: '12:30' },
//     { name: 'Asr', arabicName: 'العصر', time: '15:45' },
//     { name: 'Maghrib', arabicName: 'المغرب', time: '18:15' },
//     { name: 'Isha', arabicName: 'العشاء', time: '19:45' },
// ];

// const getLocalYYYYMMDD = (date: Date): string => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
// };

// export function PrayerProvider({ children }: { children: React.ReactNode }) {
//   const { user } = useAuth();
//   const [displayedPrayers, setDisplayedPrayers] = useState<Prayer[]>(DEFAULT_PRAYERS);
//   const [loading, setLoading] = useState(true);

//   const loadPrayersForDate = async (date: Date) => {
//     if (!user) {
//         setDisplayedPrayers(DEFAULT_PRAYERS);
//         setLoading(false);
//         return;
//     };
//     setLoading(true);
//     const dateString = getLocalYYYYMMDD(date);

//     const { data, error } = await supabase
//       .from('prayers')
//       .select('prayer_name, status')
//       .eq('user_id', user.id)
//       .eq('prayer_date', dateString);

//     if (error) {
//       console.error("Error fetching prayers:", error);
//     } else {
//       const updatedPrayers = DEFAULT_PRAYERS.map(defaultPrayer => {
//         const fetchedPrayer = data?.find(p => p.prayer_name === defaultPrayer.name);
//         return { ...defaultPrayer, status: fetchedPrayer?.status || null };
//       });
//       setDisplayedPrayers(updatedPrayers);
//     }
//     setLoading(false);
//   };

//   const updatePrayerStatus = async (prayerName: string, status: PrayerStatus, date: Date) => {
//     if (!user) return;
//     const dateString = getLocalYYYYMMDD(date);
//     let newStatus: PrayerStatus | null = status;

//     const currentPrayer = displayedPrayers.find(p => p.name === prayerName);
//     if (currentPrayer && currentPrayer.status === status) {
//       newStatus = null; // Toggle off logic
//     }

//     const updatedPrayers = displayedPrayers.map(p =>
//       p.name === prayerName ? { ...p, status: newStatus } : p
//     );
//     setDisplayedPrayers(updatedPrayers);
    
//     const { error } = await supabase.from('prayers').upsert({
//       user_id: user.id,
//       prayer_date: dateString,
//       prayer_name: prayerName,
//       status: newStatus,
//     }, { onConflict: 'user_id, prayer_date, prayer_name' });

//     if (error) {
//       Alert.alert("Error", "Could not save your prayer.");
//       loadPrayersForDate(date);
//     }
//   };

//   const getAllTimeStats = async (): Promise<MonthlyStats> => {
//     if (!user) return { totalPrayers: 0, onTime: 0, jamaah: 0, late: 0 };

//     const { data, error, count } = await supabase
//       .from('prayers')
//       .select('status', { count: 'exact' })
//       .eq('user_id', user.id)
//       .not('status', 'is', null);
    
//     if (error) {
//       console.error("Error fetching all-time stats:", error);
//       return { totalPrayers: 0, onTime: 0, jamaah: 0, late: 0 };
//     }

//     const stats: MonthlyStats = { totalPrayers: count || 0, onTime: 0, jamaah: 0, late: 0 };
//     data?.forEach(prayer => {
//       if (prayer.status === 'jamaah') {
//         stats.jamaah++;
//         stats.onTime++;
//       } else if (prayer.status === 'alone') {
//         stats.onTime++;
//       } else if (prayer.status === 'late') {
//         stats.late++;
//       }
//     });

//     return stats;
//   };

//   return (
//     <PrayerContext.Provider value={{
//       displayedPrayers,
//       updatePrayerStatus,
//       loadPrayersForDate,
//       getAllTimeStats,
//       loading,
//     }}>
//       {children}
//     </PrayerContext.Provider>
//   );
// }

// export function usePrayer() {
//   const context = useContext(PrayerContext);
//   if (context === undefined) {
//     throw new Error('usePrayer must be used within a PrayerProvider');
//   }
//   return context;
// }
import React, { createContext, useContext, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Prayer, PrayerStatus, MonthlyStats } from '@/types/prayer';
import { Alert } from 'react-native';

interface PrayerContextType {
  displayedPrayers: Prayer[];
  updatePrayerStatus: (prayerName: string, status: PrayerStatus, date: Date) => void;
  loadPrayersForDate: (date: Date) => Promise<void>;
  getAllTimeStats: () => Promise<MonthlyStats>;
  loading: boolean;
}

const PrayerContext = createContext<PrayerContextType | undefined>(undefined);

// The default prayers no longer need hardcoded times.
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

export function PrayerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [displayedPrayers, setDisplayedPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);

  // --- NEW FUNCTION TO FETCH PRAYER TIMES ---
  const fetchPrayerTimes = async (date: Date) => {
    const dateString = getLocalYYYYMMDD(date);
    try {
      // API call to get timings for Cairo, Egypt using the Egyptian method (5)
      const response = await fetch(`https://api.aladhan.com/v1/timingsByCity/${dateString}?city=Cairo&country=Egypt&method=5`);
      const data = await response.json();
      
      if (data.code === 200) {
        // Return a simple object with just the times we need
        const times = data.data.timings;
        return {
          Fajr: times.Fajr,
          Dhuhr: times.Dhuhr,
          Asr: times.Asr,
          Maghrib: times.Maghrib,
          Isha: times.Isha,
        };
      }
    } catch (error) {
      console.error("Failed to fetch prayer times:", error);
    }
    return null; // Return null if fetching fails
  };

  const loadPrayersForDate = async (date: Date) => {
    if (!user) {
        setLoading(false);
        return;
    };
    setLoading(true);

    // 1. Fetch the correct prayer times for the selected date
    const prayerTimes = await fetchPrayerTimes(date);
    
    // 2. Fetch the user's prayer statuses for that date from Supabase
    const dateString = getLocalYYYYMMDD(date);
    const { data: prayerStatuses, error } = await supabase
      .from('prayers')
      .select('prayer_name, status')
      .eq('user_id', user.id)
      .eq('prayer_date', dateString);

    if (error) {
      console.error("Error fetching prayer statuses:", error);
    }

    // 3. Combine the times and statuses
    const updatedPrayers = DEFAULT_PRAYERS.map(prayerInfo => {
      const statusData = prayerStatuses?.find(p => p.prayer_name === prayerInfo.name);
      return {
        ...prayerInfo,
        time: prayerTimes?.[prayerInfo.name] || '--:--', // Use fetched time or a placeholder
        status: statusData?.status || null,
      };
    });

    setDisplayedPrayers(updatedPrayers);
    setLoading(false);
  };
  
  // The rest of your functions (updatePrayerStatus, getAllTimeStats) remain the same
  // ... (paste your existing updatePrayerStatus and getAllTimeStats functions here) ...

  const updatePrayerStatus = async (prayerName: string, status: PrayerStatus, date: Date) => {
    if (!user) return;
    const dateString = getLocalYYYYMMDD(date);
    let newStatus: PrayerStatus | null = status;

    const currentPrayer = displayedPrayers.find(p => p.name === prayerName);
    if (currentPrayer && currentPrayer.status === status) {
      newStatus = null; // Toggle off logic
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

  const getAllTimeStats = async (): Promise<MonthlyStats> => {
      if (!user) return { totalPrayers: 0, onTime: 0, jamaah: 0, late: 0 };

      const { data, error, count } = await supabase
        .from('prayers')
        .select('status', { count: 'exact' })
        .eq('user_id', user.id)
        .not('status', 'is', null);
      
      if (error) {
        console.error("Error fetching all-time stats:", error);
        return { totalPrayers: 0, onTime: 0, jamaah: 0, late: 0 };
      }
      const stats: MonthlyStats = { totalPrayers: count || 0, onTime: 0, jamaah: 0, late: 0 };
      data?.forEach(prayer => {
        if (prayer.status === 'jamaah') { stats.jamaah++; stats.onTime++; }
        else if (prayer.status === 'alone') { stats.onTime++; }
        else if (prayer.status === 'late') { stats.late++; }
      });
      return stats;
    };


  return (
    <PrayerContext.Provider value={{
      displayedPrayers,
      updatePrayerStatus,
      loadPrayersForDate,
      getAllTimeStats,
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