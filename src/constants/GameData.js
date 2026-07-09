export const MAP_WIDTH = 2500;
export const MAP_HEIGHT = 2500;
export const PLAYER_SIZE = 40;
export const SPEED = 8;
export const TRIGGER_RADIUS = 50;

export const TICKET_LIFESPAN = 45000; // 45 seconds ticket timer


export const INITIAL_FURNITURES = [
  // Server IT
  { id: 'rack1', name: 'Server DB', x: 100, y: 100, w: 80, h: 200, color: '#3b82f6', status: 'normal', zHeight: 160, imageNormal: require('../../assets/sprites/server_clean.png'), imageError: require('../../assets/sprites/server_error.png') },
  { id: 'rack2', name: 'Server Web', x: 200, y: 100, w: 80, h: 200, color: '#3b82f6', status: 'normal', zHeight: 160, imageNormal: require('../../assets/sprites/server_clean.png'), imageError: require('../../assets/sprites/server_error.png') },
  { id: 'backupserver', name: 'NAS Storage', x: 100, y: 1350, w: 100, h: 200, color: '#f59e0b', status: 'normal', zHeight: 180, imageNormal: require('../../assets/sprites/nas_clean.png'), imageError: require('../../assets/sprites/nas_error.png') },
  
  // HRD & Direktur
  { id: 'desk1', name: 'PC Mbak Dina', x: 800, y: 100, w: 120, h: 80, color: '#10b981', status: 'normal', zHeight: 60, imageNormal: require('../../assets/sprites/pc_clean.png'), imageError: require('../../assets/sprites/pc_error.png') },
  { id: 'desk2', name: 'PC Mas Budi', x: 1000, y: 100, w: 120, h: 80, color: '#10b981', status: 'normal', zHeight: 60, imageNormal: require('../../assets/sprites/pc_clean.png'), imageError: require('../../assets/sprites/pc_error.png') },
  { id: 'router1', name: 'Router Direktur', x: 100, y: 900, w: 80, h: 80, color: '#f59e0b', status: 'normal', zHeight: 100, imageNormal: require('../../assets/sprites/router_clean.png'), imageError: require('../../assets/sprites/router_error.png') },
  
  // Main Room
  { id: 'printer1', name: 'Printer Utama', x: 800, y: 300, w: 100, h: 80, color: '#6366f1', status: 'normal', zHeight: 80, imageNormal: require('../../assets/sprites/printer_clean.png'), imageError: require('../../assets/sprites/printer_error.png') },
  { id: 'basecamp', name: 'Meja IT (Upgrade)', x: 400, y: 300, w: 150, h: 100, color: '#ec4899', status: 'shop', zHeight: 70, imageNormal: require('../../assets/sprites/basecamp_clean.png'), imageError: require('../../assets/sprites/basecamp_error.png') },
  
  // Ruang Meeting & Pantry
  { id: 'projector1', name: 'Proyektor BenQ', x: 1100, y: 800, w: 150, h: 150, color: '#14b8a6', status: 'normal', zHeight: 50, imageNormal: require('../../assets/sprites/projector_clean.png'), imageError: require('../../assets/sprites/projector_error.png') },
  { id: 'fridge1', name: 'Kulkas IoT', x: 1800, y: 200, w: 100, h: 150, color: '#a855f7', status: 'normal', zHeight: 180, imageNormal: require('../../assets/sprites/fridge_clean.png'), imageError: require('../../assets/sprites/fridge_error.png') },
];

export const WALLS = [
  // Dinding Pembatas Ruang IT/Server
  { id: 'wall_it_right', x: 650, y: 50, w: 20, h: 550, color: '#475569', zHeight: 180, imageNormal: require('../../assets/sprites/wall.png'), imageError: require('../../assets/sprites/wall.png') },
  { id: 'wall_it_bottom', x: 50, y: 600, w: 600, h: 20, color: '#475569', zHeight: 180, imageNormal: require('../../assets/sprites/wall.png'), imageError: require('../../assets/sprites/wall.png') },
  
  // Dinding Pembatas Ruang Direktur
  { id: 'wall_boss_top', x: 50, y: 680, w: 620, h: 20, color: '#475569', zHeight: 180, imageNormal: require('../../assets/sprites/wall.png'), imageError: require('../../assets/sprites/wall.png') },
  { id: 'wall_boss_right', x: 650, y: 680, w: 20, h: 520, color: '#475569', zHeight: 180, imageNormal: require('../../assets/sprites/wall.png'), imageError: require('../../assets/sprites/wall.png') },
  
  // Dinding Pantry
  { id: 'wall_pantry_left', x: 1630, y: 50, w: 20, h: 1150, color: '#475569', zHeight: 180, imageNormal: require('../../assets/sprites/wall.png'), imageError: require('../../assets/sprites/wall.png') },
];

export const TICKET_TEMPLATES = [
  { title: "Printer Ruang HRD Macet/Paper Jam!", targetId: 'printer1' },
  { title: "Wi-Fi Direktur Lemot/RTO", targetId: 'router1' },
  { title: "Server Kantor Kena Ransomware!", targetId: 'rack1' },
  { title: "PC Mbak Dina HRD Mati Total", targetId: 'desk1' },
  { title: "Mati Lampu Proyektor Meeting Mati!", targetId: 'projector1' },
  { title: "Kulkas IoT Minta Update Firmware", targetId: 'fridge1' },
  { title: "NAS Storage Backup Penuh!", targetId: 'backupserver' }
];

export const SHOP_ITEMS = [
  { id: 'fastWalk', name: 'Sepatu Kursi Roda Turbo', price: 200, desc: 'Meningkatkan kecepatan lari karakter.' },
  { id: 'ipTolerance', name: 'Kabel LAN Cat6 Premium', price: 150, desc: 'Beri kelonggaran 1x salah ketik di Konfig IP.' },
  { id: 'fasterRam', name: 'Obeng Elektrik', price: 100, desc: 'Install RAM tanpa delay.' },
];
