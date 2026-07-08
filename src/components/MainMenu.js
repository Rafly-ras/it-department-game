import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function MainMenu({ onStart }) {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <View style={styles.container}>
      {/* Background Ornamen */}
      <View style={styles.gridOverlay} />
      
      <View style={styles.titleContainer}>
        <Text style={styles.titleGlow}>IT SUPPORT QUEST:</Text>
        <Text style={styles.subtitleGlow}>CORPORATE MAYHEM</Text>
      </View>

      <TouchableOpacity style={styles.btnStart} onPress={onStart}>
        <Text style={styles.btnStartText}>[ MULAI KERJA ]</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnGuide} onPress={() => setShowGuide(true)}>
        <Text style={styles.btnGuideText}>BACA PANDUAN</Text>
      </TouchableOpacity>

      {/* MODAL PANDUAN */}
      <Modal visible={showGuide} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}># PANDUAN KERJA IT</Text>
            
            <View style={styles.guideSection}>
              <Text style={styles.guideHeader}>1. KONTROL ARAH</Text>
              <Text style={styles.guideText}>* Gunakan W,A,S,D atau Panah Keyboard.</Text>
              <Text style={styles.guideText}>* Atau sentuh Virtual D-Pad (Layar Mobile).</Text>
            </View>

            <View style={styles.guideSection}>
              <Text style={styles.guideHeader}>2. MISI & TARGET</Text>
              <Text style={styles.guideText}>* Pantau daftar tiket di pojok kanan layar.</Text>
              <Text style={styles.guideText}>* Jika ada tiket yang kedaluwarsa (45s), Boss Stress naik 25%.</Text>
              <Text style={styles.guideText}>* Jangan sampai Stress 100% atau DIPECAT!</Text>
            </View>

            <View style={styles.guideSection}>
              <Text style={styles.guideHeader}>3. UPGRADE TOKO</Text>
              <Text style={styles.guideText}>* Hasil kerja (Uang) dapat dibelanjakan di meja Basecamp IT.</Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowGuide(false)}>
              <Text style={styles.closeBtnText}>TUTUP (MENGERTI)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,
    borderWidth: 2,
    borderColor: '#22c55e',
    borderStyle: 'dashed',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 80,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 30,
    borderWidth: 1,
    borderColor: '#22c55e',
    borderRadius: 8,
    shadowColor: '#22c55e',
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20
  },
  titleGlow: {
    fontSize: 42,
    fontWeight: '900',
    color: '#a3e635',
    textShadowColor: '#22c55e',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    fontFamily: 'monospace',
    letterSpacing: 2
  },
  subtitleGlow: {
    fontSize: 28,
    fontWeight: '700',
    color: '#facc15',
    textShadowColor: '#eab308',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginTop: 10,
    fontFamily: 'monospace',
    letterSpacing: 4
  },
  btnStart: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderWidth: 3,
    borderColor: '#4ade80',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 4,
    marginBottom: 20,
    shadowColor: '#22c55e',
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  btnStartText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  btnGuide: {
    padding: 10,
  },
  btnGuideText: {
    color: '#94a3b8',
    fontSize: 16,
    fontFamily: 'monospace',
    textDecorationLine: 'underline',
  },
  // MODAL PANDUAN
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '80%',
    maxWidth: 600,
    backgroundColor: '#0f172a',
    borderWidth: 2,
    borderColor: '#38bdf8',
    padding: 30,
    borderRadius: 8
  },
  modalTitle: {
    color: '#38bdf8',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#38bdf8',
    paddingBottom: 10
  },
  guideSection: {
    marginBottom: 20
  },
  guideHeader: {
    color: '#fbbf24',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  guideText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 3,
    lineHeight: 20
  },
  closeBtn: {
    backgroundColor: '#ef4444',
    padding: 12,
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 10
  },
  closeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'monospace'
  }
});
