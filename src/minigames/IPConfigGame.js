import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

export default function IPConfigGame({ onComplete, onClose, toleranceUpgrade }) {
  const [ipInput, setIpInput] = useState('');
  const [attempts, setAttempts] = useState(0);

  const submit = () => {
    if (ipInput.trim() === '192.168.1.1' || ipInput.trim() === '255.255.255.0') {
      onComplete();
    } else {
      if (toleranceUpgrade && attempts === 0) {
        alert("IP Address Salah! Tapi untung kabelnya premium. Coba sekali lagi!");
        setAttempts(1);
      } else {
        alert("IP Address Salah Gagal total! Ketik 192.168.1.1");
        // Kalau gagal karna salah tanpa toleransi, kita tutup dan biarkan dia buka lagi
        onClose();
      }
    }
  };

  return (
    <>
      <Text style={styles.modalTitle}>KONFIGURASI JARINGAN</Text>
      <Text style={styles.modalDesc}>Server down karena Ransomware! Ketikkan IP Gateway '192.168.1.1' untuk restart jaringan.</Text>
      {toleranceUpgrade && <Text style={{color: '#a3e635', marginBottom: 10}}>*Kabel Premium Aktif: Bisa salah 1x</Text>}
      <TextInput 
        style={styles.modalInput} 
        placeholder="Ketik 192.168.1.1" 
        placeholderTextColor="#475569" 
        value={ipInput} 
        onChangeText={setIpInput} 
      />
      <TouchableOpacity style={styles.modalButton} onPress={submit}>
        <Text style={styles.modalButtonText}>EXECUTE</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
        <Text style={styles.modalCloseText}>Batal (Tutup)</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  modalTitle: { color: '#38bdf8', fontSize: 26, fontWeight: '900', marginBottom: 15, textAlign: 'center' },
  modalDesc: { color: '#cbd5e1', fontSize: 15, textAlign: 'center', marginBottom: 10, lineHeight: 22 },
  modalInput: { backgroundColor: '#0f172a', color: '#22c55e', width: '100%', height: 60, borderRadius: 8, borderWidth: 2, borderColor: '#3b82f6', paddingHorizontal: 15, fontSize: 20, fontFamily: 'monospace', marginBottom: 20 },
  modalButton: { backgroundColor: '#22c55e', paddingVertical: 15, borderRadius: 8, width: '100%', alignItems: 'center' },
  modalButtonText: { color: '#000', fontWeight: '900', fontSize: 18 },
  modalCloseButton: { marginTop: 25, padding: 10 },
  modalCloseText: { color: '#ef4444', fontSize: 16, fontWeight: 'bold', textDecorationLine: 'underline' },
});
