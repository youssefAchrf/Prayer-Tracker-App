// // // import React, { useState, useEffect, useMemo } from 'react';
// // // import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Platform, StatusBar, Image } from 'react-native';
// // // import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Sun, Moon, User as UserIcon, PauseCircle } from 'lucide-react-native';
// // // import DateTimePickerModal from 'react-native-modal-datetime-picker';
// // // import { usePrayer } from '@/contexts/PrayerContext';
// // // import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
// // // import { PrayerCard } from '@/components/PrayerCard';
// // // import { useTheme } from '@/contexts/ThemeContext';

// // // const getUTCDateString = (date: Date): string => {
// // //   return date.toISOString().split('T')[0];
// // // };

// // // const getLocalYYYYMMDD = (date: Date): string => {
// // //   const year = date.getFullYear();
// // //   const month = String(date.getMonth() + 1).padStart(2, '0');
// // //   const day = String(date.getDate()).padStart(2, '0');
// // //   return `${year}-${month}-${day}`;
// // // };

// // // export default function PrayerScreen() {
// // //   const { theme, colors } = useTheme();
// // //   const { displayedPrayers, updatePrayerStatus, loadPrayersForDate, loading: prayersLoading } = usePrayer();
// // //   const { profile, loading: userLoading, appSettings, currentExemption } = useSupabaseUser();
  
// // //   const [viewingDate, setViewingDate] = useState(new Date());
// // //   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

// // //   const isLockingEnabled = appSettings.get('restrict_late_prayer_logging') ?? false;

// // //   const isViewingDateExempt = useMemo(() => {
// // //     if (!currentExemption) return false;
// // //     const checkDateString = getUTCDateString(viewingDate);
// // //     const { start_date, end_date } = currentExemption;
// // //     return checkDateString >= start_date && (end_date === null || checkDateString <= end_date);
// // //   }, [viewingDate, currentExemption]);


// // //   useEffect(() => {
// // //     loadPrayersForDate(viewingDate);
// // //   }, [viewingDate]);

// // //   const goToPreviousDay = () => setViewingDate(d => new Date(d.setDate(d.getDate() - 1)));
// // //   const goToNextDay = () => setViewingDate(d => new Date(d.setDate(d.getDate() + 1)));

// // //   const showDatePicker = () => setDatePickerVisibility(true);
// // //   const hideDatePicker = () => setDatePickerVisibility(false);
// // //   const handleConfirmDate = (date: Date) => {
// // //     setViewingDate(date);
// // //     hideDatePicker();
// // //   };

// // //   const isToday = getLocalYYYYMMDD(viewingDate) === getLocalYYYYMMDD(new Date());
// // //   const formattedDate = viewingDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
// // //   const isLoading = prayersLoading || userLoading;

// // //   const getGreeting = () => {
// // //     const hour = new Date().getHours();
// // //     if (hour < 12) return { text: "Good Morning", icon: <Sun size={24} color="#f59e0b" /> };
// // //     if (hour < 18) return { text: "Good Afternoon", icon: <Sun size={24} color="#f59e0b" /> };
// // //     return { text: "Good Evening", icon: <Moon size={24} color={colors.textSecondary} /> };
// // //   };
// // //   const greeting = getGreeting();

// // //   const styles = useMemo(() => StyleSheet.create({
// // //     container: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
// // //     header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, backgroundColor: colors.background, borderBottomColor: colors.border },
// // //     headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
// // //     greetingContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
// // //     greetingText: { fontSize: 22, fontFamily: 'Inter-Regular', color: colors.text },
// // //     avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
// // //     avatarImage: { width: '100%', height: '100%' },
// // //     userName: { fontSize: 22, fontFamily: 'Inter-Bold', color: colors.text },
// // //     dateSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingVertical: 12, paddingHorizontal: 20, backgroundColor: colors.background, borderBottomColor: colors.border, marginBottom: 8 },
// // //     arrowButton: { padding: 8 },
// // //     dateDisplay: { flexDirection: 'row', alignItems: 'center', gap: 8 },
// // //     dateText: { color: colors.text, fontSize: 16, fontFamily: 'Inter-SemiBold' },
// // //     scrollContent: { paddingHorizontal: 16, paddingBottom: 16 },
// // //     exemptionBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: theme === 'dark' ? '#4a2c0d' : '#fffbeb', paddingVertical: 10, paddingHorizontal: 16, marginHorizontal: 16, marginBottom: 8, borderRadius: 12, borderWidth: 1, borderColor: '#b45309' },
// // //     exemptionBannerText: { fontFamily: 'Inter-Medium', color: '#fcd34d', fontSize: 14 },
// // //   }), [colors, theme]);

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <View style={styles.header}>
// // //         <View style={styles.headerTop}>
// // //           <View style={styles.greetingContainer}>
// // //             {greeting.icon}
// // //             <Text style={styles.greetingText}>{greeting.text},</Text>
// // //           </View>
// // //           <View style={styles.avatar}>
// // //             {profile?.avatar_url ? (
// // //               <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
// // //             ) : (
// // //               <UserIcon size={24} color={colors.textSecondary} />
// // //             )}
// // //           </View>
// // //         </View>
// // //         <Text style={styles.userName}>{profile?.name || 'User'}</Text>
// // //       </View>

