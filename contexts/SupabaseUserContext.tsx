
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/database';

type UserProfile = Database['public']['Tables']['users']['Row'];
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

interface SupabaseUserContextType {
  profile: UserProfile | null;
  friends: Friendship[];
  loading: boolean;
  personalStreak: number;
  sharedStreaks: Map<string, number>;
  friendsPersonalStreaks: Map<string, number>;
  leaderboard: LeaderboardEntry[];
  appSettings: Map<string, boolean>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  sendFriendRequest: (email: string) => Promise<{ error?: { message: string } }>;
  respondToFriendRequest: (friendshipId: string, accept: boolean) => Promise<void>;
  togglePrayerAccess: (friendshipId: string) => Promise<void>;
  removeFriend: (friendshipId: string) => Promise<void>;
  forceReloadLeaderboard: () => Promise<void>;
  updateAppSetting: (settingName: string, value: boolean) => Promise<void>;
}

const SupabaseUserContext = createContext<SupabaseUserContextType | undefined>(undefined);

export function SupabaseUserProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [personalStreak, setPersonalStreak] = useState(0);
  const [sharedStreaks, setSharedStreaks] = useState<Map<string, number>>(new Map());
  const [friendsPersonalStreaks, setFriendsPersonalStreaks] = useState<Map<string, number>>(new Map());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [appSettings, setAppSettings] = useState<Map<string, boolean>>(new Map());

  // Effect to fetch initial data when user logs in
  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      // Clear all state on logout
      setProfile(null);
      setFriends([]);
      setPersonalStreak(0);
      setSharedStreaks(new Map());
      setFriendsPersonalStreaks(new Map());
      setLeaderboard([]);
      setAppSettings(new Map());
      setLoading(false);
    }
  }, [user]);

  // Effect to set up real-time listeners for database changes
  useEffect(() => {
    if (!user) return;

    const handleAllUpdates = (payload: any) => {
        loadPersonalStreak();
        loadFriendsAndStreaks();
        loadLeaderboardData();
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

    return () => {
      supabase.removeChannel(prayersListener);
      supabase.removeChannel(settingsListener);
      supabase.removeChannel(friendsListener);
    };
  }, [user]);
  
  // --- PERFORMANCE FIX ---
  // This effect now runs ONLY when the friends list changes.
  // It fetches secondary data (streaks) in the background without blocking the UI.
  useEffect(() => {
    if (!user || friends.length === 0) {
        setSharedStreaks(new Map());
        setFriendsPersonalStreaks(new Map());
        return;
    };

    const fetchStreaksData = async () => {
        // 1. Get friend IDs
        const friendIds = friends
            .filter(f => f.status === 'accepted')
            .map(f => (f.requester_id === user.id ? f.addressee_id : f.requester_id));

        if (friendIds.length === 0) return;

        // 2. Fetch shared streaks in parallel
        const sharedStreaksPromise = supabase.rpc('get_all_shared_streaks', { p_user_id: user.id });

        // 3. Fetch all friends' personal streaks in parallel
        const personalStreaksPromises = friendIds.map(id => 
            supabase.rpc('get_personal_perfect_streak', { p_user_id: id }).then(({ data, error }) => ({ id, data, error }))
        );

        const [sharedStreaksResult, personalStreaksResults] = await Promise.all([
            sharedStreaksPromise,
            Promise.all(personalStreaksPromises)
        ]);

        // 4. Process and set shared streaks
        if (!sharedStreaksResult.error) {
            const newStreaksMap = new Map<string, number>();
            sharedStreaksResult.data?.forEach(item => newStreaksMap.set(item.friendship_id, item.streak));
            setSharedStreaks(newStreaksMap);
        }

        // 5. Process and set friends' personal streaks
        const newFriendsPersonalStreaks = new Map<string, number>();
        personalStreaksResults.forEach(result => {
            if (!result.error) {
                newFriendsPersonalStreaks.set(result.id, result.data || 0);
            }
        });
        setFriendsPersonalStreaks(newFriendsPersonalStreaks);
    };

    fetchStreaksData();

  }, [friends, user]);


  // Initial data fetch (made faster)
  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    await Promise.all([
      loadProfile(),
      loadPersonalStreak(),
      loadFriendsAndStreaks(), // Now only fetches the friend list, not their streaks
      loadLeaderboardData(),
      loadAppSettings()
    ]);
    setLoading(false);
  };

  const loadAppSettings = async () => {
    const { data, error } = await supabase.from('app_settings').select('*');
    if (error) console.error('Error loading app settings:', error);
    else {
        const newSettingsMap = new Map<string, boolean>();
        data.forEach(setting => newSettingsMap.set(setting.setting_name, setting.setting_value));
        setAppSettings(newSettingsMap);
    }
  }

  const loadProfile = async () => {
    if (!user) return;
    const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();
    if (error) console.error('Error loading profile:', error);
    else setProfile(data);
  };

  const loadPersonalStreak = async () => {
    if (!user) return;
    const { data, error } = await supabase.rpc('get_personal_perfect_streak', { p_user_id: user.id });
    if (error) console.error('Error fetching personal streak:', error);
    else setPersonalStreak(data || 0);
  };

  // This function is now much faster.
  const loadFriendsAndStreaks = async () => {
    if (!user) return;
    const { data: friendships, error: friendsError } = await supabase.from('friendships').select(`*, requester:requester_id(*), addressee:addressee_id(*)`).or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);
    if (friendsError) console.error('Error loading friends:', friendsError);
    else setFriends(friendships || []);
  };

  const loadLeaderboardData = async () => {
    if (!user) return;
    const { data, error } = await supabase.rpc('get_friends_leaderboard', { p_user_id: user.id });
    if (error) console.error('Error fetching leaderboard data:', error);
    else setLeaderboard(data || []);
  };
  
  const forceReloadLeaderboard = async () => {
    await loadLeaderboardData();
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const { error } = await supabase.from('users').update(updates).eq('id', user.id);
    if (error) throw error;
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  };
  
  const updateAppSetting = async (settingName: string, value: boolean) => {
      if (!profile?.is_admin) throw new Error("User is not authorized to change app settings.");
      const { error } = await supabase.from('app_settings').update({ setting_value: value }).eq('setting_name', settingName);
      if (error) throw error;
      setAppSettings(prev => new Map(prev).set(settingName, value));
  }

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
    } catch (error) {
      console.error('Error sending friend request:', error);
      return { error: { message: 'An unexpected error occurred. Please try again.' } };
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
      profile, friends, loading, personalStreak, sharedStreaks, friendsPersonalStreaks, leaderboard, appSettings,
      updateProfile, sendFriendRequest, respondToFriendRequest,
      togglePrayerAccess, removeFriend, forceReloadLeaderboard,
      updateAppSetting
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
