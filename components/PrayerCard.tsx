
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, Users, User, Lock } from 'lucide-react-native';
import { Prayer, PrayerStatus } from '@/types/prayer';

interface PrayerCardProps {
  prayer: Prayer;
  onStatusChange: (status: PrayerStatus) => void;
  readOnly?: boolean;
  viewingDate?: Date;
  isLockingEnabled: boolean; // This prop will now be passed from the parent
}

export function PrayerCard({ prayer, onStatusChange, readOnly = false, viewingDate, isLockingEnabled }: PrayerCardProps) {

  const isExpired = () => {
    // If locking is globally disabled by the admin, prayers never expire.
    if (!isLockingEnabled) {
      return false;
    }
    
    // If it's a friend's card (readOnly) or there's no date/time, it's not considered expired for locking purposes.
    if (readOnly || !viewingDate || !prayer.time || prayer.time === '--:--') {
      return false;
    }

    // The original logic to calculate the 12-hour window
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
        if (readOnly) {
          return renderReadOnlyStatus();
        }

        if (prayerIsExpired) {
          if (prayer.status) {
            return (
              <View style={[styles.actionsContainer, styles.disabledContainer]}>
                <TouchableOpacity style={[styles.button, prayer.status === 'jamaah' && styles.selected]} disabled={true}><Users size={16} color={prayer.status === 'jamaah' ? '#ffffff' : '#4b5563'} /><Text style={[styles.buttonText, prayer.status === 'jamaah' && styles.selectedText]}>Jamaa'ah</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.button, prayer.status === 'alone' && styles.selected]} disabled={true}><User size={16} color={prayer.status === 'alone' ? '#ffffff' : '#4b5563'} /><Text style={[styles.buttonText, prayer.status === 'alone' && styles.selectedText]}>Alone</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.button, prayer.status === 'late' && styles.selected]} disabled={true}><Clock size={16} color={prayer.status === 'late' ? '#ffffff' : '#4b5563'} /><Text style={[styles.buttonText, prayer.status === 'late' && styles.selectedText]}>Late</Text></TouchableOpacity>
              </View>
            );
          }
          else {
            return (
              <View style={styles.expiredContainer}>
                <Lock size={16} color="#6b7280" />
                <Text style={styles.expiredText}>Time window has passed</Text>
              </View>
            );
          }
        }
        
        return (
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={[styles.button, prayer.status === 'jamaah' && styles.selected]} onPress={() => onStatusChange('jamaah')}><Users size={16} color={prayer.status === 'jamaah' ? '#ffffff' : '#4b5563'} /><Text style={[styles.buttonText, prayer.status === 'jamaah' && styles.selectedText]}>Jamaa'ah</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.button, prayer.status === 'alone' && styles.selected]} onPress={() => onStatusChange('alone')}><User size={16} color={prayer.status === 'alone' ? '#ffffff' : '#4b5563'} /><Text style={[styles.buttonText, prayer.status === 'alone' && styles.selectedText]}>Alone</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.button, prayer.status === 'late' && styles.selected]} onPress={() => onStatusChange('late')}><Clock size={16} color={prayer.status === 'late' ? '#ffffff' : '#4b5563'} /><Text style={[styles.buttonText, prayer.status === 'late' && styles.selectedText]}>Late</Text></TouchableOpacity>
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
  selected: { backgroundColor: '#059669' },
  selectedText: { color: '#ffffff' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6, backgroundColor: '#ecfdf5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99 },
  statusBadgeText: { color: '#059669', fontFamily: 'Inter-SemiBold', fontSize: 14 },
  statusBadgeLate: { backgroundColor: '#fffbeb' },
  statusBadgeTextLate: { color: '#d97706' },
  statusNotPrayed: { fontFamily: 'Inter-Regular', color: '#9ca3af', fontStyle: 'italic', paddingLeft: 4 },
  expiredContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10, backgroundColor: '#f3f4f6', borderRadius: 12 },
  expiredText: { fontFamily: 'Inter-Medium', color: '#6b7280', fontStyle: 'italic' },
  disabledContainer: {
    opacity: 0.6,
  }
});
