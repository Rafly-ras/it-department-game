export const MAP_WIDTH = 1500;
export const MAP_HEIGHT = 1500;
export const PLAYER_SIZE = 40;
export const SPEED = 8;
export const TRIGGER_RADIUS = 50;

export const TICKET_LIFESPAN = 45000; // 45 seconds ticket timer

export const ROOMS = [
  { id: 'server', name: 'Ruang IT/Server', x: 50, y: 50, w: 400, h: 450, color: '#334155' },
  { id: 'hrd', name: 'Ruang HRD/Kubikel', x: 550, y: 50, w: 600, h: 450, color: '#475569' },
  { id: 'direktur', name: 'Ruang Direktur', x: 50, y: 600, w: 400, h: 400, color: '#1e293b' },
];

export const INITIAL_FURNITURES = [
  { 
    id: 'rack1', 
    name: 'Rak Server Utama', 
    x: 100, y: 100, w: 100, h: 200, 
    color: '#3b82f6', 
    status: 'normal', // awalnya normal
    sprite: require('../../assets/sprites/server.png') 
  },
  { 
    id: 'desk1', 
    name: 'Meja Mbak Dina', 
    x: 700, y: 200, w: 150, h: 80, 
    color: '#3b82f6', 
    status: 'normal',
    sprite: require('../../assets/sprites/desk.png')
  },
  { 
    id: 'printer1', 
    name: 'Printer HRD', 
    x: 880, y: 180, w: 80, h: 80, 
    color: '#3b82f6', 
    status: 'normal',
    sprite: require('../../assets/sprites/printer.png')
  },
  { 
    id: 'router1', 
    name: 'Router Direktur', 
    x: 150, y: 700, w: 60, h: 60, 
    color: '#3b82f6', 
    status: 'normal',
    sprite: require('../../assets/sprites/router.png')
  },
  // BASECAMP IT (Untuk Toko)
  {
    id: 'basecamp',
    name: 'Meja Basecamp IT',
    x: 650, y: 650, w: 140, h: 100,
    color: '#fff',
    status: 'shop', // Spesial
    sprite: null // bisa diubah nanti
  }
];

export const TICKET_TEMPLATES = [
  { title: "Printer Ruang HRD Macet/Paper Jam!", targetId: 'printer1' },
  { title: "Wi-Fi Direktur Lemot/RTO", targetId: 'router1' },
  { title: "Server Kantor Kena Ransomware!", targetId: 'rack1' },
  { title: "PC Mbak Dina HRD Mati Total", targetId: 'desk1' }
];

export const SHOP_ITEMS = [
  { id: 'fastWalk', name: 'Sepatu Kursi Roda Turbo', price: 200, desc: 'Meningkatkan kecepatan lari karakter.' },
  { id: 'ipTolerance', name: 'Kabel LAN Cat6 Premium', price: 150, desc: 'Beri kelonggaran 1x salah ketik di Konfig IP.' },
  { id: 'fasterRam', name: 'Obeng Elektrik', price: 100, desc: 'Install RAM tanpa delay.' },
];
