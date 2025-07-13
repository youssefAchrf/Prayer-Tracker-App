// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { Sun, Moon, Sunrise, Sunset, CloudSun } from 'lucide-react-native'; // <-- Import the new CloudSun icon

// // Define the prayer order and their corresponding icons
// const PRAYER_ORDER = [
//   { name: 'Fajr', Icon: Sunrise },
//   { name: 'Dhuhr', Icon: Sun },
//   { name: 'Asr', Icon: CloudSun }, // <-- Changed the icon for Asr
//   { name: 'Maghrib', Icon: Sunset },
//   { name: 'Isha', Icon: Moon },
// ];

// // Define the colors for each prayer status
// const STATUS_COLORS: { [key: string]: string } = {
//   jamaah: '#22c55e', // Green
//   alone: '#3b82f6',   // Blue
//   late: '#f59e0b',    // Amber/Yellow
//   default: '#d1d5db', // Gray for not prayed
// };

// interface FriendPrayerStatusProps {
//   prayers: Array<{ prayer_name: string; status: string }>;
// }

// export function FriendPrayerStatus({ prayers = [] }: FriendPrayerStatusProps) {
//   // Create a map for quick lookup of a friend's prayer statuses
//   const prayerStatusMap = new Map(prayers.map(p => [p.prayer_name, p.status]));

//   return (
//     <View style={styles.container}>
//       {PRAYER_ORDER.map(({ name, Icon }) => {
//         const status = prayerStatusMap.get(name);
//         const color = status ? STATUS_COLORS[status] : STATUS_COLORS.default;
        
//         return (
//           <View key={name} style={[styles.iconWrapper, { backgroundColor: `${color}20` }]}>
//             <Icon size={16} color={color} />
//           </View>
//         );
//       })}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     gap: 6,
//     marginTop: 6, // Add some space below the friend's name
//   },
//   iconWrapper: {
//     padding: 5,
//     borderRadius: 99, // Make it a circle
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Sun, Moon, Sunrise, Sunset, CloudSun, Lock } from 'lucide-react-native'; // Import Lock icon

// Define the prayer order and their corresponding icons
const PRAYER_ORDER = [
  { name: 'Fajr', Icon: Sunrise },
  { name: 'Dhuhr', Icon: Sun },
  { name: 'Asr', Icon: CloudSun },
  { name: 'Maghrib', Icon: Sunset },
  { name: 'Isha', Icon: Moon },
];

// Define the colors for each prayer status
const STATUS_COLORS: { [key: string]: string } = {
  jamaah: '#22c55e', // Green
  alone: '#3b82f6',   // Blue
  late: '#f59e0b',    // Amber/Yellow
  default: '#d1d5db', // Gray for not prayed / hidden
  private: '#9ca3af', // Color for private status (a slightly darker gray)
};

interface FriendPrayerStatusProps {
  prayers: Array<{ prayer_name: string; status: string }>;
  isPrivateProfile?: boolean; // Prop to indicate if the friend's profile is private
}

export function FriendPrayerStatus({ prayers = [], isPrivateProfile = false }: FriendPrayerStatusProps) {
  // Create a map for quick lookup of a friend's prayer statuses
  const prayerStatusMap = new Map(prayers.map(p => [p.prayer_name, p.status]));

  return (
    <View style={styles.container}>
      {PRAYER_ORDER.map(({ name, Icon }) => {
        const status = prayerStatusMap.get(name);
        // Determine color: if private, use 'private' color, otherwise use actual status color or default
        const color = isPrivateProfile ? STATUS_COLORS.private : (status ? STATUS_COLORS[status] : STATUS_COLORS.default);
        
        return (
          <View key={name} style={[styles.iconWrapper, { backgroundColor: `${color}20` }]}>
            {isPrivateProfile ? ( // If private, show a Lock icon
              <Lock size={16} color={color} />
            ) : ( // Otherwise, show the prayer icon
              <Icon size={16} color={color} />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 6,
    marginTop: 6,
  },
  iconWrapper: {
    padding: 5,
    borderRadius: 99, // Make it a circle
    alignItems: 'center',
    justifyContent: 'center',
  },
});