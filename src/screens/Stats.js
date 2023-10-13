import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Stats() {
  const [statData, setStatData] = React.useState(null);
  const [currentDate, setCurrentDate] = React.useState(new Date().toLocaleDateString());
  const [records, setRecords] = React.useState([]);
  const [showRecords, setShowRecords] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [triangleDirection, setTriangleDirection] = React.useState('right');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date().toLocaleDateString());
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const generateRandomPercentage = () => {
    return Math.round(Math.random() * 100);
  };

  const saveDataToAsyncStorage = async () => {
    const jsonData = {
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      porcentaje_modelo: generateRandomPercentage(),
      porcentaje_error: generateRandomPercentage(),
    };
    try {
      await AsyncStorage.setItem('statData', JSON.stringify(jsonData));
      console.log('Datos Guardados:', jsonData);
      setStatData(jsonData);

      setRecords((prevRecords) => {
        const dateKey = jsonData.fecha;
        if (!prevRecords[dateKey]) {
          prevRecords[dateKey] = [];
        }
        prevRecords[dateKey].push(jsonData);
        return { ...prevRecords };
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDateClick = (fecha) => {
    setSelectedDate(selectedDate === fecha ? null : fecha);
  };

  const handleShowRecordsClick = () => {
    setTriangleDirection(!triangleDirection);
    setShowRecords(!showRecords);
  };
  
  return (
    <ScrollView style={{flex:1}}>
      <View style={{padding: 10, margin: 5, flex: 1,}}>
      
          <Text style={{ fontSize: 15, fontWeight: 'bold', padding: 3, marginBottom:10 }}>
            ¡Hola! Hoy es: {currentDate}
          </Text>
        
        {statData ? (
          <View style={{marginTop:10}}>
            <View style={styles.text}>
              <Text>Fecha: {statData.fecha}</Text>
              <Text>Hora: {statData.hora}</Text>
              <Text>porcentaje_modelo: {statData.porcentaje_modelo}%</Text>
              <Text>porcentaje_error: {statData.porcentaje_error}%</Text>
            </View>
          </View>
        ) : (
          <View style={{backgroundColor:'gainsboro', overflow:'hidden', borderRadius:20}}>
          <View style={{alignItems: 'center'}}>
            <Text style={{textAlign:'center', padding:10}}>Aún no has realizado ninguna captura hoy.</Text>
            <Icons name='image-off' size={80} />
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity style={{ alignItems: 'center', textAlign: 'center' }} onPress={saveDataToAsyncStorage}>
              <Text style={{ margin:10, padding:10, textAlign: 'center', backgroundColor:'gray', color: 'white', paddingBottom: 10, overflow:'hidden', borderRadius:10 }}>
                Tomar Fotografía
              </Text>
            </TouchableOpacity>
          </View>

          </View>
         
        )}
        
        <TouchableOpacity onPress={handleShowRecordsClick} style={styles.showRecordsButton}>
          <View style={styles.buttonContainer}>
            <Text>Datos Guardados</Text>
            <Icon name={triangleDirection ? "arrow-up" : "arrow-down"} size={16} />

          </View>
        </TouchableOpacity>
        
        {showRecords && (
          <View style={styles.recordsContainer}>
            {Object.entries(records).map(([fecha, captureArray], index) => (
              <View key={index}>
                <TouchableOpacity style={styles.buttonContainer} onPress={() => handleDateClick(fecha)}>
                  <Text style={{fontWeight: 'bold', marginBottom:8, marginTop:4}}>Fecha: {fecha}</Text>
                  <Icon name={selectedDate ? "folder-open": "folder"} size={15}/>
                </TouchableOpacity>

                {selectedDate === fecha &&
                  captureArray.map((capture, captureIndex) => (
                    <View style={{marginLeft:5}}key={captureIndex}>
                      <Text>Hora: {capture.hora}</Text>
                      <Text>porcentaje_modelo: {capture.porcentaje_modelo}%</Text>
                      <Text style={{marginBottom:2}}>porcentaje_error: {capture.porcentaje_error}%</Text>
                      <Text>--------------------------------</Text>
                    </View>
                  ))}

              </View>
            ))}

          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    padding: 10,
    textAlign: 'center',
    backgroundColor: 'gainsboro',
    overflow: 'hidden',
    borderRadius: 10,
  },
  capturar: {
    backgroundColor: 'gainsboro',
    textAlign: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
    width: 100,
    overflow: 'hidden',
    borderRadius: 12,
    fontWeight: '500'
  },
  recordsContainer: {
    marginTop: 5,
    padding: 10,
    backgroundColor: 'gainsboro',
    borderRadius: 10,
  },
  recordsHeader: {
    fontWeight: 'bold',
  },
  recordItem: {
    marginVertical: 5,
  },
  showRecordsButton: {
    marginTop: 5,
    padding: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5
  },
});