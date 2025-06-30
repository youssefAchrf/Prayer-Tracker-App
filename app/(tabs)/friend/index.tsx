// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   SafeAreaView,
//   TouchableOpacity,
//   TextInput,
//   Platform,
//   StatusBar,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { router } from 'expo-router';
// import { Plus, Search, UserPlus, Check, X, Eye, EyeOff, Users, User as UserIcon, Mail, ChevronRight } from 'lucide-react-native';
// import { useSupabaseUser } from '@/contexts/SupabaseUserContext';

// export default function FriendsScreen() {
//   const { profile, friends, sendFriendRequest, respondToFriendRequest, togglePrayerAccess, loading: friendsLoading } = useSupabaseUser();
  
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showAddFriend, setShowAddFriend] = useState(false);
//   const [newFriendEmail, setNewFriendEmail] = useState('');
//   const [requestLoading, setRequestLoading] = useState(false);

//   const acceptedFriends = friends.filter(f => f.status === 'accepted');
//   const pendingFriends = friends.filter(f => f.status === 'pending');

//   const handleAddFriend = async () => {
//     if (newFriendEmail.trim() && !requestLoading) {
//       setRequestLoading(true);
//       const { error } = await sendFriendRequest(newFriendEmail);
//       setRequestLoading(false);

//       if (error) {
//         Alert.alert('Error', error);
//       } else {
//         Alert.alert('Success', 'Friend request sent!');
//         setNewFriendEmail('');
//         setShowAddFriend(false);
//       }
//     }
//   };

//   const handleFriendPress = (friendship) => {
//     if (!profile) return;
//     const friendProfile = friendship.requester_id === profile.id ? friendship.addressee : friendship.requester;
//     if (friendProfile) {
//       //router.push(`/friends/${friendProfile.id}`);
//       router.push(`/friend/${friendProfile.id}`);
//     }
//   };

//   if (friendsLoading && friends.length === 0) {
//       return <ActivityIndicator style={{ flex: 1 }} size="large" color="#059669" />;
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Friends</Text>
//         <TouchableOpacity style={styles.addButton} onPress={() => setShowAddFriend(true)}>
//           <Plus size={20} color="#ffffff" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Add Friend Modal... */}
//         {showAddFriend && (
//           <View style={styles.addFriendCard}>
//             <Text style={styles.cardTitle}>Add New Friend</Text>
//             <View style={styles.inputContainer}>
//               <Mail size={20} color="#6b7280" />
//               <TextInput
//                 style={styles.textInput}
//                 placeholder="friend@example.com"
//                 value={newFriendEmail}
//                 onChangeText={setNewFriendEmail}
//                 autoCapitalize="none"
//               />
//             </View>
//             <View style={styles.buttonRow}>
//               <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowAddFriend(false)}>
//                 <Text>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.button, styles.addFriendButton]}
//                 onPress={handleAddFriend}
//                 disabled={requestLoading}
//               >
//                 {requestLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.addButtonText}>Send Request</Text>}
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}

//         {/* Pending Requests */}
//         {pendingFriends.length > 0 && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Pending Requests</Text>
//             {pendingFriends.map((friendship) => {
//               if (profile && friendship.addressee_id === profile.id) {
//                 return (
//                   <View key={friendship.id} style={styles.friendCard}>
//                     <View style={styles.friendInfo}>
//                       <UserIcon size={20} color="#6b7280" />
//                       <View style={styles.friendDetails}>
//                         <Text style={styles.friendName}>{friendship.requester?.name || 'User'}</Text>
//                         <Text style={styles.friendEmail}>{friendship.requester?.email || 'No email'}</Text>
//                       </View>
//                     </View>
//                     <View style={styles.pendingActions}>
//                       <TouchableOpacity style={styles.acceptButton} onPress={() => respondToFriendRequest(friendship.id, true)}>
//                         <Check size={16} color="#ffffff" />
//                       </TouchableOpacity>
//                       <TouchableOpacity style={styles.rejectButton} onPress={() => respondToFriendRequest(friendship.id, false)}>
//                         <X size={16} color="#ffffff" />
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 );
//               } else {
//                 return (
//                   <View key={friendship.id} style={styles.friendCard}>
//                     <View style={styles.friendInfo}>
//                       <UserIcon size={20} color="#6b7280" />
//                       <View style={styles.friendDetails}>
//                         <Text style={styles.friendName}>{friendship.addressee?.name || 'User'}</Text>
//                         <Text style={styles.friendEmail}>{friendship.addressee?.email || 'No email'}</Text>
//                       </View>
//                     </View>
//                     <Text style={styles.pendingText}>Request Sent</Text>
//                   </View>
//                 );
//               }
//             })}
//           </View>
//         )}

