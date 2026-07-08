import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Image } from 'expo-image';
import { MAP_WIDTH, MAP_HEIGHT, PLAYER_SIZE, ROOMS } from '../constants/GameData';

// Fallback jika tidak ada gambar
const FallbackBox = ({ isBroken, color }) => (
  <View style={{ width: '100%', height: '100%', backgroundColor: color, 
    borderWidth: 2, borderColor: isBroken ? '#ef4444' : '#bae6fd' }} />
);

const FurnitureItem = ({ obj }) => {
  const isBroken = obj.status === 'broken';
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const isShop = obj.status === 'shop';

  useEffect(() => {
    let anim;
    if (isBroken || isShop) {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, { toValue: 0.1, duration: isShop ? 1000 : 300, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 1, duration: isShop ? 1000 : 300, useNativeDriver: true })
        ])
      );
      anim.start();
    } else {
      fadeAnim.setValue(1);
    }
    return () => { if (anim) anim.stop(); };
  }, [isBroken, isShop]);

  return (
    <Animated.View style={[
      styles.furniture, 
      { 
        left: obj.x, top: obj.y, width: obj.w, height: obj.h,
        opacity: fadeAnim,
        shadowColor: isBroken ? '#ef4444' : isShop ? '#facc15' : '#38bdf8',
        shadowRadius: isBroken ? 20 : 15,
        shadowOpacity: 1,
        elevation: 10,
        backgroundColor: '#0f172a'
      }
    ]}>
      <Image 
         source={obj.sprite}
         style={{ width: '100%', height: '100%', position: 'absolute' }}
         contentFit="contain"
      />
      {/* Fallback box menutupi background hitam jika image belum ada, tp transparan jika ada */}
      <View style={{...StyleSheet.absoluteFillObject, zIndex: -1}}>
         <FallbackBox isBroken={isBroken} color={obj.color} />
      </View>

      <Text style={styles.furnitureText}>{obj.name}</Text>
      {isBroken && <Text style={styles.alertIcon}>⚠️</Text>}
      {isShop && <Text style={[styles.alertIcon, {color: '#facc15'}]}>$</Text>}
    </Animated.View>
  );
};

export default function GameMap({ cameraOffsetX, cameraOffsetY, furnitures, player, promptE, playerDir }) {
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
        width: MAP_WIDTH, height: MAP_HEIGHT,
        transform: [{ translateX: cameraOffsetX }, { translateY: cameraOffsetY }]
      }
    ]}>
      {/* Grid Pattern Background Retro */}
      <View style={[styles.gridFloor, {
        backgroundImage: 'repeating-linear-gradient(45deg, #1e293b 25%, transparent 25%, transparent 75%, #1e293b 75%, #1e293b), repeating-linear-gradient(45deg, #1e293b 25%, #020617 25%, #020617 75%, #1e293b 75%, #1e293b)',
        backgroundPosition: '0 0, 10px 10px',
        backgroundSize: '20px 20px'
      }]} />

      {ROOMS.map(room => (
        <View key={room.id} style={[styles.room, { left: room.x, top: room.y, width: room.w, height: room.h }]}>
          <Text style={styles.roomText}>{room.name}</Text>
        </View>
      ))}

      {furnitures.map(obj => (
        <FurnitureItem key={obj.id} obj={obj} />
      ))}

      {/* Render Player & Arah Panah Neon */}
      <View style={[styles.player, { left: player.x, top: player.y }]}>
         <Image source={null} style={{ width: '100%', height: '100%', zIndex: 2 }} contentFit="cover" />
         {/* Fallback warna player */}
         <View style={{...StyleSheet.absoluteFillObject, backgroundColor: '#fcd34d', zIndex: 1}} />
         
         <View style={[styles.directionArrow, {transform: [{rotate: getDeg()}]}]}>
           <Text style={styles.arrowText}>▲</Text>
         </View>
      </View>

      {promptE && (
         <View style={[styles.promptBubble, { left: player.x, top: player.y - 45, transform: [{translateX: -25}] }]}>
            <Text style={styles.promptBubbleText}>E</Text>
         </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: { backgroundColor: '#020617', position: 'absolute' },
  gridFloor: { position: 'absolute', width: '100%', height: '100%', opacity: 0.2 },
  player: { position: 'absolute', width: PLAYER_SIZE, height: PLAYER_SIZE, borderRadius: 8, borderWidth: 2, borderColor: '#fff', zIndex: 10, shadowColor: '#fcd34d', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 15, overflow: 'visible' },
  directionArrow: { position: 'absolute', top: -10, left: 0, width: '100%', height: '100%', justifyContent:'flex-start', alignItems:'center', zIndex: 20 },
  arrowText: { color: '#ef4444', fontSize: 20, marginTop: -20, fontWeight: '900', textShadowColor: '#fca5a5', textShadowRadius: 5 },
  room: { position: 'absolute', borderWidth: 2, borderColor: '#334155', backgroundColor: 'rgba(15, 23, 42, 0.4)' },
  roomText: { color: '#475569', fontSize: 20, fontFamily: 'monospace', fontWeight: 'bold', opacity: 0.5, position: 'absolute', bottom: 10, right: 15 },
  furniture: { position: 'absolute', justifyContent: 'center', alignItems: 'center', borderRadius: 4, overflow: 'hidden' },
  furnitureText: { color: '#fff', fontSize: 9, fontFamily: 'monospace', fontWeight: 'bold', textAlign: 'center', padding: 2, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 2, width: '100%', position: 'absolute', bottom: 0 },
  alertIcon: { fontSize: 28, position: 'absolute', top: -20, right: -15, zIndex: 5, fontWeight: 'bold' },
  promptBubble: { 
    position: 'absolute', backgroundColor: '#10b981', borderRadius: 20, 
    width: 40, height: 40, justifyContent: 'center', alignItems: 'center', zIndex: 110,
    borderWidth: 2, borderColor: '#fff',
    shadowColor: '#34d399', shadowOpacity: 1, shadowRadius: 15, elevation: 15,
  },
  promptBubbleText: { color: '#fff', fontWeight: '900', fontFamily: 'Arial', fontSize: 18 }
});
