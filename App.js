import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants & Data
import { MAP_WIDTH, MAP_HEIGHT, PLAYER_SIZE, SPEED, TRIGGER_RADIUS, INITIAL_FURNITURES, TICKET_TEMPLATES, TICKET_LIFESPAN } from './src/constants/GameData';

// Components
import GameMap from './src/components/GameMap';
import TicketOverlay from './src/components/TicketOverlay';
import VirtualDPad from './src/components/VirtualDPad';
import ITShopModal from './src/components/ITShopModal';

// Mini Games
import IPConfigGame from './src/minigames/IPConfigGame';
import RAMInstallationGame from './src/minigames/RAMInstallationGame';
import PrinterJamGame from './src/minigames/PrinterJamGame';

// Utils
import { playAlarmSound, playSuccessSound, playGameOverSound } from './src/utils/soundManager';

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
  const [playerDir, setPlayerDir] = useState('up'); // arah depan ('up')

  const keysPressed = useRef({ w: false, a: false, s: false, d: false, ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false, e: false });
  const [promptE, setPromptE] = useState(false); 
  const activeTriggerRef = useRef(null); 
  
  const [paused, setPaused] = useState(false);
  const [furnitures, setFurnitures] = useState(INITIAL_FURNITURES);
  const [tickets, setTickets] = useState([]);
  const [activeMiniGame, setActiveMiniGame] = useState(null);

  // --- SISTEM EKONOMI & PENALTI ---
  const [money, setMoney] = useState(500); 
  const [stressLevel, setStressLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);
  
  const [upgrades, setUpgrades] = useState({ fastWalk: false, ipTolerance: false, fasterRam: false });

  // Data Pemuat (On Mount)
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedScore = await AsyncStorage.getItem('@high_score');
        if (storedScore !== null) {
          setHighScore(parseInt(storedScore));
        }
      } catch (e) { console.error("Gagal load storage", e); }
    };
    loadData();
  }, []);

  const calculateSpeed = () => upgrades.fastWalk ? 15 : SPEED;

  // --- DYNAMIC TICKET SPAWNER ---
  useEffect(() => {
    if (gameOver) return;

    const spawnTimer = setInterval(() => {
       setFurnitures(prevFurn => {
           const normalObjs = prevFurn.filter(f => f.status === 'normal');
           if (normalObjs.length === 0) return prevFurn;
           
           const randomObj = normalObjs[Math.floor(Math.random() * normalObjs.length)];
           const template = TICKET_TEMPLATES.find(t => t.targetId === randomObj.id) || { title: `Gangguan ${randomObj.name}`, targetId: randomObj.id };
           
           setTickets(prevTickets => [
             ...prevTickets,
             { id: 'tick_' + Date.now(), title: template.title, targetId: template.targetId, status: 'active', createdAt: Date.now() }
           ]);

           playAlarmSound(); // Trigger Alarm

           return prevFurn.map(f => f.id === randomObj.id ? { ...f, status: 'broken', color: '#ef4444' } : f);
       });
    }, 20000); 

    const checkTimer = setInterval(() => {
       const now = Date.now();
       setTickets(prevTickets => {
         let newTickets = [...prevTickets];
         let penalty = 0;
         
         newTickets.forEach((t) => {
           if (t.status === 'active' && (now - t.createdAt) > TICKET_LIFESPAN) {
             t.status = 'expired';
             penalty += 25; 
             
             setFurnitures(prev => prev.map(f => f.id === t.targetId ? { ...f, status: 'normal', color: '#3b82f6' } : f));
           }
         });
         
         if (penalty > 0) {
            setStressLevel(prev => {
              const res = prev + penalty;
              if (res >= 100) triggerGameOver(); 
              return res;
            });
         }
         
         return newTickets.filter(t => t.status !== 'expired');
       });
    }, 1000);

    return () => { clearInterval(spawnTimer); clearInterval(checkTimer); }
  }, [gameOver]);

  const triggerGameOver = async () => {
    setGameOver(true);
    playGameOverSound();
    
    // Cek High Score
    if (money > highScore) {
      setHighScore(money);
      setIsNewRecord(true);
      try {
        await AsyncStorage.setItem('@high_score', money.toString());
      } catch (e) {
        console.error("Gagal save storage", e);
      }
    } else {
      setIsNewRecord(false);
    }
  };

  // --- KEYBOARD & JOYSTICK LISTENER ---
  const handleKeyIn = (key) => {
    if (gameOver) return;
    const k = key.toLowerCase();
    if (keysPressed.current.hasOwnProperty(key) || Object.keys(keysPressed.current).includes(k)) {
      keysPressed.current[k] = true;
      keysPressed.current[key] = true;
    }
    if (k === 'e' && activeTriggerRef.current && !paused) {
      startInteraction(activeTriggerRef.current);
    }
  }

  const handleKeyOut = (key) => {
    const k = key.toLowerCase();
    if (keysPressed.current.hasOwnProperty(key) || Object.keys(keysPressed.current).includes(k)) {
      keysPressed.current[k] = false;
      keysPressed.current[key] = false;
    }
  }

  useEffect(() => {
    const onKeyD = (e) => handleKeyIn(e.key);
    const onKeyU = (e) => handleKeyOut(e.key);
    const onResize = () => setWindowSize(Dimensions.get('window'));

    window.addEventListener('keydown', onKeyD);
    window.addEventListener('keyup', onKeyU);
    Dimensions.addEventListener('change', onResize);
    return () => {
      window.removeEventListener('keydown', onKeyD);
      window.removeEventListener('keyup', onKeyU);
    };
  }, [paused, gameOver]);

  // --- GAME LOOP ---
  useEffect(() => {
    let animationFrameId;
    const gameLoop = () => {
      if (paused || gameOver) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      const keys = keysPressed.current;
      let dx = 0; let dy = 0;
      let newDir = playerDir;
      const currentSpeed = calculateSpeed();

      if (keys.w || keys.ArrowUp) { dy -= currentSpeed; newDir = 'up'; }
      if (keys.s || keys.ArrowDown) { dy += currentSpeed; newDir = 'down'; }
      if (keys.a || keys.ArrowLeft) { dx -= currentSpeed; newDir = 'left'; }
      if (keys.d || keys.ArrowRight) { dx += currentSpeed; newDir = 'right'; }

      if (dx !== 0 && dy !== 0) {
        const length = Math.sqrt(dx * dx + dy * dy);
        dx = (dx / length) * currentSpeed;
        dy = (dy / length) * currentSpeed;
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
          
          if ((obj.status === 'broken' || obj.status === 'shop') && checkCollision(newX, newY, triggerArea.x, triggerArea.y, triggerArea.w, triggerArea.h)) {
            triggerFound = obj.id;
          }
        }

        if (triggerFound !== activeTriggerRef.current) {
          activeTriggerRef.current = triggerFound;
          setPromptE(!!triggerFound);
        }

        return { x: newX, y: newY };
      });

      if (newDir !== playerDir) setPlayerDir(newDir);

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [paused, furnitures, gameOver, upgrades, playerDir]);

  // --- LOGIKA MINIGAME ---
  const startInteraction = (furnitureId) => {
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
    
    setMoney(s => s + 100);
    setStressLevel(s => Math.max(0, s - 10)); 
    playSuccessSound(); // Mainkan nada success

    closeMiniGame(); 
  };

  const handleBuyUpgrade = (upgradeId, price) => {
    if (money >= price) {
      setMoney(m => m - price);
      setUpgrades(u => ({ ...u, [upgradeId]: true }));
      playSuccessSound();
    }
  };

  const resetGame = () => {
     setGameOver(false);
     setStressLevel(0);
     setMoney(0); // Roguelike wipe
     setUpgrades({ fastWalk: false, ipTolerance: false, fasterRam: false });
     setTickets([]);
     setFurnitures(INITIAL_FURNITURES);
     setPlayer({ x: 700, y: 700 });
     setIsNewRecord(false);
  };

  const renderActiveMiniGame = () => {
    if (activeMiniGame === 'basecamp') return <ITShopModal money={money} upgrades={upgrades} onBuy={handleBuyUpgrade} onClose={closeMiniGame} />;
    if (activeMiniGame === 'rack1') return <IPConfigGame onComplete={() => completeTicket('rack1')} onClose={closeMiniGame} toleranceUpgrade={upgrades.ipTolerance} />;
    if (activeMiniGame === 'desk1') return <RAMInstallationGame onComplete={() => completeTicket('desk1')} onClose={closeMiniGame} fasterUpgrade={upgrades.fasterRam} />;
    if (activeMiniGame === 'printer1') return <PrinterJamGame onComplete={() => completeTicket('printer1')} onClose={closeMiniGame} />;
    if (activeMiniGame === 'router1') return (
         <>
             <Text style={styles.modalTitle}>RESTART ROUTER</Text>
             <TouchableOpacity style={{backgroundColor: '#3b82f6', padding: 15, borderRadius: 8, width: 200, alignItems:'center'}} onPress={() => completeTicket('router1')}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>RESTART NETWORK</Text>
             </TouchableOpacity>
             <TouchableOpacity style={{marginTop: 20}} onPress={closeMiniGame}><Text style={{color: '#ef4444'}}>Batal</Text></TouchableOpacity>
         </>
    )
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
         playerDir={playerDir}
         promptE={promptE}
      />

      <TicketOverlay money={money} highScore={highScore} tickets={tickets} stressLevel={stressLevel} />

      <VirtualDPad onKeyPress={handleKeyIn} onKeyRelease={handleKeyOut} />

      {promptE && !paused && !gameOver && (
        <TouchableOpacity style={styles.promptEBtn} onPress={() => startInteraction(activeTriggerRef.current)}>
          <Text style={styles.promptEText}>[E] Interaksi</Text>
        </TouchableOpacity>
      )}

      {/* MODAL MINIGAMES / TOKO */}
      <Modal visible={paused && activeMiniGame !== null && !gameOver} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
             {renderActiveMiniGame()}
          </View>
        </View>
      </Modal>

      {/* MODAL GAME OVER */}
      <Modal visible={gameOver} transparent={true} animationType="slide">
         <View style={[styles.modalOverlay, {backgroundColor: 'rgba(153, 27, 27, 0.95)'}]}>
            <Text style={{color: '#fca5a5', fontSize: 60, fontWeight: '900', textAlign: 'center'}}>GAME OVER</Text>
            <Text style={{color: 'white', fontSize: 24, marginTop: 10, width:'80%', textAlign:'center'}}>STRESS LEVEL BOSS MENCAPAI 100%. LU DIPECAT!</Text>
            
            {isNewRecord && (
                <Text style={{color: '#fbbf24', fontSize: 32, fontWeight: 'bold', marginTop: 20, animation: 'bounce'}}>🏆 REKOR BARU: ${highScore} 🏆</Text>
            )}

            <TouchableOpacity style={{backgroundColor: '#fff', padding: 20, borderRadius: 10, marginTop: 50}} onPress={resetGame}>
               <Text style={{color: '#991b1b', fontSize: 20, fontWeight: 'bold'}}>CARI KERJAAN BARU (RESTART)</Text>
            </TouchableOpacity>
         </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', overflow: 'hidden' },
  promptEBtn: { position: 'absolute', bottom: '25%', alignSelf: 'center', backgroundColor: '#3b82f6', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 30, borderWidth: 4, borderColor: '#bfdbfe' },
  promptEText: { color: 'white', fontWeight: '900', fontSize: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  modalContent: { width: '85%', maxWidth: 500, backgroundColor: '#1e293b', borderRadius: 16, padding: 30, alignItems: 'center', borderWidth: 3, borderColor: '#3b82f6' },
  modalTitle: { color: '#38bdf8', fontSize: 26, fontWeight: '900', marginBottom: 15, textAlign: 'center' },
});
