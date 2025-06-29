import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, Clock, Users, User } from 'lucide-react-native';
import { Prayer, PrayerStatus } from '@/types/prayer';

interface PrayerCardProps {
  prayer: Prayer;
  onStatusChange: (status: PrayerStatus) => void;
  readOnly?: boolean;
}

export function PrayerCard({ prayer, onStatusChange, readOnly = false }: PrayerCardProps) {
  const getStatusColor = (status?: PrayerStatus) => {
    switch (status) {
      case 'jamaah': return '#059669';
      case 'alone': return '#0d9488';
      case 'late': return '#f59e0b';
      case 'missed': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status?: PrayerStatus) => {
    switch (status) {
      case 'jamaah': return <Users size={16} color="#ffffff" />;
      case 'alone': return <User size={16} color="#ffffff" />;
      case 'late': return <Clock size={16} color="#ffffff" />;
      case 'missed': return <Check size={16} color="#ffffff" />;
      default: return null;
    }
  };

  const getStatusText = (status?: PrayerStatus) => {
    switch (status) {
      case 'jamaah': return 'Jamaa\'ah';
      case 'alone': return 'Alone';
      case 'late': return 'Late';
      case 'missed': return 'Missed';
      default: return 'Not prayed';
    }
  };

  return (
    <View style={[styles.container, readOnly && styles.readOnlyContainer]}>
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <Text style={styles.prayerName}>{prayer.name}</Text>
          <Text style={styles.arabicName}>{prayer.arabicName}</Text>
        </View>
        <Text style={styles.time}>{prayer.time}</Text>
      </View>

      {!readOnly && (
        <View style={styles.statusContainer}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              { backgroundColor: prayer.status === 'jamaah' ? '#059669' : '#f3f4f6' }
            ]}
            onPress={() => onStatusChange('jamaah')}
          >
            <Users size={16} color={prayer.status === 'jamaah' ? '#ffffff' : '#6b7280'} />
            <Text style={[
              styles.statusText,
              { color: prayer.status === 'jamaah' ? '#ffffff' : '#6b7280' }
            ]}>
              Jamaa'ah
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statusButton,
              { backgroundColor: prayer.status === 'alone' ? '#0d9488' : '#f3f4f6' }
            ]}
            onPress={() => onStatusChange('alone')}
          >
            <User size={16} color={prayer.status === 'alone' ? '#ffffff' : '#6b7280'} />
            <Text style={[
              styles.statusText,
              { color: prayer.status === 'alone' ? '#ffffff' : '#6b7280' }
            ]}>
              Alone
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statusButton,
              { backgroundColor: prayer.status === 'late' ? '#f59e0b' : '#f3f4f6' }
            ]}
            onPress={() => onStatusChange('late')}
          >
            <Clock size={16} color={prayer.status === 'late' ? '#ffffff' : '#6b7280'} />
            <Text style={[
              styles.statusText,
              { color: prayer.status === 'late' ? '#ffffff' : '#6b7280' }
            ]}>
              Late
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {prayer.status && (
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(prayer.status) }]}>
          {getStatusIcon(prayer.status)}
          <Text style={styles.statusIndicatorText}>{getStatusText(prayer.status)}</Text>
          {readOnly && (
            <Text style={styles.readOnlyLabel}>View Only</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  readOnlyContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nameContainer: {
    flex: 1,
  },
  prayerName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 4,
  },
  arabicName: {
    fontSize: 16,
    fontFamily: 'Amiri-Regular',
    color: '#6b7280',
  },
  time: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#059669',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  statusIndicatorText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  readOnlyLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
    marginLeft: 8,
  },
});