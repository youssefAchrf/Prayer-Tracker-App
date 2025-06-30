// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase';
// import { useAuth } from '@/contexts/AuthContext';
// import { Database } from '@/types/database';

// type UserProfile = Database['public']['Tables']['users']['Row'];
// type Friendship = Database['public']['Tables']['friendships']['Row'] & {
//   requester: UserProfile;
//   addressee: UserProfile;
// };

// interface SupabaseUserContextType {
//   profile: UserProfile | null;
//   friends: Friendship[];
//   loading: boolean;
//   updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
//   sendFriendRequest: (email: string) => Promise<{ error?: string }>;
//   respondToFriendRequest: (friendshipId: string, accept: boolean) => Promise<void>;
//   togglePrayerAccess: (friendshipId: string) => Promise<void>;
//   refreshFriends: () => Promise<void>;
// }

// const SupabaseUserContext = createContext<SupabaseUserContextType | undefined>(undefined);

// export function SupabaseUserProvider({ children }: { children: React.ReactNode }) {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [friends, setFriends] = useState<Friendship[]>([]);
//   const [loading, setLoading] = useState(true);

//   // This useEffect loads the initial data when the user logs in
//   useEffect(() => {
//     if (user) {
//       loadProfile();
//       loadFriends();
//     } else {
//       setProfile(null);
//       setFriends([]);
//       setLoading(false);
//     }
//   }, [user]);

//   // --- THIS IS THE NEW REAL-TIME LISTENER ---
//   // It listens for any changes to friendships involving the current user.
//   useEffect(() => {
//     if (!user) return;

//     const friendsSubscription = supabase
//       .channel(`public:friendships:user=${user.id}`)
//       .on(
//         'postgres_changes',
//         {
//           event: '*', // Listen for INSERT, UPDATE, DELETE
//           schema: 'public',
//           table: 'friendships',
//           filter: `requester_id=eq.${user.id}`,
//         },
//         (payload) => {
//           console.log('Friendship change detected (I am the requester), reloading friends...');
//           loadFriends();
//         }
//       )
//       .on(
//         'postgres_changes',
//         {
//           event: '*', // Listen for INSERT, UPDATE, DELETE
//           schema: 'public',
//           table: 'friendships',
//           filter: `addressee_id=eq.${user.id}`,
//         },
//         (payload) => {
//           console.log('Friendship change detected (I am the addressee), reloading friends...');
//           loadFriends();
//         }
//       )
//       .subscribe();

//     // Cleanup the listener when the user logs out or the app closes
//     return () => {
//       supabase.removeChannel(friendsSubscription);
//     };
//   }, [user]);


//   const loadProfile = async () => {
//     if (!user) return;
//     try {
//       const { data, error } = await supabase
//         .from('users')
//         .select('*')
//         .eq('id', user.id)
//         .single();
//       if (error) throw error;
//       setProfile(data);
//     } catch (error) {
//       console.error('Error loading profile:', error);
//     }
//   };

//   const loadFriends = async () => {
//     if (!user) return;
//     try {
//       const { data, error } = await supabase
//         .from('friendships')
//         .select(`
//           *,
//           requester:requester_id(*),
//           addressee:addressee_id(*)
//         `)
//         .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
//         .order('created_at', { ascending: false });
//       if (error) throw error;
//       setFriends(data || []);
//     } catch (error) {
//       console.error('Error loading friends:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateProfile = async (updates: Partial<UserProfile>) => {
//     if (!user) return;
//     try {
//       const { error } = await supabase
//         .from('users')
//         .update(updates)
//         .eq('id', user.id);
//       if (error) throw error;
//       setProfile(prev => prev ? { ...prev, ...updates } : null);
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       throw error;
//     }
//   };

//   const sendFriendRequest = async (email: string) => {
//     if (!user) return { error: 'Not authenticated' };
//     try {
//       const { data: targetUser, error: userError } = await supabase
//         .from('users')
//         .select('id')
//         .eq('email', email.toLowerCase())
//         .single();
//       if (userError || !targetUser) {
//         return { error: 'User not found with this email address' };
//       }
//       if (targetUser.id === user.id) {
//         return { error: 'You cannot add yourself as a friend' };
//       }
//       const { data: existingFriendship } = await supabase
//         .from('friendships')
//         .select('id')
//         .or(`and(requester_id.eq.${user.id},addressee_id.eq.${targetUser.id}),and(requester_id.eq.${targetUser.id},addressee_id.eq.${user.id})`)
//         .single();
//       if (existingFriendship) {
//         return { error: 'Friend request already exists' };
//       }
//       const { error: friendshipError } = await supabase
//         .from('friendships')
//         .insert({
//           requester_id: user.id,
//           addressee_id: targetUser.id,
//           status: 'pending',
//         });
//       if (friendshipError) throw friendshipError;
//       return {};
//     } catch (error) {
//       console.error('Error sending friend request:', error);
//       return { error: 'Failed to send friend request' };
//     }
//   };

