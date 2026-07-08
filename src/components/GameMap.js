import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Image } from 'expo-image';
import { MAP_WIDTH, MAP_HEIGHT, PLAYER_SIZE, ROOMS } from '../constants/GameData';

// Objek 3D Semu - Flat Isometric
const IsometricFloor = ({ room }) => (
  <View style={[
    styles.room,
    { left: room.x, top: room.y, width: room.w, height: room.h }
  ]}>
    {room.texture && (
      <Image 
        source={room.texture} 
        style={{ ...StyleSheet.absoluteFillObject, opacity: 0.7 }} 
        contentFit="cover" 
      />
    )}
    {/* Teks di lantai, dibiarkan rata (flat) dengan tanah */}
    <Text style={[styles.roomText, { transform: [{rotateZ: '-45deg'}], bottom: 40, right: 40 }]}>
       {room.name}
    </Text>
  </View>
);

// Objek Berdiri (Billboard Counter-Rotation)
const IsometricObject = ({ obj, isPlayer, playerDir, promptE }) => {
  const isBroken = obj.status === 'broken';
  const isShop = obj.status === 'shop';
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let anim;
    if (isBroken || isShop) {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, { toValue: 0.2, duration: isShop ? 1000 : 300, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 1, duration: isShop ? 1000 : 300, useNativeDriver: true })
        ])
      );
      anim.start();
    } else {
      fadeAnim.setValue(1);
    }
    return () => { if (anim) anim.stop(); };
  }, [isBroken, isShop]);

  // Transformasi Billboard: berlawanan arah dari putaran lantai agar objek tampak "Berdiri" tegak lurus kamera
  const billboardTransform = [
    { rotateZ: '-45deg' },
    { rotateX: '-60deg' } 
  ];

  if (isPlayer) {
    // Render Player
    // Mengubah rotasi panah arah berdasarkan wasd pada grid cartesian
    const getDirDeg = () => {
      switch(playerDir) {
         case 'up': return '45deg';     // -Y = Top Right
         case 'right': return '135deg'; // +X = Bottom Right
         case 'down': return '-135deg'; // +Y = Bottom Left (atau 225deg)
         case 'left': return '-45deg';  // -X = Top Left
         default: return '0deg';
      }
    };

    return (
      <View style={[
         styles.player, 
         { left: obj.x, top: obj.y, zIndex: Math.floor(obj.x + obj.y) }
      ]}>
         {/* Bayangan di tanah (Flat) */}
         <View style={{ width: PLAYER_SIZE, height: PLAYER_SIZE, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, transform: [{scaleY: 0.5}] }} />
         
         {/* Badan Berdiri (Billboard) */}
         <View style={[styles.billboardContainer, { transform: billboardTransform }]}>
            <View style={{ width: PLAYER_SIZE, height: PLAYER_SIZE * 1.5, backgroundColor: '#38bdf8', borderRadius: 8, borderWidth: 2, borderColor: '#fff' }} />
            {/* Panah arah */}
            <View style={[styles.directionArrow, {transform: [{rotate: getDirDeg()}]}]}>
              <Text style={styles.arrowText}>▲</Text>
            </View>
         </View>

         {promptE && (
           <View style={[styles.promptBubble, { transform: billboardTransform, top: -80, left: 20 }]}>
              <Text style={styles.promptBubbleText}>💡 Tekan [E] untuk</Text>
              <Text style={styles.promptBubbleTextAction}>{promptE.title}</Text>
              <View style={styles.promptBubbleTail} />
           </View>
         )}
      </View>
    );
  }

  // Render Furnitur
  // Ketinggian rak dibuat ilusi tinggi
  const heightMultiplier = obj.id.includes('rack') || obj.id.includes('gudang') ? 2 : 1;
  const renderH = obj.h * heightMultiplier;

  return (
    <Animated.View style={[
      styles.furnitureBase, 
      { 
        left: obj.x, top: obj.y, width: obj.w, height: obj.h,
        zIndex: Math.floor(obj.x + obj.y)
      }
    ]}>
      {/* Bayangan di lantai */}
      <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)' }} />
      
      {/* Mesh Berdiri (Billboard) - Ditarik ke atas berlawanan arah jarum transform */}
      <Animated.View style={[
         styles.billboardContainer, 
         { transform: billboardTransform, opacity: fadeAnim }
      ]}>
        {/* Balok 2D bergaya prisma */}
         <View style={{ width: obj.w, height: renderH, backgroundColor: obj.color, borderWidth: 2, borderColor: isBroken ? '#ef4444' : '#64748b', borderTopWidth: 8, borderTopColor: '#94a3b8', borderRadius: 4, elevation: 15, shadowColor: isBroken ? '#ef4444' : '#000', shadowOpacity: 1, shadowRadius: 20 }}>
            {/* Garis-garis estetika cyber */}
            <View style={{width: '100%', height: 2, backgroundColor: '#000', marginTop: 10, opacity: 0.5}}/>
            <View style={{width: '100%', height: 2, backgroundColor: '#000', marginTop: 10, opacity: 0.5}}/>
         </View>

         {/* Label Nama Objek Hovering */}
         <Text style={styles.furnitureText}>{obj.name}</Text>
         {isBroken && <Text style={styles.alertIcon}>⚠️</Text>}
         {isShop && <Text style={[styles.alertIcon, {color: '#facc15'}]}>$</Text>}
      </Animated.View>
    </Animated.View>
  );
};

