import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
  ActivityIndicator, // We'll show a loading spinner
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Calendar, Moon, Sun, User as UserIcon } from 'lucide-react-native';
import { PrayerCard } from '@/components/PrayerCard';
import { ProgressCircle } from '@/components/ProgressCircle';
import { useUser } from '@/contexts/UserContext';
import { Prayer } from '@/types/prayer';
import { supabase } from '@/lib/supabase'; // Make sure this path to your Supabase client is correct

const DEFAULT_PRAYERS: Prayer[] = [
  { name: 'Fajr', arabicName: 'الفجر', time: '05:30' },
  { name: 'Dhuhr', arabicName: 'الظهر', time: '12:30' },
  { name: 'Asr', arabicName: 'العصر', time: '15:45' },
  { name: 'Maghrib', arabicName: 'المغرب', time: '18:15' },
  { name: 'Isha', arabicName: 'العشاء', time: '19:45' },
];

export default function FriendPrayerDetailScreen() {
  const { friendId } = useLocalSearchParams<{ friendId: string }>();
  const { friends } = useUser();
  
  // State to hold the real prayer data and loading status
  const [friendPrayers, setFriendPrayers] = useState<Prayer[]>(DEFAULT_PRAYERS);
  const [loading, setLoading] = useState(true);

  const friend = friends.find(f => f.id === friendId);

  useEffect(() => {
    // If we can't find the friend or don't have permission, don't do anything.
    if (!friend || !friend.canViewPrayers) {
      setLoading(false);
      return;
    }

    // IMPORTANT: Make sure `friend.id` is the actual Supabase auth user ID (UUID)
    // If Bolt stored it in another field like `friend.user_id`, change it here.
    const friend_user_id = friend.id;
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // This function fetches the initial data for today
    const fetchInitialData = async () => {
      const { data, error } = await supabase
        .from('prayer_logs') // Assumes your table is named 'prayer_logs'
        .select('prayer_name, status') // Select only the needed columns
        .eq('user_id', friend_user_id) // Filter by the friend's user ID
        .eq('date', today); // Filter for today's records

      if (error) {
        console.error("Error fetching friend's prayer data:", error);
        setLoading(false);
        return;
      }
      
      if (data) {
        // Merge the fetched data with the default prayer list
        // to ensure all 5 prayers are always displayed correctly.
        const updatedPrayers = DEFAULT_PRAYERS.map(defaultPrayer => {
          const fetchedPrayer = data.find(p => p.prayer_name === defaultPrayer.name);
          return {
            ...defaultPrayer,
            status: fetchedPrayer?.status, // Use real status if found, otherwise it's undefined (not prayed)
          };
        });
        setFriendPrayers(updatedPrayers);
      }
      setLoading(false);
    };

    // Fetch the data when the screen loads
    fetchInitialData();

    // Create a real-time subscription to listen for any changes
    const channel = supabase
      .channel(`friend-prayers-${friend_user_id}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'prayer_logs',
          filter: `user_id=eq.${friend_user_id}`, // IMPORTANT: Only get updates for this specific friend
        },
        (payload) => {
          // When a change is detected, simply re-fetch the data to update the UI
          console.log('Change received for friend!', payload);
          fetchInitialData();
        }
      )
      .subscribe();

    // This is a cleanup function. It runs when you navigate away from this screen
    // to remove the listener and prevent memory leaks.
    return () => {
      supabase.removeChannel(channel);
    };
  }, [friendId, friend?.canViewPrayers]); // Re-run this effect if the friendId or their privacy setting changes


  // --- UI AND RENDER LOGIC ---

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={{ marginTop: 10, fontFamily: 'Inter-Regular', color: '#6b7280' }}>
            Loading {friend?.name}'s prayers...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!friend) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Friend Not Found</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // The rest of your component that renders the UI. It will now use the live `friendPrayers` state.
  // ... (All the remaining code from the original file, like getGreeting, getTodayStats, the main return(), and styles, goes here)
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
      return <Sun size={20} color="#f59e0b" />;
    }
    return <Moon size={20} color="#6366f1" />;
  };

  const getTodayStats = () => {
    const completed = friendPrayers.filter(p => p.status && p.status !== 'missed').length;
    const jamaah = friendPrayers.filter(p => p.status === 'jamaah').length;
    const onTime = friendPrayers.filter(p => p.status === 'jamaah' || p.status === 'alone').length;
    
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

  if (!friend.canViewPrayers) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#059669', '#0d9488']}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.friendInfo}>
              <View style={styles.avatar}>
                <UserIcon size={24} color="#6b7280" />
              </View>
              <Text style={styles.friendName}>{friend.name}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.privateContainer}>
          <View style={styles.privateCard}>
            <Text style={styles.privateTitle}>Prayer Data is Private</Text>
            <Text style={styles.privateText}>
              {friend.name} has chosen to keep their prayer data private. 
              You can ask them to enable prayer sharing in their friend settings.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#059669', '#0d9488']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.friendInfo}>
            <View style={styles.avatar}>
              <UserIcon size={24} color="#6b7280" />
            </View>
            <View>
              <Text style={styles.friendName}>{friend.name}</Text>
              <View style={styles.greetingContainer}>
                {getGreetingIcon()}
                <Text style={styles.greeting}>{getGreeting()}</Text>
              </View>
            </View>
          </View>
          <View style={styles.dateContainer}>
            <Calendar size={16} color="#ffffff" />
            <Text style={styles.date}>{formatDate()}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>{friend.name}'s Progress Today</Text>
          <View style={styles.progressRow}>
            <ProgressCircle
              percentage={stats.completed}
              size={80}
              strokeWidth={6}
              color="#059669"
              label="Completed"
              value={`${friendPrayers.filter(p => p.status && p.status !== 'missed').length}/5`}
            />
            <ProgressCircle
              percentage={stats.jamaah}
              size={80}
              strokeWidth={6}
              color="#0d9488"
              label="Jamaa'ah"
              value={`${friendPrayers.filter(p => p.status === 'jamaah').length}/5`}
            />
            <ProgressCircle
              percentage={stats.onTime}
              size={80}
              strokeWidth={6}
              color="#f59e0b"
              label="On Time"
              value={`${friendPrayers.filter(p => p.status === 'jamaah' || p.status === 'alone').length}/5`}
            />
          </View>
        </View>

        <View style={styles.prayersContainer}>
          <Text style={styles.sectionTitle}>Today's Prayers</Text>
          {friendPrayers.map((prayer, index) => (
            <View key={`${prayer.name}-${index}`} style={styles.prayerCardWrapper}>
              <PrayerCard
                prayer={prayer}
                onStatusChange={() => {}} // Read-only for friend's prayers
                readOnly={true}
              />
            </View>
          ))}
        </View>

        <View style={styles.motivationContainer}>
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.motivationCard}
          >
            <Text style={styles.motivationText}>
              "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose." - Quran 65:3
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
      header: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
      },
      backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
      },
      headerTitle: {
        fontSize: 24,
        fontFamily: 'Inter-Bold',
        color: '#ffffff',
        textAlign: 'center',
      },
      headerContent: {
        gap: 8,
      },
      friendInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      },
      avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      friendName: {
        fontSize: 24,
        fontFamily: 'Inter-Bold',
        color: '#ffffff',
        marginBottom: 4,
      },
      greetingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      },
      greeting: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: '#ffffff',
        opacity: 0.9,
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
      prayerCardWrapper: {
        opacity: 0.9,
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
      privateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
      },
      privateCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
      privateTitle: {
        fontSize: 20,
        fontFamily: 'Inter-Bold',
        color: '#1f2937',
        marginBottom: 12,
        textAlign: 'center',
      },
      privateText: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 24,
      },
});