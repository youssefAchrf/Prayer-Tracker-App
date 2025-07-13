// PrayerCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, Users, User, Lock, PauseCircle } from 'lucide-react-native'; // Ensure all icons are imported
import { Prayer, PrayerStatus } from '@/types/prayer';

interface PrayerCardProps {
  prayer: Prayer;
  onStatusChange: (status: PrayerStatus) => void;
  readOnly?: boolean;
  viewingDate?: Date;
  isLockingEnabled: boolean;
  isExempted: boolean;
}

export function PrayerCard({ prayer, onStatusChange, readOnly = false, viewingDate, isLockingEnabled, isExempted }: PrayerCardProps) {

  const isExpired = () => {
    if (!isLockingEnabled) {
      return false;
    }
    if (readOnly || !viewingDate || !prayer.time || prayer.time === '--:--') {
      return false;
    }
    const [timePart, ampm] = prayer.time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (ampm === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }
    const prayerDateTime = new Date(viewingDate);
    prayerDateTime.setHours(hours, minutes, 0, 0);
    const expirationTime = new Date(prayerDateTime.getTime() + 12 * 60 * 60 * 1000);
    return new Date() > expirationTime;
  };

  const prayerIsExpired = isExpired();

  const renderReadOnlyStatus = () => {
    if (!prayer.status || prayer.status === 'missed') {
      return <Text style={styles.statusNotPrayed}>Not Yet Prayed</Text>;
    }
    const statusInfo = {
      jamaah: { icon: <Users size={14} color="#059669" />, text: "Jamaa'ah" },
      alone: { icon: <User size={14} color="#059669" />, text: 'Alone' },
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
              <PauseCircle size={16} color="#6b7280" />
              <Text style={styles.expiredText}>Streak Paused</Text>
            </View>
          );
        }
        if (readOnly) {
          return renderReadOnlyStatus();
        }
        if (prayerIsExpired) {
            // This part for expired prayers remains unchanged
        }
        
        return (
          <View style={styles.actionsContainer}>
            {/* Jamaa'ah Button */}
            <TouchableOpacity 
              style={[styles.button, prayer.status === 'jamaah' && styles.selectedJamaah]} 
              onPress={() => onStatusChange('jamaah')}
            >
              <Users size={16} color={prayer.status === 'jamaah' ? '#ffffff' : '#4b5563'} />
              <Text style={[styles.buttonText, prayer.status === 'jamaah' && styles.selectedText]}>Jamaa'ah</Text>
            </TouchableOpacity>
            
            {/* Alone Button */}
            <TouchableOpacity 
              style={[styles.button, prayer.status === 'alone' && styles.selectedAlone]} 
              onPress={() => onStatusChange('alone')}
            >
              <User size={16} color={prayer.status === 'alone' ? '#ffffff' : '#4b5563'} />
              <Text style={[styles.buttonText, prayer.status === 'alone' && styles.selectedText]}>Alone</Text>
            </TouchableOpacity>

            {/* Late Button */}
            <TouchableOpacity 
              style={[styles.button, prayer.status === 'late' && styles.selectedLate]} 
              onPress={() => onStatusChange('late')}
            >
              <Clock size={16} color={prayer.status === 'late' ? '#ffffff' : '#4b5563'} />
              <Text style={[styles.buttonText, prayer.status === 'late' && styles.selectedText]}>Late</Text>
            </TouchableOpacity>
          </View>
        );
      })()}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  infoContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  name: { fontSize: 20, fontFamily: 'Inter-Bold', color: '#1f2937' },
  arabicName: { fontSize: 14, fontFamily: 'Amiri-Regular', color: '#6b7280' },
  time: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: '#059669' },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  button: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 12, backgroundColor: '#f3f4f6', gap: 6 },
  buttonText: { fontSize: 14, fontWeight: '500', color: '#4b5563' },

  // --- MODIFIED STYLES ---
  selectedJamaah: { backgroundColor: '#22c55e' }, // Green
  selectedAlone: { backgroundColor: '#89CFF0' },   // baby blue
  selectedLate: { backgroundColor: '#ffd700' },   // Amber/Yellow
  selectedText: { color: '#ffffff' },
  // --- END OF MODIFIED STYLES ---

  statusBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6, backgroundColor: '#ecfdf5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99 },
  statusBadgeText: { color: '#059669', fontFamily: 'Inter-SemiBold', fontSize: 14 },
  statusBadgeLate: { backgroundColor: '#fffbeb' },
  statusBadgeTextLate: { color: '#d97706' },
  statusNotPrayed: { fontFamily: 'Inter-Regular', color: '#9ca3af', fontStyle: 'italic', paddingLeft: 4 },
  expiredContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10, backgroundColor: '#f3f4f6', borderRadius: 12 },
  exemptedContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10, backgroundColor: '#f3f4f6', borderRadius: 12 },
  expiredText: { fontFamily: 'Inter-Medium', color: '#6b7280', fontStyle: 'italic' },
  disabledContainer: {
    opacity: 0.6,
  }
});