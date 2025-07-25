// File: app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Users, BarChart3, UserCircle, Trophy } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext'; // 1. Import the useTheme hook

export default function TabLayout() {
  const { colors } = useTheme(); // 2. Get the colors from the theme context

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // 3. Make tab bar colors dynamic
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Inter-Medium',
          paddingBottom: 5,
        },
        tabBarStyle: {
          backgroundColor: colors.card, // Use theme color for background
          borderTopWidth: 1,
          borderTopColor: colors.border, // Use theme color for border
          height: 65,
          paddingTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="friend"
        options={{
          title: 'Friends',
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color }) => <Trophy size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ color }) => <BarChart3 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <UserCircle size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}