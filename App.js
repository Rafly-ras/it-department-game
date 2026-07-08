import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableOpacity, Text } from 'react-native';

// Constants & Data
import { MAP_WIDTH, MAP_HEIGHT, PLAYER_SIZE, SPEED, TRIGGER_RADIUS, INITIAL_FURNITURES, TICKET_TEMPLATES } from './src/constants/GameData';

// Components
import GameMap from './src/components/GameMap';
import TicketOverlay from './src/components/TicketOverlay';

// Mini Games
import IPConfigGame from './src/minigames/IPConfigGame';
import RAMInstallationGame from './src/minigames/RAMInstallationGame';
import PrinterJamGame from './src/minigames/PrinterJamGame';

// --- FUNGSI HELPER MATEMATIKA ---
const checkCollision = (nextX, nextY, objX, objY, objW, objH) => {
  return (
    nextX < objX + objW &&
    nextX + PLAYER_SIZE > objX &&
    nextY < objY + objH &&
    nextY + PLAYER_SIZE > objY
  );
};

export default function App() {
  const [windowSize, setWindowSize] = useState(Dimensions.get('window'));
  const [player, setPlayer] = useState({ x: 700, y: 700 }); 
  
  const keysPressed = useRef({ w: false, a: false, s: false, d: false, ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false });
  const [promptE, setPromptE] = useState(false); 
  const activeTriggerRef = useRef(null); 
  
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  
  const [furnitures, setFurnitures] = useState(INITIAL_FURNITURES);
  
  // Diberi 2 tiket awal statis berdasarkan ID template
  const [tickets, setTickets] = useState([
    { id: 't1', title: TICKET_TEMPLATES[2].title, targetId: 'rack1', status: 'active' },
    { id: 't2', title: TICKET_TEMPLATES[3].title, targetId: 'desk1', status: 'active' },
  ]);

  const [activeMiniGame, setActiveMiniGame] = useState(null);

  // --- DYNAMIC TICKET SPAWNER ---
  useEffect(() => {
    // Jalankan interval per 30 Detik
    const spawnTimer = setInterval(() => {
       setFurnitures(prevFurn => {
           // Cek objek mana aja yang sedang normal
           const normalObjs = prevFurn.filter(f => f.status === 'normal' || f.status === 'fixed');
           if (normalObjs.length === 0) return prevFurn; // Kalo semua rusak, ga spawn tiket baru

           // Pilih acak 1 objek
           const randomObj = normalObjs[Math.floor(Math.random() * normalObjs.length)];
           
           // Daftarkan ke sistem tiket
           const template = TICKET_TEMPLATES.find(t => t.targetId === randomObj.id) || { title: `Gangguan pada ${randomObj.name}`, targetId: randomObj.id };
           
           setTickets(prevTickets => [
             ...prevTickets,
             { id: 'tick_' + Date.now(), title: template.title, targetId: template.targetId, status: 'active' }
           ]);

           // Bikin objek itu jadi rusak lagi ("broken" / merah)
           return prevFurn.map(f => f.id === randomObj.id ? { ...f, status: 'broken', color: '#ef4444' } : f);
       });
    }, 30000); // 30000 ms = 30 detik

    return () => clearInterval(spawnTimer);
  }, []);

  // --- KEYBOARD LISTENER ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (keysPressed.current.hasOwnProperty(e.key) || Object.keys(keysPressed.current).includes(key)) {
        keysPressed.current[key] = true;
        keysPressed.current[e.key] = true;
      }
      if ((key === 'e') && activeTriggerRef.current && !paused) {
        startMiniGame(activeTriggerRef.current);
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (keysPressed.current.hasOwnProperty(e.key) || Object.keys(keysPressed.current).includes(key)) {
        keysPressed.current[key] = false;
        keysPressed.current[e.key] = false;
      }
    };

    const handleResize = () => setWindowSize(Dimensions.get('window'));

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    Dimensions.addEventListener('change', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [paused]);

  // --- GAME LOOP ---
  useEffect(() => {
    let animationFrameId;

    const gameLoop = () => {
      if (paused) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      const keys = keysPressed.current;
      let dx = 0; let dy = 0;

      if (keys.w || keys.ArrowUp) dy -= SPEED;
      if (keys.s || keys.ArrowDown) dy += SPEED;
      if (keys.a || keys.ArrowLeft) dx -= SPEED;
      if (keys.d || keys.ArrowRight) dx += SPEED;

      if (dx !== 0 && dy !== 0) {
        const length = Math.sqrt(dx * dx + dy * dy);
        dx = (dx / length) * SPEED;
        dy = (dy / length) * SPEED;
      }

      setPlayer((prev) => {
        let newX = prev.x + dx;
        let newY = prev.y + dy;

        if (newX < 0) newX = 0;
        if (newX > MAP_WIDTH - PLAYER_SIZE) newX = MAP_WIDTH - PLAYER_SIZE;
        if (newY < 0) newY = 0;
        if (newY > MAP_HEIGHT - PLAYER_SIZE) newY = MAP_HEIGHT - PLAYER_SIZE;

        let triggerFound = null;

        for (let i = 0; i < furnitures.length; i++) {
          const obj = furnitures[i];
          
          if (checkCollision(newX, prev.y, obj.x, obj.y, obj.w, obj.h)) newX = prev.x;
          if (checkCollision(newX, newY, obj.x, obj.y, obj.w, obj.h)) newY = prev.y;

          const triggerArea = {
            x: obj.x - TRIGGER_RADIUS,
            y: obj.y - TRIGGER_RADIUS,
            w: obj.w + (TRIGGER_RADIUS * 2),
            h: obj.h + (TRIGGER_RADIUS * 2)
          };
          
          if (obj.status === 'broken' && checkCollision(newX, newY, triggerArea.x, triggerArea.y, triggerArea.w, triggerArea.h)) {
            triggerFound = obj.id;
          }
        }

        if (triggerFound !== activeTriggerRef.current) {
          activeTriggerRef.current = triggerFound;
          setPromptE(!!triggerFound);
        }

        return { x: newX, y: newY };
      });

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [paused, furnitures]);

  // --- LOGIKA GAMEPLAY & MINIGAME ---
  const startMiniGame = (furnitureId) => {
    setPaused(true); 
    setActiveMiniGame(furnitureId);
  };

  const closeMiniGame = () => {
    setActiveMiniGame(null);
    setPaused(false); 
  };

  const completeTicket = (targetId) => {
    setFurnitures(prev => prev.map(f => f.id === targetId ? { ...f, status: 'fixed', color: '#22c55e' } : f));
    setTickets(prev => prev.map(t => t.targetId === targetId && t.status === 'active' ? { ...t, status: 'completed' } : t));
    setScore(s => s + 100);
    alert("Ticket Solved! +100 Point"); 
    closeMiniGame(); 
  };

  const renderActiveMiniGame = () => {
    if (activeMiniGame === 'rack1') return <IPConfigGame onComplete={() => completeTicket('rack1')} onClose={closeMiniGame} />;
    if (activeMiniGame === 'desk1') return <RAMInstallationGame onComplete={() => completeTicket('desk1')} onClose={closeMiniGame} />;
    if (activeMiniGame === 'printer1') return <PrinterJamGame onComplete={() => completeTicket('printer1')} onClose={closeMiniGame} />;
    
    // Default fallback untuk objek yang tidak punya minigame spesifik (misal Router)
    if (activeMiniGame === 'router1') {
      return (
         <>
             <Text style={styles.modalTitle}>RESTART ROUTER</Text>
             <Text style={{color: '#fff', fontSize: 16, marginBottom: 20}}>Tekan tombol untuk me-restart modem/router direktur!</Text>
             <TouchableOpacity style={{backgroundColor: '#3b82f6', padding: 15, borderRadius: 8, width: 200, alignItems:'center'}} onPress={() => completeTicket('router1')}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>RESTART NETWORK</Text>
             </TouchableOpacity>
             <TouchableOpacity style={{marginTop: 20}} onPress={closeMiniGame}><Text style={{color: '#ef4444'}}>Batal</Text></TouchableOpacity>
         </>
      )
    }

    return null;
  };

  const cameraOffsetX = windowSize.width / 2 - (player.x + PLAYER_SIZE / 2);
  const cameraOffsetY = windowSize.height / 2 - (player.y + PLAYER_SIZE / 2);

  return (
    <View style={styles.container}>
      <GameMap 
         cameraOffsetX={cameraOffsetX}
         cameraOffsetY={cameraOffsetY}
         furnitures={furnitures}
         player={player}
         promptE={promptE}
      />

      <TicketOverlay score={score} tickets={tickets} />

      {promptE && !paused && (
        <TouchableOpacity style={styles.promptEBtn} onPress={() => startMiniGame(activeTriggerRef.current)}>
          <Text style={styles.promptEText}>[E] Perbaiki Perangkat</Text>
        </TouchableOpacity>
      )}

      {/* MODAL WRAPPER UMUM */}
      <Modal visible={paused && activeMiniGame !== null} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
             {renderActiveMiniGame()}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', overflow: 'hidden' },
  promptEBtn: { position: 'absolute', bottom: '15%', alignSelf: 'center', backgroundColor: '#3b82f6', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 30, borderWidth: 4, borderColor: '#bfdbfe' },
  promptEText: { color: 'white', fontWeight: '900', fontSize: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', maxWidth: 500, backgroundColor: '#1e293b', borderRadius: 16, padding: 30, alignItems: 'center', borderWidth: 3, borderColor: '#3b82f6' },
  modalTitle: { color: '#38bdf8', fontSize: 26, fontWeight: '900', marginBottom: 15, textAlign: 'center' },
});
