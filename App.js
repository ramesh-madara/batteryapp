import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as Battery from 'expo-battery';

export default function App() {
  const [batteryPercentage, setBatteryPercentage] = useState(null);

  useEffect(() => {
    const getBatteryPercentage = async () => {
      try {
        const batteryInfo = await Battery.getBatteryStateAsync();
        if (batteryInfo.isAvailable) {
          setBatteryPercentage(batteryInfo.batteryPercentage);
        } else {
          setBatteryPercentage('Battery info not accessible');
        }
      } catch (error) {
        console.error('Error fetching battery info:', error.message);
        setBatteryPercentage('Error fetching battery info');
      }
    };

    getBatteryPercentage();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your application!</Text>
      <Text>Battery Percentage: {batteryPercentage ?? 'Loading...'}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#777',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
});
