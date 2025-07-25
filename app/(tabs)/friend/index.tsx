
import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity,
  TextInput, Platform, StatusBar, ActivityIndicator, Modal, LayoutAnimation,
  UIManager, Image
} from 'react-native';
import { router } from 'expo-router';
import { Plus, User as UserIcon, Mail, Check, X, ChevronRight, Trash2, MoreVertical, AlertTriangle, Flame, Image as ImageIcon, Lock, XCircle } from 'lucide-react-native';
import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
import { StreakBadge } from '@/components/StreakBadge';
import { FriendPrayerStatus } from '@/components/FriendPrayerStatus';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase'; // Ensure supabase is imported

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Start of Change 1: Update FriendActionSheet to include the new option ---
const FriendActionSheet = ({ visible, onClose, onSelect, friend, hasCustomAvatar, colors, theme }) => {
    if (!visible || !friend) return null;
    const handleAction = (action) => { onSelect(action, friend); onClose(); };
    const isPrivate = friend.profile?.is_private ?? false;

    const styles = useMemo(() => StyleSheet.create({
        modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
        actionSheetContainer: { backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 8, paddingBottom: Platform.OS === 'ios' ? 30 : 20 },
        actionSheetHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 8, },
        actionSheetTitle: { fontSize: 18, fontFamily: 'Inter-Bold', textAlign: 'center', color: colors.text },
        actionSheetSubtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },
        actionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, gap: 16, borderRadius: 12 },
        actionButtonText: { fontSize: 16, fontFamily: 'Inter-Medium', color: colors.text },
        actionSheetSection: { borderRadius: 12, overflow: 'hidden', marginVertical: 4, backgroundColor: colors.card },
        disabledActionButtonText: { color: colors.textSecondary },
        cancelSheetButton: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginTop: 16, alignItems: 'center' },
        cancelButtonText: { fontFamily: 'Inter-Bold', color: colors.text, fontSize: 16 },
    }), [colors]);

    return (
      <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
          <View style={styles.actionSheetContainer}>
            <View style={styles.actionSheetHeader}>
                <Text style={styles.actionSheetTitle}>{friend.profile?.name}</Text>
                <Text style={styles.actionSheetSubtitle}>{friend.profile?.email}</Text>
            </View>
            <View style={styles.actionSheetSection}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('view')} disabled={isPrivate}>
                    <ChevronRight size={20} color={isPrivate ? colors.textSecondary : colors.text} />
                    <Text style={[styles.actionButtonText, isPrivate && styles.disabledActionButtonText]}>View Prayers</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.actionSheetSection}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('editImage')}>
                    <ImageIcon size={20} color={colors.text} />
                    <Text style={styles.actionButtonText}>Set Custom Image</Text>
                </TouchableOpacity>
                {/* Conditionally render the "Remove" button if a custom avatar exists */}
                {hasCustomAvatar && (
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('removeImage')}>
                        <XCircle size={20} color={colors.text} />
                        <Text style={styles.actionButtonText}>Remove Custom Image</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.actionSheetSection}>
                 <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('remove')}>
                    <Trash2 size={20} color="#ef4444" />
                    <Text style={[styles.actionButtonText, {color: "#ef4444"}]}>Remove Friend</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.cancelSheetButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
};
// --- End of Change 1 ---

const ConfirmRemoveModal = ({ visible, onClose, onConfirm, friendName, colors }) => {
    if (!visible) return null;

    const styles = useMemo(() => StyleSheet.create({
        modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
        confirmModalContent: { width: '100%', maxWidth: 400, backgroundColor: colors.card, borderRadius: 16, padding: 24, alignItems: 'center', elevation: 5 },
        confirmModalIconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(217, 119, 6, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 16, },
        confirmModalTitle: { fontSize: 20, fontFamily: 'Inter-Bold', marginBottom: 8, color: colors.text },
        confirmModalMessage: { fontSize: 14, fontFamily: 'Inter-Regular', textAlign: 'center', color: colors.textSecondary, marginBottom: 24, lineHeight: 20, },
        confirmModalButtonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', },
        confirmModalButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginHorizontal: 8, },
        confirmModalCancelButton: { backgroundColor: colors.buttonDisabled, },
        confirmModalCancelButtonText: { color: colors.textSecondary, fontFamily: 'Inter-SemiBold', },
        confirmModalRemoveButton: { backgroundColor: 'rgba(239, 68, 68, 0.1)', },
        confirmModalRemoveButtonText: { color: '#ef4444', fontFamily: 'Inter-SemiBold', },
    }), [colors]);

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

