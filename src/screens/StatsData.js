import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

export default function StatsData({
  dataByDate,
  open,
  toggleOpen,
  dateOpen,
  toggleDateOpen,
}) {

  return (
    <ScrollView>
      <View style={{ margin: 10, padding: 10, backgroundColor: 'gainsboro', overflow: 'hidden', borderRadius: 15 }}>
        <View style={{ borderRadius: 15, overflow: 'hidden', padding: 3 }}>
          <TouchableOpacity onPress={toggleOpen}>
            <Text style={{ fontSize: 15, fontWeight: '600', textAlign: 'center' }}>
              Bitácora de Datos
            </Text>
          </TouchableOpacity>
        </View>
        {true && (
          <View style={{ backgroundColor: 'gainsboro', marginTop: 5 }}>
            {Object.keys(dataByDate).map(date => (
              <View key={date} style={{ margin: 5, padding: 10, backgroundColor: 'white', borderRadius: 15 }}>
                <TouchableOpacity onPress={() => toggleDateOpen(date)}>
                  <Text style={{ fontWeight: 'bold', flexDirection: 'row-reverse' }}>{`Fecha: ${date}`}</Text>
                </TouchableOpacity>
                {dateOpen[date] && (
                  <View style={{ flex: 1, padding: 5, marginLeft: 5, overflow: 'hidden', borderRadius: 10 }}>
                    {dataByDate[date].map(item => (
                      <View key={item.hora} style={{ marginBottom: 5 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, marginTop: 5 }}>
                          <Text>Planograma:</Text>
                          <Text>{item.planograma}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                          <Text>Hora:</Text>
                          <Text>{item.hora}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text>Precisión:</Text>
                          <Text style={{ color: 'green' }}>{item.precision}%</Text>
                        </View>
                        <Text style={{ textAlign: 'center' }}>___________________________</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
    
  );
}