export default function GameMap({ cameraOffsetX, cameraOffsetY, furnitures, player, promptE, playerDir, windowSize }) {
  // PENGURUTAN Z-INDEX (Depth Sorting untuk Pseudo 3D Isometric)
  // Objek paling ujung atas digambar duluan. Objek di bawah menutupi atasnya.
  const allObjects = [
     { ...player, isPlayer: true, id: 'player1' },
     ...furnitures
  ].sort((a, b) => (a.y + a.x) - (b.y + b.x));

  // TRANSLASI KAMERA ISOMETRIK EKSKUSIF KITA
  // Di Engine ini kita memutar entire Map Plane sejauh RotateX 60 dan RotateZ 45.
  // Pusat Plane ada di tengah. Kita harus melakukan Screen-Space Translation yang akurat.
  const ISO_SCALE_Y = 0.5; // Efek cos(60deg)
  const ISO_SCALE_X = 0.707; // Efek sin(45deg)
  
  // Posisi Cartesian The Player
  const px = player.x + PLAYER_SIZE / 2;
  const py = player.y + PLAYER_SIZE / 2;
  
  // Pusat Peta (Titik putar pivot)
  const cx = MAP_WIDTH / 2;
  const cy = MAP_HEIGHT / 2;

  // Jarak Absolut Center ke Player (dalam Cartesian)
  const dx = px - cx;
  const dy = py - cy;

  // Konversi ke Koordinat Layar Setelah Bidang Diputar
  // Memutar matriks 45 derajat (Z) lalu memipihkan 60 derajat (X)
  const screenDx = (dx - dy) * Math.cos(Math.PI / 4);
  const screenDy = (dx + dy) * Math.sin(Math.PI / 4) * Math.cos(Math.PI / 3);

  // Pusatkan layar dengan mengurangi Screen Space Player
  const finalCamX = (windowSize.width / 2) - screenDx;
  const finalCamY = (windowSize.height / 2) - screenDy;

  return (
    <View style={styles.cameraWrapper}>
        <View style={[
        styles.masterIsoPlane, 
        { 
            width: MAP_WIDTH, height: MAP_HEIGHT,
            // Memindahkan Map Center ke Center Layar, lalu dipotong oleh pergerakan Isometrik
            left: '50%', top: '50%',
            marginLeft: -MAP_WIDTH / 2, marginTop: -MAP_HEIGHT / 2,
            transform: [
               { translateX: screenDx * -1 },
               { translateY: screenDy * -1 },
               { rotateX: '60deg' },
               { rotateZ: '45deg' }
            ]
        }
        ]}>
        
        {/* Layer 0: Tanah & Ruangan */}
        {ROOMS.map(room => <IsometricFloor key={room.id} room={room} />)}

        {/* Layer 1: Entitas 3D Sorted Z-Index */}
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
    // Menghindari clipping overflow akibat putaran 3D
    overflow: 'visible'
  },
  
  room: { position: 'absolute', borderWidth: 4, borderColor: '#334155', backgroundColor: '#0f172a' },
  roomText: { color: '#475569', fontSize: 24, fontFamily: 'monospace', fontWeight: '900', opacity: 0.8, position: 'absolute' },
  
  furnitureBase: { position: 'absolute' },
  billboardContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center' },
  
  player: { position: 'absolute', width: PLAYER_SIZE, height: PLAYER_SIZE, justifyContent:'center', alignItems:'center' },
  directionArrow: { position: 'absolute', top: -15, zIndex: 20 },
  arrowText: { color: '#ef4444', fontSize: 24, fontWeight: '900', textShadowColor: '#fca5a5', textShadowRadius: 5 },
  
  furnitureText: { color: '#fff', fontSize: 10, fontFamily: 'monospace', fontWeight: 'bold', textAlign: 'center', padding: 4, backgroundColor: 'rgba(0,0,0,0.8)', position: 'absolute', top: -20, borderWidth: 1, borderColor: '#475569', borderRadius: 4 },
  alertIcon: { fontSize: 36, position: 'absolute', top: -50, zIndex: 30, textShadowColor: '#000', textShadowRadius: 10 },
  
  promptBubble: { 
    position: 'absolute', backgroundColor: '#1e293b', borderRadius: 8, 
    paddingHorizontal: 12, paddingVertical: 8, zIndex: 110,
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
