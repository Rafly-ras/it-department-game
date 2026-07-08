import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TicketOverlay({ score, tickets }) {
  return (
    <>
      <View style={styles.scoreBoard}>
        <Text style={styles.scoreText}>SKOR: {score}</Text>
      </View>

      <View style={styles.ticketContainer}>
        <Text style={styles.ticketHeader}>📋 TIKET KELUHAN USER</Text>
        {tickets.map((ticket) => (
          <View key={ticket.id} style={[styles.ticketItem, ticket.status === 'completed' && { opacity: 0.5 }]}>
            <Text style={[styles.ticketItemText, ticket.status === 'completed' && { textDecorationLine: 'line-through' }]}>
              {ticket.status === 'completed' ? '✅ ' : '❌ '}{ticket.title}
            </Text>
          </View>
        ))}
        {tickets.every(t => t.status === 'completed') && (
          <Text style={[styles.ticketItemText, { marginTop: 10, color: '#22c55e', fontWeight: 'bold' }]}>
            Semua tiket selesai, standby... ☕
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
    borderColor: '#facc15'
  },
  scoreText: {
    color: '#facc15',
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