// // //       <View style={styles.dateSelector}>
// // //         <TouchableOpacity onPress={goToPreviousDay} style={styles.arrowButton}><ArrowLeft size={20} color={colors.text} /></TouchableOpacity>
// // //         <TouchableOpacity onPress={showDatePicker} style={styles.dateDisplay}>
// // //           <CalendarIcon size={20} color={colors.primary} />
// // //           <Text style={styles.dateText}>{formattedDate}</Text>
// // //         </TouchableOpacity>
// // //         <TouchableOpacity onPress={goToNextDay} disabled={isToday} style={[styles.arrowButton, isToday && { opacity: 0.3 }]}><ArrowRight size={20} color={colors.text} /></TouchableOpacity>
// // //       </View>

// // //       <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirmDate} onCancel={hideDatePicker} maximumDate={new Date()} isDarkModeEnabled={theme === 'dark'} />

// // //       {isLoading ? (
// // //         <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} />
// // //       ) : (
// // //         <>
// // //           {isViewingDateExempt && (
// // //             <View style={styles.exemptionBanner}>
// // //               <PauseCircle size={18} color="#fcd34d" />
// // //               <Text style={styles.exemptionBannerText}>Streak is paused for this day.</Text>
// // //             </View>
// // //           )}
// // //           <ScrollView contentContainerStyle={styles.scrollContent}>
// // //             {displayedPrayers.map((prayer, index) => (
// // //               <PrayerCard
// // //                 key={index}
// // //                 prayer={prayer}
// // //                 onStatusChange={(status) => updatePrayerStatus(prayer.name, status, viewingDate)}
// // //                 viewingDate={viewingDate}
// // //                 isLockingEnabled={isLockingEnabled}
// // //                 isExempted={isViewingDateExempt}
// // //               />
// // //             ))}
// // //           </ScrollView>
// // //         </>
// // //       )}
// // //     </SafeAreaView>
// // //   );
// // // }


// // import React, { useState, useEffect, useMemo, useCallback } from 'react';
// // import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Platform, StatusBar, Image, LayoutAnimation, UIManager } from 'react-native';
// // import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Sun, Moon, User as UserIcon, PauseCircle, X } from 'lucide-react-native';
// // import DateTimePickerModal from 'react-native-modal-datetime-picker';
// // import { usePrayer } from '@/contexts/PrayerContext';
// // import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
// // import { PrayerCard } from '@/components/PrayerCard';
// // import { useTheme } from '@/contexts/ThemeContext';

// // // This is required to enable LayoutAnimation on Android
// // if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
// //   UIManager.setLayoutAnimationEnabledExperimental(true);
// // }

// // const getUTCDateString = (date: Date): string => {
// //   return date.toISOString().split('T')[0];
// // };

// // const getLocalYYYYMMDD = (date: Date): string => {
// //   const year = date.getFullYear();
// //   const month = String(date.getMonth() + 1).padStart(2, '0');
// //   const day = String(date.getDate()).padStart(2, '0');
// //   return `${year}-${month}-${day}`;
// // };

