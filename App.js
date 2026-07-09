import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants & Data
import { MAP_WIDTH, MAP_HEIGHT, PLAYER_SIZE, SPEED, TRIGGER_RADIUS, INITIAL_FURNITURES, WALLS, TICKET_TEMPLATES, TICKET_LIFESPAN } from './src/constants/GameData';

// Components
import GameMap from './src/components/GameMap';
import TicketOverlay from './src/components/TicketOverlay';
import VirtualDPad from './src/components/VirtualDPad';
import ITShopModal from './src/components/ITShopModal';
import MainMenu from './src/components/MainMenu';

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
  const [gameState, setGameState] = useState('MENU'); // 'MENU' | 'PLAYING'
  const [windowSize, setWindowSize] = useState(Dimensions.get('window'));
  const [player, setPlayer] = useState({ x: 500, y: 500 }); 
  const [playerDir, setPlayerDir] = useState('up'); 

  const keysPressed = useRef({ w: false, a: false, s: false, d: false, ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false, e: false });
  const [promptE, setPromptE] = useState(false); 
  const activeTriggerRef = useRef(null); 
  
  const [paused, setPaused] = useState(false);
  const [furnitures, setFurnitures] = useState(INITIAL_FURNITURES);
  const [tickets, setTickets] = useState([]);
  const [activeMiniGame, setActiveMiniGame] = useState(null);

  const [money, setMoney] = useState(500); 
  const [stressLevel, setStressLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);
  
  const [upgrades, setUpgrades] = useState({ fastWalk: false, ipTolerance: false, fasterRam: false });

  // Data Pemuat
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedScore = await AsyncStorage.getItem('@high_score');
        if (storedScore !== null) setHighScore(parseInt(storedScore));
      } catch (e) {}
    };
    loadData();
  }, []);

  const calculateSpeed = () => upgrades.fastWalk ? 15 : SPEED;

  // --- DYNAMIC TICKET SPAWNER ---
  useEffect(() => {
    if (gameOver || gameState !== 'PLAYING') return;

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

           playAlarmSound(); 
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
  }, [gameOver, gameState]);

  const triggerGameOver = async () => {
    setGameOver(true);
    playGameOverSound();
    
    if (money > highScore) {
      setHighScore(money);
      setIsNewRecord(true);
      try { await AsyncStorage.setItem('@high_score', money.toString()); } catch (e) {}
    } else {
      setIsNewRecord(false);
    }
  };

  // --- CONTROLLER ---
  const handleKeyIn = (e) => {
    if (gameOver || gameState !== 'PLAYING') return;
    const k = typeof e === 'string' ? e : e.key;
    const lower = k.toLowerCase();
    keysPressed.current[k] = true;
    keysPressed.current[lower] = true;
    
    if (lower === 'e' && activeTriggerRef.current && !paused) {
      startInteraction(activeTriggerRef.current);
    }
  }
  const handleKeyOut = (e) => {
    const k = typeof e === 'string' ? e : e.key;
    const lower = k.toLowerCase();
    keysPressed.current[k] = false;
    keysPressed.current[lower] = false;
  }

  useEffect(() => {
    const onResize = () => setWindowSize(Dimensions.get('window'));
    window.addEventListener('keydown', handleKeyIn);
    window.addEventListener('keyup', handleKeyOut);
    Dimensions.addEventListener('change', onResize);
    return () => {
      window.removeEventListener('keydown', handleKeyIn);
      window.removeEventListener('keyup', handleKeyOut);
      Dimensions.removeEventListener('change', onResize);
    };
  }, [paused, gameOver, gameState]);

  // --- GAME LOOP ---
  useEffect(() => {
    let animationFrameId;
    const gameLoop = () => {
      if (paused || gameOver || gameState !== 'PLAYING') {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      const keys = keysPressed.current;
      let dx = 0; let dy = 0;
      let newDir = playerDir;
      const currentSpeed = calculateSpeed();

      if (keys.w || keys.ArrowUp || keys.arrowup) { dy -= currentSpeed; newDir = 'up'; }
      if (keys.s || keys.ArrowDown || keys.arrowdown) { dy += currentSpeed; newDir = 'down'; }
      if (keys.a || keys.ArrowLeft || keys.arrowleft) { dx -= currentSpeed; newDir = 'left'; }
      if (keys.d || keys.ArrowRight || keys.arrowright) { dx += currentSpeed; newDir = 'right'; }

      if (dx !== 0 && dy !== 0) {
        const length = Math.sqrt(dx * dx + dy * dy);
        dx = (dx / length) * currentSpeed;
        dy = (dy / length) * currentSpeed;
      }

      let triggerFound = null;

      setPlayer((prev) => {
        let newX = prev.x + dx;
        let newY = prev.y + dy;

        if (newX < 0) newX = 0;
        if (newX > MAP_WIDTH - PLAYER_SIZE) newX = MAP_WIDTH - PLAYER_SIZE;
        if (newY < 0) newY = 0;
        if (newY > MAP_HEIGHT - PLAYER_SIZE) newY = MAP_HEIGHT - PLAYER_SIZE;

        // Collision for furnitures
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
        
        // Collision for WALLS
        for (let i = 0; i < WALLS.length; i++) {
          const wall = WALLS[i];
          if (checkCollision(newX, prev.y, wall.x, wall.y, wall.w, wall.h)) newX = prev.x;
          if (checkCollision(newX, newY, wall.x, wall.y, wall.w, wall.h)) newY = prev.y;
        }

        if (newX === prev.x && newY === prev.y) {
           return prev; // Mencegah freeze React re-render looping object yang sama!
        }
        return { x: newX, y: newY };
      });

      if (triggerFound !== activeTriggerRef.current) {
        activeTriggerRef.current = triggerFound;
        if (triggerFound) {
           const found = furnitures.find(f => f.id === triggerFound);
           let title = "Interaksi";
           if(found.status === 'shop') title = "Buka Toko";
           else if (found.status === 'broken') title = `Perbaiki ${found.name}`;
           setPromptE({ id: triggerFound, title });
        } else {
           setPromptE(null);
        }
      }

      if (newDir !== playerDir) setPlayerDir(newDir);
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [paused, furnitures, gameOver, upgrades, playerDir, gameState]);

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
    playSuccessSound(); 
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
     setMoney(0); 
     setUpgrades({ fastWalk: false, ipTolerance: false, fasterRam: false });
     setTickets([]);
     setFurnitures(INITIAL_FURNITURES);
     setPlayer({ x: 500, y: 500 });
     setIsNewRecord(false);
     setGameState('MENU'); // Balik ke menu
  };

  const renderActiveMiniGame = () => {
    if (activeMiniGame === 'basecamp') return <ITShopModal money={money} upgrades={upgrades} onBuy={handleBuyUpgrade} onClose={closeMiniGame} />;
    if (activeMiniGame === 'rack1') return <IPConfigGame onComplete={() => completeTicket('rack1')} onClose={closeMiniGame} toleranceUpgrade={upgrades.ipTolerance} />;
    if (activeMiniGame === 'desk1') return <RAMInstallationGame onComplete={() => completeTicket('desk1')} onClose={closeMiniGame} fasterUpgrade={upgrades.fasterRam} />;
    if (activeMiniGame === 'printer1') return <PrinterJamGame onComplete={() => completeTicket('printer1')} onClose={closeMiniGame} />;
    if (activeMiniGame === 'router1') return (
         <>
             <Text style={styles.modalTitle}>SYS_REBOOT_REQUIRED</Text>
             <TouchableOpacity style={{backgroundColor: '#3b82f6', padding: 15, width: 200, alignItems:'center', borderWidth:1, borderColor:'#fff'}} onPress={() => completeTicket('router1')}>
                <Text style={{color: 'white', fontWeight: 'bold', fontFamily:'monospace'}}>[ EXECUTE RESTART ]</Text>
             </TouchableOpacity>
             <TouchableOpacity style={{marginTop: 20}} onPress={closeMiniGame}><Text style={{color: '#ef4444', fontFamily:'monospace'}}>[ ABORT ]</Text></TouchableOpacity>
         </>
    );
    if (activeMiniGame === 'projector1') return (
         <>
             <Text style={styles.modalTitle}>PROJECTOR CALIBRATION</Text>
             <TouchableOpacity style={{backgroundColor: '#14b8a6', padding: 15, width: 200, alignItems:'center'}} onPress={() => completeTicket('projector1')}>
                <Text style={{color: '#000', fontWeight: 'bold', fontFamily:'monospace'}}>GANTI LAMPU BENQ</Text>
             </TouchableOpacity>
             <TouchableOpacity style={{marginTop: 20}} onPress={closeMiniGame}><Text style={{color: '#ef4444'}}>Tutup</Text></TouchableOpacity>
         </>
    );
    if (activeMiniGame === 'fridge1') return (
         <>
             <Text style={styles.modalTitle}>IOT FRIDGE UPDATE</Text>
             <TouchableOpacity style={{backgroundColor: '#a855f7', padding: 15, width: 250, alignItems:'center'}} onPress={() => completeTicket('fridge1')}>
                <Text style={{color: '#fff', fontWeight: 'bold', fontFamily:'monospace'}}>INSTALL FIRMWARE v2.0</Text>
             </TouchableOpacity>
             <TouchableOpacity style={{marginTop: 20}} onPress={closeMiniGame}><Text style={{color: '#ef4444'}}>Tutup</Text></TouchableOpacity>
         </>
    );
    if (activeMiniGame === 'backupserver') return (
         <>
             <Text style={styles.modalTitle}>NAS STORAGE FULL</Text>
             <TouchableOpacity style={{backgroundColor: '#84cc16', padding: 15, width: 200, alignItems:'center'}} onPress={() => completeTicket('backupserver')}>
                <Text style={{color: '#000', fontWeight: 'bold', fontFamily:'monospace'}}>CLEAR CACHE & BACKUP</Text>
             </TouchableOpacity>
             <TouchableOpacity style={{marginTop: 20}} onPress={closeMiniGame}><Text style={{color: '#ef4444'}}>Tutup</Text></TouchableOpacity>
         </>
    );
    return null;
  };

  // --- RENDER ---
  if (gameState === 'MENU') {
     return <MainMenu onStart={() => setGameState('PLAYING')} />;
  }

  return (
    <View style={styles.container}>
      <GameMap 
         furnitures={furnitures}
         player={player}
         playerDir={playerDir}
         promptE={promptE}
         windowSize={windowSize}
      />

      <TicketOverlay money={money} highScore={highScore} tickets={tickets} stressLevel={stressLevel} playerPos={player} />
      <VirtualDPad onKeyPress={handleKeyIn} onKeyRelease={handleKeyOut} />

      <Modal visible={paused && activeMiniGame !== null && !gameOver} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
             {renderActiveMiniGame()}
          </View>
        </View>
      </Modal>

      <Modal visible={gameOver} transparent={true} animationType="fade">
         <View style={[styles.modalOverlay, {backgroundColor: 'rgba(239, 68, 68, 0.95)'}]}>
            <Text style={{color: '#fff', fontSize: 60, fontWeight: '900', textAlign: 'center', fontFamily: 'monospace'}}>SYS_FAILURE</Text>
            <Text style={{color: '#facc15', fontSize: 24, marginTop: 10, width:'80%', textAlign:'center', fontFamily: 'monospace'}}>STRESS LIMIT REACHED. ACCESS DENIED (FIRED).</Text>
            
            {isNewRecord && (
                <Text style={{color: '#10b981', fontSize: 24, fontWeight: 'bold', marginTop: 30, fontFamily: 'monospace', backgroundColor: '#064e3b', padding: 10}}>*** NEW HIGHSCORE: ${highScore} ***</Text>
            )}

            <TouchableOpacity style={{backgroundColor: '#0f172a', padding: 20, borderWidth: 2, borderColor: '#fff', marginTop: 50}} onPress={resetGame}>
               <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold', fontFamily: 'monospace'}}>[ REBOOT SYSTEM / RESTART ]</Text>
            </TouchableOpacity>
         </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', overflow: 'hidden' },
  promptEBtn: { position: 'absolute', bottom: '25%', alignSelf: 'center', backgroundColor: 'rgba(15, 23, 42, 0.8)', paddingHorizontal: 30, paddingVertical: 15, borderWidth: 2, borderColor: '#4ade80', borderStyle: 'dotted' },
  promptEText: { color: '#4ade80', fontWeight: '900', fontSize: 20, fontFamily: 'monospace' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.9)', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  modalContent: { width: '85%', maxWidth: 500, backgroundColor: 'rgba(15, 23, 42, 0.85)', padding: 30, alignItems: 'center', borderWidth: 2, borderColor: '#38bdf8', borderStyle: 'dashed' },
  modalTitle: { color: '#ef4444', fontSize: 26, fontWeight: '900', marginBottom: 15, textAlign: 'center', fontFamily: 'monospace' },
});
