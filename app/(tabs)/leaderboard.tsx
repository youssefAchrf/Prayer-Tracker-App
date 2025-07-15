
// // In project/app/(tabs)/leaderboard.tsx

// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
// import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
// import { useFocusEffect } from 'expo-router';
// // --- 1. IMPORT THE UserIcon TO USE AS THE PLACEHOLDER ---
// import { Crown, User as UserIcon } from 'lucide-react-native';
// import { supabase } from '@/lib/supabase';

// type LeaderboardEntry = {
//   user_id: string;
//   name: string;
//   avatar_url: string | null;
//   points: number;
// };

// export default function LeaderboardScreen() {
//   const { profile, friendAvatars } = useSupabaseUser();
//   const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'today'>('week');

//   const fetchLeaderboard = useCallback(async () => {
//     if (!profile?.id) return;
//     setLoading(true);

//     const today = new Date();
//     let startDate = new Date();

//     if (timeFilter === 'today') {
//       startDate = new Date(today.setHours(0, 0, 0, 0));
//     } else if (timeFilter === 'week') {
//       startDate.setDate(today.getDate() - today.getDay());
//     } else if (timeFilter === 'month') {
//       startDate = new Date(today.getFullYear(), today.getMonth(), 1);
//     }

//     const { data, error } = await supabase.rpc('get_friends_leaderboard', {
//       p_user_id: profile.id,
//       start_date: startDate.toISOString()
//     });

//     if (error) {
//       console.error('Error fetching leaderboard:', error);
//       setLeaderboard([]);
//     } else {
//       setLeaderboard(data as LeaderboardEntry[]);
//     }
//     setLoading(false);
//   }, [profile, timeFilter]);

//   useFocusEffect(
//     useCallback(() => {
//       fetchLeaderboard();
//     }, [fetchLeaderboard])
//   );

//   const topThree = leaderboard.slice(0, 3);
//   const restOfList = leaderboard.slice(3);

//   const getRankSuffix = (rank: number) => {
//     if (rank > 3 && rank < 21) return 'th';
//     switch (rank % 10) {
//       case 1: return 'st';
//       case 2: return 'nd';
//       case 3: return 'rd';
//       default: return 'th';
//     }
//   };

//   // --- 3. HELPER FUNCTION NOW RETURNS A URL OR NULL ---
//   const getDisplayAvatarUrl = (player: LeaderboardEntry): string | null => {
//     const customAvatar = friendAvatars.get(player.user_id);
//     if (customAvatar) {
//       return customAvatar;
//     }
//     // The player's own public avatar is the next priority
//     if (player.avatar_url) {
//       return player.avatar_url;
//     }
//     // Return null if no image is available
//     return null;
//   };

//   const renderPodium = () => {
//     const player1 = topThree.find((_, i) => i === 0);
//     const player2 = topThree.find((_, i) => i === 1);
//     const player3 = topThree.find((_, i) => i === 2);