// // // --- START OF NEW CODE 1: Hadith Card Component ---
// // const HadithCard = ({ onClose, colors }) => {
// //   const styles = useMemo(() => StyleSheet.create({
// //     hadithCard: {
// //       backgroundColor: colors.card,
// //       borderRadius: 16,
// //       padding: 20,
// //       paddingTop: 32,
// //       marginVertical: 8,
// //       borderWidth: 1,
// //       borderColor: colors.border,
// //       position: 'relative',
// //     },
// //     hadithText: {
// //       fontFamily: 'Inter-Regular',
// //       fontSize: 16,
// //       color: colors.textSecondary,
// //       lineHeight: 26,
// //       textAlign: 'right', // For proper Arabic alignment
// //     },
// //     closeButton: {
// //       position: 'absolute',
// //       top: 8,
// //       right: 8,
// //       padding: 6,
// //       borderRadius: 16,
// //       backgroundColor: colors.background,
// //     },
// //   }), [colors]);

// //   return (
// //     <View style={styles.hadithCard}>
// //       <TouchableOpacity style={styles.closeButton} onPress={onClose}>
// //         <X size={16} color={colors.textSecondary} />
// //       </TouchableOpacity>
// //       <Text style={styles.hadithText}>
// //         عن أبي هريرة رضي الله عنه، أن النبي صلى الله عليه وسلم قال: "من تطهر في بيته ثم مشى إلى بيت من بيوت الله ليقضي فريضة من فرائض الله، كانت خطواته إحداهما تحط خطيئة، والأخرى ترفع درجة."
// //       </Text>
// //     </View>
// //   );
// // };
// // // --- END OF NEW CODE 1 ---

// // export default function PrayerScreen() {
// //   const { theme, colors } = useTheme();
// //   const { displayedPrayers, updatePrayerStatus, loadPrayersForDate, loading: prayersLoading } = usePrayer();
// //   const { profile, loading: userLoading, appSettings, currentExemption } = useSupabaseUser();
  
// //   const [viewingDate, setViewingDate] = useState(new Date());
// //   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
// //   // --- START OF NEW CODE 2: State and handler for the Hadith card ---
// //   const [isHadithVisible, setIsHadithVisible] = useState(true);

// //   const handleDismissHadith = () => {
// //     // Configure a smooth animation for the next layout change (the card's removal)
// //     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// //     setIsHadithVisible(false);
// //   };
// //   // --- END OF NEW CODE 2 ---

// //   const isLockingEnabled = appSettings.get('restrict_late_prayer_logging') ?? false;

// //   const isViewingDateExempt = useMemo(() => {
// //     if (!currentExemption) return false;
// //     const checkDateString = getUTCDateString(viewingDate);
// //     const { start_date, end_date } = currentExemption;
// //     return checkDateString >= start_date && (end_date === null || checkDateString <= end_date);
// //   }, [viewingDate, currentExemption]);


// //   useEffect(() => {
// //     loadPrayersForDate(viewingDate);
// //   }, [viewingDate]);

// //   const goToPreviousDay = () => setViewingDate(d => new Date(d.setDate(d.getDate() - 1)));
// //   const goToNextDay = () => setViewingDate(d => new Date(d.setDate(d.getDate() + 1)));

// //   const showDatePicker = () => setDatePickerVisibility(true);
// //   const hideDatePicker = () => setDatePickerVisibility(false);
// //   const handleConfirmDate = (date: Date) => {
// //     setViewingDate(date);
// //     hideDatePicker();
// //   };

// //   const isToday = getLocalYYYYMMDD(viewingDate) === getLocalYYYYMMDD(new Date());
// //   const formattedDate = viewingDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
// //   const isLoading = prayersLoading || userLoading;

// //   const getGreeting = () => {
// //     const hour = new Date().getHours();
// //     if (hour < 12) return { text: "Good Morning", icon: <Sun size={24} color="#f59e0b" /> };
// //     if (hour < 18) return { text: "Good Afternoon", icon: <Sun size={24} color="#f59e0b" /> };
// //     return { text: "Good Evening", icon: <Moon size={24} color={colors.textSecondary} /> };
// //   };
// //   const greeting = getGreeting();

