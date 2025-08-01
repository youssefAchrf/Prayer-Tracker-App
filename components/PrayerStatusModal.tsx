// components/PrayerStatusModal.tsx

import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, Users, User, X } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Prayer, PrayerStatus } from '@/types/prayer';

interface PrayerStatusModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectStatus: (status: PrayerStatus) => void;
  prayer: Prayer | null;
}

export function PrayerStatusModal({ isVisible, onClose, onSelectStatus, prayer }: PrayerStatusModalProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  if (!prayer) return null;

  const handleSelect = (status: PrayerStatus) => {
    onSelectStatus(status);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{prayer.name}</Text>
          <Text style={styles.modalSubtitle}>How did you pray?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.statusButton} onPress={() => handleSelect('jamaah')}>
              <Users size={22} color={colors.primary} />
              <Text style={styles.buttonText}>Jamaa'ah</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statusButton} onPress={() => handleSelect('alone')}>
              <User size={22} color={colors.primary} />
              <Text style={styles.buttonText}>Alone</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statusButton} onPress={() => handleSelect('late')}>
              <Clock size={22} color={colors.primary} />
              <Text style={styles.buttonText}>Late</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const getStyles = (colors) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  modalTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: colors.text,
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.textSecondary,
    marginBottom: 24,
    marginTop: 4,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
  },
});