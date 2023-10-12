import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

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
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      model_percentage: generateRandomPercentage(),
      error_percentage: generateRandomPercentage(),
    };
    try {
      await AsyncStorage.setItem('statData', JSON.stringify(jsonData));
      console.log('Datos Guardados:', jsonData);
      setStatData(jsonData);

      setRecords((prevRecords) => {
        const dateKey = jsonData.date;
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

  const handleDateClick = (date) => {
    setSelectedDate(selectedDate === date ? null : date);
  };

  const handleShowRecordsClick = () => {
    setTriangleDirection(triangleDirection === 'down' ? 'right' : 'down');
    setShowRecords(!showRecords);
  };
  
  
  return (
    <ScrollView style={{flex:1}}>
      <View style={{padding: 10, margin: 5, flex: 1,}}>
        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', padding: 10, backgroundColor: 'gold', overflow: 'hidden', borderRadius: 10,}}
          >Información {currentDate}
        </Text>
        {statData ? (
          <View style={{marginTop:10}}>
            <View style={styles.text}>
              <Text>Date: {statData.date}</Text>
              <Text>Time: {statData.time}</Text>
              <Text>Model Percentage: {statData.model_percentage}%</Text>
              <Text>Error Percentage: {statData.error_percentage}%</Text>
            </View>
          </View>
        ) : (
          <Text style={{textAlign:'center', padding:10}}>No hay datos hoy.</Text>
        )}

        <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={saveDataToAsyncStorage}>
            <Text style={styles.capturar}>Capturar</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={handleShowRecordsClick} style={styles.showRecordsButton}>
          <View style={styles.buttonContainer}>
            <Text>Datos Guardados</Text>
            <FontAwesomeIcon name={`caret-${triangleDirection}`} size={16} />
          </View>
        </TouchableOpacity>
        
        {showRecords && (
          <View style={styles.recordsContainer}>
            {Object.entries(records).map(([date, captureArray], index) => (
              <View key={index}>
                <TouchableOpacity style={styles.buttonContainer} onPress={() => handleDateClick(date)}>
                  <Text style={{fontWeight: 'bold', marginBottom:2}}>Date: {date}</Text>
                  <FontAwesomeIcon name="folder" style={{color: "#366ac4",}} />
                </TouchableOpacity>

                {selectedDate === date &&
                  captureArray.map((capture, captureIndex) => (
                    <View style={{marginLeft:5}}key={captureIndex}>
                      <Text>Time: {capture.time}</Text>
                      <Text>Model Percentage: {capture.model_percentage}%</Text>
                      <Text style={{marginBottom:2}}>Error Percentage: {capture.error_percentage}%</Text>
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
    backgroundColor: 'lightskyblue',
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
  },
});