// //   const styles = useMemo(() => StyleSheet.create({
// //     container: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
// //     header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, backgroundColor: colors.background, borderBottomColor: colors.border },
// //     headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
// //     greetingContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
// //     greetingText: { fontSize: 22, fontFamily: 'Inter-Regular', color: colors.text },
// //     avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
// //     avatarImage: { width: '100%', height: '100%' },
// //     userName: { fontSize: 22, fontFamily: 'Inter-Bold', color: colors.text },
// //     dateSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingVertical: 12, paddingHorizontal: 20, backgroundColor: colors.background, borderBottomColor: colors.border, marginBottom: 8 },
// //     arrowButton: { padding: 8 },
// //     dateDisplay: { flexDirection: 'row', alignItems: 'center', gap: 8 },
// //     dateText: { color: colors.text, fontSize: 16, fontFamily: 'Inter-SemiBold' },
// //     scrollContent: { paddingHorizontal: 16, paddingBottom: 16 },
// //     exemptionBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: theme === 'dark' ? '#4a2c0d' : '#fffbeb', paddingVertical: 10, paddingHorizontal: 16, marginHorizontal: 16, marginBottom: 8, borderRadius: 12, borderWidth: 1, borderColor: '#b45309' },
// //     exemptionBannerText: { fontFamily: 'Inter-Medium', color: '#fcd34d', fontSize: 14 },
// //   }), [colors, theme]);

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <View style={styles.header}>
// //         <View style={styles.headerTop}>
// //           <View style={styles.greetingContainer}>
// //             {greeting.icon}
// //             <Text style={styles.greetingText}>{greeting.text},</Text>
// //           </View>
// //           <View style={styles.avatar}>
// //             {profile?.avatar_url ? (
// //               <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
// //             ) : (
// //               <UserIcon size={24} color={colors.textSecondary} />
// //             )}
// //           </View>
// //         </View>
// //         <Text style={styles.userName}>{profile?.name || 'User'}</Text>
// //       </View>

// //       <View style={styles.dateSelector}>
// //         <TouchableOpacity onPress={goToPreviousDay} style={styles.arrowButton}><ArrowLeft size={20} color={colors.text} /></TouchableOpacity>
// //         <TouchableOpacity onPress={showDatePicker} style={styles.dateDisplay}>
// //           <CalendarIcon size={20} color={colors.primary} />
// //           <Text style={styles.dateText}>{formattedDate}</Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity onPress={goToNextDay} disabled={isToday} style={[styles.arrowButton, isToday && { opacity: 0.3 }]}><ArrowRight size={20} color={colors.text} /></TouchableOpacity>
// //       </View>

// //       <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirmDate} onCancel={hideDatePicker} maximumDate={new Date()} isDarkModeEnabled={theme === 'dark'} />

// //       {isLoading ? (
// //         <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} />
// //       ) : (
// //         <>
// //           {isViewingDateExempt && (
// //             <View style={styles.exemptionBanner}>
// //               <PauseCircle size={18} color="#fcd34d" />
// //               <Text style={styles.exemptionBannerText}>Streak is paused for this day.</Text>
// //             </View>
// //           )}
// //           <ScrollView contentContainerStyle={styles.scrollContent}>
// //             {/* --- START OF NEW CODE 3: Conditionally render Hadith card --- */}
// //             {isToday && isHadithVisible && (
// //               <HadithCard onClose={handleDismissHadith} colors={colors} />
// //             )}
// //             {/* --- END OF NEW CODE 3 --- */}
            
// //             {displayedPrayers.map((prayer, index) => (
// //               <PrayerCard
// //                 key={index}
// //                 prayer={prayer}
// //                 onStatusChange={(status) => updatePrayerStatus(prayer.name, status, viewingDate)}
// //                 viewingDate={viewingDate}
// //                 isLockingEnabled={isLockingEnabled}
// //                 isExempted={isViewingDateExempt}
// //               />
// //             ))}
// //           </ScrollView>
// //         </>
// //       )}
// //     </SafeAreaView>
// //   );
// // }


// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Platform, StatusBar, Image, LayoutAnimation, UIManager } from 'react-native';
// import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Sun, Moon, User as UserIcon, PauseCircle, X } from 'lucide-react-native';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import { usePrayer } from '@/contexts/PrayerContext';
// import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
// import { PrayerCard } from '@/components/PrayerCard';
// import { useTheme } from '@/contexts/ThemeContext';

// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// const getUTCDateString = (date: Date): string => {
//   return date.toISOString().split('T')[0];
// };

// const getLocalYYYYMMDD = (date: Date): string => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