//     return (
//       <View style={styles.podiumContainer}>
//         {player2 && (
//           <View style={[styles.podiumPillar, styles.podiumPillar2]}>
//             {/* --- 4. CONDITIONAL RENDERING FOR PODIUM AVATARS --- */}
//             {getDisplayAvatarUrl(player2) ? (
//               <Image source={{ uri: getDisplayAvatarUrl(player2) }} style={styles.podiumAvatar} />
//             ) : (
//               <View style={[styles.podiumAvatar, styles.avatarPlaceholder]}><UserIcon size={40} color="#AFAFAF" /></View>
//             )}
//             <Text style={styles.podiumName}>{player2.name}</Text>
//             <Text style={styles.podiumScore}>{player2.points} pts</Text>
//             <View style={styles.podiumRankCircle}><Text style={styles.podiumRankText}>2</Text></View>
//           </View>
//         )}
//         {player1 && (
//           <View style={[styles.podiumPillar, styles.podiumPillar1]}>
//             <Crown size={32} color="#FFD700" style={styles.crownIcon} />
//             {getDisplayAvatarUrl(player1) ? (
//                 <Image source={{ uri: getDisplayAvatarUrl(player1) }} style={[styles.podiumAvatar, styles.podiumAvatarPillar1]} />
//             ) : (
//                 <View style={[styles.podiumAvatar, styles.podiumAvatarPillar1, styles.avatarPlaceholder]}><UserIcon size={50} color="#AFAFAF" /></View>
//             )}
//             <Text style={styles.podiumName}>{player1.name}</Text>
//             <Text style={styles.podiumScore}>{player1.points} pts</Text>
//             <View style={[styles.podiumRankCircle, styles.podiumRankCirclePillar1]}><Text style={styles.podiumRankText}>1</Text></View>
//           </View>
//         )}
//         {player3 && (
//           <View style={[styles.podiumPillar, styles.podiumPillar3]}>
//             {getDisplayAvatarUrl(player3) ? (
//               <Image source={{ uri: getDisplayAvatarUrl(player3) }} style={styles.podiumAvatar} />
//             ) : (
//               <View style={[styles.podiumAvatar, styles.avatarPlaceholder]}><UserIcon size={40} color="#AFAFAF" /></View>
//             )}
//             <Text style={styles.podiumName}>{player3.name}</Text>
//             <Text style={styles.podiumScore}>{player3.points} pts</Text>
//             <View style={styles.podiumRankCircle}><Text style={styles.podiumRankText}>3</Text></View>
//           </View>
//         )}
//       </View>
//     );
//   };
  
//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Leaderboard</Text>
//       </View>

//       <View style={styles.filterContainer}>
//         {(['today', 'week', 'month'] as const).map(filter => (
//           <TouchableOpacity
//             key={filter}
//             style={[styles.filterButton, timeFilter === filter && styles.activeFilterButton]}
//             onPress={() => setTimeFilter(filter)}
//           >
//             <Text style={[styles.filterText, timeFilter === filter && styles.activeFilterText]}>
//               {filter.charAt(0).toUpperCase() + filter.slice(1)}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {loading ? <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 50 }}/> : (
//           <>
//             {topThree.length > 0 && renderPodium()}
            
