import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TicketOverlay({ money, highScore, tickets, stressLevel }) {
  const getStressColor = () => {
    if (stressLevel < 50) return '#4ade80'; // Neon Green
    if (stressLevel < 75) return '#facc15'; // Yellow
    return '#f87171'; // Red
  };

  return (
    <>
      <View style={styles.hudBlockLeft}>
        <Text style={styles.labelCyber}>[ SALDO_BANK ]</Text>
        <Text style={styles.moneyText}>${money}</Text>
        {highScore > 0 && <Text style={styles.highScoreText}>REKOR: ${highScore}</Text>}
      </View>

      <View style={styles.hudBlockRight}>
        <Text style={[styles.labelCyber, {textAlign:'right'}]}>[ CRITICAL_STRESS_LEVEL ]</Text>
        <Text style={[styles.stressValueText, {color: getStressColor()}]}>{stressLevel}%</Text>
        
        <View style={styles.stressBarBg}>
          <View style={[styles.stressBarFill, { width: `${stressLevel}%`, backgroundColor: getStressColor(),
            shadowColor: getStressColor(), shadowOpacity: 1, shadowRadius: 10 }]} />
        </View>

        <Text style={[styles.labelCyber, {marginTop: 15}]}>[ ACTIVE_QUEUE ]</Text>
        <View style={styles.ticketList}>
          {tickets.map((ticket) => (
            <View key={ticket.id} style={[styles.ticketItem, ticket.status === 'completed' && { opacity: 0.3 }]}>
              <Text style={[styles.ticketItemText, ticket.status === 'completed' && { textDecorationLine: 'line-through' }]}>
                {ticket.status === 'completed' ? 'PASS' : 'WARN'} :: {ticket.title}
              </Text>
            </View>
          ))}
          {tickets.filter(t => t.status === 'active').length === 0 && (
            <Text style={[styles.ticketItemText, { marginTop: 5, color: '#4ade80' }]}>
              SYS_IDLE_READY... ☕
            </Text>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  hudBlockLeft: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(5, 5, 5, 0.85)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#4ade80',
    borderLeftWidth: 4,
    borderRightWidth: 4,
  },
  labelCyber: {
    color: '#64748b',
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 5,
  },
  moneyText: {
    color: '#4ade80',
    fontWeight: '900',
    fontSize: 26,
    fontFamily: 'monospace',
    textShadowColor: '#22c55e',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  highScoreText: {
    color: '#fbbf24',
    fontFamily: 'monospace',
    fontSize: 10,
    marginTop: 5,
  },
  hudBlockRight: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 320,
    backgroundColor: 'rgba(5, 5, 5, 0.9)',
    padding: 15,
    borderWidth: 1,
    borderColor: '#38bdf8',
    borderStyle: 'dashed',
  },
  stressValueText: {
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'monospace',
    textAlign: 'right',
    marginBottom: 5,
  },
  stressBarBg: { 
    width: '100%', 
    height: 8, 
    backgroundColor: '#1e293b', 
    borderWidth: 1,
    borderColor: '#0f172a'
  },
  stressBarFill: { 
    height: '100%' 
  },
  ticketList: {
    marginTop: 5,
    borderLeftWidth: 2,
    borderColor: '#cbd5e1',
    paddingLeft: 10
  },
  ticketItem: { 
    marginBottom: 8 
  },
  ticketItemText: { 
    color: '#f8fafc',
    fontSize: 12, 
    fontFamily: 'monospace',
  }
});