// const PRAYER_AHADITH = [
//   {
//     text: 'عن أبي هريرة رضي الله عنه، أن النبي صلى الله عليه وسلم قال: "من تطهر في بيته ثم مشى إلى بيت من بيوت الله ليقضي فريضة من فرائض الله، كانت خطواته إحداهما تحط خطيئة، والأخرى ترفع درجة."',
//     source: 'صحيح مسلم'
//   },
//   {
//     text: 'عن عبد الله بن مسعود رضي الله عنه قال: سألت النبي صلى الله عليه وسلم: أي العمل أحب إلى الله؟ قال: "الصلاة على وقتها".',
//     source: 'صحيح البخاري'
//   },
//   {
//     text: 'قال رسول الله صلى الله عليه وسلم: "أول ما يحاسب عليه العبد يوم القيامة الصلاة، فإن صلحت صلح سائر عمله، وإن فسدت فسد سائر عمله."',
//     source: 'صحيح الجامع'
//   },
//   {
//     text: 'قال رسول الله صلى الله عليه وسلم: "بين الرجل وبين الشرك والكفر ترك الصلاة."',
//     source: 'صحيح مسلم'
//   },
//   {
//     text: 'عن أبي هريرة رضي الله عنه أن رسول الله صلى الله عليه وسلم قال: "ألا أدلكم على ما يمحو الله به الخطايا ويرفع به الدرجات؟" قالوا: بلى يا رسول الله، قال: "إسباغ الوضوء على المكاره، وكثرة الخطا إلى المساجد، وانتظار الصلاة بعد الصلاة، فذلكم الرباط."',
//     source: 'صحيح مسلم'
//   },
// ];

// const HadithCard = ({ hadith, onClose, colors }) => {
//   const styles = useMemo(() => StyleSheet.create({
//     hadithCard: {
//       backgroundColor: colors.card,
//       borderRadius: 16,
//       padding: 20,
//       paddingBottom: 16,
//       paddingTop: 32,
//       marginVertical: 8,
//       borderWidth: 1,
//       borderColor: colors.border,
//       position: 'relative',
//     },
//     hadithText: {
//       fontFamily: 'Inter-Regular',
//       fontSize: 16,
//       color: colors.textSecondary,
//       lineHeight: 26,
//       textAlign: 'right',
//       marginBottom: 8,
//     },
//     hadithSource: {
//       fontFamily: 'Inter-SemiBold',
//       fontSize: 12,
//       color: colors.primary,
//       textAlign: 'right',
//     },
//     closeButton: {
//       position: 'absolute',
//       top: 8,
//       right: 8,
//       padding: 6,
//       borderRadius: 16,
//       backgroundColor: colors.background,
//     },
//   }), [colors]);

//   if (!hadith) return null;

//   return (
//     <View style={styles.hadithCard}>
//       <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//         <X size={16} color={colors.textSecondary} />
//       </TouchableOpacity>
//       <Text style={styles.hadithText}>{hadith.text}</Text>
//       <Text style={styles.hadithSource}>{hadith.source}</Text>
//     </View>
//   );
// };

// export default function PrayerScreen() {
//   const { theme, colors } = useTheme();
//   const { displayedPrayers, updatePrayerStatus, loadPrayersForDate, loading: prayersLoading } = usePrayer();
//   const { profile, loading: userLoading, appSettings, currentExemption } = useSupabaseUser();
  
//   const [viewingDate, setViewingDate] = useState(new Date());
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//   const [isHadithVisible, setIsHadithVisible] = useState(true);
//   const [selectedHadith, setSelectedHadith] = useState(null);

//   useEffect(() => {
//     const randomIndex = Math.floor(Math.random() * PRAYER_AHADITH.length);
//     setSelectedHadith(PRAYER_AHADITH[randomIndex]);
//   }, []);

//   const handleDismissHadith = () => {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     setIsHadithVisible(false);
//   };

//   const isLockingEnabled = appSettings.get('restrict_late_prayer_logging') ?? false;

//   const isViewingDateExempt = useMemo(() => {
//     if (!currentExemption) return false;
//     const checkDateString = getUTCDateString(viewingDate);
//     const { start_date, end_date } = currentExemption;
//     return checkDateString >= start_date && (end_date === null || checkDateString <= end_date);
//   }, [viewingDate, currentExemption]);

//   // --- START OF FIX: Corrected the dependency array to prevent the loop ---
//   useEffect(() => {
//     loadPrayersForDate(viewingDate);
//   }, [viewingDate]);
//   // --- END OF FIX ---