//         {/* Friends List */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>My Friends ({acceptedFriends.length})</Text>
//           {acceptedFriends.map((friendship) => {
//             if (!profile) return null;
//             const friendProfile = friendship.requester_id === profile.id ? friendship.addressee : friendship.requester;
//             return (
//               <TouchableOpacity
//                 key={friendship.id}
//                 style={styles.friendCard}
//                 onPress={() => handleFriendPress(friendship)}
//               >
//                 <View style={styles.friendInfo}>
//                   <UserIcon size={20} color="#6b7280" />
//                   <View style={styles.friendDetails}>
//                     <Text style={styles.friendName}>{friendProfile?.name || 'User'}</Text>
//                     <Text style={styles.friendEmail}>{friendProfile?.email || 'No email'}</Text>
//                   </View>
//                 </View>
//                 <View style={styles.friendActions}>
//                   <TouchableOpacity onPress={() => togglePrayerAccess(friendship.id)}>
//                     {friendship.can_view_prayers ? <Eye size={20} color="#059669" /> : <EyeOff size={20} color="#6b7280" />}
//                   </TouchableOpacity>
//                   <ChevronRight size={16} color="#6b7280" />
//                 </View>
//               </TouchableOpacity>
//             );
//           })}
//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// // --- Use the full styles object from your file ---
// const styles = StyleSheet.create({
//   // ... Paste your full styles object here ...
//   container: { flex: 1, backgroundColor: '#f9fafb', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, },
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
//   headerTitle: { fontSize: 24, fontFamily: 'Inter-Bold', color: '#1f2937' },
//   addButton: { backgroundColor: '#059669', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
//   content: { flex: 1, paddingHorizontal: 20 },
//   addFriendCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginVertical: 20 },
//   cardTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: '#1f2937', marginBottom: 8 },
//   inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16, gap: 12 },
//   textInput: { flex: 1, fontSize: 16 },
//   buttonRow: { flexDirection: 'row', gap: 12 },
//   button: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
//   cancelButton: { backgroundColor: '#f3f4f6' },
//   addFriendButton: { backgroundColor: '#059669' },
//   addButtonText: { color: '#ffffff' },
//   section: { marginBottom: 24 },
//   sectionTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: '#1f2937', marginBottom: 12 },
//   friendCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 8 },
//   friendInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
//   friendDetails: { flex: 1 },
//   friendName: { fontSize: 16, fontFamily: 'Inter-SemiBold' },
//   friendEmail: { fontSize: 12, color: '#6b7280' },
//   pendingActions: { flexDirection: 'row', gap: 8 },
//   acceptButton: { backgroundColor: '#059669', padding: 8, borderRadius: 16 },
//   rejectButton: { backgroundColor: '#dc2626', padding: 8, borderRadius: 16 },
//   pendingText: { fontStyle: 'italic', color: '#6b7280' },
//   friendActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
// });
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
  ActivityIndicator,
  Alert,
  // --- IMPORT MODAL FOR THE CUSTOM POP-UP ---
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { Plus, Search, UserPlus, Check, X, Eye, EyeOff, Users, User as UserIcon, Mail, ChevronRight, Trash2 } from 'lucide-react-native';
import { useSupabaseUser } from '@/contexts/SupabaseUserContext';

