import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
} from 'react-native';
import { 
  Plus, 
  Search, 
  UserPlus, 
  Check, 
  X, 
  Eye, 
  EyeOff,
  Users,
  User as UserIcon,
  Mail
} from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import { Friend } from '@/types/prayer';

export default function FriendsScreen() {
  const { friends, addFriend, updateFriendStatus, toggleFriendPrayerAccess } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState('');

  const acceptedFriends = friends.filter(f => f.status === 'accepted');
  const pendingFriends = friends.filter(f => f.status === 'pending');

  const handleAddFriend = () => {
    if (newFriendEmail.trim()) {
      const newFriend: Friend = {
        id: 'friend_' + Date.now(),
        name: newFriendEmail.split('@')[0] || 'Friend', // Use email prefix as name
        email: newFriendEmail.trim(),
        isPrivate: false,
        status: 'pending',
        canViewPrayers: false,
      };
      addFriend(newFriend);
      setNewFriendEmail('');
      setShowAddFriend(false);
    }
  };

  const filteredFriends = acceptedFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (friend.email && friend.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getMockPrayerStats = () => {
    return {
      completed: Math.floor(Math.random() * 5) + 1,
      jamaah: Math.floor(Math.random() * 3) + 1,
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Friends</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddFriend(true)}
        >
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Add Friend Modal */}
        {showAddFriend && (
          <View style={styles.addFriendCard}>
            <Text style={styles.cardTitle}>Add New Friend</Text>
            <Text style={styles.cardDescription}>
              Enter your friend's email address to send them a friend request
            </Text>
            <View style={styles.inputContainer}>
              <Mail size={20} color="#6b7280" />
              <TextInput
                style={styles.textInput}
                placeholder="friend@example.com"
                value={newFriendEmail}
                onChangeText={setNewFriendEmail}
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setShowAddFriend(false);
                  setNewFriendEmail('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.addFriendButton]}
                onPress={handleAddFriend}
              >
                <UserPlus size={16} color="#ffffff" />
                <Text style={styles.addButtonText}>Send Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Pending Requests */}
        {pendingFriends.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            {pendingFriends.map((friend) => (
              <View key={friend.id} style={styles.friendCard}>
                <View style={styles.friendInfo}>
                  <View style={styles.avatar}>
                    <UserIcon size={20} color="#6b7280" />
                  </View>
                  <View style={styles.friendDetails}>
                    <Text style={styles.friendName}>{friend.name}</Text>
                    <Text style={styles.friendEmail}>{friend.email}</Text>
                  </View>
                </View>
                <View style={styles.pendingActions}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => updateFriendStatus(friend.id, 'accepted')}
                  >
                    <Check size={16} color="#ffffff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => updateFriendStatus(friend.id, 'blocked')}
                  >
                    <X size={16} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Friends List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Friends ({acceptedFriends.length})</Text>
          {filteredFriends.length === 0 ? (
            <View style={styles.emptyState}>
              <Users size={48} color="#d1d5db" />
              <Text style={styles.emptyStateTitle}>No friends yet</Text>
              <Text style={styles.emptyStateText}>
                Add friends by their email address to see their prayer progress and stay motivated together
              </Text>
            </View>
          ) : (
            filteredFriends.map((friend) => {
              const stats = getMockPrayerStats();
              return (
                <View key={friend.id} style={styles.friendCard}>
                  <View style={styles.friendInfo}>
                    <View style={styles.avatar}>
                      <UserIcon size={20} color="#6b7280" />
                    </View>
                    <View style={styles.friendDetails}>
                      <Text style={styles.friendName}>{friend.name}</Text>
                      <Text style={styles.friendEmail}>{friend.email}</Text>
                      {friend.canViewPrayers ? (
                        <Text style={styles.friendStats}>
                          {stats.completed}/5 prayers • {stats.jamaah} in Jamaa'ah
                        </Text>
                      ) : (
                        <Text style={styles.privateText}>Prayer data is private</Text>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.viewToggle}
                    onPress={() => toggleFriendPrayerAccess(friend.id)}
                  >
                    {friend.canViewPrayers ? (
                      <Eye size={20} color="#059669" />
                    ) : (
                      <EyeOff size={20} color="#6b7280" />
                    )}
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
  },
  addButton: {
    backgroundColor: '#059669',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
  },
  addFriendCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  addFriendButton: {
    backgroundColor: '#059669',
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 12,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 2,
  },
  friendEmail: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 2,
  },
  friendStats: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#059669',
  },
  privateText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  pendingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    backgroundColor: '#059669',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#dc2626',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewToggle: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 40,
  },
});