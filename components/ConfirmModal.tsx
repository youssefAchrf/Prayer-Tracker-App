// In components/ConfirmModal.tsx
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmColor?: string;
}

export function ConfirmModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  confirmColor = '#dc2626'
}: ConfirmModalProps) {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <AlertTriangle size={24} color="#d97706" />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: `${confirmColor}1A` }]} // Lighter version of the color
              onPress={onConfirm}
            >
              <Text style={[styles.confirmButtonText, { color: confirmColor }]}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  content: { width: '100%', maxWidth: 400, backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', elevation: 5 },
  iconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontFamily: 'Inter-Bold', marginBottom: 8 },
  message: { fontSize: 14, fontFamily: 'Inter-Regular', textAlign: 'center', color: '#6b7280', marginBottom: 24, lineHeight: 20 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  button: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginHorizontal: 8 },
  cancelButton: { backgroundColor: '#f3f4f6' },
  cancelButtonText: { color: '#374151', fontFamily: 'Inter-SemiBold' },
  confirmButtonText: { fontFamily: 'Inter-SemiBold' },
});