import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/database';

type UserProfile = Database['public']['Tables']['users']['Row'] & {
  gender?: string;
};
type AppSettings = Database['public']['Tables']['app_settings']['Row'];
type Friendship = Database['public']['Tables']['friendships']['Row'] & {
  requester: UserProfile;
  addressee: UserProfile;
};
export type LeaderboardEntry = {
  user_id: string;
  name: string;
  points: number;
};
type DailyPrayer = { prayer_name: string; status: string };

type ExemptionPeriod = Database['public']['Tables']['exemption_periods']['Row'];

interface SupabaseUserContextType {
  profile: UserProfile | null;
  friends: Friendship[];
  loading: boolean;
  personalStreak: number;
  sharedStreaks: Map<string, number>;
  friendsPersonalStreaks: Map<string, number>;
  friendsDailyPrayers: Map<string, DailyPrayer[]>;
  leaderboard: LeaderboardEntry[];
  appSettings: Map<string, boolean>;
  currentExemption: ExemptionPeriod | null;
  isExemptedToday: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  sendFriendRequest: (email: string) => Promise<{ error?: { message: string } }>;
  respondToFriendRequest: (friendshipId: string, accept: boolean) => Promise<void>;
  togglePrayerAccess: (friendshipId: string) => Promise<void>;
  removeFriend: (friendshipId: string) => Promise<void>;
  forceReloadLeaderboard: () => Promise<void>;
  updateAppSetting: (settingName: string, value: boolean) => Promise<void>;
  startExemption: (startDate: string, endDate: string | null, durationDays: number | null, reason: string | null) => Promise<void>;
  fetchData: () => Promise<void>;
  endExemption: (exemptionId: string) => Promise<void>;
}

const SupabaseUserContext = createContext<SupabaseUserContextType | undefined>(undefined);

const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getUTCDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const isDateExempt = (date: Date, exemption: ExemptionPeriod | null) => {
    if (!exemption) {
        return false;
    }
    const checkDateString = getUTCDateString(date);
    const exemptionStart = exemption.start_date;
    const exemptionEnd = exemption.end_date;
    const isWithinRange = checkDateString >= exemptionStart && 
                          (exemptionEnd === null || checkDateString <= exemptionEnd);
    return isWithinRange;
};