//   const respondToFriendRequest = async (friendshipId: string, accept: boolean) => {
//     try {
//       const { error } = await supabase
//         .from('friendships')
//         .update({ status: accept ? 'accepted' : 'blocked' })
//         .eq('id', friendshipId);
//       if (error) throw error;
//     } catch (error) {
//       console.error('Error responding to friend request:', error);
//     }
//   };

//   const togglePrayerAccess = async (friendshipId: string) => {
//     try {
//       const friendship = friends.find(f => f.id === friendshipId);
//       if (!friendship) return;
//       const { error } = await supabase
//         .from('friendships')
//         .update({ can_view_prayers: !friendship.can_view_prayers })
//         .eq('id', friendshipId);
//       if (error) throw error;
//     } catch (error) {
//       console.error('Error toggling prayer access:', error);
//     }
//   };

//   const refreshFriends = async () => {
//     await loadFriends();
//   };

//   return (
//     <SupabaseUserContext.Provider value={{
//       profile,
//       friends,
//       loading,
//       updateProfile,
//       sendFriendRequest,
//       respondToFriendRequest,
//       togglePrayerAccess,
//       refreshFriends,
//     }}>
//       {children}
//     </SupabaseUserContext.Provider>
//   );
// }

// export function useSupabaseUser() {
//   const context = useContext(SupabaseUserContext);
//   if (context === undefined) {
//     throw new Error('useSupabaseUser must be used within a SupabaseUserProvider');
//   }
//   return context;
// }
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
  // --- ADDED NEW FUNCTION DEFINITION ---
  removeFriend: (friendshipId: string) => Promise<void>;
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

  useEffect(() => {
    if (!user) return;

    const friendsSubscription = supabase
      .channel(`public:friendships:user=${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'friendships', filter: `requester_id=eq.${user.id}` },
        () => loadFriends()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'friendships', filter: `addressee_id=eq.${user.id}` },
        () => loadFriends()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(friendsSubscription);
    };
  }, [user]);


  const loadProfile = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();
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
        .select(`*, requester:requester_id(*), addressee:addressee_id(*)`)
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
      const { error } = await supabase.from('users').update(updates).eq('id', user.id);
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
      const { data: targetUser, error: userError } = await supabase.from('users').select('id').eq('email', email.toLowerCase()).single();
      if (userError || !targetUser) return { error: 'User not found with this email address' };
      if (targetUser.id === user.id) return { error: 'You cannot add yourself as a friend' };
      const { data: existingFriendship } = await supabase.from('friendships').select('id').or(`and(requester_id.eq.${user.id},addressee_id.eq.${targetUser.id}),and(requester_id.eq.${targetUser.id},addressee_id.eq.${user.id})`).single();
      if (existingFriendship) return { error: 'Friend request already exists' };
      const { error: friendshipError } = await supabase.from('friendships').insert({ requester_id: user.id, addressee_id: targetUser.id, status: 'pending' });
      if (friendshipError) throw friendshipError;
      return {};
    } catch (error) {
      console.error('Error sending friend request:', error);
      return { error: 'Failed to send friend request' };
    }
  };

  const respondToFriendRequest = async (friendshipId: string, accept: boolean) => {
    try {
      const { error } = await supabase.from('friendships').update({ status: accept ? 'accepted' : 'blocked' }).eq('id', friendshipId);
      if (error) throw error;
    } catch (error) {
      console.error('Error responding to friend request:', error);
    }
  };

  const togglePrayerAccess = async (friendshipId: string) => {
    try {
      const friendship = friends.find(f => f.id === friendshipId);
      if (!friendship) return;
      const { error } = await supabase.from('friendships').update({ can_view_prayers: !friendship.can_view_prayers }).eq('id', friendshipId);
      if (error) throw error;
    } catch (error) {
      console.error('Error toggling prayer access:', error);
    }
  };

  // --- IMPLEMENTED NEW FUNCTION ---
  const removeFriend = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);
      if (error) throw error;
      // The real-time listener will automatically update the friends list
    } catch (error) {
      console.error('Error removing friend:', error);
      // You could add an Alert here if you want to notify the user of a failure
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
      // --- EXPORTED NEW FUNCTION ---
      removeFriend,
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
