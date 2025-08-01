// import { useEffect } from 'react';
// import { router } from 'expo-router';
// import { View, Text, StyleSheet } from 'react-native';
// import { useAuth } from '@/contexts/AuthContext';

// export default function IndexScreen() {
//   const { user, loading } = useAuth();

//   useEffect(() => {
//     if (!loading) {
//       if (user) {
//         router.replace('/(tabs)');
//       } else {
//         router.replace('/(auth)/login');
//       }
//     }
//   }, [user, loading]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Loading...</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f9fafb',
//   },
//   text: {
//     fontSize: 16,
//     fontFamily: 'Inter-Medium',
//     color: '#6b7280',
//   },
// });
// import { useEffect } from 'react';
// import { router } from 'expo-router';
// import { View, Text, StyleSheet } from 'react-native';
// import { useAuth } from '@/contexts/AuthContext';

// export default function IndexScreen() {
//   const { user, loading } = useAuth();

//   useEffect(() => {
//     if (!loading) {
//       if (user) {
//         router.replace('/(tabs)');
//       } else {
//         router.replace('/(auth)/login');
//       }
//     }
//   }, [user, loading]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Loading...</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f9fafb',
//   },
//   text: {
//     fontSize: 16,
//     fontFamily: 'Inter-Medium',
//     color: '#6b7280',
//   },
// });
import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function IndexScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    const fromHome = typeof window !== 'undefined' && window.location.search.includes('homescreen=1');

    if (!loading) {
      if (user) {
        router.replace('/(tabs)/');
      } else {
        router.replace('/(auth)/login');
      }
    }

    // if (typeof window !== 'undefined' && !window.navigator.standalone) {
    //   alert("You're not running this as a PWA. Add it to your Home Screen to use it like an app.");
    // }
  }, [user, loading]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  text: {
    fontSize: 16,
    color: '#555'
  }
});