export function SupabaseUserProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [personalStreak, setPersonalStreak] = useState(0);

  const [sharedStreaks, setSharedStreaks] = useState<Map<string, number>>(new Map());
  const [friendsPersonalStreaks, setFriendsPersonalStreaks] = useState<Map<string, number>>(new Map());
  const [friendsDailyPrayers, setFriendsDailyPrayers] = useState<Map<string, DailyPrayer[]>>(new Map());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [appSettings, setAppSettings] = useState<Map<string, boolean>>(new Map());
  const [currentExemption, setCurrentExemption] = useState<ExemptionPeriod | null>(null);

  const isExemptedToday = currentExemption ? isDateExempt(new Date(), currentExemption) : false;

  const loadProfile = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();
    if (error) console.error('Error loading profile:', error);
    else setProfile(data);
  }, [user]);

  const loadCurrentExemption = useCallback(async () => {
    if (!user) return;
    const today = getTodayDateString();
    const { data, error } = await supabase
      .from('exemption_periods')
      .select('*')
      .eq('user_id', user.id)
      .lte('start_date', today)
      .or(`end_date.gte.${today},end_date.is.null`)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error loading current exemption:', error);
      setCurrentExemption(null);
    } else {
      setCurrentExemption(data || null);
    }
  }, [user]);

  const loadPersonalStreak = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase.rpc('get_personal_perfect_streak', { p_user_id: user.id });
    if (error) console.error('Error fetching personal streak:', error);
    else setPersonalStreak(data || 0);
  }, [user]);

  const loadFriendsAndStreaks = useCallback(async () => {
    if (!user) return;
    const { data: friendships, error: friendsError } = await supabase.from('friendships').select(`*, requester:requester_id(id, name, email, gender, is_private), addressee:addressee_id(id, name, email, gender, is_private)`).or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);
    if (friendsError) console.error('Error loading friends:', friendsError);
    else {
      const typedFriendships: Friendship[] = friendships?.map(f => ({
        ...f,
        requester: { ...f.requester, gender: f.requester?.gender || undefined },
        addressee: { ...f.addressee, gender: f.addressee?.gender || undefined },
      })) || [];
      setFriends(typedFriendships);
    }
  }, [user]);

  const loadLeaderboardData = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase.rpc('get_friends_leaderboard', { p_user_id: user.id });
    if (error) console.error('Error fetching leaderboard data:', error);
    else setLeaderboard(data || []);
  }, [user]);

  const loadAppSettings = useCallback(async () => {
    const { data, error } = await supabase.from('app_settings').select('*');
    if (error) console.error('Error loading app settings:', error);
    else {
        const newSettingsMap = new Map<string, boolean>();
        data.forEach(setting => newSettingsMap.set(setting.setting_name, setting.setting_value));
        setAppSettings(newSettingsMap);
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    await Promise.all([
      loadProfile(),
      loadPersonalStreak(),
      loadFriendsAndStreaks(),
      loadLeaderboardData(),
      loadAppSettings(),
      loadCurrentExemption()
    ]);
    setLoading(false);
  }, [user, loadProfile, loadPersonalStreak, loadFriendsAndStreaks, loadLeaderboardData, loadAppSettings, loadCurrentExemption]);


  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setProfile(null);
      setFriends([]);
      setPersonalStreak(0);
      setSharedStreaks(new Map());
      setFriendsPersonalStreaks(new Map());
      setFriendsDailyPrayers(new Map());
      setLeaderboard([]);
      setAppSettings(new Map());
      setCurrentExemption(null);
      setLoading(false);
    }
  }, [user, fetchData]);

  useEffect(() => {
    if (!user) return;

    const handleAllUpdates = (payload: any) => {
        loadPersonalStreak();
        loadFriendsAndStreaks();
        loadLeaderboardData();
        loadCurrentExemption();
    };

    const prayersListener = supabase
      .channel('public:prayers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'prayers' }, handleAllUpdates)
      .subscribe();
      
    const friendsListener = supabase
      .channel('public:friendships')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'friendships' }, handleAllUpdates)
      .subscribe();

    const settingsListener = supabase
      .channel('public:app_settings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_settings' }, () => loadAppSettings())
      .subscribe();
    
    const exemptionsListener = supabase
      .channel('public:exemption_periods')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'exemption_periods', filter: `user_id=eq.${user.id}` }, handleAllUpdates)
      .subscribe();

    return () => {
      supabase.removeChannel(prayersListener);
      supabase.removeChannel(settingsListener);
      supabase.removeChannel(friendsListener);
      supabase.removeChannel(exemptionsListener);
    };
  }, [user, loadPersonalStreak, loadFriendsAndStreaks, loadLeaderboardData, loadAppSettings, loadCurrentExemption]);

  useEffect(() => {
    if (!user || friends.length === 0) {
        setSharedStreaks(new Map());
        setFriendsPersonalStreaks(new Map());
        setFriendsDailyPrayers(new Map());
        return;
    };

    const fetchSecondaryFriendData = async () => {
      const acceptedFriends = friends.filter(f => f.status === 'accepted');

      if (acceptedFriends.length === 0) {
        setSharedStreaks(new Map());
        setFriendsPersonalStreaks(new Map());
        setFriendsDailyPrayers(new Map());
        return;
      }

      const acceptedFriendIds = acceptedFriends.map(f => (f.requester_id === user.id ? f.addressee_id : f.requester_id));

      const friendProfilesMap = new Map<string, UserProfile>();
      acceptedFriends.forEach(f => {
        const friendId = f.requester_id === user.id ? f.addressee_id : f.requester_id;
        const friendProfile = f.requester_id === user.id ? f.addressee : f.requester;
        friendProfilesMap.set(friendId, friendProfile);
      });

      const todayString = getTodayDateString();
      const sharedStreaksPromise = supabase.rpc('get_all_shared_streaks', { p_user_id: user.id });
      const personalStreaksPromises = acceptedFriendIds.map(id =>
        supabase.rpc('get_personal_perfect_streak', { p_user_id: id }).then(({ data, error }) => ({ id, data, error }))
      );
      const dailyPrayersPromise = supabase.from('prayers').select('user_id, prayer_name, status').in('user_id', acceptedFriendIds).eq('prayer_date', todayString);
      const exemptionsPromise = supabase.from('exemption_periods').select('user_id, start_date, end_date, created_at').in('user_id', acceptedFriendIds).order('created_at', { ascending: false });

      const [
        sharedStreaksResult,
        dailyPrayersResult,
        personalStreaksResults,
        exemptionsResult
      ] = await Promise.all([
        sharedStreaksPromise,
        dailyPrayersPromise,
        Promise.all(personalStreaksPromises),
        exemptionsPromise
      ]);

      if (!sharedStreaksResult.error) {
        const newStreaksMap = new Map<string, number>();
        sharedStreaksResult.data?.forEach(item => newStreaksMap.set(item.friendship_id, item.streak));
        setSharedStreaks(newStreaksMap);
      }

      const newFriendsPersonalStreaks = new Map<string, number>();
      personalStreaksResults.forEach(result => {
        if (!result.error) newFriendsPersonalStreaks.set(result.id, result.data || 0);
      });
      setFriendsPersonalStreaks(newFriendsPersonalStreaks);

      const friendExemptionMap = new Map<string, ExemptionPeriod>();
      if (exemptionsResult.data) {
        exemptionsResult.data.forEach(ex => {
          if (isDateExempt(new Date(), ex) && (!friendExemptionMap.has(ex.user_id) || new Date(ex.created_at!) > new Date(friendExemptionMap.get(ex.user_id)!.created_at!))) {
            friendExemptionMap.set(ex.user_id, ex);
          }
        });
      }

      const prayersMap = new Map<string, DailyPrayer[]>();
      if (dailyPrayersResult.data) {
        acceptedFriendIds.forEach(friendId => {
          const profile = friendProfilesMap.get(friendId);
          if (profile?.is_private) {
            prayersMap.set(friendId, [{ prayer_name: 'private', status: 'private' }]);
          } else if (friendExemptionMap.has(friendId)) {
            prayersMap.set(friendId, [
              { prayer_name: 'Fajr', status: 'jamaah' },
              { prayer_name: 'Dhuhr', status: 'jamaah' },
              { prayer_name: 'Asr', status: 'jamaah' },
              { prayer_name: 'Maghrib', status: 'jamaah' },
              { prayer_name: 'Isha', status: 'jamaah' },
            ]);
          } else {
            const prayers = dailyPrayersResult.data.filter(p => p.user_id === friendId);
            prayersMap.set(friendId, prayers.map(p => ({ prayer_name: p.prayer_name, status: p.status })));
          }
        });
      }
      setFriendsDailyPrayers(prayersMap);
    };

    fetchSecondaryFriendData();
  }, [friends, user]);


  const forceReloadLeaderboard = async () => {
    await loadLeaderboardData();
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const { error } = await supabase.from('users').update(updates).eq('id', user.id);
    if (error) throw error;
    setProfile(prev => prev ? { ...prev, ...updates } : null);
    if (updates.gender !== undefined || updates.is_private !== undefined) {
        loadFriendsAndStreaks();
    }
  };
  
  const updateAppSetting = async (settingName: string, value: boolean) => {
      if (!profile?.is_admin) throw new Error("User is not authorized to change app settings.");
      const { error } = await supabase.from('app_settings').update({ setting_value: value }).eq('setting_name', settingName);
      if (error) throw error;
      setAppSettings(prev => new Map(prev).set(settingName, value));
  }

  const startExemption = async (startDate: string, endDate: string | null, durationDays: number | null, reason: string | null) => {
    if (!user) throw new Error('User not logged in.');
    if (isExemptedToday) {
      throw new Error('An exemption period is already active. Please end it first.');
    }
    const { data, error } = await supabase
      .from('exemption_periods')
      .insert({
        user_id: user.id,
        start_date: startDate,
        end_date: endDate,
        duration_days: durationDays,
        reason: reason,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }
    setCurrentExemption(data);
  };

  const endExemption = async (exemptionId: string) => {
    if (!user) throw new Error('User not logged in.');
    const { error } = await supabase
      .from('exemption_periods')
      .delete()
      .eq('id', exemptionId)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }
    setCurrentExemption(null);
    loadPersonalStreak();
  };
  
  const sendFriendRequest = async (email: string) => {
    if (!user || !profile) return { error: { message: 'You must be logged in.' } };
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) return { error: { message: 'Please enter an email address.' } };
    if (!emailRegex.test(trimmedEmail)) return { error: { message: 'Please enter a valid email format.' } };
    if (trimmedEmail === profile.email) return { error: { message: 'You cannot add yourself as a friend.' } };

    try {
      const { data: targetUser, error: userError } = await supabase.from('users').select('id').eq('email', trimmedEmail).single();
      if (userError || !targetUser) return { error: { message: 'No user found with this email address.' } };
      
      const { data: existingFriendship } = await supabase.from('friendships').select('id').or(`and(requester_id.eq.${user.id},addressee_id.eq.${targetUser.id}),and(requester_id.eq.${targetUser.id},addressee_id.eq.${user.id})`).maybeSingle();
      if (existingFriendship) return { error: { message: 'You are already friends or have a pending request with this user.' } };

      const { error: insertError } = await supabase.from('friendships').insert({ requester_id: user.id, addressee_id: targetUser.id });
      if (insertError) throw insertError;
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'An unexpected error occurred. Please try again.' } };
    }
  };

  const respondToFriendRequest = async (friendshipId: string, accept: boolean) => {
    const { error } = await supabase.from('friendships').update({ status: accept ? 'accepted' : 'blocked', can_view_prayers: accept }).eq('id', friendshipId);
    if (error) console.error('Error responding to request:', error);
  };

  const togglePrayerAccess = async (friendshipId: string) => {
    const friendship = friends.find(f => f.id === friendshipId);
    if (!friendship) return;
    const { error } = await supabase.from('friendships').update({ can_view_prayers: !friendship.can_view_prayers }).eq('id', friendshipId);
    if (error) console.error('Error toggling prayer access:', error);
  };

  const removeFriend = async (friendshipId: string) => {
    const { error } = await supabase.from('friendships').delete().eq('id', friendshipId);
    if (error) console.error('Error removing friend:', error);
  };
  
  return (
    <SupabaseUserContext.Provider value={{
      profile, friends, loading, personalStreak, sharedStreaks, friendsPersonalStreaks, friendsDailyPrayers, leaderboard, appSettings,
      currentExemption, isExemptedToday,
      updateProfile, sendFriendRequest, respondToFriendRequest,
      togglePrayerAccess, removeFriend, forceReloadLeaderboard,
      updateAppSetting,
      startExemption, endExemption,fetchData
    }}>
      {children}
    </SupabaseUserContext.Provider>
  );
}

export function useSupabaseUser() {
  const context = useContext(SupabaseUserContext);
  if (context === undefined) {
    throw new Error('useSupabaseUser must be used within a SupabaseUserProvider');
  }
  return context;
}