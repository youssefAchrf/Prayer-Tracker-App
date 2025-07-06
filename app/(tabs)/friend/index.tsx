// // import React, { useState } from 'react';
// // import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Platform, StatusBar, ActivityIndicator, Modal, LayoutAnimation, UIManager } from 'react-native';
// // import { router } from 'expo-router';
// // import { Plus, User as UserIcon, Mail, Check, X, Eye, EyeOff, ChevronRight, Trash2, MoreVertical, AlertTriangle, Flame } from 'lucide-react-native';
// // import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
// // import { StreakBadge } from '@/components/StreakBadge';

// // if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
// //   UIManager.setLayoutAnimationEnabledExperimental(true);
// // }

// // const FriendActionSheet = ({ visible, onClose, onSelect, friend }) => {
// //     if (!visible || !friend) return null;
// //     const handleAction = (action) => { onSelect(action, friend); onClose(); };
// //     return (
// //       <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
// //         <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
// //           <View style={styles.actionSheetContainer}>
// //             <View style={styles.actionSheetHeader}><Text style={styles.actionSheetTitle}>{friend.profile?.name}</Text><Text style={styles.actionSheetSubtitle}>{friend.profile?.email}</Text></View>
// //             <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('view')}><ChevronRight size={20} color="#374151" /><Text style={styles.actionButtonText}>View Profile</Text></TouchableOpacity>
// //             <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('toggle_access')}>{friend.can_view_prayers ? <EyeOff size={20} color="#374151" /> : <Eye size={20} color="#374151" />}<Text style={styles.actionButtonText}>{friend.can_view_prayers ? 'Disable Prayer Access' : 'Enable Prayer Access'}</Text></TouchableOpacity>
// //             <TouchableOpacity style={[styles.actionButton, { borderBottomWidth: 0 }]} onPress={() => handleAction('remove')}><Trash2 size={20} color="#ef4444" /><Text style={styles.actionButtonText}>Remove Friend</Text></TouchableOpacity>
// //             <TouchableOpacity style={styles.cancelSheetButton} onPress={onClose}><Text style={styles.cancelButtonText}>Cancel</Text></TouchableOpacity>
// //           </View>
// //         </TouchableOpacity>
// //       </Modal>
// //     );
// // };

// // const ConfirmRemoveModal = ({ visible, onClose, onConfirm, friendName }) => {
// //     if (!visible) return null;
// //     return (
// //       <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
// //         <View style={styles.modalOverlay}>
// //           <View style={styles.confirmModalContent}>
// //             <View style={styles.confirmModalIconContainer}><AlertTriangle size={24} color="#d97706" /></View>
// //             <Text style={styles.confirmModalTitle}>Remove Friend</Text>
// //             <Text style={styles.confirmModalMessage}>Are you sure you want to remove {friendName}? This action cannot be undone.</Text>
// //             <View style={styles.confirmModalButtonRow}>
// //               <TouchableOpacity style={[styles.confirmModalButton, styles.confirmModalCancelButton]} onPress={onClose}><Text style={styles.confirmModalCancelButtonText}>Cancel</Text></TouchableOpacity>
// //               <TouchableOpacity style={[styles.confirmModalButton, styles.confirmModalRemoveButton]} onPress={onConfirm}><Text style={styles.confirmModalRemoveButtonText}>Remove</Text></TouchableOpacity>
// //             </View>
// //           </View>
// //         </View>
// //       </Modal>
// //     );
// // };

// // const CustomAlertModal = ({ visible, onClose, title, message }) => {
// //     if (!visible) return null;
// //     return (
// //         <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
// //             <View style={styles.modalOverlay}>
// //                 <View style={styles.alertModalContent}>
// //                     <Text style={styles.alertModalTitle}>{title}</Text>
// //                     <Text style={styles.alertModalMessage}>{message}</Text>
// //                     <TouchableOpacity style={styles.alertModalButton} onPress={onClose}>
// //                         <Text style={styles.alertModalButtonText}>Acknowledge</Text>
// //                     </TouchableOpacity>
// //                 </View>
// //             </View>
// //         </Modal>
// //     );
// // };
  
// // export default function FriendsScreen() {
// //   const { profile, friends, sharedStreaks, friendsPersonalStreaks, sendFriendRequest, respondToFriendRequest, togglePrayerAccess, removeFriend, loading } = useSupabaseUser();
  
// //   const [showAddFriend, setShowAddFriend] = useState(false);
// //   const [newFriendEmail, setNewFriendEmail] = useState('');
// //   const [requestLoading, setRequestLoading] = useState(false);
// //   const [isNewFriendEmailFocused, setIsNewFriendEmailFocused] = useState(false);
// //   const [isActionSheetVisible, setActionSheetVisible] = useState(false);
// //   const [selectedFriend, setSelectedFriend] = useState(null);
// //   const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  
// //   const [alertInfo, setAlertInfo] = useState({ visible: false, title: '', message: '' });

// //   if (loading) {
// //     return (
// //         <SafeAreaView style={styles.container}>
// //             <ActivityIndicator style={{ flex: 1 }} size="large" color="#059669" />
// //         </SafeAreaView>
// //     );
// //   }

// //   const acceptedFriends = (friends || []).filter(f => f.status === 'accepted');
// //   const pendingFriends = (friends || []).filter(f => f.status === 'pending');

// //   const handleAddFriend = async () => {
// //     setRequestLoading(true);
// //     const { error } = await sendFriendRequest(newFriendEmail);
// //     setRequestLoading(false);

// //     if (error) {
// //       setAlertInfo({ visible: true, title: 'Request Failed', message: error.message });
// //     } else {
// //       setAlertInfo({ visible: true, title: 'Success!', message: 'Your friend request has been sent.' });
// //       setNewFriendEmail('');
// //       setShowAddFriend(false);
// //     }
// //   };