export default function FriendsScreen() {
  const { profile, friends, sendFriendRequest, respondToFriendRequest, togglePrayerAccess, removeFriend, loading: friendsLoading } = useSupabaseUser();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);

  // --- STATE FOR THE CUSTOM CONFIRMATION MODAL ---
  const [isModalVisible, setModalVisible] = useState(false);
  const [friendToRemove, setFriendToRemove] = useState<{ id: string; name: string } | null>(null);

  const acceptedFriends = friends.filter(f => f.status === 'accepted');
  const pendingFriends = friends.filter(f => f.status === 'pending');

  const handleAddFriend = async () => {
    if (newFriendEmail.trim() && !requestLoading) {
      setRequestLoading(true);
      const { error } = await sendFriendRequest(newFriendEmail);
      setRequestLoading(false);

      if (error) {
        Alert.alert('Error', error);
      } else {
        Alert.alert('Success', 'Friend request sent!');
        setNewFriendEmail('');
        setShowAddFriend(false);
      }
    }
  };

  // --- THIS FUNCTION NOW OPENS THE CUSTOM MODAL ---
  const handleRemoveFriend = (friendshipId: string, friendName: string) => {
    setFriendToRemove({ id: friendshipId, name: friendName });
    setModalVisible(true);
  };

  // --- FUNCTION TO EXECUTE THE DELETION ---
  const confirmRemoveFriend = () => {
    if (friendToRemove) {
      removeFriend(friendToRemove.id);
    }
    setModalVisible(false);
    setFriendToRemove(null);
  };

  const handleFriendPress = (friendship) => {
    if (!profile) return;
    const friendProfile = friendship.requester_id === profile.id ? friendship.addressee : friendship.requester;
    if (friendProfile) {
      router.push(`/friend/${friendProfile.id}`);
    }
  };

  if (friendsLoading && friends.length === 0) {
      return <ActivityIndicator style={{ flex: 1 }} size="large" color="#059669" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* --- CUSTOM CONFIRMATION MODAL --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Remove Friend</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to remove {friendToRemove?.name}? This action cannot be undone.
            </Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={confirmRemoveFriend}
              >
                <Text style={styles.modalConfirmButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Friends</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddFriend(true)}>
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Add Friend Modal... */}
        {showAddFriend && (
          <View style={styles.addFriendCard}>
            <Text style={styles.cardTitle}>Add New Friend</Text>
            <View style={styles.inputContainer}>
              <Mail size={20} color="#6b7280" />
              <TextInput
                style={styles.textInput}
                placeholder="friend@example.com"
                value={newFriendEmail}
                onChangeText={setNewFriendEmail}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowAddFriend(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.addFriendButton]}
                onPress={handleAddFriend}
                disabled={requestLoading}
              >
                {requestLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.addButtonText}>Send Request</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Pending Requests */}
        {pendingFriends.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            {pendingFriends.map((friendship) => {
              if (profile && friendship.addressee_id === profile.id) {
                return (
                  <View key={friendship.id} style={styles.friendCard}>
                    <View style={styles.friendInfo}>
                      <UserIcon size={20} color="#6b7280" />
                      <View style={styles.friendDetails}>
                        <Text style={styles.friendName}>{friendship.requester?.name || 'User'}</Text>
                        <Text style={styles.friendEmail}>{friendship.requester?.email || 'No email'}</Text>
                      </View>
                    </View>
                    <View style={styles.pendingActions}>
                      <TouchableOpacity style={styles.acceptButton} onPress={() => respondToFriendRequest(friendship.id, true)}>
                        <Check size={16} color="#ffffff" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rejectButton} onPress={() => respondToFriendRequest(friendship.id, false)}>
                        <X size={16} color="#ffffff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              } else {
                return (
                  <View key={friendship.id} style={styles.friendCard}>
                    <View style={styles.friendInfo}>
                      <UserIcon size={20} color="#6b7280" />
                      <View style={styles.friendDetails}>
                        <Text style={styles.friendName}>{friendship.addressee?.name || 'User'}</Text>
                        <Text style={styles.friendEmail}>{friendship.addressee?.email || 'No email'}</Text>
                      </View>
                    </View>
                    <Text style={styles.pendingText}>Request Sent</Text>
                  </View>
                );
              }
            })}
          </View>
        )}

        {/* Friends List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Friends ({acceptedFriends.length})</Text>
          {acceptedFriends.map((friendship) => {
            if (!profile) return null;
            const friendProfile = friendship.requester_id === profile.id ? friendship.addressee : friendship.requester;
            return (
              <TouchableOpacity
                key={friendship.id}
                style={styles.friendCard}
                onPress={() => handleFriendPress(friendship)}
              >
                <View style={styles.friendInfo}>
                  <UserIcon size={20} color="#6b7280" />
                  <View style={styles.friendDetails}>
                    <Text style={styles.friendName}>{friendProfile?.name || 'User'}</Text>
                    <Text style={styles.friendEmail}>{friendProfile?.email || 'No email'}</Text>
                  </View>
                </View>
                <View style={styles.friendActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleRemoveFriend(friendship.id, friendProfile?.name || 'this friend');
                    }}
                  >
                    <Trash2 size={20} color="#ef4444" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      togglePrayerAccess(friendship.id);
                    }}
                  >
                    {friendship.can_view_prayers ? <Eye size={20} color="#059669" /> : <EyeOff size={20} color="#6b7280" />}
                  </TouchableOpacity>
                  <ChevronRight size={16} color="#6b7280" />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  headerTitle: { fontSize: 24, fontFamily: 'Inter-Bold', color: '#1f2937' },
  addButton: { backgroundColor: '#059669', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, paddingHorizontal: 20 },
  addFriendCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginVertical: 20 },
  cardTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: '#1f2937', marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16, gap: 12 },
  textInput: { flex: 1, fontSize: 16 },
  buttonRow: { flexDirection: 'row', gap: 12 },
  button: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  cancelButton: { backgroundColor: '#f3f4f6' },
  addFriendButton: { backgroundColor: '#059669' },
  addButtonText: { color: '#ffffff' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: '#1f2937', marginBottom: 12 },
  friendCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 8 },
  friendInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  friendDetails: { flex: 1 },
  friendName: { fontSize: 16, fontFamily: 'Inter-SemiBold' },
  friendEmail: { fontSize: 12, color: '#6b7280' },
  pendingActions: { flexDirection: 'row', gap: 8 },
  acceptButton: { backgroundColor: '#059669', padding: 8, borderRadius: 16 },
  rejectButton: { backgroundColor: '#dc2626', padding: 8, borderRadius: 16 },
  pendingText: { fontStyle: 'italic', color: '#6b7280' },
  friendActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionButton: { padding: 8 },
  
  // --- STYLES FOR THE CUSTOM MODAL ---
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  modalCancelButton: {
    backgroundColor: '#f3f4f6',
  },
  modalCancelButtonText: {
    color: '#374151',
    fontFamily: 'Inter-SemiBold',
  },
  modalConfirmButton: {
    backgroundColor: '#fee2e2', // Red background for destructive action
  },
  modalConfirmButtonText: {
    color: '#dc2626', // Red text
    fontFamily: 'Inter-SemiBold',
  },
});