//   const goToPreviousDay = () => setViewingDate(d => new Date(d.setDate(d.getDate() - 1)));
//   const goToNextDay = () => setViewingDate(d => new Date(d.setDate(d.getDate() + 1)));

//   const showDatePicker = () => setDatePickerVisibility(true);
//   const hideDatePicker = () => setDatePickerVisibility(false);
//   const handleConfirmDate = (date: Date) => {
//     setViewingDate(date);
//     hideDatePicker();
//   };

//   const isToday = getLocalYYYYMMDD(viewingDate) === getLocalYYYYMMDD(new Date());
//   const formattedDate = viewingDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
//   const isLoading = prayersLoading || userLoading;

//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return { text: "Good Morning", icon: <Sun size={24} color="#f59e0b" /> };
//     if (hour < 18) return { text: "Good Afternoon", icon: <Sun size={24} color="#f59e0b" /> };
//     return { text: "Good Evening", icon: <Moon size={24} color={colors.textSecondary} /> };
//   };
//   const greeting = getGreeting();

//   const styles = useMemo(() => StyleSheet.create({
//     container: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
//     header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, backgroundColor: colors.background, borderBottomColor: colors.border },
//     headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
//     greetingContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//     greetingText: { fontSize: 22, fontFamily: 'Inter-Regular', color: colors.text },
//     avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
//     avatarImage: { width: '100%', height: '100%' },
//     userName: { fontSize: 22, fontFamily: 'Inter-Bold', color: colors.text },
//     dateSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingVertical: 12, paddingHorizontal: 20, backgroundColor: colors.background, borderBottomColor: colors.border, marginBottom: 8 },
//     arrowButton: { padding: 8 },
//     dateDisplay: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//     dateText: { color: colors.text, fontSize: 16, fontFamily: 'Inter-SemiBold' },
//     scrollContent: { paddingHorizontal: 16, paddingBottom: 16 },
//     exemptionBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: theme === 'dark' ? '#4a2c0d' : '#fffbeb', paddingVertical: 10, paddingHorizontal: 16, marginHorizontal: 16, marginBottom: 8, borderRadius: 12, borderWidth: 1, borderColor: '#b45309' },
//     exemptionBannerText: { fontFamily: 'Inter-Medium', color: '#fcd34d', fontSize: 14 },
//   }), [colors, theme]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.headerTop}>
//           <View style={styles.greetingContainer}>
//             {greeting.icon}
//             <Text style={styles.greetingText}>{greeting.text},</Text>
//           </View>
//           <View style={styles.avatar}>
//             {profile?.avatar_url ? (
//               <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
//             ) : (
//               <UserIcon size={24} color={colors.textSecondary} />
//             )}
//           </View>
//         </View>
//         <Text style={styles.userName}>{profile?.name || 'User'}</Text>
//       </View>

//       <View style={styles.dateSelector}>
//         <TouchableOpacity onPress={goToPreviousDay} style={styles.arrowButton}><ArrowLeft size={20} color={colors.text} /></TouchableOpacity>
//         <TouchableOpacity onPress={showDatePicker} style={styles.dateDisplay}>
//           <CalendarIcon size={20} color={colors.primary} />
//           <Text style={styles.dateText}>{formattedDate}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={goToNextDay} disabled={isToday} style={[styles.arrowButton, isToday && { opacity: 0.3 }]}><ArrowRight size={20} color={colors.text} /></TouchableOpacity>
//       </View>

//       <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirmDate} onCancel={hideDatePicker} maximumDate={new Date()} isDarkModeEnabled={theme === 'dark'} />

//       {isLoading ? (
//         <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} />
//       ) : (
//         <>
//           {isViewingDateExempt && (
//             <View style={styles.exemptionBanner}>
//               <PauseCircle size={18} color="#fcd34d" />
//               <Text style={styles.exemptionBannerText}>Streak is paused for this day.</Text>
//             </View>
//           )}
//           <ScrollView contentContainerStyle={styles.scrollContent}>
//             {isToday && isHadithVisible && (
//               <HadithCard
//                 hadith={selectedHadith}
//                 onClose={handleDismissHadith}
//                 colors={colors}
//               />
//             )}
            
