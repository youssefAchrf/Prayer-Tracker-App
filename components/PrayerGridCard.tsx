// components/PrayerGridCard.tsx

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Sun, Moon, Sunrise, Sunset, CloudSun, Users, User, Clock, CheckCircle2, Lock } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Prayer, PrayerStatus } from '@/types/prayer';

const PRAYER_ICONS = {
  Fajr: Sunrise,
  Dhuhr: Sun,
  Asr: CloudSun,
  Maghrib: Sunset,
  Isha: Moon,
};

const getStatusColor = (status: PrayerStatus | null) => {
  if (status === 'jamaah') return '#22c55e'; // Green
  if (status === 'alone') return '#3b82f6';   // Blue
  if (status === 'late') return '#f59e0b';    // Amber/Yellow
  return null;
};

interface PrayerGridCardProps {
  prayer: Prayer;
  onStatusChange: (status: PrayerStatus | null) => void;
  viewingDate: Date;
  isLockingEnabled: boolean;
}

export function PrayerGridCard({ prayer, onStatusChange, viewingDate, isLockingEnabled }: PrayerGridCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  
  const isExpired = () => {
    if (!isLockingEnabled) return false;
    if (!viewingDate || !prayer.time || prayer.time === '--:--') return false;
    
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
  const Icon = PRAYER_ICONS[prayer.name] || Sun;
  const isPrayed = prayer.status !== null;

  const handlePress = (currentStatus: PrayerStatus) => {
    if (prayer.status === currentStatus) {
      onStatusChange(null);
    } else {
      onStatusChange(currentStatus);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <View style={styles.topSection}>
          <View style={styles.prayerInfo}>
            <Icon size={24} color={colors.textSecondary} />
            <View>
              <Text style={styles.prayerName}>{prayer.name}</Text>
              <Text style={styles.prayerTime}>{prayer.time}</Text>
            </View>
          </View>
          {isPrayed && (
            <View style={styles.checkContainer}>
              <CheckCircle2 size={24} color={getStatusColor(prayer.status) ?? colors.primary} fill={colors.card} />
            </View>
          )}
        </View>

        {prayerIsExpired && !isPrayed ? (
          <View style={styles.missedContainer}>
              <Lock size={18} color={colors.textSecondary}/>
              <Text style={styles.missedText}>Logging window closed</Text>
          </View>
        ) : (
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              disabled={prayerIsExpired}
              style={[styles.actionButton, prayer.status === 'jamaah' && styles.jamaahSelected, prayerIsExpired && styles.disabledButton]}
              onPress={() => handlePress('jamaah')}
            >
              <Users size={20} color={prayer.status === 'jamaah' ? '#FFFFFF' : colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity 
              disabled={prayerIsExpired}
              style={[styles.actionButton, prayer.status === 'alone' && styles.aloneSelected, prayerIsExpired && styles.disabledButton]}
              onPress={() => handlePress('alone')}
            >
              <User size={20} color={prayer.status === 'alone' ? '#FFFFFF' : colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity 
              disabled={prayerIsExpired}
              style={[styles.actionButton, prayer.status === 'late' && styles.lateSelected, prayerIsExpired && styles.disabledButton]}
              onPress={() => handlePress('late')}
            >
              <Clock size={20} color={prayer.status === 'late' ? '#FFFFFF' : colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  cardContainer: {
    width: '50%',
    padding: 6,
  },
  card: { 
    flex: 1,
    backgroundColor: colors.card, 
    borderRadius: 24, 
    padding: 16, 
    aspectRatio: 1, 
    justifyContent: 'space-between', 
    borderWidth: 1, 
    borderColor: colors.border 
  },
  topSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  prayerInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  prayerName: { fontFamily: 'Inter-Bold', fontSize: 18, color: colors.text },
  prayerTime: { fontFamily: 'Inter-Regular', fontSize: 14, color: colors.textSecondary },
  checkContainer: { padding: 4 },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: colors.background, borderRadius: 18, padding: 4 },
  actionButton: { flex: 1, padding: 10, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  jamaahSelected: { backgroundColor: getStatusColor('jamaah') },
  aloneSelected: { backgroundColor: getStatusColor('alone') },
  lateSelected: { backgroundColor: getStatusColor('late') },
  missedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, paddingBottom: 10 },
  missedText: { fontFamily: 'Inter-Regular', fontSize: 12, color: colors.textSecondary, textAlign: 'center' },
  disabledButton: { opacity: 0.5 },
});