const CustomAlertModal = ({ visible, onClose, title, message, showAcknowledgeButton = true, colors }) => {
    if (!visible) return null;
    const isSuccess = title === 'Success!';
    const Icon = isSuccess ? Check : AlertTriangle;
    const iconColor = isSuccess ? colors.primary : '#f59e0b';

    const styles = useMemo(() => StyleSheet.create({
        modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
        alertModalContent: { width: '100%', maxWidth: 400, backgroundColor: colors.card, borderRadius: 16, padding: 24, alignItems: 'center', elevation: 5 },
        alertModalTitle: { fontSize: 20, fontFamily: 'Inter-Bold', marginBottom: 8, color: colors.text },
        alertModalMessage: { fontSize: 14, fontFamily: 'Inter-Regular', textAlign: 'center', color: colors.textSecondary, marginBottom: 24, lineHeight: 20, },
        alertModalButton: { backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 12, alignItems: 'center', alignSelf: 'stretch' },
        alertModalButtonText: { color: 'white', fontFamily: 'Inter-SemiBold', fontSize: 16, },
        alertIcon: { marginBottom: 16 },
    }), [colors]);

    return (
        <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.alertModalContent}>
                    <Icon size={48} color={iconColor} style={styles.alertIcon} />
                    <Text style={styles.alertModalTitle}>{title}</Text>
                    <Text style={styles.alertModalMessage}>{message}</Text>
                    {showAcknowledgeButton && (
                        <TouchableOpacity style={styles.alertModalButton} onPress={onClose}>
                            <Text style={styles.alertModalButtonText}>Acknowledge</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );
};


export default function FriendsScreen() {
  const { theme, colors } = useTheme();
  const {
    profile, friends, sharedStreaks, friendsPersonalStreaks, friendsDailyPrayers,
    sendFriendRequest, respondToFriendRequest, removeFriend,
    loading: contextLoading,
    fetchData,
    friendAvatars,
    setFriendAvatar
  } = useSupabaseUser();

  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [isNewFriendEmailFocused, setIsNewFriendEmailFocused] = useState(false);
  const [isActionSheetVisible, setActionSheetVisible] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ visible: false, title: '', message: '', showAcknowledgeButton: true });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchData();
    } catch (error) {
      console.error("Failed to refresh friend data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchData]);

  const handleAddFriend = async () => {
    setRequestLoading(true);
    const { error } = await sendFriendRequest(newFriendEmail);
    setRequestLoading(false);

    if (error) {
      setAlertInfo({ visible: true, title: 'Request Failed', message: error.message, showAcknowledgeButton: true });
    } else {
      setAlertInfo({ visible: true, title: 'Success!', message: 'Your friend request has been sent.', showAcknowledgeButton: true });
      setNewFriendEmail('');
      setShowAddFriend(false);
    }
  };

  const handleFriendPress = (friendship) => {
    if (!profile) {
      console.warn("[FriendsScreen] handleFriendPress: User profile not available.");
      return;
    }
    const friendProfile = friendship.requester_id === profile.id ? friendship.addressee : friendship.requester;

    if (friendProfile?.is_private) {
      setAlertInfo({
        visible: true,
        title: 'Private Profile',
        message: `${friendProfile.name || 'This user'} has set their prayer data to private.`,
        showAcknowledgeButton: true,
      });
      return;
    }

    if (friendProfile) { router.push(`/friend/${friendProfile.id}`); }
  };

  const handleSetImage = async (friendship) => {
    const friendProfile = friendship.requester_id === profile.id ? friendship.addressee : friendship.requester;
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
    });

    if (!result.canceled) {
        const { error } = await setFriendAvatar(friendProfile.id, result.assets[0].uri);
        if (error) {
            setAlertInfo({ visible: true, title: 'Upload Failed', message: error.message, showAcknowledgeButton: true });
        } else {
            setAlertInfo({ visible: true, title: 'Success!', message: 'Custom image has been set.', showAcknowledgeButton: false });
            setTimeout(() => setAlertInfo(prev => ({ ...prev, visible: false })), 1500);
        }
    }
  };
  
  // --- Start of Change 2: Add the new handleRemoveAvatar function ---
  const handleRemoveAvatar = async (friendship) => {
    const friendProfile = friendship.requester_id === profile.id ? friendship.addressee : friendship.requester;
    const friendId = friendProfile.id;
    const customAvatarUrl = friendAvatars.get(friendId);
  
    if (!customAvatarUrl) {
      setAlertInfo({ visible: true, title: 'Error', message: 'No custom avatar to remove.', showAcknowledgeButton: true });
      return;
    }
  
    // Extract the file path from the full URL to use for storage deletion
    const avatarPath = customAvatarUrl.split('/friend-avatars/')[1];
    
    if (!avatarPath) {
        setAlertInfo({ visible: true, title: 'Error', message: 'Could not determine avatar path.', showAcknowledgeButton: true });
        return;
    }

    try {
      // Step 1: Delete the image file from Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('friend-avatars')
        .remove([avatarPath]);
  
      if (storageError) throw storageError;
  
      // Step 2: Delete the record from the 'friend_avatars' database table
      const { error: dbError } = await supabase
        .from('friend_avatars')
        .delete()
        .eq('user_id', profile.id)
        .eq('friend_id', friendId);
  
      if (dbError) throw dbError;
  
      // Step 3: Manually trigger a data refresh to update the UI
      await fetchData();
      setAlertInfo({ visible: true, title: 'Success!', message: 'Custom avatar removed.', showAcknowledgeButton: false });
      setTimeout(() => setAlertInfo(prev => ({ ...prev, visible: false })), 1500);
  
    } catch (error) {
      console.error('Error removing custom avatar:', error.message);
      setAlertInfo({ visible: true, title: 'Error', message: 'Failed to remove custom avatar.', showAcknowledgeButton: true });
    }
  };
  // --- End of Change 2 ---

  // --- Start of Change 3: Update handleActionSelect to handle the new action ---
  const handleActionSelect = (action, friendship) => {
    const friendProfile = friendship.requester_id === profile.id ? friendship.addressee : friendship.requester;
    setActionSheetVisible(false);
    switch (action) {
      case 'view': handleFriendPress(friendship); break;
      case 'remove': setSelectedFriend({ ...friendship, profile: friendProfile }); setConfirmModalVisible(true); break;
      case 'editImage': handleSetImage(friendship); break;
      case 'removeImage': handleRemoveAvatar(friendship); break; // Add this new case
      default: break;
    }
  };
  // --- End of Change 3 ---

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
  
  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20, backgroundColor: colors.background },
    headerTitle: { fontSize: 24, fontFamily: 'Inter-Bold', color: colors.text },
    headerTitleRefreshing: { color: colors.primary },
    addButton: { backgroundColor: colors.primary, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    content: { flex: 1, paddingHorizontal: 16 },
    addFriendCard: { backgroundColor: colors.card, borderRadius: 16, padding: 20, marginVertical: 8, borderWidth: 1, borderColor: colors.border },
    cardTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: colors.text, marginBottom: 16 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16, marginBottom: 16, gap: 12, },
    inputContainerFocused: { borderColor: colors.primary, },
    textInput: { flex: 1, fontSize: 16, paddingVertical: 12, color: colors.text, outlineStyle: 'none' },
    buttonRow: { flexDirection: 'row', gap: 12 },
    button: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
    cancelBtn: { backgroundColor: colors.buttonDisabled },
    cancelButtonText: { fontFamily: 'Inter-SemiBold', color: colors.textSecondary },
    addFriendButton: { backgroundColor: colors.primary },
    addFriendButtonText: { color: '#ffffff', fontFamily: 'Inter-SemiBold' },
    section: { marginTop: 16 },
    sectionTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: colors.text, marginBottom: 8, marginLeft: 4, marginTop: 16 },
    friendCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
    friendInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', marginRight: 12, overflow: 'hidden' },
    friendDetails: { flex: 1, },
    nameAndBadgeContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    friendName: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: colors.text },
    friendEmail: { fontSize: 12, color: colors.textSecondary },
    pendingActions: { flexDirection: 'row', gap: 8 },
    acceptButton: { backgroundColor: colors.primary, padding: 8, borderRadius: 99 },
    rejectButton: { backgroundColor: '#dc2626', padding: 8, borderRadius: 99 },
    pendingText: { fontFamily: 'Inter-Regular', color: colors.textSecondary },
    friendActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    moreButton: { padding: 8 },
    streakContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 99, paddingHorizontal: 8, paddingVertical: 4, marginLeft: 4, },
    streakText: { marginLeft: 4, fontFamily: 'Inter-Bold', color: '#c2410c', fontSize: 12, },
  }), [colors, theme]);
  
  if (contextLoading && !isRefreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  const acceptedFriends = (friends || []).filter(f => f.status === 'accepted');
  const pendingFriends = (friends || []).filter(f => f.status === 'pending');

  return (
    <SafeAreaView style={styles.container}>
      {/* --- Start of Change 4: Update the FriendActionSheet call to pass the hasCustomAvatar prop --- */}
      <FriendActionSheet
        visible={isActionSheetVisible}
        onClose={() => setActionSheetVisible(false)}
        onSelect={handleActionSelect}
        friend={selectedFriend}
        hasCustomAvatar={!!(selectedFriend && friendAvatars.get(selectedFriend.profile.id))}
        colors={colors}
        theme={theme}
      />
      {/* --- End of Change 4 --- */}
      <ConfirmRemoveModal visible={isConfirmModalVisible} onClose={() => setConfirmModalVisible(false)} onConfirm={onConfirmRemove} friendName={selectedFriend?.profile?.name} colors={colors} />
      <CustomAlertModal visible={alertInfo.visible} title={alertInfo.title} message={alertInfo.message} onClose={() => setAlertInfo({ visible: false, title: '', message: '', showAcknowledgeButton: true })} showAcknowledgeButton={alertInfo.showAcknowledgeButton} colors={colors}/>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleRefresh} disabled={isRefreshing}>
          <Text style={[styles.headerTitle, isRefreshing && styles.headerTitleRefreshing]}>
            Friends
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddFriend(true)}>
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {showAddFriend && (
          <View style={styles.addFriendCard}>
            <Text style={styles.cardTitle}>Add New Friend</Text>
            <View style={[styles.inputContainer, isNewFriendEmailFocused && styles.inputContainerFocused]}>
              <Mail size={20} color={isNewFriendEmailFocused ? colors.primary : colors.textSecondary} />
              <TextInput style={styles.textInput} placeholder="friend@example.com" value={newFriendEmail} onChangeText={setNewFriendEmail} autoCapitalize="none" onFocus={() => setIsNewFriendEmailFocused(true)} onBlur={() => setIsNewFriendEmailFocused(false)} placeholderTextColor={colors.textSecondary} />
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
                    <View style={styles.avatar}>
                        <UserIcon size={24} color={colors.textSecondary} />
                    </View>
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
            const isFriendPrivate = friendProfile?.is_private ?? false;
            const customAvatar = friendAvatars.get(friendProfile.id);
            const displayAvatarUrl = customAvatar || friendProfile?.avatar_url;

            return (
              <TouchableOpacity key={friendship.id} style={styles.friendCard} onPress={() => handleFriendPress(friendship)}>
                <View style={styles.friendInfo}>
                  <View style={styles.avatar}>
                    {displayAvatarUrl ? (
                        <Image source={{ uri: displayAvatarUrl }} style={{width: '100%', height: '100%'}} />
                    ) : (
                        <UserIcon size={24} color={colors.textSecondary} />
                    )}
                  </View>
                  <View style={styles.friendDetails}>
                    <View style={styles.nameAndBadgeContainer}>
                      <Text style={styles.friendName}>{friendProfile?.name || 'User'}</Text>
                      <StreakBadge streak={personalStreak} size={16} />
                    </View>
                    <FriendPrayerStatus prayers={dailyPrayers} isPrivateProfile={isFriendPrivate} />
                  </View>
                </View>
                <View style={styles.friendActions}>
                  
                  {sharedStreak > 0 && (
                    <View style={styles.streakContainer}>
                      <Flame size={16} color="#f97316" />
                      <Text style={styles.streakText}>{sharedStreak}</Text>
                    </View>
                  )}
                  {isFriendPrivate && <Lock size={16} color={colors.textSecondary} />}
                  <TouchableOpacity style={styles.moreButton} onPress={(e) => { e.stopPropagation(); setSelectedFriend({ ...friendship, profile: friendProfile }); setActionSheetVisible(true); }}>
                    <MoreVertical size={20} color={colors.textSecondary} />
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