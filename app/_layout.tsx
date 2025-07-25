// // File: app/_layout.tsx
// import { useEffect } from 'react';
// import { Slot, router, useSegments } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import { useFonts } from 'expo-font';
// import {
//   Inter_400Regular,
//   Inter_500Medium,
//   Inter_600SemiBold,
//   Inter_700Bold
// } from '@expo-google-fonts/inter';
// import * as SplashScreen from 'expo-splash-screen';
// import { AuthProvider, useAuth } from '@/contexts/AuthContext';
// import { PrayerProvider } from '@/contexts/PrayerContext';
// import { SupabaseUserProvider } from '@/contexts/SupabaseUserContext';
// import { ThemeProvider } from '@/contexts/ThemeContext';
// import { useDisableZoom } from '@/hooks/useDisableZoom';
// import './global.css';

// SplashScreen.preventAutoHideAsync();

// const InitialLayout = () => {
//   const { user, loading } = useAuth();
//   const segments = useSegments();
  
//   useEffect(() => {
//     // Wait until the auth state is determined
//     if (loading) return;

//     const inAuthGroup = segments[0] === '(auth)';

//     if (!user && !inAuthGroup) {
//       // If the user is not signed in and is not on a page in the (auth) group,
//       // redirect them to the login page.
//       router.replace('/(auth)/login');
//     } else if (user && inAuthGroup) {
//       // If the user is signed in and on a page in the (auth) group (e.g., login page),
//       // redirect them to the main part of the app.
//       router.replace('/'); // Or any other default page
//     }
//   }, [user, segments, loading]);

//   return <Slot />;
// }

// export default function RootLayout() {
//   useDisableZoom();

//   const [fontsLoaded, fontError] = useFonts({
//     'Inter-Regular': Inter_400Regular,
//     'Inter-Medium': Inter_500Medium,
//     'Inter-SemiBold': Inter_600SemiBold,
//     'Inter-Bold': Inter_700Bold,
//   });

//   useEffect(() => {
//     if (fontError) {
//       console.error("Font loading error:", fontError);
//     }
//     if (fontsLoaded || fontError) {
//       SplashScreen.hideAsync();
//     }
//   }, [fontsLoaded, fontError]);

//   if (!fontsLoaded && !fontError) {
//     return null;
//   }

//   return (
//     <AuthProvider>
//       <SupabaseUserProvider>
//         <ThemeProvider>
//           <PrayerProvider>
//             <StatusBar style="auto" />
//             <InitialLayout />
//           </PrayerProvider>
//         </ThemeProvider>
//       </SupabaseUserProvider>
//     </AuthProvider>
//   );
// }

import { useEffect, useState, useCallback } from 'react';
import { Slot, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { PrayerProvider } from '@/contexts/PrayerContext';
import { SupabaseUserProvider } from '@/contexts/SupabaseUserContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useDisableZoom } from '@/hooks/useDisableZoom';
import { AnimatedSplashScreen } from '@/components/AnimatedSplashScreen'; // Import the new component
import { View } from 'react-native';
import './global.css';

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const { user, loading } = useAuth();
  const segments = useSegments();
  
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/');
    }
  }, [user, segments, loading]);

  return <Slot />;
}

export default function RootLayout() {
  useDisableZoom();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  // This new state will track when our custom animation is finished
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  const isAppReady = (fontsLoaded || fontError) && splashAnimationFinished;

  const onLayoutRootView = useCallback(async () => {
    // We will now only hide the native splash screen when the app is fully ready
    if (isAppReady) {
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AuthProvider>
          <SupabaseUserProvider>
            <ThemeProvider>
                <PrayerProvider>
                    <StatusBar style="auto" />
                    {/* Conditionally show the animation or the app */}
                    {isAppReady ? (
                        <InitialLayout />
                    ) : (
                        <AnimatedSplashScreen 
                            onAnimationFinish={() => setSplashAnimationFinished(true)}
                        />
                    )}
                </PrayerProvider>
            </ThemeProvider>
          </SupabaseUserProvider>
        </AuthProvider>
    </View>
  );
}