//             {(displayedPrayers || []).map((prayer, index) => (
//               <PrayerCard
//                 key={index}
//                 prayer={prayer}
//                 onStatusChange={(status) => updatePrayerStatus(prayer.name, status, viewingDate)}
//                 viewingDate={viewingDate}
//                 isLockingEnabled={isLockingEnabled}
//                 isExempted={isViewingDateExempt}
//               />
//             ))}
//           </ScrollView>
//         </>
//       )}
//     </SafeAreaView>
//   );
// }

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Platform, StatusBar, Image, LayoutAnimation, UIManager } from 'react-native';
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Sun, Moon, User as UserIcon, PauseCircle, X } from 'lucide-react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { usePrayer } from '@/contexts/PrayerContext';
import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
import { PrayerCard } from '@/components/PrayerCard';
import { useTheme } from '@/contexts/ThemeContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const getUTCDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const getLocalYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// --- START OF CHANGE 1: Add the new Hadith and an 'isSpecial' property ---
const PRAYER_AHADITH = [
  {
    text: 'عن أبي هريرة رضي الله عنه، أن النبي صلى الله عليه وسلم قال: "من تطهر في بيته ثم مشى إلى بيت من بيوت الله ليقضي فريضة من فرائض الله، كانت خطواته إحداهما تحط خطيئة، والأخرى ترفع درجة."',
    source: 'صحيح مسلم',
    isSpecial: false,
  },
  {
    text: 'قال رسول الله صلى الله عليه وسلم: "من صلى الصبح فهو في ذمة الله، فلا يطلبنكم الله من ذمته بشيء, فيدركه, فيكبه في نار جهنم."',
    source: 'صحيح مسلم',
    isSpecial: true, // Mark this Hadith as special
  },
  {
    text: 'عن عبد الله بن مسعود رضي الله عنه قال: سألت النبي صلى الله عليه وسلم: أي العمل أحب إلى الله؟ قال: "الصلاة على وقتها".',
    source: 'صحيح البخاري',
    isSpecial: false,
  },
  {
    text: 'قال رسول الله صلى الله عليه وسلم: "أول ما يحاسب عليه العبد يوم القيامة الصلاة، فإن صلحت صلح سائر عمله، وإن فسدت فسد سائر عمله."',
    source: 'صحيح الجامع',
    isSpecial: false,
  },
  {
    text: 'قال رسول الله صلى الله عليه وسلم: "بين الرجل وبين الشرك والكفر ترك الصلاة."',
    source: 'صحيح مسلم',
    isSpecial: false,
  },
];
// --- END OF CHANGE 1 ---

// --- START OF CHANGE 2: Update HadithCard to handle special styling ---
const HadithCard = ({ hadith, onClose, colors }) => {
  const styles = useMemo(() => StyleSheet.create({
    hadithCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      paddingBottom: 16,
      paddingTop: 32,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
      position: 'relative',
    },
    // New style for the special Hadith
    specialHadithCard: {
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.05)',
    },
    hadithText: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 26,
      textAlign: 'right',
      marginBottom: 8,
    },
    hadithSource: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 12,
      color: colors.primary,
      textAlign: 'right',
    },
    closeButton: {
      position: 'absolute',
      top: 8,
      right: 8,
      padding: 6,
      borderRadius: 16,
      backgroundColor: colors.background,
    },
  }), [colors]);

  if (!hadith) return null;

  return (
    // Conditionally apply the special style
    <View style={[styles.hadithCard, hadith.isSpecial && styles.specialHadithCard]}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <X size={16} color={colors.textSecondary} />
      </TouchableOpacity>
      <Text style={styles.hadithText}>{hadith.text}</Text>
      <Text style={styles.hadithSource}>{hadith.source}</Text>
    </View>
  );
};
// --- END OF CHANGE 2 ---

