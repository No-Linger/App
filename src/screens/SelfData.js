import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ScrollView, Text, View, Button } from 'react-native';

export default function SelfData({
  capture,
  history,
  currentDate,
  open,
  setOpen,
  dateOpen,
  setDateOpen,
  loading,
  setLoading,
  dataByDate,
  handleCapturar,
  clearData
}) {
  return (
    <ScrollView>
      <Text style={{ marginLeft: 10, marginTop: 15, fontSize: 20, fontWeight: 600 }}>
        ¡Hola! Hoy es: {currentDate}
      </Text>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: 10, padding: 2 }}>
          <Text>LOADING</Text>
        </View>
      ) : (
        Object.keys(dataByDate).length === 0 ||
        (Object.keys(dataByDate)[Object.keys(dataByDate).length - 1] !== currentDate) ? (
          <View style={{ padding: 15 }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                backgroundColor: 'gainsboro',
                overflow: 'hidden',
                borderRadius: 15,
              }}
            >
              <Text style={{ padding: 10, backgroundColor: 'gray', color: 'white', overflow: 'hidden', borderRadius: 15 }}>
                Aún no has realizado ninguna captura hoy.
              </Text>
            </View>
          </View>
        ) : (
          <View style={{ margin: 10, padding: 15, backgroundColor: 'gainsboro', overflow: 'hidden', borderRadius: 15 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 15 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5, fontSize: 17 }}>Captura</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, padding: 15, fontSize: 17 }}>
        <Text style={{fontSize: 17}}>Planograma:</Text>
        <Text style={{fontSize: 17}}>{capture.planograma}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, padding: 15 }}>
        <Text style={{fontSize: 17}}>Fecha:</Text>
        <Text style={{fontSize: 17}}>{capture.fecha}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, padding: 15 }}>
        <Text style={{fontSize: 17}}>Hora:</Text>
        <Text style={{fontSize: 17}}>{capture.hora}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, padding: 15 }}>
        <Text style={{fontSize: 17}}>Precisión:</Text>
        <Text style={{ color: 'green', fontSize:17 }}>{capture.precision}%</Text>
      </View>
          </View>
        )
      )}

      <Button onPress={handleCapturar} title="Capturar" />
      <Button onPress={clearData} title="Borrar" />
    </ScrollView>

  );
}
