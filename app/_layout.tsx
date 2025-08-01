// File: app/_layout.tsx
import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

import { AuthProvider } from '@/contexts/AuthContext';
import { PrayerProvider } from '@/contexts/PrayerContext';
import { SupabaseUserProvider } from '@/contexts/SupabaseUserContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useDisableZoom } from '@/hooks/useDisableZoom';


import './global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useDisableZoom();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontError) console.error('Font loading error:', fontError);
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <AuthProvider>
      <SupabaseUserProvider>
        <ThemeProvider>
          <PrayerProvider>
            <StatusBar style="auto" />
            <Slot /> {/* This loads index.tsx */}
          </PrayerProvider>
        </ThemeProvider>
      </SupabaseUserProvider>
    </AuthProvider>
  );
}
