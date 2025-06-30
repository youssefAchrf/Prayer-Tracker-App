// import { useEffect } from 'react';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import { useFrameworkReady } from '@/hooks/useFrameworkReady';
// import { useFonts } from 'expo-font';
// import {
//   Inter_400Regular,
//   Inter_500Medium,
//   Inter_600SemiBold,
//   Inter_700Bold
// } from '@expo-google-fonts/inter';
// import {
//   Amiri_400Regular,
//   Amiri_700Bold
// } from '@expo-google-fonts/amiri';
// import * as SplashScreen from 'expo-splash-screen';
// import { AuthProvider } from '@/contexts/AuthContext';
// import { PrayerProvider } from '@/contexts/PrayerContext';
// // --- CORRECT PROVIDER IS IMPORTED HERE ---
// import { SupabaseUserProvider } from '@/contexts/SupabaseUserContext';

// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   useFrameworkReady();

//   const [fontsLoaded, fontError] = useFonts({
//     'Inter-Regular': Inter_400Regular,
//     'Inter-Medium': Inter_500Medium,
//     'Inter-SemiBold': Inter_600SemiBold,
//     'Inter-Bold': Inter_700Bold,
//     'Amiri-Regular': Amiri_400Regular,
//     'Amiri-Bold': Amiri_700Bold,
//   });

//   useEffect(() => {
//     if (fontsLoaded || fontError) {
//       SplashScreen.hideAsync();
//     }
//   }, [fontsLoaded, fontError]);

//   if (!fontsLoaded && !fontError) {
//     return null;
//   }

//   return (
//     // --- THIS IS THE CORRECT PROVIDER STRUCTURE ---
//     <AuthProvider>
//       <SupabaseUserProvider>
//         <PrayerProvider>
//           <Stack screenOptions={{ headerShown: false }}>
//             <Stack.Screen name="(auth)" />
//             <Stack.Screen name="(tabs)" />
//             <Stack.Screen name="+not-found" />
//           </Stack>
//           <StatusBar style="auto" />
//         </PrayerProvider>
//       </SupabaseUserProvider>
//     </AuthProvider>
//   );
// }
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

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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