// //   const handleFriendPress = (friendship) => {
// //     if (!profile) return;
// //     const friendProfile = friendship.requester_id === profile.id ? friendship.addressee : friendship.requester;
// //     if (friendProfile) { router.push(`/friend/${friendProfile.id}`); }
// //   };

// //   const handleActionSelect = (action, friendship) => {
// //     const friendProfile = friendship.requester_id === profile.id ? friendship.addressee : friendship.requester;
// //     setActionSheetVisible(false);
// //     switch (action) {
// //       case 'view': handleFriendPress(friendship); break;
// //       case 'toggle_access': togglePrayerAccess(friendship.id); break;
// //       case 'remove': setSelectedFriend({ ...friendship, profile: friendProfile }); setConfirmModalVisible(true); break;
// //       default: break;
// //     }
// //   };
  
// //   const onConfirmRemove = () => {
// //     if (selectedFriend) {
// //       LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// //       removeFriend(selectedFriend.id);
// //     }
// //     setConfirmModalVisible(false);
// //     setSelectedFriend(null);
// //   };

// //   const handleCancelAddFriend = () => {
// //     setNewFriendEmail('');
// //     setShowAddFriend(false);
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <FriendActionSheet visible={isActionSheetVisible} onClose={() => setActionSheetVisible(false)} onSelect={handleActionSelect} friend={selectedFriend}/>
// //       <ConfirmRemoveModal visible={isConfirmModalVisible} onClose={() => setConfirmModalVisible(false)} onConfirm={onConfirmRemove} friendName={selectedFriend?.profile?.name} />
// //       <CustomAlertModal visible={alertInfo.visible} title={alertInfo.title} message={alertInfo.message} onClose={() => setAlertInfo({ visible: false, title: '', message: '' })} />
      
// //       <View style={styles.header}>
// //         <Text style={styles.headerTitle}>Friends</Text>
// //         <TouchableOpacity style={styles.addButton} onPress={() => setShowAddFriend(true)}>
// //           <Plus size={20} color="#ffffff" />
// //         </TouchableOpacity>
// //       </View>
// //       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
// //         {showAddFriend && (
// //           <View style={styles.addFriendCard}>
// //             <Text style={styles.cardTitle}>Add New Friend</Text>
// //             <View style={[styles.inputContainer, isNewFriendEmailFocused && styles.inputContainerFocused]}>
// //               <Mail size={20} color={isNewFriendEmailFocused ? '#059669' : '#6b7280'} />
// //               <TextInput style={styles.textInput} placeholder="friend@example.com" value={newFriendEmail} onChangeText={setNewFriendEmail} autoCapitalize="none" onFocus={() => setIsNewFriendEmailFocused(true)} onBlur={() => setIsNewFriendEmailFocused(false)} placeholderTextColor="#9ca3af"/>
// //             </View>
// //             <View style={styles.buttonRow}>
// //               <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={handleCancelAddFriend}><Text style={styles.cancelButtonText}>Cancel</Text></TouchableOpacity>
// //               <TouchableOpacity style={[styles.button, styles.addFriendButton]} onPress={handleAddFriend} disabled={requestLoading}>
// //                 {requestLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.addFriendButtonText}>Send Request</Text>}
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         )}
// //         {pendingFriends.length > 0 && (
// //           <View style={styles.section}>
// //             <Text style={styles.sectionTitle}>Pending Requests</Text>
// //             {pendingFriends.map((friendship) => {
// //               const friendProfile = friendship.requester_id === profile.id ? friendship.addressee : friendship.requester;
// //               return (
// //                 <View key={friendship.id} style={styles.friendCard}>
// //                   <View style={styles.friendInfo}>
// //                     <UserIcon size={24} color="#6b7280" />
// //                     <View style={styles.friendDetails}>
// //                       <Text style={styles.friendName}>{friendProfile?.name || 'User'}</Text>
// //                       <Text style={styles.friendEmail}>{friendProfile?.email || 'No email'}</Text>
// //                     </View>
// //                   </View>
// //                   {profile && friendship.addressee_id === profile.id ? (
// //                     <View style={styles.pendingActions}>
// //                       <TouchableOpacity style={styles.acceptButton} onPress={() => respondToFriendRequest(friendship.id, true)}><Check size={16} color="#ffffff" /></TouchableOpacity>
// //                       <TouchableOpacity style={styles.rejectButton} onPress={() => respondToFriendRequest(friendship.id, false)}><X size={16} color="#ffffff" /></TouchableOpacity>
// //                     </View>
// //                   ) : (
// //                     <Text style={styles.pendingText}>Request Sent</Text>
// //                   )}
// //                 </View>
// //               );
// //             })}
// //           </View>
// //         )}
// //         <View style={styles.section}>
// //           <Text style={styles.sectionTitle}>My Friends ({acceptedFriends.length})</Text>
// //           {acceptedFriends.map((friendship) => {
// //             const friendProfile = profile && friendship.requester_id === profile.id ? friendship.addressee : friendship.requester;
// //             const sharedStreak = sharedStreaks.get(friendship.id) || 0;
// //             // --- THIS IS THE FIX ---
// //             // Get the friend's personal streak from the new map
// //             const personalStreak = friendsPersonalStreaks.get(friendProfile.id) || 0;

