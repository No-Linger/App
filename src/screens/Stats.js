import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Stats() {
  const [statData, setStatData] = React.useState(null);
  const [currentDate, setCurrentDate] = React.useState(new Date().toLocaleDateString());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date().toLocaleDateString());
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);


  const saveDataToAsyncStorage = async () => {
    const jsonData = {
      date: '2023-10-12',
      time: '2:30',
      model_percentage: 99,
      error_percentage: 1,
    };
    try {
      await AsyncStorage.setItem('statData', JSON.stringify(jsonData));
      console.log('Datos Guardados:', jsonData);
      setStatData(jsonData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View>
      <Text style={styles.header}>Información {currentDate}</Text>
      {statData ? (
        <View>
          <Text>Date: {statData.date}</Text>
          <Text>Time: {statData.time}</Text>
          <Text>Model Percentage: {statData.model_percentage}%</Text>
          <Text>Error Percentage: {statData.error_percentage}%</Text>
        </View>
      ) : (
        <Text style={styles.text}>No hay datos hoy.</Text>
      )}
      <Button title="Capturar" onPress={saveDataToAsyncStorage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
  text: {
    textAlign: 'center',
  }
});
