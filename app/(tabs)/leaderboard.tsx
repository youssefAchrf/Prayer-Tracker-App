
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { useSupabaseUser, LeaderboardEntry } from '@/contexts/SupabaseUserContext';
import { Crown, TrendingUp, Award } from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';

// A component for the top 3 ranked players
const TopPlayerCard = ({ entry, rank }: { entry: LeaderboardEntry, rank: number }) => {
  const rankColors: { [key: number]: { bg: string; border: string; text: string; icon: string } } = {
    1: { bg: '#fffbeb', border: '#fde68a', text: '#b45309', icon: '#f59e0b' },
    2: { bg: '#f1f5f9', border: '#e2e8f0', text: '#475569', icon: '#94a3b8' },
    3: { bg: '#fef3c7', border: '#fcd34d', text: '#92400e', icon: '#d97706' },
  };
  const colors = rankColors[rank];

  if (!colors) return null;

  return (
    <View style={[styles.topPlayerCard, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      <Crown size={32} color={colors.icon} style={styles.topPlayerCrown} />
      <Text style={[styles.topPlayerRank, { color: colors.text }]}>#{rank}</Text>
      <Text style={styles.topPlayerName}>{entry.name}</Text>
      <Text style={styles.topPlayerPoints}>{entry.points} pts</Text>
    </View>
  );
};

export default function LeaderboardScreen() {
  const { profile, loading: userLoading, leaderboard, forceReloadLeaderboard } = useSupabaseUser(); 
  
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      forceReloadLeaderboard().then(() => {
        setIsLoading(false);
      });
    }, [forceReloadLeaderboard])
  );

  useEffect(() => {
    setIsLoading(userLoading || (leaderboard.length === 0 && !userLoading));
  }, [userLoading, leaderboard]);
  
  const topThree = leaderboard.slice(0, 3);
  const restOfList = leaderboard.slice(3);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TrendingUp size={28} color="#059669" />
        <Text style={styles.headerTitle}>Leaderboard</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#059669" />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {topThree.length > 0 && (
            <View style={styles.topThreeContainer}>
              {topThree.map((entry, index) => (
                <TopPlayerCard key={entry.user_id} entry={entry} rank={index + 1} />
              ))}
            </View>
          )}

          {restOfList.length > 0 && <Text style={styles.listHeader}>All Ranks</Text>}
          
          {restOfList.map((entry, index) => {
            const rank = index + 4;
            const isCurrentUser = entry.user_id === profile?.id;
            return (
              <View key={entry.user_id} style={[styles.row, isCurrentUser && styles.currentUserRow]}>
                <Text style={styles.rankText}>{rank}</Text>
                <View style={styles.cell}>
                  <Text style={styles.nameText}>{entry.name}</Text>
                  {isCurrentUser && <Text style={styles.youLabel}>You</Text>}
                </View>
                <Text style={styles.statText}>{entry.points} pts</Text>
              </View>
            );
          })}

          {leaderboard.length === 0 && (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No leaderboard data available yet.</Text>
              <Text style={styles.noDataSubText}>Log your prayers to earn points!</Text>
            </View>
          )}

          <View style={styles.rulesContainer}>
            <Text style={styles.rulesTitle}>Scoring Rules</Text>
            <Text style={styles.rule}>• Jamaa'ah: <Text style={{fontWeight: 'bold'}}>3</Text> Points</Text>
            <Text style={styles.rule}>• Alone: <Text style={{fontWeight: 'bold'}}>2</Text> Points</Text>
            <Text style={styles.rule}>• Late: <Text style={{fontWeight: 'bold'}}>1</Text> Point</Text>
          </View>

          {/* --- NEW BADGE RULES SECTION --- */}
          <View style={styles.rulesContainer}>
            <Text style={styles.rulesTitle}>Badge Rules</Text>
            <View style={styles.badgeRule}>
                <Award size={18} color="#cd7f32" fill="#cd7f32" />
                <Text style={styles.rule}>Bronze Badge: <Text style={{fontWeight: 'bold'}}>10</Text> Perfect Days</Text>
            </View>
             <View style={styles.badgeRule}>
                <Award size={18} color="#c0c0c0" fill="#c0c0c0" />
                <Text style={styles.rule}>Silver Badge: <Text style={{fontWeight: 'bold'}}>20</Text> Perfect Days</Text>
            </View>
             <View style={styles.badgeRule}>
                <Award size={18} color="#ffd700" fill="#ffd700" />
                <Text style={styles.rule}>Gold Badge: <Text style={{fontWeight: 'bold'}}>30</Text> Perfect Days</Text>
            </View>
          </View>
          {/* --- END OF NEW SECTION --- */}

        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', backgroundColor: '#ffffff' },
  headerTitle: { fontSize: 24, fontFamily: 'Inter-Bold', color: '#1e293b' },
  content: { padding: 16 },
  
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 24,
  },
  topPlayerCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  topPlayerCrown: {
    position: 'absolute',
    top: -16,
  },
  topPlayerRank: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginTop: 16,
  },
  topPlayerName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1e293b',
    marginTop: 4,
    textAlign: 'center',
  },
  topPlayerPoints: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1e293b',
    marginTop: 8,
  },
  
  listHeader: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#ffffff', 
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    borderRadius: 12, 
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  currentUserRow: { 
    backgroundColor: '#ecfdf5', 
    borderColor: '#10b981',
  },
  rankText: { 
    fontFamily: 'Inter-Bold', 
    fontSize: 16,
    color: '#64748b',
    width: 30,
  },
  cell: { 
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8,
    marginLeft: 12,
  },
  nameText: { 
    fontFamily: 'Inter-SemiBold', 
    color: '#1e293b', 
    fontSize: 16,
    flexShrink: 1,
  },
  youLabel: { 
    fontFamily: 'Inter-Medium', 
    color: '#059669', 
    fontSize: 12,
  },
  statText: { 
    fontFamily: 'Inter-Bold', 
    color: '#334155', 
    fontSize: 14,
  },

  rulesContainer: {
    marginTop: 16, // Adjusted margin
    padding: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
  },
  rulesTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#475569',
    marginBottom: 12,
    textAlign: 'center',
  },
  rule: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#475569',
    marginBottom: 8,
    lineHeight: 20,
  },
  badgeRule: { // New style for badge rule rows
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  noDataText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#475569',
    marginBottom: 8,
    textAlign: 'center',
  },
  noDataSubText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
  },
});

