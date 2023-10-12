import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
    <View style={styles.main}>
      <Text style={styles.header}>Información {currentDate}</Text>
      {statData ? (
      <View style={styles.data}>
        <View style={styles.text}>
          <Text>Date: {statData.date}</Text>
          <Text>Time: {statData.time}</Text>
          <Text>Model Percentage: {statData.model_percentage}%</Text>
          <Text>Error Percentage: {statData.error_percentage}%</Text>
        </View>
      </View>
      ) : (
        <Text style={styles.alert}>No hay datos hoy.</Text>
      )}
      <TouchableOpacity style={styles.container} onPress={saveDataToAsyncStorage}>
        <Text style={styles.button}>Capturar</Text>
      </TouchableOpacity>
    </View>
  );
}  

const styles = StyleSheet.create({
  main: {
    padding: 10,
    margin: 5,
    flex: 1,
    
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    backgroundColor: 'gold',
    overflow: 'hidden',
    borderRadius: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  alert: {
    padding: 20,
    textAlign: 'center',
    color: 'lightcoral',
    fontWeight: 'bold',
  },
  text: {
    padding: 10,
    textAlign: 'center',
    backgroundColor: 'gainsboro',
    overflow: 'hidden',
    borderRadius: 10,
  },
  data:{
    paddingTop: 10
  },
  button: {
    backgroundColor: 'lightsalmon',
    textAlign: 'center',
    padding: 10,
    minWidth: 100,
    overflow: 'hidden',
    borderRadius: 12,
    fontWeight: '500'
  },
});
