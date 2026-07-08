import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Image } from 'expo-image';
import { MAP_WIDTH, MAP_HEIGHT, PLAYER_SIZE, ROOMS } from '../constants/GameData';

// Sub-komponen agar setiap furnitur punya siklus animasinya sendiri
const FurnitureItem = ({ obj }) => {
  const isBroken = obj.status === 'broken';
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let anim;
    if (isBroken) {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, { toValue: 0.2, duration: 500, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true })
        ])
      );
      anim.start();
    } else {
      fadeAnim.setValue(1);
    }
    return () => { if (anim) anim.stop(); };
  }, [isBroken]);

  return (
    <Animated.View style={[
      styles.furniture, 
      { 
        left: obj.x, top: obj.y, width: obj.w, height: obj.h, backgroundColor: obj.color,
        opacity: fadeAnim,
        // Neon Glow CSS untuk normal/fixed, Red Shadow untuk broken
        shadowColor: isBroken ? '#ef4444' : '#38bdf8',
        shadowRadius: isBroken ? 20 : 15,
        shadowOpacity: 1,
        elevation: 10,
        borderColor: isBroken ? '#ef4444' : '#bae6fd',
        borderWidth: 2
      }
    ]}>
      <Image 
         source={obj.sprite}
         style={{ width: '100%', height: '100%', position: 'absolute' }}
         contentFit="contain"
         onError={() => {}}
         placeholder={null}
      />
      <Text style={styles.furnitureText}>{obj.name}</Text>
      {isBroken && <Text style={styles.alertIcon}>⚠️</Text>}
    </Animated.View>
  );
};

export default function GameMap({ cameraOffsetX, cameraOffsetY, furnitures, player, promptE, onInteract, playerDir }) {
  
  // Konversi arah ('up','down','left','right') ke sudut rotasi panah
  const getDeg = () => {
    switch(playerDir) {
       case 'up': return '0deg';
       case 'right': return '90deg';
       case 'down': return '180deg';
       case 'left': return '-90deg';
       default: return '0deg';
    }
  };

  return (
    <View style={[
      styles.mapContainer, 
      { 
        width: MAP_WIDTH, 
        height: MAP_HEIGHT,
        transform: [{ translateX: cameraOffsetX }, { translateY: cameraOffsetY }]
      }
    ]}>
      
      {ROOMS.map(room => (
        <View key={room.id} style={[styles.room, { left: room.x, top: room.y, width: room.w, height: room.h, backgroundColor: room.color }]}>
          <Text style={styles.roomText}>{room.name}</Text>
        </View>
      ))}

      {furnitures.map(obj => (
        <FurnitureItem key={obj.id} obj={obj} />
      ))}

      {/* Render Player & Indikator Arah Panah */}
      <View style={[styles.player, { left: player.x, top: player.y }]}>
         <Image 
           source={require('../../assets/sprites/player.png')} // dummy
           style={{ width: '100%', height: '100%' }}
           contentFit="cover"
         />
         <View style={[styles.directionArrow, {transform: [{rotate: getDeg()}]}]}>
           <Text style={styles.arrowText}>▲</Text>
         </View>
      </View>

      {promptE && (
         <View style={[styles.promptBubble, { left: player.x - 70, top: player.y - 60 }]}>
            <Text style={styles.promptBubbleText}>[E]</Text>
         </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: { backgroundColor: '#94a3b8', position: 'absolute' },
  player: { position: 'absolute', width: PLAYER_SIZE, height: PLAYER_SIZE, backgroundColor: '#fcd34d', borderRadius: 8, borderWidth: 2, borderColor: '#fff', zIndex: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 5 },
  directionArrow: { position: 'absolute', top: -5, left: 0, width: '100%', height: '100%', justifyContent:'flex-start', alignItems:'center' },
  arrowText: { color: '#ef4444', fontSize: 16, marginTop: -15, fontWeight: 'bold' },
  room: { position: 'absolute', borderWidth: 2, borderColor: '#475569' },
  roomText: { color: '#cbd5e1', fontSize: 24, fontWeight: 'bold', opacity: 0.4, position: 'absolute', bottom: 15, right: 20 },
  furniture: { position: 'absolute', justifyContent: 'center', alignItems: 'center', borderRadius: 4, overflow: 'hidden' },
  furnitureText: { color: 'white', fontSize: 10, fontWeight: 'bold', textAlign: 'center', padding: 2, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2, width: '100%', position: 'absolute', bottom: 0 },
  alertIcon: { fontSize: 28, position: 'absolute', top: -20, right: -15, zIndex: 5 },
  promptBubble: { position: 'absolute', backgroundColor: '#3b82f6', borderWidth: 2, borderColor: '#fff', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, zIndex: 15, width: 180, justifyContent: 'center', alignItems: 'center' },
  promptBubbleText: { color: 'white', fontWeight: '900', fontSize: 16 }
});
