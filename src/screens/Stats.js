import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconPicture from '../components/PotatoePicture';

export default function Stats({ navigation }) {
  const [statData, setStatData] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString());
  const [records, setRecords] = useState({});
  const [showRecords, setShowRecords] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentDate(new Date().toLocaleDateString()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const generateRandomPercentage = () => Math.round(Math.random() * 100);

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

      setRecords((prevRecords) => ({
        ...prevRecords,
        [jsonData.fecha]: [...(prevRecords[jsonData.fecha] || []), jsonData],
      }));

    navigation.navigate('Cámara');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>¡Hola! Hoy es: {currentDate}</Text>
      {statData ? (
       <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Captura</Text>
          <Text style={{marginBottom:5, fontWeight:'bold'}}>------------------------------------</Text>
          <View style={styles.statsRow}>
              <Text style={styles.leftText}>Fecha:</Text>
              <Text>{statData.fecha}</Text>
          </View>
          <View style={styles.statsRow}>
              <Text style={styles.leftText}>Hora:</Text>
              <Text>{statData.hora}</Text>
          </View>
          <View style={styles.statsRow}>
              <Text style={styles.leftText}>Porcentaje_modelo:</Text>
              <Text style={styles.greenText}>{statData.porcentaje_modelo}%</Text>
          </View>
          <View style={styles.statsRow}>
              <Text style={styles.leftText}>Porcentaje_error:</Text>
              <Text style={styles.redText}>{statData.porcentaje_error}%</Text>
          </View>
       </View>
   
      ) : (
        <View style={styles.noCaptureContainer}>
          <Text style={styles.noCaptureText}>Aún no has realizado ninguna captura hoy.</Text>
          <IconPicture/>
          <TouchableOpacity style={styles.captureButton} onPress={saveDataToAsyncStorage}>
            <Text style={styles.captureButtonText}>Capturar</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity onPress={() => setShowRecords(!showRecords)} style={styles.showRecordsButton}>
        <View style={styles.buttonContainer}>
          <Text>Datos Guardados</Text>
          <Icon name={showRecords ? "arrow-up" : "arrow-down"} size={16} />
        </View>
      </TouchableOpacity>
      {showRecords && (
        <View style={styles.recordsContainer}>
          {Object.entries(records).map(([fecha, captureArray]) => (
            <View key={fecha}>
              <TouchableOpacity style={styles.buttonContainer} onPress={() => setSelectedDate(selectedDate === fecha ? null : fecha)}>
                <Text style={styles.boldText}>Fecha: {fecha}</Text>
                <Icon name={selectedDate === fecha ? "folder-open" : "folder"} size={15} />
              </TouchableOpacity>
              {selectedDate === fecha &&
                captureArray.map((capture, captureIndex) => (
                  <View key={captureIndex} style={styles.captureInfo}>
                    <View style={styles.captureRow}>
                        <Text style={styles.leftText}>Hora:</Text>
                        <Text>{capture.hora}</Text>
                    </View>
                    <View style={styles.captureRow}>
                        <Text style={styles.leftText}>porcentaje_modelo:</Text>
                        <Text style={styles.greenText}>{capture.porcentaje_modelo}%</Text>
                    </View>
                    <View style={styles.captureRow}>
                        <Text style={styles.leftText}>porcentaje_error:</Text>
                        <Text style={styles.redText}>{capture.porcentaje_error}%</Text>
                    </View>
                 </View>
                ))}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    margin: 5,
  
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    padding: 3,
    marginBottom: 10,
  },
  statsContainer: {
    marginTop: 10,
    backgroundColor: 'lightsteelblue',
    overflow: 'hidden',
    borderRadius: 10,
    padding: 10,
  },
  statsTitle: {
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  greenText: {
    color: 'green',
    marginBottom:3
  },
  redText: {
    marginBottom: 5,
    color: 'red',
  },
  noCaptureContainer: {
    backgroundColor: 'lightsteelblue',
    overflow: 'hidden',
    borderRadius: 20,
    alignItems: 'center',
    shadowOffset: {width: -2, height: 4},  
    shadowColor: '#171717',  
    shadowOpacity: 0.2,  
    shadowRadius: 3, 
  },
  noCaptureText: {
    textAlign: 'center',
    padding: 15,
    fontWeight:'500'
  },
  captureButton: {
    alignItems: 'center',
  },
  captureButtonText: {
    margin: 10,
    padding: 10,
    textAlign: 'center',
    backgroundColor: 'dodgerblue',
    color: 'white',
    paddingBottom: 10,
    overflow: 'hidden',
    borderRadius: 10,
    width:180,
    marginBottom:15,
    fontWeight:'bold'
  },
  showRecordsButton: {
    marginTop: 5,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  recordsContainer: {
    marginTop: 5,
    padding: 10,
    backgroundColor: 'lightsteelblue',
    borderRadius: 10,
  },
  boldText: {
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 4
  },
  captureInfo: {
    marginLeft: 5,
  },
  captureSeparator: {
    marginBottom: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
},
captureRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 3,
},
});
