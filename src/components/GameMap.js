import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { MAP_WIDTH, MAP_HEIGHT, PLAYER_SIZE, ROOMS } from '../constants/GameData';

export default function GameMap({ cameraOffsetX, cameraOffsetY, furnitures, player, promptE, onInteract }) {
  return (
    <View style={[
      styles.mapContainer, 
      { 
        width: MAP_WIDTH, 
        height: MAP_HEIGHT,
        transform: [{ translateX: cameraOffsetX }, { translateY: cameraOffsetY }]
      }
    ]}>
      {/* 1. Render Rooms (Lantai/Dinding) */}
      {ROOMS.map(room => (
        <View key={room.id} style={[styles.room, { left: room.x, top: room.y, width: room.w, height: room.h, backgroundColor: room.color }]}>
          <Text style={styles.roomText}>{room.name}</Text>
        </View>
      ))}

      {/* 2. Render Furnitures (Objects) */}
      {furnitures.map(obj => (
        <View key={obj.id} style={[styles.furniture, { left: obj.x, top: obj.y, width: obj.w, height: obj.h, backgroundColor: obj.color }]}>
          {/* Implementasi ekspos Image Sprite, ditambahkan error handling jika file dummy blm ada */}
          <Image 
             source={obj.sprite}
             style={{ width: '100%', height: '100%', position: 'absolute' }}
             contentFit="contain"
             // Fallback jika tidak ada gambar / error (karena dummy path)
             onError={() => {}}
             placeholder={null}
          />
          <Text style={styles.furnitureText}>{obj.name}</Text>
          {obj.status === 'broken' && <Text style={styles.alertIcon}>⚠️</Text>}
        </View>
      ))}

      {/* 3. Render Player */}
      <View style={[styles.player, { left: player.x, top: player.y }]}>
         <Image 
           source={require('../../assets/sprites/player.png')} // dummy
           style={{ width: '100%', height: '100%' }}
           contentFit="cover"
         />
      </View>

      {/* 4. Trigger Prompt Bubble (Muncul di atas kepala player) */}
      {promptE && (
         <View style={[styles.promptBubble, { left: player.x - 70, top: player.y - 60 }]}>
            <Text style={styles.promptBubbleText}>[E]</Text>
         </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    backgroundColor: '#94a3b8',
    position: 'absolute',
  },
  player: {
    position: 'absolute',
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    backgroundColor: '#fcd34d', 
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    overflow: 'hidden'
  },
  room: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#475569',
  },
  roomText: {
    color: '#cbd5e1',
    fontSize: 24,
    fontWeight: 'bold',
    opacity: 0.4,
    position: 'absolute',
    bottom: 15,
    right: 20,
  },
  furniture: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 5,
    overflow: 'hidden'
  },
  furnitureText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 2, // Agar tulisan ada di atas sprite
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  alertIcon: {
    fontSize: 28,
    position: 'absolute',
    top: -20,
    right: -15,
    zIndex: 5
  },
  promptBubble: {
    position: 'absolute',
    backgroundColor: '#3b82f6',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    zIndex: 15,
    width: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptBubbleText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 16,
  }
});