//             <View style={styles.listContainer}>
//               {restOfList.map((entry, index) => {
//                 const rank = index + 4;
//                 const isCurrentUser = entry.user_id === profile?.id;
//                 return (
//                   <View key={entry.user_id} style={[styles.listItem, isCurrentUser && styles.currentUserListItem]}>
//                     <View style={styles.rankContainer}>
//                         <Text style={styles.rankText}>{rank}</Text>
//                         <Text style={styles.rankSuffix}>{getRankSuffix(rank)}</Text>
//                     </View>
//                     {/* --- 5. CONDITIONAL RENDERING FOR LIST AVATARS --- */}
//                     {getDisplayAvatarUrl(entry) ? (
//                         <Image source={{ uri: getDisplayAvatarUrl(entry) }} style={styles.listAvatar} />
//                     ) : (
//                         <View style={[styles.listAvatar, styles.avatarPlaceholder]}><UserIcon size={20} color="#AFAFAF" /></View>
//                     )}
//                     <Text style={styles.listName}>{entry.name}</Text>
//                     <View style={[styles.listScoreContainer, isCurrentUser && styles.currentUserScoreContainer]}>
//                       <Text style={styles.listScoreText}>{entry.points} pts</Text>
//                     </View>
//                   </View>
//                 );
//               })}
//             </View>
//           </>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   // ... other styles
//   podiumAvatar: {
//     width: 90,
//     height: 90,
//     borderRadius: 45,
//     borderWidth: 3,
//     borderColor: '#059669',
//     backgroundColor: '#333333', // Background for image loading
//   },
//   listAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 12,
//     backgroundColor: '#333333', // Background for image loading
//   },
//   // --- 6. NEW STYLE FOR THE ICON PLACEHOLDER ---
//   avatarPlaceholder: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#2a2a2a',
//     borderWidth: 1,
//     borderColor: '#444444',
//   },
//   podiumAvatarPillar1: {
//     width: 110,
//     height: 110,
//     borderRadius: 55,
//     borderColor: '#FFD700',
//   },
//   // ... rest of the styles
//   container: { flex: 1, backgroundColor: '#121212' },
//   header: { padding: 20, alignItems: 'center' },
//   headerTitle: { fontSize: 22, fontFamily: 'Inter-Bold', color: '#FFFFFF' },
//   filterContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 20,
//     marginHorizontal: 40,
//     padding: 4,
//     marginBottom: 20,
//   },
//   filterButton: {
//     flex: 1,
//     paddingVertical: 8,
//     borderRadius: 16,
//   },
//   activeFilterButton: {
//     backgroundColor: '#059669',
//   },
//   filterText: {
//     color: '#AFAFAF',
//     textAlign: 'center',
//     fontFamily: 'Inter-SemiBold',
//   },
//   activeFilterText: {
//     color: '#FFFFFF',
//   },
//   scrollContent: { paddingBottom: 40 },
//   podiumContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'flex-end',
//     height: 200,
//     marginBottom: 30,
//   },
//   podiumPillar: {
//     alignItems: 'center',
//     position: 'relative',
//   },
//   podiumPillar1: {
//     height: 150,
//     width: 120,
//   },
//   podiumPillar2: {
//     height: 120,
//     width: 100,
//     marginRight: -10,
//   },
//   podiumPillar3: {
//     height: 120,
//     width: 100,
//     marginLeft: -10,
//   },
//   podiumName: {
//     color: '#FFFFFF',
//     fontFamily: 'Inter-Bold',
//     marginTop: 8,
//     fontSize: 14,
//   },
//   podiumScore: {
//     color: '#AFAFAF',
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 12,
//   },
//   crownIcon: {
//     position: 'absolute',
//     top: -30,
//     zIndex: 1,
//   },
//   podiumRankCircle: {
//     position: 'absolute',
//     bottom: 30,
//     right: 0,
//     backgroundColor: '#1E1E1E',
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#444444',
//   },
//   podiumRankText: {
//     color: '#FFFFFF',
//     fontFamily: 'Inter-Bold',
//     fontSize: 12,
//   },
//   listContainer: {
//     marginHorizontal: 20,
//   },
//   listItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 8,
//   },
//   currentUserListItem: {
//     backgroundColor: '#059669',
//     borderColor: '#34D399',
//     borderWidth: 1,
//   },
//   rankContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     width: 40,
//   },
//   rankText: {
//     color: '#FFFFFF',
//     fontFamily: 'Inter-Bold',
//     fontSize: 16,
//   },
//   rankSuffix: {
//     color: '#AFAFAF',
//     fontFamily: 'Inter-Regular',
//     fontSize: 10,
//     marginLeft: 1,
//   },
//   listName: {
//     flex: 1,
//     color: '#FFFFFF',
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 16,
//   },
//   listScoreContainer: {
//     backgroundColor: '#333333',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//   },
//   currentUserScoreContainer: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   listScoreText: {
//     color: '#FFFFFF',
//     fontFamily: 'Inter-Bold',
//   },
//   podiumRankCirclePillar1: {
//     bottom: 40,
//     right: 0,
//   },
// });

// In project/app/(tabs)/leaderboard.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
import { useFocusEffect } from 'expo-router';
import { Crown, User as UserIcon, TrendingUp } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

type LeaderboardEntry = {
  user_id: string;
  name: string;
  avatar_url: string | null;
  points: number;
};