// //             return (
// //               <TouchableOpacity key={friendship.id} style={styles.friendCard} onPress={() => handleFriendPress(friendship)}>
// //                 <View style={styles.friendInfo}>
// //                   <UserIcon size={24} color="#6b7280" />
// //                   <View style={styles.friendDetails}>
// //                     <Text style={styles.friendName}>{friendProfile?.name || 'User'}</Text>
// //                   </View>
// //                 </View>
// //                 <View style={styles.friendActions}>
// //                     {/* Use the friend's personal streak for the badge */}
// //                     <StreakBadge streak={personalStreak} size={18} />
// //                     {sharedStreak > 0 && (
// //                         <View style={styles.streakContainer}>
// //                             <Flame size={14} color="#f97316" />
// //                             <Text style={styles.streakText}>{sharedStreak}</Text>
// //                         </View>
// //                     )}
// //                     <TouchableOpacity style={styles.moreButton} onPress={(e) => { e.stopPropagation(); setSelectedFriend({ ...friendship, profile: friendProfile }); setActionSheetVisible(true); }}>
// //                         <MoreVertical size={20} color="#6b7280" />
// //                     </TouchableOpacity>
// //                 </View>
// //               </TouchableOpacity>
// //             );
// //           })}
// //         </View>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#f9fafb', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, },
// //   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
// //   headerTitle: { fontSize: 24, fontFamily: 'Inter-Bold', color: '#1f2937' },
// //   addButton: { backgroundColor: '#059669', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
// //   content: { flex: 1, paddingHorizontal: 16 },
// //   addFriendCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginVertical: 8, borderWidth: 1, borderColor: '#e5e7eb' },
// //   cardTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: '#1f2937', marginBottom: 16 },
// //   inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#d1d5db', borderRadius: 12, paddingHorizontal: 16, marginBottom: 16, gap: 12, },
// //   inputContainerFocused: { borderColor: '#059669', },
// //   textInput: { flex: 1, fontSize: 16, paddingVertical: 12, outlineStyle: 'none', },
// //   buttonRow: { flexDirection: 'row', gap: 12 },
// //   button: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
// //   cancelBtn: { backgroundColor: '#f3f4f6' },
// //   cancelButtonText: { fontFamily: 'Inter-SemiBold' },
// //   addFriendButton: { backgroundColor: '#059669' },
// //   addFriendButtonText: { color: '#ffffff', fontFamily: 'Inter-SemiBold' },
// //   section: { marginTop: 16 },
// //   sectionTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: '#1f2937', marginBottom: 8, marginLeft: 4, marginTop: 16 },
// //   friendCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#e5e7eb' },
// //   friendInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
// //   friendDetails: { flex: 1, marginLeft: 16 },
// //   friendName: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: '#1f2937' },
// //   friendEmail: { fontSize: 12, color: '#6b7280' },
// //   pendingActions: { flexDirection: 'row', gap: 8 },
// //   acceptButton: { backgroundColor: '#059669', padding: 8, borderRadius: 99 },
// //   rejectButton: { backgroundColor: '#dc2626', padding: 8, borderRadius: 99 },
// //   pendingText: { fontFamily: 'Inter-Regular', color: '#6b7280' },
// //   friendActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
// //   moreButton: { padding: 8 },
// //   streakContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff7ed', borderRadius: 99, paddingHorizontal: 8, paddingVertical: 4, },
// //   streakText: { marginLeft: 4, fontFamily: 'Inter-Bold', color: '#c2410c', fontSize: 12, },
  
// //   // Modal/Alert styles
// //   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
// //   actionSheetContainer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#f9fafb', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, },
// //   actionSheetHeader: { paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', marginBottom: 8, },
// //   actionSheetTitle: { fontSize: 18, fontFamily: 'Inter-Bold', textAlign: 'center' },
// //   actionSheetSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
// //   actionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', gap: 16, },
// //   actionButtonText: { fontSize: 16, fontFamily: 'Inter-Medium', color: '#374151' },
// //   cancelSheetButton: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginTop: 16, alignItems: 'center', width: '100%' },
// //   confirmModalContent: { width: '100%', maxWidth: 400, backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
// //   confirmModalIconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center', marginBottom: 16, },
// //   confirmModalTitle: { fontSize: 20, fontFamily: 'Inter-Bold', marginBottom: 8, },
// //   confirmModalMessage: { fontSize: 14, fontFamily: 'Inter-Regular', textAlign: 'center', color: '#6b7280', marginBottom: 24, lineHeight: 20, },
// //   confirmModalButtonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', },
// //   confirmModalButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginHorizontal: 8, },
// //   confirmModalCancelButton: { backgroundColor: '#f3f4f6', },
// //   confirmModalCancelButtonText: { color: '#374151', fontFamily: 'Inter-SemiBold', },
// //   confirmModalRemoveButton: { backgroundColor: '#fee2e2', },
// //   confirmModalRemoveButtonText: { color: '#dc2626', fontFamily: 'Inter-SemiBold', },
// //   alertModalContent: { width: '100%', maxWidth: 400, backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
// //   alertModalTitle: { fontSize: 20, fontFamily: 'Inter-Bold', marginBottom: 8, },
// //   alertModalMessage: { fontSize: 14, fontFamily: 'Inter-Regular', textAlign: 'center', color: '#6b7280', marginBottom: 24, lineHeight: 20, },
// //   alertModalButton: { backgroundColor: '#059669', paddingVertical: 12, borderRadius: 12, alignItems: 'center', alignSelf: 'stretch' },
// //   alertModalButtonText: { color: 'white', fontFamily: 'Inter-SemiBold', fontSize: 16, },
// // });

// import React, { useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Platform, StatusBar, ActivityIndicator, Modal, LayoutAnimation, UIManager } from 'react-native';
// import { router } from 'expo-router'; 
// import { Plus, User as UserIcon, Mail, Check, X, Eye, EyeOff, ChevronRight, Trash2, MoreVertical, AlertTriangle, Flame } from 'lucide-react-native';
// import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
// import { StreakBadge } from '@/components/StreakBadge';
// import { FriendPrayerStatus } from '@/components/FriendPrayerStatus'; 

// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// const FriendActionSheet = ({ visible, onClose, onSelect, friend }) => {
//     if (!visible || !friend) return null;
//     const handleAction = (action) => { onSelect(action, friend); onClose(); };
//     return (
//       <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
//         <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
//           <View style={styles.actionSheetContainer}>
//             <View style={styles.actionSheetHeader}><Text style={styles.actionSheetTitle}>{friend.profile?.name}</Text><Text style={styles.actionSheetSubtitle}>{friend.profile?.email}</Text></View>
//             <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('view')}><ChevronRight size={20} color="#374151" /><Text style={styles.actionButtonText}>View Profile</Text></TouchableOpacity>
//             <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('toggle_access')}>{friend.can_view_prayers ? <EyeOff size={20} color="#374151" /> : <Eye size={20} color="#374151" />}<Text style={styles.actionButtonText}>{friend.can_view_prayers ? 'Disable Prayer Access' : 'Enable Prayer Access'}</Text></TouchableOpacity>
//             <TouchableOpacity style={[styles.actionButton, { borderBottomWidth: 0 }]} onPress={() => handleAction('remove')}><Trash2 size={20} color="#ef4444" /><Text style={styles.actionButtonText}>Remove Friend</Text></TouchableOpacity>
//             <TouchableOpacity style={styles.cancelSheetButton} onPress={onClose}><Text style={styles.cancelButtonText}>Cancel</Text></TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     );
// };

// const ConfirmRemoveModal = ({ visible, onClose, onConfirm, friendName }) => {
//     if (!visible) return null;
//     return (
//       <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.confirmModalContent}>
//             <View style={styles.confirmModalIconContainer}><AlertTriangle size={24} color="#d97706" /></View>
//             <Text style={styles.confirmModalTitle}>Remove Friend</Text>
//             <Text style={styles.confirmModalMessage}>Are you sure you want to remove {friendName}? This action cannot be undone.</Text>
//             <View style={styles.confirmModalButtonRow}>
//               <TouchableOpacity style={[styles.confirmModalButton, styles.confirmModalCancelButton]} onPress={onClose}><Text style={styles.confirmModalCancelButtonText}>Cancel</Text></TouchableOpacity>
//               <TouchableOpacity style={[styles.confirmModalButton, styles.confirmModalRemoveButton]} onPress={onConfirm}><Text style={styles.confirmModalRemoveButtonText}>Remove</Text></TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     );
// };

// const CustomAlertModal = ({ visible, onClose, title, message }) => {
//     if (!visible) return null;
//     return (
//         <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
//             <View style={styles.modalOverlay}>
//                 <View style={styles.alertModalContent}>
//                     <Text style={styles.alertModalTitle}>{title}</Text>
//                     <Text style={styles.alertModalMessage}>{message}</Text>
//                     <TouchableOpacity style={styles.alertModalButton} onPress={onClose}>
//                         <Text style={styles.alertModalButtonText}>Acknowledge</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </Modal>
//     );
// };
  
// export default function FriendsScreen() {
//   const { profile, friends, sharedStreaks, friendsPersonalStreaks, friendsDailyPrayers, sendFriendRequest, respondToFriendRequest, togglePrayerAccess, removeFriend, loading } = useSupabaseUser();
  
//   const [showAddFriend, setShowAddFriend] = useState(false);
//   const [newFriendEmail, setNewFriendEmail] = useState('');
//   const [requestLoading, setRequestLoading] = useState(false);
//   const [isNewFriendEmailFocused, setIsNewFriendEmailFocused] = useState(false);
//   const [isActionSheetVisible, setActionSheetVisible] = useState(false);
//   const [selectedFriend, setSelectedFriend] = useState(null);
//   const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  
//   const [alertInfo, setAlertInfo] = useState({ visible: false, title: '', message: '' });

//   if (loading) {
//     return (
//         <SafeAreaView style={styles.container}>
//             <ActivityIndicator style={{ flex: 1 }} size="large" color="#059669" />
//         </SafeAreaView>
//     );
//   }

//   const acceptedFriends = (friends || []).filter(f => f.status === 'accepted');
//   const pendingFriends = (friends || []).filter(f => f.status === 'pending');

//   const handleAddFriend = async () => {
//     setRequestLoading(true);
//     const { error } = await sendFriendRequest(newFriendEmail);
//     setRequestLoading(false);

//     if (error) {
//       setAlertInfo({ visible: true, title: 'Request Failed', message: error.message });
//     } else {
//       setAlertInfo({ visible: true, title: 'Success!', message: 'Your friend request has been sent.' });
//       setNewFriendEmail('');
//       setShowAddFriend(false);
//     }
//   };

//   const handleFriendPress = (friendship) => {
//     if (!profile) return;
//     const friendProfile = friendship.requester_id === profile.id ? friendship.addressee : friendship.requester;
//     if (friendProfile) { router.push(`/friend/${friendProfile.id}`); }
//   };

//   const handleActionSelect = (action, friendship) => {
//     const friendProfile = friendship.requester_id === profile.id ? friendship.addressee : friendship.requester;
//     setActionSheetVisible(false);
//     switch (action) {
//       case 'view': handleFriendPress(friendship); break;
//       case 'toggle_access': togglePrayerAccess(friendship.id); break;
//       case 'remove': setSelectedFriend({ ...friendship, profile: friendProfile }); setConfirmModalVisible(true); break;
//       default: break;
//     }
//   };
  
