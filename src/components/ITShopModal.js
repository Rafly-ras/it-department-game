import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SHOP_ITEMS } from '../constants/GameData';

export default function ITShopModal({ money, upgrades, onBuy, onClose }) {
  return (
    <>
      <Text style={styles.modalTitle}>🛒 TOKO BASECAMP IT</Text>
      <Text style={styles.moneyText}>Saldo: ${money}</Text>
      <Text style={styles.modalDesc}>Beli upgrade pakai duit hasil benerin tiket keluhan!</Text>
      
      <View style={styles.itemsContainer}>
        {SHOP_ITEMS.map((item) => {
          const isOwned = upgrades[item.id];
          const canAfford = money >= item.price;
          
          return (
            <View key={item.id} style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDesc}>{item.desc}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
              </View>
              
              {isOwned ? (
                <Text style={styles.ownedTag}>OWNED</Text>
              ) : (
                <TouchableOpacity 
                  style={[styles.buyBtn, canAfford ? styles.buyActive : styles.buyDisabled]} 
                  disabled={!canAfford}
                  onPress={() => onBuy(item.id, item.price)}
                >
                  <Text style={styles.buyText}>BELI</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
      
      <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
        <Text style={styles.modalCloseText}>Tutup Toko</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  modalTitle: { color: '#fbbf24', fontSize: 24, fontWeight: '900', marginBottom: 5, textAlign: 'center' },
  moneyText: { color: '#22c55e', fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  modalDesc: { color: '#cbd5e1', fontSize: 14, textAlign: 'center', marginBottom: 20 },
  itemsContainer: { width: '100%' },
  itemRow: { flexDirection: 'row', backgroundColor: '#0f172a', padding: 15, borderRadius: 8, marginBottom: 10, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  itemName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  itemDesc: { color: '#94a3b8', fontSize: 12, marginTop: 4, marginBottom: 4 },
  itemPrice: { color: '#fbbf24', fontSize: 14, fontWeight: 'bold' },
  buyBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 6, justifyContent: 'center' },
  buyActive: { backgroundColor: '#3b82f6' },
  buyDisabled: { backgroundColor: '#475569' },
  buyText: { color: '#fff', fontWeight: 'bold' },
  ownedTag: { color: '#22c55e', fontWeight: 'bold', padding: 10 },
  modalCloseButton: { marginTop: 25, padding: 10 },
  modalCloseText: { color: '#f87171', fontSize: 16, fontWeight: 'bold', textDecorationLine: 'underline' }
});