export default function LeaderboardScreen() {
  const { profile, friendAvatars } = useSupabaseUser();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'today'>('week');

  const fetchLeaderboard = useCallback(async () => {
    if (!profile?.id) return;
    setLoading(true);

    const today = new Date();
    let startDate = new Date();

    if (timeFilter === 'today') {
      startDate = new Date(today.setHours(0, 0, 0, 0));
    } else if (timeFilter === 'week') {
      startDate.setDate(today.getDate() - today.getDay());
    } else if (timeFilter === 'month') {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    const { data, error } = await supabase.rpc('get_friends_leaderboard', {
      p_user_id: profile.id,
      start_date: startDate.toISOString()
    });

    if (error) {
      console.error('Error fetching leaderboard:', error);
      setLeaderboard([]);
    } else {
      setLeaderboard(data as LeaderboardEntry[]);
    }
    setLoading(false);
  }, [profile, timeFilter]);

  useFocusEffect(
    useCallback(() => {
      fetchLeaderboard();
    }, [fetchLeaderboard])
  );

  const topThree = leaderboard.slice(0, 3);
  const restOfList = leaderboard.slice(3);

  const getRankSuffix = (rank: number) => {
    if (rank > 3 && rank < 21) return 'th';
    switch (rank % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const getDisplayAvatarUrl = (player: LeaderboardEntry): string | null => {
    const customAvatar = friendAvatars.get(player.user_id);
    return customAvatar || player.avatar_url || null;
  };

  const renderPodium = () => {
    const player1 = topThree.find((_, i) => i === 0);
    const player2 = topThree.find((_, i) => i === 1);
    const player3 = topThree.find((_, i) => i === 2);

    return (
      <View style={styles.podiumContainer}>
        {player2 && (
          <View style={[styles.podiumPillar, styles.podiumPillar2]}>
            <View style={styles.podiumAvatarContainer}>
              {getDisplayAvatarUrl(player2) ? (
                <Image source={{ uri: getDisplayAvatarUrl(player2) }} style={styles.podiumAvatar} />
              ) : (
                <View style={[styles.podiumAvatar, styles.avatarPlaceholder]}><UserIcon size={40} color="#9ca3af" /></View>
              )}
              <View style={styles.podiumRankCircle}><Text style={styles.podiumRankText}>2</Text></View>
            </View>
            <View style={styles.podiumTextContainer}>
                <Text style={styles.podiumName} numberOfLines={1}>{player2.name}</Text>
                <Text style={styles.podiumScore}>{player2.points} pts</Text>
            </View>
          </View>
        )}
        {player1 && (
          <View style={[styles.podiumPillar, styles.podiumPillar1]}>
            <View style={styles.podiumAvatarContainer}>
              <Crown size={32} color="#f59e0b" style={styles.crownIcon} />
              {getDisplayAvatarUrl(player1) ? (
                  <Image source={{ uri: getDisplayAvatarUrl(player1) }} style={[styles.podiumAvatar, styles.podiumAvatarPillar1]} />
              ) : (
                  <View style={[styles.podiumAvatar, styles.podiumAvatarPillar1, styles.avatarPlaceholder]}><UserIcon size={50} color="#9ca3af" /></View>
              )}
              <View style={[styles.podiumRankCircle, styles.podiumRankCirclePillar1]}><Text style={styles.podiumRankText}>1</Text></View>
            </View>
             <View style={styles.podiumTextContainer}>
                <Text style={styles.podiumName} numberOfLines={1}>{player1.name}</Text>
                <Text style={styles.podiumScore}>{player1.points} pts</Text>
            </View>
          </View>
        )}
        {player3 && (
          <View style={[styles.podiumPillar, styles.podiumPillar3]}>
            <View style={styles.podiumAvatarContainer}>
              {getDisplayAvatarUrl(player3) ? (
                <Image source={{ uri: getDisplayAvatarUrl(player3) }} style={styles.podiumAvatar} />
              ) : (
                <View style={[styles.podiumAvatar, styles.avatarPlaceholder]}><UserIcon size={40} color="#9ca3af" /></View>
              )}
              <View style={styles.podiumRankCircle}><Text style={styles.podiumRankText}>3</Text></View>
            </View>
             <View style={styles.podiumTextContainer}>
                <Text style={styles.podiumName} numberOfLines={1}>{player3.name}</Text>
                <Text style={styles.podiumScore}>{player3.points} pts</Text>
            </View>
          </View>
        )}
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TrendingUp size={28} color="#059669" />
        <Text style={styles.headerTitle}>Leaderboard</Text>
      </View>

      <View style={styles.filterContainer}>
        {(['today', 'week', 'month'] as const).map(filter => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterButton, timeFilter === filter && styles.activeFilterButton]}
            onPress={() => setTimeFilter(filter)}
          >
            <Text style={[styles.filterText, timeFilter === filter && styles.activeFilterText]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? <ActivityIndicator size="large" color="#059669" style={{ marginTop: 50 }}/> : (
          <>
            {topThree.length > 0 && renderPodium()}
            
            <View style={styles.listContainer}>
              {restOfList.map((entry, index) => {
                const rank = index + 4;
                const isCurrentUser = entry.user_id === profile?.id;
                return (
                  <View key={entry.user_id} style={[styles.listItem, isCurrentUser && styles.currentUserListItem]}>
                    <View style={styles.rankContainer}>
                        <Text style={styles.rankText}>{rank}</Text>
                        <Text style={styles.rankSuffix}>{getRankSuffix(rank)}</Text>
                    </View>
                    {getDisplayAvatarUrl(entry) ? (
                        <Image source={{ uri: getDisplayAvatarUrl(entry) }} style={styles.listAvatar} />
                    ) : (
                        <View style={[styles.listAvatar, styles.avatarPlaceholder]}><UserIcon size={20} color="#9ca3af" /></View>
                    )}
                    <Text style={styles.listName} numberOfLines={1}>{entry.name}</Text>
                    <View style={[styles.listScoreContainer, isCurrentUser && styles.currentUserScoreContainer]}>
                      <Text style={styles.listScoreText}>{entry.points} pts</Text>
                    </View>
                  </View>
                );
              })}
            </View>
            {leaderboard.length === 0 && (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No Leaderboard Data Yet</Text>
                  <Text style={styles.noDataSubText}>Scores for this period will show up here as you and your friends log prayers.</Text>
                </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f9fafb',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 20, 
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: { 
    fontSize: 24, 
    fontFamily: 'Inter-Bold', 
    color: '#1f2937'
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
  },
  activeFilterButton: {
    backgroundColor: '#ffffff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterText: {
    color: '#6b7280',
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
  },
  activeFilterText: {
    color: '#059669',
  },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingVertical: 20,
  },
  podiumPillar: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  podiumPillar1: {
    width: 140, // Increased width for 1st place
    height: 180,
    zIndex: 10,
  },
  podiumPillar2: {
    width: 110, // Increased width
    height: 150,
    marginRight: -15, // Adjusted overlap
  },
  podiumPillar3: {
    width: 110, // Increased width
    height: 150,
    marginLeft: -15, // Adjusted overlap
  },
  podiumAvatarContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumTextContainer: {
      alignItems: 'center',
      marginTop: 8,
  },
  podiumAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#059669', // Theme green border
    backgroundColor: '#e5e7eb',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  podiumAvatarPillar1: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#f59e0b',
  },
  podiumName: {
    color: '#1f2937',
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    textAlign: 'center',
  },
  podiumScore: {
    color: '#6b7280',
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    marginTop: 2,
  },
  crownIcon: {
    position: 'absolute',
    top: -18,
    zIndex: 1,
  },
  podiumRankCircle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ffffff',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#059669',
  },
  podiumRankCirclePillar1: {
    borderColor: '#f59e0b',
  },
  podiumRankText: {
    color: '#374151',
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  listContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    marginTop: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  currentUserListItem: {
    backgroundColor: '#ecfdf5',
    borderTopColor: '#d1fae5',
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: 40,
  },
  rankText: {
    color: '#6b7280',
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  rankSuffix: {
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    marginLeft: 1,
  },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#e5e7eb',
  },
  listName: {
    flex: 1,
    color: '#1f2937',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  listScoreContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  currentUserScoreContainer: {
    backgroundColor: '#d1fae5',
  },
  listScoreText: {
    color: '#374151',
    fontFamily: 'Inter-Bold',
  },
  noDataContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  noDataText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  noDataSubText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

