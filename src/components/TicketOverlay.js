import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TicketOverlay({ money, highScore, tickets, stressLevel, playerPos }) {
  const getStressLevelText = () => {
    if (stressLevel < 30) return 'Rendah';
    if (stressLevel < 70) return 'Sedang';
    return 'TINGGI';
  };

  const getStressColor = () => {
    if (stressLevel < 30) return '#4ade80';
    if (stressLevel < 70) return '#facc15';
    return '#f87171';
  };

  const activeTickets = tickets.filter(t => t.status === 'active');

  return (
    <>
      <View style={styles.hudBlockBottomLeft}>
        <Text style={styles.titleText}>TIKET AKTIF</Text>
        <View style={styles.divider} />
        
        <View style={styles.ticketList}>
          {activeTickets.map((ticket, index) => (
            <View key={ticket.id} style={styles.ticketItem}>
              <Text style={styles.ticketItemText}>
                □ {index + 1}. {ticket.title}
              </Text>
            </View>
          ))}
          {activeTickets.length === 0 && (
            <View style={styles.ticketItem}>
               <Text style={[styles.ticketItemText, {color: '#94a3b8'}]}>
                 ✓ Tidak ada tiket. Santuy...
               </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.statusBar}>
         <Text style={styles.statusText}>
            IT Support: (X: {Math.round(playerPos?.x || 0)}, Y: {Math.round(playerPos?.y || 0)})  |  Skor: ${money}  |  Stress: <Text style={{color: getStressColor()}}>{getStressLevelText()} ({stressLevel}%)</Text>
         </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  hudBlockBottomLeft: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    width: 350,
    backgroundColor: '#1e293b',
    padding: 15,
    borderWidth: 4,
    borderColor: '#94a3b8',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 20,
    zIndex: 100
  },
  titleText: {
    color: '#f8fafc',
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 2
  },
  divider: {
    height: 2,
    backgroundColor: '#34d399',
    marginVertical: 10
  },
  ticketList: {
    marginTop: 5
  },
  ticketItem: {
    marginBottom: 8
  },
  ticketItemText: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'monospace'
  },
  
  statusBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 35,
    backgroundColor: '#020617',
    borderTopWidth: 2,
    borderTopColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 110
  },
  statusText: {
    color: '#cbd5e1',
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold'
  }
});
