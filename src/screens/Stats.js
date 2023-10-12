import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Stats() {
  const [statData, setStatData] = React.useState(null);
  const [currentDate, setCurrentDate] = React.useState(new Date().toLocaleDateString());
  const [showGuardarButton, setShowGuardarButton] = useState(false); // State to control button visibility

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date().toLocaleDateString());
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const showAlert = () => {
    Alert.alert(
      'Datos no disponibles',
      'No hay datos disponibles en este momento.',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
    );
  };

  useEffect(() => {
    if (statData === null) {
      showAlert();
    } else {
      // Data is available, so show the "Guardar" button
      setShowGuardarButton(true);
    }
  }, [statData]);

  const saveDataToAsyncStorage = async () => {
    const jsonData = {
      date: '2023-10-11',
      time: '15:30',
      model_percentage: 98,
      error_percentage: 2,
    };
    try {
      await AsyncStorage.setItem('statData', JSON.stringify(jsonData));
      console.log('Datos Guardados:', jsonData);
      setStatData(jsonData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const retrieveDataFromAsyncStorage = async () => {
    try {
      const data = await AsyncStorage.getItem('statData');
      if (data) {
        const parsedData = JSON.parse(data);
        console.log('Data retrieved:', parsedData);
        setStatData(parsedData);
      } else {
        console.log('No data found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
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
      <Button title="Fotografía" onPress={saveDataToAsyncStorage} />
      {showGuardarButton && <Button title="Recuperar Datos" onPress={retrieveDataFromAsyncStorage} />}
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
