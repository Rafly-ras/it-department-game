import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function VirtualDPad({ onKeyPress, onKeyRelease }) {
  // Simulasi Keyboard Event yang bisa ditangkap oleh object refs
  const handleTouchStart = (key) => {
    onKeyPress(key);
  };
  const handleTouchEnd = (key) => {
    onKeyRelease(key);
  };

  return (
    <View style={styles.dpadContainer}>
      <View style={styles.row}>
        <TouchableOpacity 
          style={styles.btn} 
          onPressIn={() => handleTouchStart('ArrowUp')} 
          onPressOut={() => handleTouchEnd('ArrowUp')}
          activeOpacity={0.5}
        >
          <Text style={styles.text}>▲</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity 
          style={styles.btn} 
          onPressIn={() => handleTouchStart('ArrowLeft')} 
          onPressOut={() => handleTouchEnd('ArrowLeft')}
        >
          <Text style={styles.text}>◀</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.btnCenter} 
          onPressIn={() => handleTouchStart('e')} 
          onPressOut={() => handleTouchEnd('e')}
        >
          <Text style={styles.textAction}>[E]</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.btn} 
          onPressIn={() => handleTouchStart('ArrowRight')} 
          onPressOut={() => handleTouchEnd('ArrowRight')}
        >
          <Text style={styles.text}>▶</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity 
          style={styles.btn} 
          onPressIn={() => handleTouchStart('ArrowDown')} 
          onPressOut={() => handleTouchEnd('ArrowDown')}
        >
          <Text style={styles.text}>▼</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dpadContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99
  },
  row: {
    flexDirection: 'row',
  },
  btn: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    margin: 5,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)'
  },
  btnCenter: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(59, 130, 246, 0.7)',
    margin: 5,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#bfdbfe'
  },
  text: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  textAction: { fontSize: 16, color: '#fff', fontWeight: 'bold' }
});
