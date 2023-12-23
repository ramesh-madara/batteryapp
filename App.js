import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as Battery from 'expo-battery';
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

export default function App() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [batteryInfo, setBatteryInfo] = useState(undefined);
  const [sound, setSound] = useState(null);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    async function checkAvailability() {
      const isBatteryAvailable = await Battery.isAvailableAsync();
      setIsAvailable(isBatteryAvailable);
      if (isBatteryAvailable) {
        const batteryInfoLoaded = await Battery.getPowerStateAsync();
        setBatteryInfo(batteryInfoLoaded);

        if (Math.round(batteryInfoLoaded.batteryLevel * 100) === 86) {
          playSound(); // Play sound if battery level is 86%
          setPlayed(true); // Set played to true to prevent repeated plays
        }
      }
    }
    checkAvailability();
  }, [played]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync(); // Unload the sound when the component unmounts
      }
    };
  }, [sound]);

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/notification_sound.mp3') // Replace with your sound file
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const showBatteryInfo = () => {
    if (!batteryInfo) return <Text>Battery info not loaded</Text>;
    return (
      <View>
        <Text style={styles.goldText}>Low Power Mode: {batteryInfo.lowPowerMode ? 'Yes' : 'No'}</Text>
        <Text style={styles.goldText}>Battery Level: {Math.round(batteryInfo.batteryLevel * 100)}%</Text>
        <Text style={styles.goldText}>Battery State: {batteryInfo.batteryState}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.goldText}>{isAvailable ? 'Battery Details: ' : 'Battery info unavailable'}</Text>
      {showBatteryInfo()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Black background color
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldText: {
    color: 'coral', // Gold text color
    marginBottom: 8, // Add space between text elements
  },
});
