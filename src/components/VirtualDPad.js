import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function VirtualDPad({ onKeyPress, onKeyRelease }) {
  const [pressedKey, setPressedKey] = useState(null);

  const handleTouchStart = (key) => {
    setPressedKey(key);
    onKeyPress(key);
  };
  const handleTouchEnd = (key) => {
    setPressedKey(null);
    onKeyRelease(key);
  };

  const isPressed = (key) => pressedKey === key;

  return (
    <View style={styles.dpadContainer}>
      <View style={styles.row}>
        <TouchableOpacity 
          style={[styles.btn, isPressed('ArrowUp') && styles.btnActive]} 
          onPressIn={() => handleTouchStart('ArrowUp')} onPressOut={() => handleTouchEnd('ArrowUp')} activeOpacity={1}
        >
          <Text style={[styles.text, isPressed('ArrowUp') && styles.textActive]}>▲</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity 
          style={[styles.btn, isPressed('ArrowLeft') && styles.btnActive]} 
          onPressIn={() => handleTouchStart('ArrowLeft')} onPressOut={() => handleTouchEnd('ArrowLeft')} activeOpacity={1}
        >
          <Text style={[styles.text, isPressed('ArrowLeft') && styles.textActive]}>◀</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.btnCenter, isPressed('e') && styles.btnCenterActive]} 
          onPressIn={() => handleTouchStart('e')} onPressOut={() => handleTouchEnd('e')} activeOpacity={1}
        >
          <Text style={[styles.textAction, isPressed('e') && styles.textActionActive]}>ACT</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.btn, isPressed('ArrowRight') && styles.btnActive]} 
          onPressIn={() => handleTouchStart('ArrowRight')} onPressOut={() => handleTouchEnd('ArrowRight')} activeOpacity={1}
        >
          <Text style={[styles.text, isPressed('ArrowRight') && styles.textActive]}>▶</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity 
          style={[styles.btn, isPressed('ArrowDown') && styles.btnActive]} 
          onPressIn={() => handleTouchStart('ArrowDown')} onPressOut={() => handleTouchEnd('ArrowDown')} activeOpacity={1}
        >
          <Text style={[styles.text, isPressed('ArrowDown') && styles.textActive]}>▼</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dpadContainer: {
    position: 'absolute', bottom: 30, left: 30, width: 220, height: 220,
    justifyContent: 'center', alignItems: 'center', zIndex: 99
  },
  row: { flexDirection: 'row' },
  btn: {
    width: 65, height: 65, margin: 4, borderRadius: 32.5,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#475569',
    shadowColor: '#000', shadowOpacity: 0.8, shadowRadius: 10, shadowOffset: {width:0, height:5}
  },
  btnActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.4)', borderColor: '#38bdf8',
    shadowColor: '#38bdf8', shadowOpacity: 1, shadowRadius: 15, shadowOffset: {width:0, height:0}, elevation: 5
  },
  btnCenter: {
    width: 65, height: 65, margin: 4, borderRadius: 16,
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#10b981',
  },
  btnCenterActive: {
    backgroundColor: 'rgba(52, 211, 153, 0.6)', borderColor: '#6ee7b7',
    shadowColor: '#34d399', shadowOpacity: 1, shadowRadius: 20
  },
  text: { fontSize: 24, color: '#94a3b8' },
  textActive: { color: '#fff', textShadowColor: '#fff', textShadowRadius: 10 },
  textAction: { fontSize: 16, color: '#10b981', fontWeight: '900', fontFamily: 'monospace' },
  textActionActive: { color: '#fff' }
});