//   const onConfirmRemove = () => {
//     if (selectedFriend) {
//       LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//       removeFriend(selectedFriend.id);
//     }
//     setConfirmModalVisible(false);
//     setSelectedFriend(null);
//   };

//   const handleCancelAddFriend = () => {
//     setNewFriendEmail('');
//     setShowAddFriend(false);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <FriendActionSheet visible={isActionSheetVisible} onClose={() => setActionSheetVisible(false)} onSelect={handleActionSelect} friend={selectedFriend}/>
//       <ConfirmRemoveModal visible={isConfirmModalVisible} onClose={() => setConfirmModalVisible(false)} onConfirm={onConfirmRemove} friendName={selectedFriend?.profile?.name} />
//       <CustomAlertModal visible={alertInfo.visible} title={alertInfo.title} message={alertInfo.message} onClose={() => setAlertInfo({ visible: false, title: '', message: '' })} />
      
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Friends</Text>
//         <TouchableOpacity style={styles.addButton} onPress={() => setShowAddFriend(true)}>
//           <Plus size={20} color="#ffffff" />
//         </TouchableOpacity>
//       </View>
//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {showAddFriend && (
//           <View style={styles.addFriendCard}>
//             <Text style={styles.cardTitle}>Add New Friend</Text>
//             <View style={[styles.inputContainer, isNewFriendEmailFocused && styles.inputContainerFocused]}>
//               <Mail size={20} color={isNewFriendEmailFocused ? '#059669' : '#6b7280'} />
//               <TextInput style={styles.textInput} placeholder="friend@example.com" value={newFriendEmail} onChangeText={setNewFriendEmail} autoCapitalize="none" onFocus={() => setIsNewFriendEmailFocused(true)} onBlur={() => setIsNewFriendEmailFocused(false)} placeholderTextColor="#9ca3af"/>
//             </View>
//             <View style={styles.buttonRow}>
//               <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={handleCancelAddFriend}><Text style={styles.cancelButtonText}>Cancel</Text></TouchableOpacity>
//               <TouchableOpacity style={[styles.button, styles.addFriendButton]} onPress={handleAddFriend} disabled={requestLoading}>
//                 {requestLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.addFriendButtonText}>Send Request</Text>}
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//         {pendingFriends.length > 0 && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Pending Requests</Text>
//             {pendingFriends.map((friendship) => {
//               const friendProfile = friendship.requester_id === profile.id ? friendship.addressee : friendship.requester;
//               return (
//                 <View key={friendship.id} style={styles.friendCard}>
//                   <View style={styles.friendInfo}>
//                     <UserIcon size={24} color="#6b7280" />
//                     <View style={styles.friendDetails}>
//                       <Text style={styles.friendName}>{friendProfile?.name || 'User'}</Text>
//                       <Text style={styles.friendEmail}>{friendProfile?.email || 'No email'}</Text>
//                     </View>
//                   </View>
//                   {profile && friendship.addressee_id === profile.id ? (
//                     <View style={styles.pendingActions}>
//                       <TouchableOpacity style={styles.acceptButton} onPress={() => respondToFriendRequest(friendship.id, true)}><Check size={16} color="#ffffff" /></TouchableOpacity>
//                       <TouchableOpacity style={styles.rejectButton} onPress={() => respondToFriendRequest(friendship.id, false)}><X size={16} color="#ffffff" /></TouchableOpacity>
//                     </View>
//                   ) : (
//                     <Text style={styles.pendingText}>Request Sent</Text>
//                   )}
//                 </View>
//               );
//             })}
//           </View>
//         )}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>My Friends ({acceptedFriends.length})</Text>
//           {acceptedFriends.map((friendship) => {
//             const friendProfile = profile && friendship.requester_id === profile.id ? friendship.addressee : friendship.requester;
//             const sharedStreak = sharedStreaks.get(friendship.id) || 0;
//             const personalStreak = friendsPersonalStreaks.get(friendProfile.id) || 0;
//             // Get the friend's daily prayer data from the context
//             const dailyPrayers = friendsDailyPrayers.get(friendProfile.id) || [];