export default function PrayerScreen() {
  const { theme, colors } = useTheme();
  const { displayedPrayers, updatePrayerStatus, loadPrayersForDate, loading: prayersLoading } = usePrayer();
  const { profile, loading: userLoading, appSettings, currentExemption } = useSupabaseUser();
  
  const [viewingDate, setViewingDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isHadithVisible, setIsHadithVisible] = useState(true);
  const [selectedHadith, setSelectedHadith] = useState(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * PRAYER_AHADITH.length);
    setSelectedHadith(PRAYER_AHADITH[randomIndex]);
  }, []);

  const handleDismissHadith = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsHadithVisible(false);
  };

  const isLockingEnabled = appSettings.get('restrict_late_prayer_logging') ?? false;

  const isViewingDateExempt = useMemo(() => {
    if (!currentExemption) return false;
    const checkDateString = getUTCDateString(viewingDate);
    const { start_date, end_date } = currentExemption;
    return checkDateString >= start_date && (end_date === null || checkDateString <= end_date);
  }, [viewingDate, currentExemption]);


  useEffect(() => {
    loadPrayersForDate(viewingDate);
  }, [viewingDate]);

  const goToPreviousDay = () => setViewingDate(d => new Date(d.setDate(d.getDate() - 1)));
  const goToNextDay = () => setViewingDate(d => new Date(d.setDate(d.getDate() + 1)));

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirmDate = (date: Date) => {
    setViewingDate(date);
    hideDatePicker();
  };

  const isToday = getLocalYYYYMMDD(viewingDate) === getLocalYYYYMMDD(new Date());
  const formattedDate = viewingDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const isLoading = prayersLoading || userLoading;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", icon: <Sun size={24} color="#f59e0b" /> };
    if (hour < 18) return { text: "Good Afternoon", icon: <Sun size={24} color="#f59e0b" /> };
    return { text: "Good Evening", icon: <Moon size={24} color={colors.textSecondary} /> };
  };
  const greeting = getGreeting();

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, backgroundColor: colors.background, borderBottomColor: colors.border },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    greetingContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    greetingText: { fontSize: 22, fontFamily: 'Inter-Regular', color: colors.text },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    avatarImage: { width: '100%', height: '100%' },
    userName: { fontSize: 22, fontFamily: 'Inter-Bold', color: colors.text },
    dateSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingVertical: 12, paddingHorizontal: 20, backgroundColor: colors.background, borderBottomColor: colors.border, marginBottom: 8 },
    arrowButton: { padding: 8 },
    dateDisplay: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    dateText: { color: colors.text, fontSize: 16, fontFamily: 'Inter-SemiBold' },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 16 },
    exemptionBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: theme === 'dark' ? '#4a2c0d' : '#fffbeb', paddingVertical: 10, paddingHorizontal: 16, marginHorizontal: 16, marginBottom: 8, borderRadius: 12, borderWidth: 1, borderColor: '#b45309' },
    exemptionBannerText: { fontFamily: 'Inter-Medium', color: '#fcd34d', fontSize: 14 },
  }), [colors, theme]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.greetingContainer}>
            {greeting.icon}
            <Text style={styles.greetingText}>{greeting.text},</Text>
          </View>
          <View style={styles.avatar}>
            {profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
            ) : (
              <UserIcon size={24} color={colors.textSecondary} />
            )}
          </View>
        </View>
        <Text style={styles.userName}>{profile?.name || 'User'}</Text>
      </View>

      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={goToPreviousDay} style={styles.arrowButton}><ArrowLeft size={20} color={colors.text} /></TouchableOpacity>
        <TouchableOpacity onPress={showDatePicker} style={styles.dateDisplay}>
          <CalendarIcon size={20} color={colors.primary} />
          <Text style={styles.dateText}>{formattedDate}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNextDay} disabled={isToday} style={[styles.arrowButton, isToday && { opacity: 0.3 }]}><ArrowRight size={20} color={colors.text} /></TouchableOpacity>
      </View>

      <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirmDate} onCancel={hideDatePicker} maximumDate={new Date()} isDarkModeEnabled={theme === 'dark'} />

      {isLoading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} />
      ) : (
        <>
          {isViewingDateExempt && (
            <View style={styles.exemptionBanner}>
              <PauseCircle size={18} color="#fcd34d" />
              <Text style={styles.exemptionBannerText}>Streak is paused for this day.</Text>
            </View>
          )}
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {isToday && isHadithVisible && selectedHadith && (
              <HadithCard
                hadith={selectedHadith}
                onClose={handleDismissHadith}
                colors={colors}
              />
            )}
            
            {(displayedPrayers || []).map((prayer, index) => (
              <PrayerCard
                key={index}
                prayer={prayer}
                onStatusChange={(status) => updatePrayerStatus(prayer.name, status, viewingDate)}
                viewingDate={viewingDate}
                isLockingEnabled={isLockingEnabled}
                isExempted={isViewingDateExempt}
              />
            ))}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}