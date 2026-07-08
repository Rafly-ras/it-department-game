// Uncomment ini jika suatu saat menggunakan expo-av untuk MP3 asli:
// import { Audio } from 'expo-av';
import { Vibration, Platform } from 'react-native';

export const playAlarmSound = () => {
  console.log("SFX: [ALARM] Theet-theet! New Ticket!");
  // Getaran pendek di HP
  if (Platform.OS !== 'web') Vibration.vibrate(300);
};

export const playSuccessSound = () => {
  console.log("SFX: [SUCCESS] Cha-ching! Ticket Resolved!");
  // Getaran halus di HP
  if (Platform.OS !== 'web') Vibration.vibrate([0, 100, 50, 100]);
};

export const playGameOverSound = () => {
  console.log("SFX: [GAME OVER] BOOOM! YOU ARE FIRED!");
  // Getaran panjang kasar di HP
  if (Platform.OS !== 'web') Vibration.vibrate([0, 500, 200, 500, 200, 1000]);
};
