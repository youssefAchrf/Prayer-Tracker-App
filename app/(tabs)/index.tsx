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

// // --- START OF CHANGE 1: Add the new Hadith and an 'isSpecial' property ---
// const PRAYER_AHADITH = [
//   {
//     text: 'عن أبي هريرة رضي الله عنه، أن النبي صلى الله عليه وسلم قال: "من تطهر في بيته ثم مشى إلى بيت من بيوت الله ليقضي فريضة من فرائض الله، كانت خطواته إحداهما تحط خطيئة، والأخرى ترفع درجة."',
//     source: 'صحيح مسلم',
//     isSpecial: false,
//   },
//   {
//     text: 'قال رسول الله صلى الله عليه وسلم: "من صلى الصبح فهو في ذمة الله، فلا يطلبنكم الله من ذمته بشيء, فيدركه, فيكبه في نار جهنم."',
//     source: 'صحيح مسلم',
//     isSpecial: true, // Mark this Hadith as special
//   },
//   {
//     text: 'عن عبد الله بن مسعود رضي الله عنه قال: سألت النبي صلى الله عليه وسلم: أي العمل أحب إلى الله؟ قال: "الصلاة على وقتها".',
//     source: 'صحيح البخاري',
//     isSpecial: false,
//   },
//   {
//     text: 'قال رسول الله صلى الله عليه وسلم: "أول ما يحاسب عليه العبد يوم القيامة الصلاة، فإن صلحت صلح سائر عمله، وإن فسدت فسد سائر عمله."',
//     source: 'صحيح الجامع',
//     isSpecial: false,
//   },
//   {
//     text: 'قال رسول الله صلى الله عليه وسلم: "بين الرجل وبين الشرك والكفر ترك الصلاة."',
//     source: 'صحيح مسلم',
//     isSpecial: false,
//   },
// ];
// // --- END OF CHANGE 1 ---

// // --- START OF CHANGE 2: Update HadithCard to handle special styling ---
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
//     // New style for the special Hadith
//     specialHadithCard: {
//       borderColor: '#f59e0b',
//       backgroundColor: 'rgba(245, 158, 11, 0.05)',
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
//     // Conditionally apply the special style
//     <View style={[styles.hadithCard, hadith.isSpecial && styles.specialHadithCard]}>
//       <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//         <X size={16} color={colors.textSecondary} />
//       </TouchableOpacity>
//       <Text style={styles.hadithText}>{hadith.text}</Text>
//       <Text style={styles.hadithSource}>{hadith.source}</Text>
//     </View>
//   );
// };
// // --- END OF CHANGE 2 ---

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


//   useEffect(() => {
//     loadPrayersForDate(viewingDate);
//   }, [viewingDate]);

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
//             {isToday && isHadithVisible && selectedHadith && (
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

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, Platform, StatusBar, Image, LayoutAnimation, UIManager } from 'react-native';
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, User as UserIcon, Flame, X, Clock, BookOpen, History } from 'lucide-react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { usePrayer } from '@/contexts/PrayerContext';
import { useSupabaseUser } from '@/contexts/SupabaseUserContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Prayer, PrayerStatus } from '@/types/prayer';
import { PrayerGridCard } from '@/components/PrayerGridCard';
import { PrayerProgressDial } from '@/components/PrayerProgressDial';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const getLocalYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const PRAYER_AHADITH = [
  {
    text: 'عن أبي هريرة رضي الله عنه، أن النبي صلى الله عليه وسلم قال: "من تطهر في بيته ثم مشى إلى بيت من بيوت الله ليقضي فريضة من فرائض الله، كانت خطواته إحداهما تحط خطيئة، والأخرى ترفع درجة."',
    source: 'صحيح مسلم',
    isSpecial: false,
  },
  {
    text: 'قال رسول الله صلى الله عليه وسلم: "من صلى الصبح فهو في ذمة الله، فلا يطلبنكم الله من ذمته بشيء, فيدركه, فيكبه في نار جهنم."',
    source: 'صحيح مسلم',
    isSpecial: true,
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
  {
    text: 'قال رسول الله صلى الله عليه وسلم: "بَشِّرِ الْمَشَّائِينَ فِي الظُّلَمِ إِلَى الْمَسَاجِدِ بِالنُّورِ التَّامِّ يَوْمَ الْقِيَامَةِ."',
    source: 'سنن أبي داود',
    isSpecial: false,
  },
  {
    text: 'قال رسول الله صلى الله عليه وسلم: "صَلاةُ الجَماعَةِ تَفْضُلُ صَلاةَ الفَذِّ بسَبْعٍ وعِشْرِينَ دَرَجَةً."',
    source: 'صحيح البخاري ومسلم',
    isSpecial: false,
  },
  {
    text: 'قال رسول الله صلى الله عليه وسلم: "أَرَأَيْتُمْ لَوْ أَنَّ نَهَرًا بِبَابِ أَحَدِكُمْ يَغْتَسِلُ فِيهِ كُلَّ يَوْمٍ خَمْسًا... فَذَلِكَ مِثْلُ الصَّلَوَاتِ الْخَمْسِ، يَمْحُو اللَّهُ بِهَا الْخَطَايَا."',
    source: 'صحيح البخاري ومسلم',
    isSpecial: false,
  },
  {
    text: 'قال رسول الله صلى الله عليه وسلم: "مَا مِنْ عَبْدٍ مُسْلِمٍ يُصَلِّي لِلَّهِ كُلَّ يَوْمٍ ثِنْتَيْ عَشْرَةَ رَكْعَةً تَطَوُّعًا غَيْرَ فَرِيضَةٍ إِلاَّ بَنَى اللَّهُ لَهُ بَيْتًا فِي الْجَنَّةِ."',
    source: 'صحيح مسلم',
    isSpecial: false,
  },
];

const HadithCard = ({ hadith, onClose, colors }) => {
  const styles = useMemo(() => getStyles(colors), [colors]);
  if (!hadith) return null;
  return (
    <View style={styles.hadithCard}>
      <View style={styles.hadithIconContainer}><BookOpen size={24} color="#FFFFFF" /></View>
      <View style={styles.hadithTextContainer}><Text style={styles.hadithText}>{hadith.text}</Text><Text style={styles.hadithSource}>{hadith.source}</Text></View>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}><X size={18} color="rgba(255, 255, 255, 0.7)" /></TouchableOpacity>
    </View>
  );
};