//             return (
//               <TouchableOpacity key={friendship.id} style={styles.friendCard} onPress={() => handleFriendPress(friendship)}>
//                 <View style={styles.friendInfo}>
//                   <UserIcon size={24} color="#6b7280" />
//                   <View style={styles.friendDetails}>
//                     <View style={styles.nameAndBadgeContainer}>
//                         <Text style={styles.friendName}>{friendProfile?.name || 'User'}</Text>
//                         <StreakBadge streak={personalStreak} size={16} />
//                     </View>
//                     {/* Render the new prayer status component */}
//                     <FriendPrayerStatus prayers={dailyPrayers} />
//                   </View>
//                 </View>
//                 <View style={styles.friendActions}>
//                     {sharedStreak > 0 && (
//                         <View style={styles.streakContainer}>
//                             <Flame size={14} color="#f97316" />
//                             <Text style={styles.streakText}>{sharedStreak}</Text>
//                         </View>
//                     )}
//                     <TouchableOpacity style={styles.moreButton} onPress={(e) => { e.stopPropagation(); setSelectedFriend({ ...friendship, profile: friendProfile }); setActionSheetVisible(true); }}>
//                         <MoreVertical size={20} color="#6b7280" />
//                     </TouchableOpacity>
//                 </View>
//               </TouchableOpacity>
//             );
//           })}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f9fafb', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, },
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
//   headerTitle: { fontSize: 24, fontFamily: 'Inter-Bold', color: '#1f2937' },
//   addButton: { backgroundColor: '#059669', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
//   content: { flex: 1, paddingHorizontal: 16 },
//   addFriendCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginVertical: 8, borderWidth: 1, borderColor: '#e5e7eb' },
//   cardTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: '#1f2937', marginBottom: 16 },
//   inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#d1d5db', borderRadius: 12, paddingHorizontal: 16, marginBottom: 16, gap: 12, },
//   inputContainerFocused: { borderColor: '#059669', },
//   textInput: { flex: 1, fontSize: 16, paddingVertical: 12, outlineStyle: 'none', },
//   buttonRow: { flexDirection: 'row', gap: 12 },
//   button: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
//   cancelBtn: { backgroundColor: '#f3f4f6' },
//   cancelButtonText: { fontFamily: 'Inter-SemiBold' },
//   addFriendButton: { backgroundColor: '#059669' },
//   addFriendButtonText: { color: '#ffffff', fontFamily: 'Inter-SemiBold' },
//   section: { marginTop: 16 },
//   sectionTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: '#1f2937', marginBottom: 8, marginLeft: 4, marginTop: 16 },
//   friendCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#e5e7eb' },
//   friendInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
//   friendDetails: { flex: 1, marginLeft: 16 },
//   nameAndBadgeContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//   friendName: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: '#1f2937' },
//   friendEmail: { fontSize: 12, color: '#6b7280' },
//   pendingActions: { flexDirection: 'row', gap: 8 },
//   acceptButton: { backgroundColor: '#059669', padding: 8, borderRadius: 99 },
//   rejectButton: { backgroundColor: '#dc2626', padding: 8, borderRadius: 99 },
//   pendingText: { fontFamily: 'Inter-Regular', color: '#6b7280' },
//   friendActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   moreButton: { padding: 8 },
//   streakContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff7ed', borderRadius: 99, paddingHorizontal: 8, paddingVertical: 4, },
//   streakText: { marginLeft: 4, fontFamily: 'Inter-Bold', color: '#c2410c', fontSize: 12, },
  
//   // Modal/Alert styles
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
//   actionSheetContainer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#f9fafb', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, },
//   actionSheetHeader: { paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', marginBottom: 8, },
//   actionSheetTitle: { fontSize: 18, fontFamily: 'Inter-Bold', textAlign: 'center' },
//   actionSheetSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
//   actionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', gap: 16, },
//   actionButtonText: { fontSize: 16, fontFamily: 'Inter-Medium', color: '#374151' },
//   cancelSheetButton: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginTop: 16, alignItems: 'center', width: '100%' },
//   confirmModalContent: { width: '100%', maxWidth: 400, backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
//   confirmModalIconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center', marginBottom: 16, },
//   confirmModalTitle: { fontSize: 20, fontFamily: 'Inter-Bold', marginBottom: 8, },
//   confirmModalMessage: { fontSize: 14, fontFamily: 'Inter-Regular', textAlign: 'center', color: '#6b7280', marginBottom: 24, lineHeight: 20, },
//   confirmModalButtonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', },
//   confirmModalButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginHorizontal: 8, },
//   confirmModalCancelButton: { backgroundColor: '#f3f4f6', },
//   confirmModalCancelButtonText: { color: '#374151', fontFamily: 'Inter-SemiBold', },
//   confirmModalRemoveButton: { backgroundColor: '#fee2e2', },
//   confirmModalRemoveButtonText: { color: '#dc2626', fontFamily: 'Inter-SemiBold', },
//   alertModalContent: { width: '100%', maxWidth: 400, backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
//   alertModalTitle: { fontSize: 20, fontFamily: 'Inter-Bold', marginBottom: 8, },
//   alertModalMessage: { fontSize: 14, fontFamily: 'Inter-Regular', textAlign: 'center', color: '#6b7280', marginBottom: 24, lineHeight: 20, },
//   alertModalButton: { backgroundColor: '#059669', paddingVertical: 12, borderRadius: 12, alignItems: 'center', alignSelf: 'stretch' },
//   alertModalButtonText: { color: 'white', fontFamily: 'Inter-SemiBold', fontSize: 16, },
// });
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Platform, StatusBar, ActivityIndicator, Modal, LayoutAnimation, UIManager } from 'react-native';
import { router } from 'expo-router';
import { Plus, User as UserIcon, Mail, Check, X, ChevronRight, Trash2, MoreVertical, AlertTriangle, Flame } from 'lucide-react-native';
import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
import { StreakBadge } from '@/components/StreakBadge';
import { FriendPrayerStatus } from '@/components/FriendPrayerStatus';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// The action sheet no longer contains the prayer access toggle
const FriendActionSheet = ({ visible, onClose, onSelect, friend }) => {
    if (!visible || !friend) return null;
    const handleAction = (action) => { onSelect(action, friend); onClose(); };
    return (
      <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
          <View style={styles.actionSheetContainer}>
            <View style={styles.actionSheetHeader}><Text style={styles.actionSheetTitle}>{friend.profile?.name}</Text><Text style={styles.actionSheetSubtitle}>{friend.profile?.email}</Text></View>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('view')}><ChevronRight size={20} color="#374151" /><Text style={styles.actionButtonText}>View Prayers</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { borderBottomWidth: 0 }]} onPress={() => handleAction('remove')}><Trash2 size={20} color="#ef4444" /><Text style={styles.actionButtonText}>Remove Friend</Text></TouchableOpacity>
            <TouchableOpacity style={styles.cancelSheetButton} onPress={onClose}><Text style={styles.cancelButtonText}>Cancel</Text></TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
};

