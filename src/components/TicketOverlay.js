import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TicketOverlay({ money, tickets, stressLevel }) {
  // Warnanya berubah seiring level stress (kuning -> jingga -> merah)
  const getStressColor = () => {
    if (stressLevel < 50) return '#22c55e'; // Hijau
    if (stressLevel < 75) return '#facc15'; // Kuning
    return '#ef4444'; // Merah
  };

  return (
    <>
      <View style={styles.scoreBoard}>
        <Text style={styles.scoreText}>SALDO: ${money}</Text>
      </View>

      <View style={styles.ticketContainer}>
        {/* Boss Stress Bar */}
        <Text style={styles.stressHeader}>BOSS STRESS: {stressLevel}%</Text>
        <View style={styles.stressBarBg}>
          <View style={[styles.stressBarFill, { width: `${stressLevel}%`, backgroundColor: getStressColor() }]} />
        </View>

        <Text style={styles.ticketHeader}>📋 TIKET KELUHAN USER</Text>
        {tickets.map((ticket) => (
          <View key={ticket.id} style={[styles.ticketItem, ticket.status === 'completed' && { opacity: 0.5 }]}>
            <Text style={[styles.ticketItemText, ticket.status === 'completed' && { textDecorationLine: 'line-through' }]}>
              {ticket.status === 'completed' ? '✅ ' : '❌ '}{ticket.title}
            </Text>
          </View>
        ))}
        {tickets.filter(t => t.status === 'active').length === 0 && (
          <Text style={[styles.ticketItemText, { marginTop: 10, color: '#22c55e', fontWeight: 'bold' }]}>
            Semua tiket beres, nyantai dulu~ ☕
          </Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scoreBoard: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#22c55e'
  },
  scoreText: {
    color: '#22c55e',
    fontWeight: '800',
    fontSize: 18,
  },
  ticketContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 280,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#64748b'
  },
  stressHeader: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  stressBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: '#334155',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 15,
  },
  stressBarFill: {
    height: '100%',
  },
  ticketHeader: {
    color: '#cbd5e1',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#475569',
    paddingBottom: 8,
  },
  ticketItem: {
    backgroundColor: '#334155',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  ticketItemText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '500'
  }
});
