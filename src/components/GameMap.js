import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Image } from 'expo-image';
import { MAP_WIDTH, MAP_HEIGHT, PLAYER_SIZE, WALLS } from '../constants/GameData';


const IsometricObject = ({ obj, isPlayer, playerDir, promptE }) => {
  const isBroken = obj.status === 'broken';
  const isShop = obj.status === 'shop';
  const isWall = obj.id.includes('wall');
  const fadeAnim = useRef(new Animated.Value(1)).current;


  useEffect(() => {
    let anim;
    if (isBroken || isShop) {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, { toValue: 0.6, duration: isShop ? 1000 : 300, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 1, duration: isShop ? 1000 : 300, useNativeDriver: true })
        ])
      );
      anim.start();
    } else {
      fadeAnim.setValue(1);
    }
    return () => { if (anim) anim.stop(); };
  }, [isBroken, isShop]);

  if (isPlayer) {
    const imgSrc = require('../../assets/sprites/player_idle.png'); 
    
    return (
      <View style={[
         styles.player, 
         // Y-Sorting (Z-index berdasarkan alas/kaki)
         { left: obj.x, top: obj.y, zIndex: Math.floor(obj.y + PLAYER_SIZE + obj.x + PLAYER_SIZE) }
      ]}>
         {/* Shadow Bulat di Tanah (Biar tidak terlihat melayang) */}
         <View style={{ position: 'absolute', width: PLAYER_SIZE, height: PLAYER_SIZE, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, transform: [{scaleY: 0.5}], bottom: 0 }} />
         
         <View style={styles.billboardContainer}>
            <Image 
              source={imgSrc} 
              style={{ width: PLAYER_SIZE * 1.5, height: PLAYER_SIZE * 2 }} 
              contentFit="contain" 
            />
         </View>


         {/* Papan Prompt 3D Flat di Atas Kepala */}
         {promptE && (
           <View style={[styles.promptBubble, { top: -80, left: 10 }]}>
              <Text style={styles.promptBubbleText}>💡 Tekan [E] untuk</Text>
              <Text style={styles.promptBubbleTextAction}>{promptE.title}</Text>
              <View style={styles.promptBubbleTail} />
           </View>
         )}

      </View>
    );
  }

  // Pilih sprite bersih atau rusak berdasarkan status 'broken' (ticket active)
  const imgSrc = isBroken ? obj.imageError : obj.imageNormal;
  
  return (
    <View style={[
      styles.furnitureBase, 
      { 
        left: obj.x, top: obj.y, width: obj.w, height: obj.h,
        zIndex: Math.floor(obj.y + obj.h + obj.x + obj.w)
      }
    ]}>
        {/* Render Gambar MURNI 2.5D TANPA TransformCSS Aneh-aneh */}
        <Animated.View style={[
          styles.billboardContainer, 
          { opacity: fadeAnim }
        ]}>
           {imgSrc && (
              <Image 
                source={imgSrc} 
                style={{ width: Math.max(obj.w, obj.h) * 1.5, height: Math.max(obj.w, obj.h) * 2 }} 
                contentFit="contain" 
              />
           )}
        </Animated.View>
        
        {/* Label Teks Billboard - Boks Hitam Tegak Lurus */}
        {!isWall && obj.name && (
           <View style={styles.furnitureTextContainer}>
              <Text style={styles.furnitureText}>{obj.name}</Text>
           </View>
        )}
    </View>
  );
};

export default function GameMap({ furnitures, player, promptE, playerDir, windowSize }) {
  // Y-SORTING Z-INDEX (Depth Sorting Mutlak Isometrik)
  // Objek disusun rapat secara dinamis dari atas-belakang ke depan-bawah
  const allObjects = [
     { ...player, isPlayer: true, id: 'player1', w: PLAYER_SIZE, h: PLAYER_SIZE },
     ...furnitures,
     ...WALLS
  ].sort((a, b) => (a.y + a.h + a.x + a.w) - (b.y + b.h + b.x + b.w));

  const px = player.x + PLAYER_SIZE / 2;
  const py = player.y + PLAYER_SIZE / 2;
  
  const cx = MAP_WIDTH / 2;
  const cy = MAP_HEIGHT / 2;

  const dx = px - cx;
  const dy = py - cy;

  return (
    <View style={styles.cameraWrapper}>
        <View style={[
        styles.masterIsoPlane, 
        { 
            width: MAP_WIDTH, height: MAP_HEIGHT,
            left: '50%', top: '50%',
            marginLeft: -MAP_WIDTH / 2, marginTop: -MAP_HEIGHT / 2,
            transform: [
               { translateX: dx * -1 },
               { translateY: dy * -1 }
            ]
        }
        ]}>
        
        {/* Render Map Background Utuh (2D / Mockup Image) */}
        {/* try/catch logic is handled by React Native automatically. If not found, will fail gracefully or show redbox during dev */}
        <Image 
           source={require('../../assets/sprites/office_map.png')} 
           style={{ width: MAP_WIDTH, height: MAP_HEIGHT, position: 'absolute', left: 0, top: 0 }} 
           contentFit="cover" 
        />

        {/* Render Entity yang Bersifat Dinamis Z-Index */}
        {allObjects.map(obj => (
            <IsometricObject 
               key={obj.id} 
               obj={obj} 
               isPlayer={obj.isPlayer} 
               playerDir={playerDir} 
               promptE={obj.isPlayer ? promptE : null} 
            />
        ))}

        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraWrapper: { flex: 1, backgroundColor: '#0f172a', position: 'relative' },
  masterIsoPlane: { 
    position: 'absolute', 
    backgroundColor: '#020617',
    borderWidth: 5, borderColor: '#334155',
    overflow: 'visible'
  },
  
  room: { position: 'absolute', borderWidth: 4, borderColor: 'rgba(56, 189, 248, 0.4)', backgroundColor: '#0f172a' },
  
  furnitureBase: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  player: { position: 'absolute', width: PLAYER_SIZE, height: PLAYER_SIZE, justifyContent:'center', alignItems:'center' },
  billboardContainer: { position: 'absolute', bottom: 0, alignItems: 'center', justifyContent: 'flex-end', width: '100%', height: '100%' },
  
  furnitureTextContainer: {
    position: 'absolute',
    top: -80, // Mengangkat label teks jauh di atas gambar furniturnya
    minWidth: 120, 
    backgroundColor: 'rgba(2, 6, 23, 0.85)', 
    borderWidth: 1.5, borderColor: '#00ffff', 
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#00ffff',
    shadowOpacity: 0.8,
    shadowRadius: 5,
    zIndex: 50
  },
  furnitureText: { 
    color: '#f8fafc', fontSize: 13, fontFamily: 'monospace', fontWeight: '900', textAlign: 'center', letterSpacing: 1
  },
  
  promptBubble: { 
    position: 'absolute', backgroundColor: '#1e293b', borderRadius: 8, 
    paddingHorizontal: 12, paddingVertical: 8, zIndex: 200,
    borderWidth: 2, borderColor: '#fff',
    shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 5, elevation: 15,
    minWidth: 180, alignItems: 'center'
  },
  promptBubbleTail: {
    position: 'absolute', bottom: -8, left: '50%', marginLeft: -6,
    width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8,
    borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#fff'
  },
  promptBubbleText: { color: '#f8fafc', fontFamily: 'monospace', fontSize: 11, fontWeight: 'bold' },
  promptBubbleTextAction: { color: '#4ade80', fontFamily: 'monospace', fontSize: 12, fontWeight: '900', marginTop: 2 }
});
