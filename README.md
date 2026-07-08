# IT Support Quest: Corporate Mayhem 🎮🔥

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React Native](https://img.shields.io/badge/React_Native-Expo_SDK_57-22c55e?logo=react)
![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Android-38bdf8)

**IT Support Quest: Corporate Mayhem** adalah game 2D Top-Down Web-Native bergaya *Cyberpunk/Retro Terminal* yang mensimulasikan kepanikan seorang teknisi IT di sebuah korporat. Selamatkan hari dari mesin printer yang nge-_jam_, Wi-Fi direktur yang putus, hingga serangan Ransomware, sebelum Boss Stress Level mencapai titik 100%!

Game ini dibangun secara *cross-platform* (Web & Android) menggunakan teknologi **React Native Expo** tanpa _Game Engine_ terpisah, mengandalkan kekuatan murni `requestAnimationFrame` untuk Game Loop 60FPS.

---

## ⚡ Mengapa Game Ini Dibuat? (Latar Belakang)
Proyek ini dibuat sebagai **Portfolio Eksperimental** untuk membuktikan bahwa kapabilitas _React Native_ modern mampu merender logika _Game Loop_, sistem benturan 2D (*Collision Detection*), dan integrasi animasi kompleks (60FPS) secara _native_ hanya bermodalkan *Hooks* dan *StyleSheet* murni.

Sebuah solusi pamungkas bagi pengembang Front-End App yang ingin melangkah bebas ke interaktivitas tingkat game 2D santai, dibalut tema korporat IT yang lekat dengan keseharian *developer*.

---

## 🛠️ Tech Stack & Arsitektur Utama
- **Framework:** React Native + Expo SDK 57 (Expo Router)
- **Game Engine:** `requestAnimationFrame` Custom Loop (JavaScript Murni, tanpa Box2D / Phaser)
- **Collision System:** AABB (*Axis-Aligned Bounding Box*)
- **Storage:** `@react-native-async-storage/async-storage` (Data Persistence Lintas Sesi)
- **Multimedia:** `expo-av` (SFX Dummy), `expo-image` (High-Performance Image Caching), `React Native Vibration API` (Haptic Feedback Mobile)
- **Styling:** CSS-in-JS murni (Animated, Absolute Positioning, Web-Glow Effects)

---

## 🚀 Sorotan Fitur Teknis (Technical Highlights)
1. **Dynamic Event Spawner:** Interval waktu algoritmis untuk memutasi objek "Normal" menjadi "Rusak" dengan pemicu stress tiap 45 detik.
2. **Cyberpunk UI & HUD:** Implementasi Grid UI dengan efek *text shadow glow* langsung dari _Engine CSS React_. 
3. **Modular Mini-Games Structure:** *Decoupled components* untuk berbagai *hardware troubleshooting* (*IP Config*, pasang RAM, fix Printer), dipanggil secara *On-Demand* (Modal Overlay).
4. **Ekonomi State-Management:** Sistem beli *item upgrade* yang terhubung merubah parameter variabel di *Game Loop* pusat (seperti `speed` dan `toleransi kesalahan`).
5. **Universal Kontroler:** Virtual D-Pad statis yang tersambung sempurna meneruskan *React Synthetic Events* ke setir koordinat Player yang sama dengan papan *Keyboard Desktop*.

---

## 🕹️ Cara Menjalankan Secara Lokal (Dev Mode)

1. **Clone Repository Ini**
   ```bash
   git clone https://github.com/username/it-support-quest.git
   cd it-support-quest
   ```
2. **Install Dependensi**
   ```bash
   npm install
   ```
3. **Jalankan Server Lokal (Expo)**
   ```bash
   npx expo start
   ```
4. **Buka di Browser:** Tekan huruf `w` pada terminal untuk memainkan versi Web, atau _scan barcode_ memakai aplikasi Expo Go pada HP Android Anda!

---

## 📱 Cara Membangun (Build) .APK Sendiri
Game ini di-set ke mode **Landscape**. Untuk meraciknya menjadi file `.apk` yang bisa diedarkan langsung (tanpa perlu ribet via Android Studio), pastikan Anda menggunakan **EAS Build**:
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

---

## 📜 Lisensi
Dikontribusikan dengan lisensi [MIT License](LICENSE). Anda bebas mengubah, menyalin, mendistribusikan proyek ini selama masih mencantumkan lisensinya.

*Dirancang dengan 💚, kopi ☕, dan kepanikan kabel.*
