import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function RAMInstallationGame({ onComplete, onClose }) {
  const [ramInstalled, setRamInstalled] = useState(false);

  const installRam = () => {
    setRamInstalled(true);
    // Delay slightly to show "Installed" state before closing
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  return (
    <>
      <Text style={styles.modalTitle}>UPGRADE RAM PC</Text>
      <Text style={styles.modalDesc}>Pasangkan CPU RAM baru ke Slot Motherboard!</Text>
      <View style={styles.ramSlotContainer}>
        <TouchableOpacity 
          style={[styles.ramSlot, ramInstalled ? styles.ramTancap : null]} 
          onPress={installRam}
        >
          <Text style={styles.ramText}>{ramInstalled ? '✅ RAM TERPASANG' : 'TANCAPKAN RAM KE SLOT'}</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
        <Text style={styles.modalCloseText}>Batal (Tutup)</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  modalTitle: { color: '#38bdf8', fontSize: 26, fontWeight: '900', marginBottom: 15, textAlign: 'center' },
  modalDesc: { color: '#cbd5e1', fontSize: 15, textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  ramSlotContainer: { width: '100%', height: 120, backgroundColor: '#0f172a', borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderColor: '#475569', borderWidth: 3, borderStyle: 'dashed' },
  ramSlot: { width: '80%', height: 60, backgroundColor: '#475569', justifyContent: 'center', alignItems: 'center', borderRadius: 4, borderWidth: 2, borderColor: '#334155' },
  ramTancap: { backgroundColor: '#22c55e', borderColor: '#166534' },
  ramText: { color: 'white', fontWeight: '800', fontSize: 16 },
  modalCloseButton: { marginTop: 25, padding: 10 },
  modalCloseText: { color: '#ef4444', fontSize: 16, fontWeight: 'bold', textDecorationLine: 'underline' },
});
