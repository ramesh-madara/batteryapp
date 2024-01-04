import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import * as Battery from 'expo-battery';
import { Audio } from 'expo-av';


export default function App() {

  const [batteryLevel, setBatteryLevel] = useState(null);
  var playNow = false;
  var isPlaying = false;
  async function playAudio() {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require('../batteryapp/assets/5.mp3'));
      if (playNow == true){
        await soundObject.playAsync();
        isPlaying = true;
      }
      // await soundObject.unloadAsync(); // Clean up after playing
    } catch (error) {
      console.error('Failed to play sound', error);
    }
  }
  // playAudio();

  useEffect(() => {
    const fetchBatteryLevel = () => {
      Battery.getBatteryLevelAsync().then(level => {
        setBatteryLevel(level);
        console.log(level);
        if (Math.round(level * 100) >= 80) {
          playNow = true;
          isPlaying? console.log('playing') : playAudio();
        }
          
      })
    }

    fetchBatteryLevel();

    const intervalID = setInterval( () => {
      fetchBatteryLevel()
    }, 2000);


    return () => {
      clearInterval(intervalID);
    }

  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Battery : {Math.round(batteryLevel * 100)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#fff',
    backgroundColor: '#000',
  },
  text: {
    // color: 'black', 
    color: 'white', 
    fontSize:40,
  },
});
