export const MAP_WIDTH = 2500;
export const MAP_HEIGHT = 2500;
export const PLAYER_SIZE = 40;
export const SPEED = 8;
export const TRIGGER_RADIUS = 50;

export const TICKET_LIFESPAN = 45000; // 45 seconds ticket timer

export const ROOMS = [
  { id: 'server', name: 'Ruang IT/Server', x: 50, y: 50, w: 600, h: 550, color: '#334155', texture: require('../../assets/sprites/floor_server.png') },
  { id: 'hrd', name: 'Ruang HRD/Kubikel', x: 750, y: 50, w: 800, h: 550, color: '#475569', texture: require('../../assets/sprites/floor_office.png') },
  { id: 'direktur', name: 'Ruang CEO', x: 50, y: 700, w: 600, h: 500, color: '#1e293b', texture: require('../../assets/sprites/floor_office.png') },
  
  // NEW ROOMS
  { id: 'meeting', name: 'Ruang Meeting Utama', x: 750, y: 700, w: 800, h: 500, color: '#111827', texture: require('../../assets/sprites/floor_office.png') },
  { id: 'pantry', name: 'Lounge / Pantry', x: 1650, y: 50, w: 600, h: 1150, color: '#374151', texture: require('../../assets/sprites/floor_pantry.png') },
  { id: 'gudang', name: 'Gudang Rak IT', x: 50, y: 1300, w: 600, h: 800, color: '#1f2937', texture: require('../../assets/sprites/floor_server.png') },
];

export const INITIAL_FURNITURES = [
  // LAMA
  { 
    id: 'rack1', name: 'Rak Server Utama', 
    x: 100, y: 100, w: 100, h: 200, 
    color: '#3b82f6', status: 'normal', sprite: null 
  },
  { 
    id: 'desk1', name: 'Meja Mbak Dina', 
    x: 850, y: 200, w: 150, h: 80, 
    color: '#3b82f6', status: 'normal', sprite: null 
  },
  { 
    id: 'printer1', name: 'Printer HRD', 
    x: 1100, y: 150, w: 80, h: 80, 
    color: '#3b82f6', status: 'normal', sprite: null 
  },
  { 
    id: 'router1', name: 'Router Direktur', 
    x: 150, y: 800, w: 60, h: 60, 
    color: '#3b82f6', status: 'normal', sprite: null 
  },
  {
    id: 'basecamp', name: 'Meja Basecamp IT',
    x: 750, y: 1300, w: 180, h: 100,
    color: '#fff', status: 'shop', sprite: null 
  },
  
  // BARU
  { 
    id: 'projector1', name: 'Proyektor BenQ', 
    x: 1100, y: 850, w: 100, h: 100, 
    color: '#14b8a6', status: 'normal', sprite: null 
  },
  { 
    id: 'fridge1', name: 'Kulkas IoT', 
    x: 1800, y: 200, w: 100, h: 100, 
    color: '#a855f7', status: 'normal', sprite: null 
  },
  { 
    id: 'backupserver', name: 'Storage Backup NAS', 
    x: 100, y: 1500, w: 120, h: 150, 
    color: '#84cc16', status: 'normal', sprite: null 
  }
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
