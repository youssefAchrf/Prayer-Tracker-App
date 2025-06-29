import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/database';

type UserProfile = Database['public']['Tables']['users']['Row'];
type Friendship = Database['public']['Tables']['friendships']['Row'] & {
  requester: UserProfile;
  addressee: UserProfile;
};

interface SupabaseUserContextType {
  profile: UserProfile | null;
  friends: Friendship[];
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  sendFriendRequest: (email: string) => Promise<{ error?: string }>;
  respondToFriendRequest: (friendshipId: string, accept: boolean) => Promise<void>;
  togglePrayerAccess: (friendshipId: string) => Promise<void>;
  refreshFriends: () => Promise<void>;
}

const SupabaseUserContext = createContext<SupabaseUserContextType | undefined>(undefined);

export function SupabaseUserProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadFriends();
    } else {
      setProfile(null);
      setFriends([]);
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadFriends = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          requester:requester_id(*),
          addressee:addressee_id(*)
        `)
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFriends(data || []);
    } catch (error) {
      console.error('Error loading friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const sendFriendRequest = async (email: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      // Find user by email
      const { data: targetUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      if (userError || !targetUser) {
        return { error: 'User not found with this email address' };
      }

      if (targetUser.id === user.id) {
        return { error: 'You cannot add yourself as a friend' };
      }

      // Check if friendship already exists
      const { data: existingFriendship } = await supabase
        .from('friendships')
        .select('id')
        .or(`and(requester_id.eq.${user.id},addressee_id.eq.${targetUser.id}),and(requester_id.eq.${targetUser.id},addressee_id.eq.${user.id})`)
        .single();

      if (existingFriendship) {
        return { error: 'Friend request already exists' };
      }

      // Create friendship
      const { error: friendshipError } = await supabase
        .from('friendships')
        .insert({
          requester_id: user.id,
          addressee_id: targetUser.id,
          status: 'pending',
        });

      if (friendshipError) throw friendshipError;

      await refreshFriends();
      return {};
    } catch (error) {
      console.error('Error sending friend request:', error);
      return { error: 'Failed to send friend request' };
    }
  };

  const respondToFriendRequest = async (friendshipId: string, accept: boolean) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ 
          status: accept ? 'accepted' : 'blocked' 
        })
        .eq('id', friendshipId);

      if (error) throw error;
      await refreshFriends();
    } catch (error) {
      console.error('Error responding to friend request:', error);
    }
  };

  const togglePrayerAccess = async (friendshipId: string) => {
    try {
      const friendship = friends.find(f => f.id === friendshipId);
      if (!friendship) return;

      const { error } = await supabase
        .from('friendships')
        .update({ 
          can_view_prayers: !friendship.can_view_prayers 
        })
        .eq('id', friendshipId);

      if (error) throw error;
      await refreshFriends();
    } catch (error) {
      console.error('Error toggling prayer access:', error);
    }
  };

  const refreshFriends = async () => {
    await loadFriends();
  };

  return (
    <SupabaseUserContext.Provider value={{
      profile,
      friends,
      loading,
      updateProfile,
      sendFriendRequest,
      respondToFriendRequest,
      togglePrayerAccess,
      refreshFriends,
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