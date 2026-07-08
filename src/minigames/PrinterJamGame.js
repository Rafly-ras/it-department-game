import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

export default function PrinterJamGame({ onComplete, onClose }) {
  const [clickCount, setClickCount] = useState(0);
  const TARGET_CLICKS = 5;

  const handleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount >= TARGET_CLICKS) {
      setTimeout(() => {
        onComplete();
      }, 300);
    }
  };

  return (
    <>
      <Text style={styles.modalTitle}>PRINTER MACET</Text>
      <Text style={styles.modalDesc}>Kertas nyangkut (Paper Jam)! Klik tombol secepatnya {TARGET_CLICKS} kali untuk menarik kertas!</Text>
      
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${(clickCount / TARGET_CLICKS) * 100}%` }]} />
      </View>

      <Text style={styles.counterText}>{clickCount} / {TARGET_CLICKS}</Text>

      <TouchableOpacity 
        style={[styles.jamButton, clickCount >= TARGET_CLICKS ? styles.jamSuccess : null]} 
        onPress={handleClick}
        disabled={clickCount >= TARGET_CLICKS}
      >
        <Text style={styles.jamButtonText}>
          {clickCount >= TARGET_CLICKS ? 'KERTAS LEPAS! ✅' : 'TARIK KERTAS! 🖨️'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
        <Text style={styles.modalCloseText}>Batal (Tutup)</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  modalTitle: { color: '#fb923c', fontSize: 26, fontWeight: '900', marginBottom: 15, textAlign: 'center' },
  modalDesc: { color: '#cbd5e1', fontSize: 15, textAlign: 'center', marginBottom: 20, lineHeight: 22 },
  progressContainer: { width: '100%', height: 20, backgroundColor: '#334155', borderRadius: 10, overflow: 'hidden', marginBottom: 15 },
  progressBar: { height: '100%', backgroundColor: '#f97316' },
  counterText: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  jamButton: { width: '80%', height: 80, backgroundColor: '#c2410c', justifyContent: 'center', alignItems: 'center', borderRadius: 8, borderWidth: 3, borderColor: '#7c2d12' },
  jamSuccess: { backgroundColor: '#22c55e', borderColor: '#166534' },
  jamButtonText: { color: 'white', fontWeight: '900', fontSize: 20 },
  modalCloseButton: { marginTop: 25, padding: 10 },
  modalCloseText: { color: '#ef4444', fontSize: 16, fontWeight: 'bold', textDecorationLine: 'underline' },
});