export default function PrayerScreen() {
  const { theme, colors } = useTheme();
  const { displayedPrayers, updatePrayerStatus, loadPrayersForDate, loading: prayersLoading } = usePrayer();
  const { profile, loading: userLoading, personalStreak, appSettings } = useSupabaseUser();
  
  const [viewingDate, setViewingDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isHadithVisible, setIsHadithVisible] = useState(true);
  const [selectedHadith, setSelectedHadith] = useState(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: Date } | null>(null);
  const [countdown, setCountdown] = useState('');

  const isLockingEnabled = appSettings.get('restrict_late_prayer_logging') ?? false;
  
  useEffect(() => {
    loadPrayersForDate(viewingDate);
  }, [viewingDate]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * PRAYER_AHADITH.length);
    setSelectedHadith(PRAYER_AHADITH[randomIndex]);
  }, []);

  useEffect(() => {
    if (displayedPrayers.length === 0) return;
    const now = new Date();
    let upcomingPrayer = null;
    for (const prayer of displayedPrayers) {
      if (!prayer.time || prayer.time === '--:--') continue;
      const [timePart, ampm] = prayer.time.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      if (ampm === 'PM' && hours !== 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      const prayerDateTime = new Date(viewingDate);
      prayerDateTime.setHours(hours, minutes, 0, 0);
      if (prayerDateTime > now) {
        upcomingPrayer = { name: prayer.name, time: prayerDateTime };
        break;
      }
    }
    setNextPrayer(upcomingPrayer);
    const timer = setInterval(() => {
      if (upcomingPrayer) {
        const totalSeconds = Math.floor((upcomingPrayer.time.getTime() - new Date().getTime()) / 1000);
        if (totalSeconds < 0) {
          setCountdown('Time has passed');
          clearInterval(timer);
        } else {
          const h = Math.floor(totalSeconds / 3600);
          const m = Math.floor((totalSeconds % 3600) / 60);
          const s = totalSeconds % 60;
          setCountdown(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
        }
      } else {
        setCountdown('All prayers passed');
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [displayedPrayers, viewingDate]);

  const handleDismissHadith = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsHadithVisible(false);
  };
  const goToPreviousDay = () => setViewingDate(d => new Date(d.setDate(d.getDate() - 1)));
  const goToNextDay = () => setViewingDate(d => new Date(d.setDate(d.getDate() + 1)));
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirmDate = (date: Date) => { setViewingDate(date); hideDatePicker(); };
  const goToToday = () => {
    setViewingDate(new Date());
  };

  const isToday = getLocalYYYYMMDD(viewingDate) === getLocalYYYYMMDD(new Date());
  const formattedDate = viewingDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const prayersCompleted = useMemo(() => displayedPrayers.filter(p => p.status !== null).length, [displayedPrayers]);
  const totalPrayers = displayedPrayers.length > 0 ? displayedPrayers.length : 5;
  const isLoading = prayersLoading || userLoading;
  const styles = useMemo(() => getStyles(colors), [colors]);
  const flatListData = useMemo(() => {
    const isOdd = displayedPrayers.length % 2 !== 0;
    return isOdd ? [...displayedPrayers, { name: 'spacer', isSpacer: true }] : displayedPrayers;
  }, [displayedPrayers]);

  const ListHeader = () => (
    <>
      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={goToPreviousDay} style={styles.arrowButton}><ArrowLeft size={20} color={colors.textSecondary} /></TouchableOpacity>
        <TouchableOpacity onPress={showDatePicker} style={styles.dateDisplay}><CalendarIcon size={20} color={colors.text} /><Text style={styles.dateText}>{formattedDate}</Text></TouchableOpacity>
        {!isToday && (
            <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
                <History size={20} color={colors.primary} />
            </TouchableOpacity>
        )}
        <TouchableOpacity onPress={goToNextDay} disabled={isToday} style={[styles.arrowButton, isToday && { opacity: 0.3 }]}><ArrowRight size={20} color={colors.textSecondary} /></TouchableOpacity>
      </View>
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { flex: 1.5, justifyContent: 'center' }]}>
          <PrayerProgressDial
            prayersCompleted={prayersCompleted}
            totalPrayers={totalPrayers}
          />
        </View>
        <View style={[styles.summaryCard, { flex: 1, justifyContent: 'center', alignItems: 'flex-start'}]}>
            <Clock size={28} color={colors.primary} />
            <View>
                <Text style={styles.summaryLabel}>{nextPrayer ? `Next: ${nextPrayer.name}` : 'Next Prayer'}</Text>
                <Text style={styles.summaryValue}>{countdown || '...'}</Text>
            </View>
        </View>
      </View>
      {isToday && isHadithVisible && selectedHadith && (
        <HadithCard hadith={selectedHadith} onClose={handleDismissHadith} colors={colors} />
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Hi, {profile?.name || 'User'}!</Text>
          <Text style={styles.subtitle}>Welcome Back</Text>
        </View>
        <TouchableOpacity style={styles.avatar}>
          {profile?.avatar_url ? (<Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />) : (<UserIcon size={24} color={colors.textSecondary} />)}
        </TouchableOpacity>
      </View>
      
      <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirmDate} onCancel={hideDatePicker} maximumDate={new Date()} isDarkModeEnabled={theme === 'dark'} />
      {isLoading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={flatListData}
          numColumns={2}
          keyExtractor={(item, index) => item.name + index}
          contentContainerStyle={styles.gridContainer}
          ListHeaderComponent={<ListHeader />}
          renderItem={({ item }) => {
            if (item.isSpacer) {
              return <View style={{ flex: 1, margin: 8 }} />;
            }
            return (
              <PrayerGridCard
                prayer={item}
                onStatusChange={(status) => updatePrayerStatus(item.name, status, viewingDate)}
                viewingDate={viewingDate}
                isLockingEnabled={isLockingEnabled}
              />
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const getStyles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 },
    title: { fontSize: 28, fontFamily: 'Inter-Bold', color: colors.text },
    subtitle: { fontSize: 16, fontFamily: 'Inter-Regular', color: colors.textSecondary },
    avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.card, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
    avatarImage: { width: '100%', height: '100%' },
    gridContainer: { paddingHorizontal: 10 },
    dateSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 },
    arrowButton: { padding: 8 },
    dateDisplay: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginHorizontal: 8 },
    dateText: { color: colors.text, fontSize: 16, fontFamily: 'Inter-SemiBold' },
    todayButton: { padding: 8 },
    summaryContainer: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingBottom: 16 },
    summaryCard: { flex: 1, gap: 12, backgroundColor: colors.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border },
    summaryLabel: { fontFamily: 'Inter-Regular', fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
    summaryValue: { fontFamily: 'Inter-Bold', fontSize: 18, color: colors.text },
    hadithCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, borderRadius: 20, padding: 20, marginHorizontal: 16, marginBottom: 16, position: 'relative' },
    hadithIconContainer: { marginRight: 16 },
    hadithTextContainer: { flex: 1 },
    hadithText: { fontFamily: 'Inter-Medium', fontSize: 14, color: '#FFFFFF', lineHeight: 20, textAlign: 'left', marginBottom: 4 },
    hadithSource: { fontFamily: 'Inter-Regular', fontSize: 12, color: 'rgba(255, 255, 255, 0.7)', textAlign: 'left' },
    closeButton: { position: 'absolute', top: 8, right: 8, padding: 4 },
});