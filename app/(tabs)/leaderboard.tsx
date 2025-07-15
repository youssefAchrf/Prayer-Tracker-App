import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
import { useFocusEffect } from 'expo-router';
import {
  Crown,
  User as UserIcon,
  TrendingUp,
  Award,
  Flame,
  ShieldCheck,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/ThemeContext';

type LeaderboardEntry = {
  user_id: string;
  name: string;
  avatar_url: string | null;
  points: number;
};

export default function LeaderboardScreen() {
  const { theme, colors } = useTheme();
  const {
    profile,
    friends,
    friendAvatars,
    personalStreak,
    friendsPersonalStreaks,
    sharedStreaks,
  } = useSupabaseUser();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'month' | 'week' | 'today'>(
    'month'
  );

  const acceptedFriends = useMemo(
    () => friends.filter((f) => f.status === 'accepted'),
    [friends]
  );
  const isOneOnOne = acceptedFriends.length === 1;

  const fetchLeaderboard = useCallback(async () => {
    if (!profile?.id) {
      setLoading(false);
      return;
    }
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
      start_date: startDate.toISOString(),
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

  const getDisplayAvatarUrl = (
    player: LeaderboardEntry | { user_id: string; avatar_url: string | null }
  ): string | null => {
    const customAvatar = friendAvatars.get(player.user_id);
    if (customAvatar) return customAvatar;
    if (player.avatar_url) return player.avatar_url;
    return null;
  };

  const OneOnOneView = () => {
    const currentUserData = leaderboard.find(
      (p) => p.user_id === profile.id
    ) || { name: profile.name, points: 0, user_id: profile.id, avatar_url: profile.avatar_url };
    const friendFriendship = acceptedFriends[0];
    const friendProfile =
      friendFriendship.requester_id === profile.id
        ? friendFriendship.addressee
        : friendFriendship.requester;
    const friendData = leaderboard.find(
      (p) => p.user_id === friendProfile.id
    ) || { name: friendProfile.name, points: 0, user_id: friendProfile.id, avatar_url: friendProfile.avatar_url };
    const friendPersonalStreak =
      friendsPersonalStreaks.get(friendProfile.id) || 0;
    const currentSharedStreak =
      sharedStreaks.get(friendFriendship.id) || 0;

    const PlayerColumn = ({ player, points, streak }) => (
      <View style={styles.playerColumn}>
        {getDisplayAvatarUrl(player) ? (
          <Image
            source={{ uri: getDisplayAvatarUrl(player) }}
            style={styles.oneOnOneAvatar}
          />
        ) : (
          <View style={[styles.oneOnOneAvatar, styles.avatarPlaceholder]}>
            <UserIcon size={50} color={colors.textSecondary} />
          </View>
        )}
        <Text style={styles.oneOnOneName} numberOfLines={1}>{player.name}</Text>
        <Text style={styles.oneOnOnePoints}>{points} pts</Text>
        <View style={styles.statRow}>
          <ShieldCheck size={18} color={colors.textSecondary} />
          <Text style={styles.statText}>Personal Streak: {streak}</Text>
        </View>
      </View>
    );

    return (
      <View style={styles.oneOnOneContainer}>
        <PlayerColumn
          player={currentUserData}
          points={currentUserData?.points || 0}
          streak={personalStreak}
        />
        <View style={styles.divider}>
          <Flame size={32} color="#f97316" />
          <Text style={styles.sharedStreakText}>{currentSharedStreak}</Text>
          <Text style={styles.sharedStreakLabel}>Shared</Text>
        </View>
        <PlayerColumn
          player={friendData}
          points={friendData?.points || 0}
          streak={friendPersonalStreak}
        />
      </View>
    );
  };

  const renderStandardLeaderboard = () => {
    const topThree = leaderboard.slice(0, 3);
    const restOfList = leaderboard.slice(3);

    const getRankSuffix = (rank: number) => {
      if (rank > 3 && rank < 21) return 'th';
      switch (rank % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
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
                  <View style={[styles.podiumAvatar, styles.avatarPlaceholder]}><UserIcon size={40} color={colors.textSecondary} /></View>
                )}
                <View style={styles.podiumRankCircle}><Text style={styles.podiumRankText}>2</Text></View>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{player2.name}</Text>
              <Text style={styles.podiumScore}>{player2.points} pts</Text>
            </View>
          )}
          {player1 && (
            <View style={[styles.podiumPillar, styles.podiumPillar1]}>
              <View style={styles.podiumAvatarContainer}>
                <Crown size={32} color="#FFD700" style={styles.crownIcon} />
                {getDisplayAvatarUrl(player1) ? (
                  <Image source={{ uri: getDisplayAvatarUrl(player1) }} style={[styles.podiumAvatar, styles.podiumAvatarPillar1]} />
                ) : (
                  <View style={[styles.podiumAvatar, styles.podiumAvatarPillar1, styles.avatarPlaceholder]}><UserIcon size={50} color={colors.textSecondary} /></View>
                )}
                <View style={[styles.podiumRankCircle, styles.podiumRankCirclePillar1]}><Text style={styles.podiumRankText}>1</Text></View>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{player1.name}</Text>
              <Text style={styles.podiumScore}>{player1.points} pts</Text>
            </View>
          )}
          {player3 && (
            <View style={[styles.podiumPillar, styles.podiumPillar3]}>
              <View style={styles.podiumAvatarContainer}>
                {getDisplayAvatarUrl(player3) ? (
                  <Image source={{ uri: getDisplayAvatarUrl(player3) }} style={styles.podiumAvatar} />
                ) : (
                  <View style={[styles.podiumAvatar, styles.avatarPlaceholder]}><UserIcon size={40} color={colors.textSecondary} /></View>
                )}
                <View style={styles.podiumRankCircle}><Text style={styles.podiumRankText}>3</Text></View>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{player3.name}</Text>
              <Text style={styles.podiumScore}>{player3.points} pts</Text>
            </View>
          )}
        </View>
      );
    };

    return (
      <>
        {leaderboard.length > 0 ? (
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
                    <View style={styles.listAvatar}>
                      {getDisplayAvatarUrl(entry) ? (
                        <Image source={{ uri: getDisplayAvatarUrl(entry) }} style={{ width: '100%', height: '100%' }} />
                      ) : (
                        <UserIcon size={20} color={colors.textSecondary} />
                      )}
                    </View>
                    <Text style={styles.listName} numberOfLines={1}>{entry.name}</Text>
                    <View style={[styles.listScoreContainer, isCurrentUser && styles.currentUserScoreContainer]}>
                      <Text style={styles.listScoreText}>{entry.points} pts</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        ) : (
          <View style={[styles.listItem, { justifyContent: 'center', paddingVertical: 40 }]}>
            <Text style={styles.podiumScore}>No data for this period.</Text>
          </View>
        )}

        <View style={styles.rulesContainer}>
          <Text style={styles.rulesTitle}>Scoring Rules</Text>
          <Text style={styles.rule}>Jamaa'ah: <Text style={{ fontWeight: 'bold' }}>3</Text> Points</Text>
          <Text style={styles.rule}>Alone: <Text style={{ fontWeight: 'bold' }}>2</Text> Points</Text>
          <Text style={styles.rule}>Late: <Text style={{ fontWeight: 'bold' }}>1</Text> Point</Text>
        </View>

        <View style={styles.rulesContainer}>
          <Text style={styles.rulesTitle}>Badge Rules</Text>
          <View style={styles.badgeRule}>
            <Award size={18} color="#cd7f32" fill="#cd7f32" />
            <Text style={styles.rule}>Bronze Badge: <Text style={{ fontWeight: 'bold' }}>10</Text> Perfect Days</Text>
          </View>
          <View style={styles.badgeRule}>
            <Award size={18} color="#c0c0c0" fill="#c0c0c0" />
            <Text style={styles.rule}>Silver Badge: <Text style={{ fontWeight: 'bold' }}>20</Text> Perfect Days</Text>
          </View>
          <View style={styles.badgeRule}>
            <Award size={18} color="#ffd700" fill="#ffd700" />
            <Text style={styles.rule}>Gold Badge: <Text style={{ fontWeight: 'bold' }}>30</Text> Perfect Days</Text>
          </View>
        </View>
      </>
    );
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
        header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 20, backgroundColor: colors.background },
        headerTitle: { fontSize: 24, fontFamily: 'Inter-Bold', color: colors.text },
        filterContainer: { flexDirection: 'row', justifyContent: 'center', backgroundColor: colors.background, borderRadius: 20, marginHorizontal: 20, marginVertical: 16, padding: 4 },
        filterButton: { flex: 1, paddingVertical: 8, borderRadius: 16 },
        activeFilterButton: { backgroundColor: colors.card, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: theme === 'dark' ? 0.3 : 0.1, shadowRadius: 2, elevation: 2 },
        filterText: { color: colors.textSecondary, textAlign: 'center', fontFamily: 'Inter-SemiBold' },
        activeFilterText: { color: colors.primary },
        scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
        oneOnOneContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start', backgroundColor: colors.card, borderRadius: 16, padding: 20, marginTop: 20, borderWidth: 1, borderColor: colors.border },
        playerColumn: { flex: 1, alignItems: 'center', gap: 4 },
        oneOnOneAvatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: colors.primary, backgroundColor: colors.border },
        oneOnOneName: { fontFamily: 'Inter-Bold', fontSize: 18, color: colors.text, marginTop: 8 },
        oneOnOnePoints: { fontFamily: 'Inter-SemiBold', fontSize: 16, color: colors.textSecondary, marginBottom: 12 },
        statRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
        statText: { fontFamily: 'Inter-Medium', color: colors.textSecondary, fontSize: 14 },
        divider: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, height: '100%' },
        sharedStreakText: { fontFamily: 'Inter-Bold', fontSize: 28, color: '#f97316', marginTop: 4 },
        sharedStreakLabel: { fontFamily: 'Inter-Regular', fontSize: 12, color: colors.textSecondary },
        podiumContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', paddingVertical: 20, minHeight: 220 },
        podiumPillar: { alignItems: 'center', justifyContent: 'flex-end' },
        podiumPillar1: { width: 140, height: 180, zIndex: 10 },
        podiumPillar2: { width: 110, height: 150, marginRight: -15 },
        podiumPillar3: { width: 110, height: 150, marginLeft: -15 },
        podiumAvatarContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
        podiumAvatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: colors.primary, backgroundColor: colors.border },
        avatarPlaceholder: { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.buttonDisabled, borderColor: colors.border },
        podiumAvatarPillar1: { width: 110, height: 110, borderRadius: 55, borderColor: '#FFD700' },
        podiumName: { color: colors.text, fontFamily: 'Inter-Bold', fontSize: 16, marginTop: 4 },
        podiumScore: { color: colors.textSecondary, fontFamily: 'Inter-SemiBold', fontSize: 12 },
        crownIcon: { position: 'absolute', top: -25, zIndex: 1 },
        podiumRankCircle: { position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.card, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.primary },
        podiumRankCirclePillar1: { borderColor: '#FFD700' },
        podiumRankText: { color: colors.text, fontFamily: 'Inter-Bold', fontSize: 12 },
        listContainer: { marginTop: 8 },
        listItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
        currentUserListItem: { backgroundColor: theme === 'dark' ? 'rgba(5, 150, 105, 0.2)' : '#ecfdf5', borderColor: theme === 'dark' ? colors.primary : '#d1fae5' },
        rankContainer: { flexDirection: 'row', alignItems: 'flex-start', width: 40 },
        rankText: { color: colors.text, fontFamily: 'Inter-Bold', fontSize: 16 },
        rankSuffix: { color: colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 10, marginLeft: 1, paddingTop: 2 },
        listAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
        listName: { flex: 1, color: colors.text, fontFamily: 'Inter-SemiBold', fontSize: 16 },
        listScoreContainer: { backgroundColor: colors.buttonDisabled, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
        currentUserScoreContainer: { backgroundColor: theme === 'dark' ? 'rgba(5, 150, 105, 0.3)' : '#d1fae5' },
        listScoreText: { color: colors.text, fontFamily: 'Inter-Bold' },
        rulesContainer: { marginTop: 24, padding: 20, backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
        rulesTitle: { fontSize: 16, fontFamily: 'Inter-Bold', color: colors.text, marginBottom: 12, textAlign: 'center' },
        rule: { fontSize: 14, fontFamily: 'Inter-Regular', color: colors.textSecondary, marginBottom: 8, lineHeight: 20 },
        badgeRule: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
      }),
    [colors, theme]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TrendingUp size={28} color={colors.primary} />
        <Text style={styles.headerTitle}>
          {isOneOnOne ? 'Head to Head' : 'Leaderboard'}
        </Text>
      </View>
      <View style={styles.filterContainer}>
        {(['today', 'week', 'month'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              timeFilter === filter && styles.activeFilterButton,
            ]}
            onPress={() => setTimeFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                timeFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 50 }}
          />
        ) : (
          <>
            {isOneOnOne ? (
              <OneOnOneView />
            ) : (
              renderStandardLeaderboard()
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}