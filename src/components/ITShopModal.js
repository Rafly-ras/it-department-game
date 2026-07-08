import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SHOP_ITEMS } from '../constants/GameData';

export default function ITShopModal({ money, upgrades, onBuy, onClose }) {
  return (
    <>
      <Text style={styles.modalTitle}>SYS_MERCHANT // BASECAMP</Text>
      <View style={styles.moneyBanner}>
        <Text style={styles.moneyText}>AVAILABLE_CREDITS:</Text>
        <Text style={styles.moneyAmount}>${money}</Text>
      </View>
      <Text style={styles.modalDesc}>Install external modules to bypass system restrictions.</Text>
      
      <View style={styles.itemsContainer}>
        {SHOP_ITEMS.map((item) => {
          const isOwned = upgrades[item.id];
          const canAfford = money >= item.price;
          
          return (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemIconPlaceholder} />
              
              <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={styles.itemName}>[{item.name}]</Text>
                <Text style={styles.itemDesc}>{item.desc}</Text>
                
                <View style={styles.actionRow}>
                  <Text style={[styles.itemPrice, isOwned ? null : canAfford ? {color:'#4ade80'} : {color:'#f87171'}]}>
                    COST: ${item.price}
                  </Text>
                  
                  {isOwned ? (
                    <Text style={styles.ownedTag}>[ INSTALLED ]</Text>
                  ) : (
                    <TouchableOpacity 
                      style={[styles.buyBtn, canAfford ? styles.buyActive : styles.buyDisabled]} 
                      disabled={!canAfford}
                      onPress={() => onBuy(item.id, item.price)}
                    >
                      <Text style={[styles.buyText, !canAfford && {color:'#64748b'}]}>INSTALL</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </View>
      
      <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
        <Text style={styles.modalCloseText}>[ DISCONNECT ]</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  modalTitle: { color: '#38bdf8', fontSize: 20, fontFamily: 'monospace', fontWeight: '900', marginBottom: 15, textAlign: 'center', letterSpacing: 2 },
  moneyBanner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#052e16', padding: 10, borderWidth: 1, borderColor: '#4ade80', width: '100%', marginBottom: 10 },
  moneyText: { color: '#4ade80', fontSize: 12, fontFamily: 'monospace' },
  moneyAmount: { color: '#4ade80', fontSize: 24, fontWeight: '900', fontFamily: 'monospace', textShadowColor: '#22c55e', textShadowRadius: 10, textShadowOffset:{width:0, height:0} },
  modalDesc: { color: '#94a3b8', fontSize: 12, fontFamily: 'monospace', textAlign: 'center', marginBottom: 20, fontStyle: 'italic' },
  itemsContainer: { width: '100%' },
  itemRow: { flexDirection: 'row', backgroundColor: 'transparent', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#334155', alignItems: 'flex-start' },
  itemIconPlaceholder: { width: 50, height: 50, backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#475569', borderRadius: 4 },
  itemName: { color: '#f8fafc', fontSize: 14, fontWeight: 'bold', fontFamily: 'monospace' },
  itemDesc: { color: '#94a3b8', fontSize: 11, marginTop: 4, marginBottom: 8, fontFamily: 'monospace', lineHeight: 16 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemPrice: { fontSize: 12, fontWeight: 'bold', fontFamily: 'monospace' },
  buyBtn: { paddingHorizontal: 15, paddingVertical: 6, borderWidth: 1 },
  buyActive: { backgroundColor: 'rgba(56, 189, 248, 0.1)', borderColor: '#38bdf8' },
  buyDisabled: { backgroundColor: 'transparent', borderColor: '#475569' },
  buyText: { color: '#38bdf8', fontWeight: 'bold', fontFamily: 'monospace', fontSize: 12 },
  ownedTag: { color: '#22c55e', fontWeight: 'bold', fontFamily: 'monospace', fontSize: 12 },
  modalCloseButton: { marginTop: 25, padding: 10, borderWidth: 1, borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  modalCloseText: { color: '#ef4444', fontSize: 14, fontWeight: 'bold', fontFamily: 'monospace' }
});
