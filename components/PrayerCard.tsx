import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, Users, User, Lock, PauseCircle } from 'lucide-react-native';
import { Prayer, PrayerStatus } from '@/types/prayer';
import { useTheme } from '@/contexts/ThemeContext';

interface PrayerCardProps {
  prayer: Prayer;
  onStatusChange: (status: PrayerStatus) => void;
  readOnly?: boolean;
  viewingDate?: Date;
  isLockingEnabled: boolean;
  isExempted: boolean;
}

export function PrayerCard({ prayer, onStatusChange, readOnly = false, viewingDate, isLockingEnabled, isExempted }: PrayerCardProps) {
  const { theme, colors } = useTheme();

  const isExpired = () => {
    if (!isLockingEnabled) return false;
    if (readOnly || !viewingDate || !prayer.time || prayer.time === '--:--') return false;
    
    const [timePart, ampm] = prayer.time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    
    const prayerDateTime = new Date(viewingDate);
    prayerDateTime.setHours(hours, minutes, 0, 0);
    const expirationTime = new Date(prayerDateTime.getTime() + 12 * 60 * 60 * 1000);
    return new Date() > expirationTime;
  };

  const prayerIsExpired = isExpired();
  
  const styles = useMemo(() => StyleSheet.create({
    card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12 },
    infoContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    name: { fontSize: 20, fontFamily: 'Inter-Bold', color: colors.text },
    arabicName: { fontSize: 14, fontFamily: 'Amiri-Regular', color: colors.textSecondary },
    time: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: colors.primary },
    actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
    button: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 12, backgroundColor: colors.buttonDisabled, gap: 6 },
    buttonText: { fontSize: 14, fontWeight: '500', color: colors.textSecondary },
    selectedJamaah: { backgroundColor: '#22c55e' },
    selectedAlone: { backgroundColor: '#3b82f6' },
    selectedLate: { backgroundColor: '#f59e0b' },
    selectedText: { color: '#ffffff' },
    statusBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6, backgroundColor: theme === 'dark' ? 'rgba(5, 150, 105, 0.2)' : '#ecfdf5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99 },
    statusBadgeText: { color: colors.primary, fontFamily: 'Inter-SemiBold', fontSize: 14 },
    statusBadgeLate: { backgroundColor: theme === 'dark' ? 'rgba(217, 119, 6, 0.2)' : '#fffbeb' },
    statusBadgeTextLate: { color: '#d97706' },
    statusNotPrayed: { fontFamily: 'Inter-Regular', color: colors.textSecondary, fontStyle: 'italic', paddingLeft: 4 },
    exemptedContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10, backgroundColor: colors.buttonDisabled, borderRadius: 12 },
    exemptedText: { fontFamily: 'Inter-Medium', color: colors.textSecondary, fontStyle: 'italic' },
    // --- New style for the disabled container ---
    disabledContainer: {
        opacity: 0.5,
    },
  }), [colors, theme]);

  const renderReadOnlyStatus = () => {
    if (!prayer.status || prayer.status === 'missed') {
      return <Text style={styles.statusNotPrayed}>Not Yet Prayed</Text>;
    }
    const statusInfo = {
      jamaah: { icon: <Users size={14} color={colors.primary} />, text: "Jamaa'ah" },
      alone: { icon: <User size={14} color={colors.primary} />, text: 'Alone' },
      late: { icon: <Clock size={14} color="#D97706" />, text: 'Late' },
    };
    const info = statusInfo[prayer.status];
    if (!info) return null;
    return (
      <View style={[styles.statusBadge, prayer.status === 'late' && styles.statusBadgeLate]}>
        {info.icon}
        <Text style={[styles.statusBadgeText, prayer.status === 'late' && styles.statusBadgeTextLate]}>
          {info.text}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.name}>{prayer.name}</Text>
          <Text style={styles.arabicName}>{prayer.arabicName}</Text>
        </View>
        <Text style={styles.time}>{prayer.time}</Text>
      </View>
      
      {(() => {
        if (isExempted) {
          return (
            <View style={styles.exemptedContainer}>
              <PauseCircle size={16} color={colors.textSecondary} />
              <Text style={styles.exemptedText}>Streak Paused</Text>
            </View>
          );
        }
        if (readOnly) {
          return renderReadOnlyStatus();
        }
        
        // --- This is the main change ---
        // The special "expired" view is removed.
        // Instead, we render the regular buttons and wrap them in a view that applies the disabled style.
        return (
          <View style={prayerIsExpired ? styles.disabledContainer : null}>
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.button, prayer.status === 'jamaah' && styles.selectedJamaah]} 
                onPress={() => onStatusChange('jamaah')}
                disabled={prayerIsExpired}
              >
                <Users size={16} color={prayer.status === 'jamaah' ? '#ffffff' : colors.textSecondary} />
                <Text style={[styles.buttonText, prayer.status === 'jamaah' && styles.selectedText]}>Jamaa'ah</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, prayer.status === 'alone' && styles.selectedAlone]} 
                onPress={() => onStatusChange('alone')}
                disabled={prayerIsExpired}
              >
                <User size={16} color={prayer.status === 'alone' ? '#ffffff' : colors.textSecondary} />
                <Text style={[styles.buttonText, prayer.status === 'alone' && styles.selectedText]}>Alone</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, prayer.status === 'late' && styles.selectedLate]} 
                onPress={() => onStatusChange('late')}
                disabled={prayerIsExpired}
              >
                <Clock size={16} color={prayer.status === 'late' ? '#ffffff' : colors.textSecondary} />
                <Text style={[styles.buttonText, prayer.status === 'late' && styles.selectedText]}>Late</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })()}
    </View>
  );
}