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
import { useDisableZoom } from '@/hooks/useDisableZoom'; // <-- 1. IMPORT THE NEW HOOK


// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    useDisableZoom(); // <-- 2. CALL THE HOOK AT THE TOP

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontError) {
      // You can handle the font error here if needed
      console.error("Font loading error:", fontError);
    }
    // Hide the splash screen once fonts are loaded (or if there's an error)
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Prevent rendering until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // This is the correct, nested structure for your providers.
  // AuthProvider is at the top, so everything inside it can use useAuth().
  return (
    <AuthProvider>
      <SupabaseUserProvider>
        <PrayerProvider>
          <StatusBar style="auto" />
          <Slot />
        </PrayerProvider>
      </SupabaseUserProvider>
    </AuthProvider>
  );
}