const ConfirmRemoveModal = ({ visible, onClose, onConfirm, friendName }) => {
    if (!visible) return null;
    return (
      <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContent}>
            <View style={styles.confirmModalIconContainer}><AlertTriangle size={24} color="#d97706" /></View>
            <Text style={styles.confirmModalTitle}>Remove Friend</Text>
            <Text style={styles.confirmModalMessage}>Are you sure you want to remove {friendName}? This action cannot be undone.</Text>
            <View style={styles.confirmModalButtonRow}>
              <TouchableOpacity style={[styles.confirmModalButton, styles.confirmModalCancelButton]} onPress={onClose}><Text style={styles.confirmModalCancelButtonText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.confirmModalButton, styles.confirmModalRemoveButton]} onPress={onConfirm}><Text style={styles.confirmModalRemoveButtonText}>Remove</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
};

const CustomAlertModal = ({ visible, onClose, title, message }) => {
    if (!visible) return null;
    return (
        <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.alertModalContent}>
                    <Text style={styles.alertModalTitle}>{title}</Text>
                    <Text style={styles.alertModalMessage}>{message}</Text>
                    <TouchableOpacity style={styles.alertModalButton} onPress={onClose}>
                        <Text style={styles.alertModalButtonText}>Acknowledge</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
  
export default function FriendsScreen() {
  // Removed `togglePrayerAccess` as it's no longer used here
  const { profile, friends, sharedStreaks, friendsPersonalStreaks, friendsDailyPrayers, sendFriendRequest, respondToFriendRequest, removeFriend, loading } = useSupabaseUser();
  
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [isNewFriendEmailFocused, setIsNewFriendEmailFocused] = useState(false);
  const [isActionSheetVisible, setActionSheetVisible] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  
  const [alertInfo, setAlertInfo] = useState({ visible: false, title: '', message: '' });

  if (loading) {
    return (
        <SafeAreaView style={styles.container}>
            <ActivityIndicator style={{ flex: 1 }} size="large" color="#059669" />
        </SafeAreaView>
    );
  }

  const acceptedFriends = (friends || []).filter(f => f.status === 'accepted');
  const pendingFriends = (friends || []).filter(f => f.status === 'pending');

  const handleAddFriend = async () => {
    setRequestLoading(true);
    const { error } = await sendFriendRequest(newFriendEmail);
    setRequestLoading(false);

    if (error) {
      setAlertInfo({ visible: true, title: 'Request Failed', message: error.message });
    } else {
      setAlertInfo({ visible: true, title: 'Success!', message: 'Your friend request has been sent.' });
      setNewFriendEmail('');
      setShowAddFriend(false);
    }
  };

  const handleFriendPress = (friendship) => {
    if (!profile) return;
    const friendProfile = friendship.requester_id === profile.id ? friendship.addressee : friendship.requester;
    if (friendProfile) { router.push(`/friend/${friendProfile.id}`); }
  };

  // Removed the 'toggle_access' case
  const handleActionSelect = (action, friendship) => {
    const friendProfile = friendship.requester_id === profile.id ? friendship.addressee : friendship.requester;
    setActionSheetVisible(false);
    switch (action) {
      case 'view': handleFriendPress(friendship); break;
      case 'remove': setSelectedFriend({ ...friendship, profile: friendProfile }); setConfirmModalVisible(true); break;
      default: break;
    }
  };
  
  const onConfirmRemove = () => {
    if (selectedFriend) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      removeFriend(selectedFriend.id);
    }
    setConfirmModalVisible(false);
    setSelectedFriend(null);
  };

  const handleCancelAddFriend = () => {
    setNewFriendEmail('');
    setShowAddFriend(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FriendActionSheet visible={isActionSheetVisible} onClose={() => setActionSheetVisible(false)} onSelect={handleActionSelect} friend={selectedFriend}/>
      <ConfirmRemoveModal visible={isConfirmModalVisible} onClose={() => setConfirmModalVisible(false)} onConfirm={onConfirmRemove} friendName={selectedFriend?.profile?.name} />
      <CustomAlertModal visible={alertInfo.visible} title={alertInfo.title} message={alertInfo.message} onClose={() => setAlertInfo({ visible: false, title: '', message: '' })} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Friends</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddFriend(true)}>
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {showAddFriend && (
          <View style={styles.addFriendCard}>
            <Text style={styles.cardTitle}>Add New Friend</Text>
            <View style={[styles.inputContainer, isNewFriendEmailFocused && styles.inputContainerFocused]}>
              <Mail size={20} color={isNewFriendEmailFocused ? '#059669' : '#6b7280'} />
              <TextInput style={styles.textInput} placeholder="friend@example.com" value={newFriendEmail} onChangeText={setNewFriendEmail} autoCapitalize="none" onFocus={() => setIsNewFriendEmailFocused(true)} onBlur={() => setIsNewFriendEmailFocused(false)} placeholderTextColor="#9ca3af"/>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={handleCancelAddFriend}><Text style={styles.cancelButtonText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.addFriendButton]} onPress={handleAddFriend} disabled={requestLoading}>
                {requestLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.addFriendButtonText}>Send Request</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )}
        {pendingFriends.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            {pendingFriends.map((friendship) => {
              const friendProfile = friendship.requester_id === profile.id ? friendship.addressee : friendship.requester;
              return (
                <View key={friendship.id} style={styles.friendCard}>
                  <View style={styles.friendInfo}>
                    <UserIcon size={24} color="#6b7280" />
                    <View style={styles.friendDetails}>
                      <Text style={styles.friendName}>{friendProfile?.name || 'User'}</Text>
                      <Text style={styles.friendEmail}>{friendProfile?.email || 'No email'}</Text>
                    </View>
                  </View>
                  {profile && friendship.addressee_id === profile.id ? (
                    <View style={styles.pendingActions}>
                      <TouchableOpacity style={styles.acceptButton} onPress={() => respondToFriendRequest(friendship.id, true)}><Check size={16} color="#ffffff" /></TouchableOpacity>
                      <TouchableOpacity style={styles.rejectButton} onPress={() => respondToFriendRequest(friendship.id, false)}><X size={16} color="#ffffff" /></TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={styles.pendingText}>Request Sent</Text>
                  )}
                </View>
              );
            })}
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Friends ({acceptedFriends.length})</Text>
          {acceptedFriends.map((friendship) => {
            const friendProfile = profile && friendship.requester_id === profile.id ? friendship.addressee : friendship.requester;
            const sharedStreak = sharedStreaks.get(friendship.id) || 0;
            const personalStreak = friendsPersonalStreaks.get(friendProfile.id) || 0;
            const dailyPrayers = friendsDailyPrayers.get(friendProfile.id) || [];

            return (
              <TouchableOpacity key={friendship.id} style={styles.friendCard} onPress={() => handleFriendPress(friendship)}>
                <View style={styles.friendInfo}>
                  <UserIcon size={24} color="#6b7280" />
                  <View style={styles.friendDetails}>
                    <View style={styles.nameAndBadgeContainer}>
                        <Text style={styles.friendName}>{friendProfile?.name || 'User'}</Text>
                        <StreakBadge streak={personalStreak} size={16} />
                    </View>
                    <FriendPrayerStatus prayers={dailyPrayers} />
                  </View>
                </View>
                <View style={styles.friendActions}>
                    {sharedStreak > 0 && (
                        <View style={styles.streakContainer}>
                            <Flame size={14} color="#f97316" />
                            <Text style={styles.streakText}>{sharedStreak}</Text>
                        </View>
                    )}
                    <TouchableOpacity style={styles.moreButton} onPress={(e) => { e.stopPropagation(); setSelectedFriend({ ...friendship, profile: friendProfile }); setActionSheetVisible(true); }}>
                        <MoreVertical size={20} color="#6b7280" />
                    </TouchableOpacity>
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
  content: { flex: 1, paddingHorizontal: 16 },
  addFriendCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginVertical: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: '#1f2937', marginBottom: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#d1d5db', borderRadius: 12, paddingHorizontal: 16, marginBottom: 16, gap: 12, },
  inputContainerFocused: { borderColor: '#059669', },
  textInput: { flex: 1, fontSize: 16, paddingVertical: 12, outlineStyle: 'none', },
  buttonRow: { flexDirection: 'row', gap: 12 },
  button: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#f3f4f6' },
  cancelButtonText: { fontFamily: 'Inter-SemiBold' },
  addFriendButton: { backgroundColor: '#059669' },
  addFriendButtonText: { color: '#ffffff', fontFamily: 'Inter-SemiBold' },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: '#1f2937', marginBottom: 8, marginLeft: 4, marginTop: 16 },
  friendCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  friendInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  friendDetails: { flex: 1, marginLeft: 16 },
  nameAndBadgeContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  friendName: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: '#1f2937' },
  friendEmail: { fontSize: 12, color: '#6b7280' },
  pendingActions: { flexDirection: 'row', gap: 8 },
  acceptButton: { backgroundColor: '#059669', padding: 8, borderRadius: 99 },
  rejectButton: { backgroundColor: '#dc2626', padding: 8, borderRadius: 99 },
  pendingText: { fontFamily: 'Inter-Regular', color: '#6b7280' },
  friendActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  moreButton: { padding: 8 },
  streakContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff7ed', borderRadius: 99, paddingHorizontal: 8, paddingVertical: 4, },
  streakText: { marginLeft: 4, fontFamily: 'Inter-Bold', color: '#c2410c', fontSize: 12, },
  
  // Modal/Alert styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  actionSheetContainer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#f9fafb', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, },
  actionSheetHeader: { paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', marginBottom: 8, },
  actionSheetTitle: { fontSize: 18, fontFamily: 'Inter-Bold', textAlign: 'center' },
  actionSheetSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
  actionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', gap: 16, },
  actionButtonText: { fontSize: 16, fontFamily: 'Inter-Medium', color: '#374151' },
  cancelSheetButton: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginTop: 16, alignItems: 'center', width: '100%' },
  confirmModalContent: { width: '100%', maxWidth: 400, backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  confirmModalIconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center', marginBottom: 16, },
  confirmModalTitle: { fontSize: 20, fontFamily: 'Inter-Bold', marginBottom: 8, },
  confirmModalMessage: { fontSize: 14, fontFamily: 'Inter-Regular', textAlign: 'center', color: '#6b7280', marginBottom: 24, lineHeight: 20, },
  confirmModalButtonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', },
  confirmModalButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginHorizontal: 8, },
  confirmModalCancelButton: { backgroundColor: '#f3f4f6', },
  confirmModalCancelButtonText: { color: '#374151', fontFamily: 'Inter-SemiBold', },
  confirmModalRemoveButton: { backgroundColor: '#fee2e2', },
  confirmModalRemoveButtonText: { color: '#dc2626', fontFamily: 'Inter-SemiBold', },
  alertModalContent: { width: '100%', maxWidth: 400, backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  alertModalTitle: { fontSize: 20, fontFamily: 'Inter-Bold', marginBottom: 8, },
  alertModalMessage: { fontSize: 14, fontFamily: 'Inter-Regular', textAlign: 'center', color: '#6b7280', marginBottom: 24, lineHeight: 20, },
  alertModalButton: { backgroundColor: '#059669', paddingVertical: 12, borderRadius: 12, alignItems: 'center', alignSelf: 'stretch' },
  alertModalButtonText: { color: 'white', fontFamily: 'Inter-SemiBold', fontSize: 16, },
});
