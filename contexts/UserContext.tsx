import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Friend } from '@/types/prayer';

interface UserContextType {
  user: User | null;
  friends: Friend[];
  updateUser: (userData: Partial<User>) => void;
  addFriend: (friend: Friend) => void;
  updateFriendStatus: (friendId: string, status: Friend['status']) => void;
  toggleFriendPrayerAccess: (friendId: string) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const friendsData = await AsyncStorage.getItem('friendsData');
      
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        // Create default user
        const defaultUser: User = {
          id: 'user_' + Date.now(),
          name: 'Abdullah',
          email: '',
          isPrivate: false,
        };
        setUser(defaultUser);
        await AsyncStorage.setItem('userData', JSON.stringify(defaultUser));
      }
      
      if (friendsData) {
        setFriends(JSON.parse(friendsData));
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  };

  const addFriend = async (friend: Friend) => {
    const updatedFriends = [...friends, friend];
    setFriends(updatedFriends);
    
    try {
      await AsyncStorage.setItem('friendsData', JSON.stringify(updatedFriends));
    } catch (error) {
      console.error('Failed to save friends data:', error);
    }
  };

  const updateFriendStatus = async (friendId: string, status: Friend['status']) => {
    const updatedFriends = friends.map(friend =>
      friend.id === friendId ? { ...friend, status } : friend
    );
    setFriends(updatedFriends);
    
    try {
      await AsyncStorage.setItem('friendsData', JSON.stringify(updatedFriends));
    } catch (error) {
      console.error('Failed to update friend status:', error);
    }
  };

  const toggleFriendPrayerAccess = async (friendId: string) => {
    const updatedFriends = friends.map(friend =>
      friend.id === friendId ? { ...friend, canViewPrayers: !friend.canViewPrayers } : friend
    );
    setFriends(updatedFriends);
    
    try {
      await AsyncStorage.setItem('friendsData', JSON.stringify(updatedFriends));
    } catch (error) {
      console.error('Failed to update friend prayer access:', error);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      friends,
      updateUser,
      addFriend,
      updateFriendStatus,
      toggleFriendPrayerAccess,
      loading,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}