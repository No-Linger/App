import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo"; // Import NetInfo
import Icon from "react-native-vector-icons/FontAwesome";
import { LottieAnimation } from "../components";
import { saveDataToAsyncStorage } from "../services/fetchService";

export default function TestStats() {

  const [capture, setCapture] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString());
  const [open, setOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Función para obtener un número entero aleatorio en un rango específico
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Función para obtener un elemento aleatorio de un arreglo
  function getRandomArrayElement(arr) {
    return arr[getRandomInt(0, arr.length - 1)];
  }

  // Función para generar un JSON falso para simular los datos capturados
  const getFakeJson = () => {
    const precision = getRandomInt(97, 100);
    const fecha = new Date().toLocaleDateString();
    const hora = new Date().toLocaleTimeString();
    const planograma = getRandomArrayElement(["Sabritas", "CocaCola", "Barcel"]);
    const sucrusal = 123456;
    const fakeJSON = { planograma, fecha, hora, precision, sucrusal};
    return fakeJSON;
  };

  // Función para subir los datos a la API
  const uploadData = async (data) => {
    try {
      let response = await fetch("http://10.48.70.252:8082/postStats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const d = await response.json();
      console.log(d);
      if (response.ok) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Función para intentar subir los registros almacenados
  const tryUploadRecords = async (data) => {
    console.log("try upload", data);
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        if (!data[i]["uploaded"]) {
          let state = await uploadData(data[i]);
          data[i]["uploaded"] = state;
        }
      }
      setHistory(data);
      setLoading(false);
      return data;
    } else {
      setHistory([])
      return [];
    }
  };

  // Manejador del botón para capturar datos
  const handleCapturar = async () => {
    const fakeData = getFakeJson();
    let data = await AsyncStorage.getItem("capturas");
    data = JSON.parse(data);
    if (!Array.isArray(data)) {
      data = [];
    }
    fakeData["uploaded"] = false;
    data.push(fakeData);
    let newRecords = await tryUploadRecords(data);
    await AsyncStorage.setItem("capturas", JSON.stringify(newRecords));
    setCapture(fakeData);
  };

  // Estado para manejar la conexión a internet
  const [isConnected, setIsConnected] = useState(null);

  // useEffect para manejar cambios en la conexión a internet
  useEffect(() => {
    // Suscribimos al evento de cambio de conexión
    let subscription = NetInfo.addEventListener(async (state) => {
      console.log(state.isConnected);
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        let data = await AsyncStorage.getItem("capturas");
        data = JSON.parse(data);
        await tryUploadRecords(data);
      }
    });

    // Limpiamos la suscripción al desmontar el componente
    return () => {
      subscription();
    };
  }, [isConnected]);

  // Función para borrar los datos almacenados
  const clearData = async () => {
    await AsyncStorage.setItem("capturas", JSON.stringify([]))
    setCapture([]);
    setHistory([]);
  };

  const toggleOpen = () => {
    setOpen(!open);
  };

  const toggleDateOpen = (date) => {
    setDateOpen(prevDateOpen => ({
      ...prevDateOpen,
      [date]: !prevDateOpen[date],
    }));
  };

  const dataByDate = {};
  for (const item of history) {
    const date = item.fecha;
    if (!dataByDate[date]) {
      dataByDate[date] = [];
    }
    dataByDate[date].push(item);
  }

  return (
    <ScrollView>
      <Text style={{marginLeft:10, marginTop:10, fontSize: 15, fontWeight:600}}>¡Hola! Hoy es: {currentDate}</Text>
  
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: 10, padding:2}}>
          <Text>LOADING</Text>
        </View>
      ) : (
        Object.keys(dataByDate).length === 0 || (Object.keys(dataByDate)[Object.keys(dataByDate).length - 1] != currentDate) ? (
          <View style={{ padding: 15 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, backgroundColor: 'gainsboro', overflow: 'hidden', borderRadius: 15 }}>
              <Text>
                Aún no has realizado ninguna captura hoy.
              </Text>
              <LottieAnimation
                source={require("../../assets/lotties/potatoeWalking.json")}
                width={50}
                height={50}
              />
            </View>
          </View>
        ) : (
          <View style={{ margin: 10, padding: 15, backgroundColor: 'gainsboro', overflow: 'hidden', borderRadius: 15 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Captura</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text>Planograma:</Text>
              <Text>{capture.planograma}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text>Fecha:</Text>
              <Text>{capture.fecha}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text>Hora:</Text>
              <Text>{capture.hora}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text>Precision:</Text>
              <Text style={{ color: 'green' }}>{capture.precision}%</Text>
            </View>
          </View>
        )
      )}
  
      <View style={{ flex: 1, alignItems: 'center'}}>
        <TouchableOpacity onPress={toggleOpen} style={{overflow:'hidden', borderRadius:15, padding:0}}>
          <Text style={{ padding: 10, backgroundColor: 'gray', fontSize: 15, color: 'white', fontWeight:'600' }}>
            Datos Guardados
          </Text>
        </TouchableOpacity>
        {open && (
          <View style={{ backgroundColor:'gainsboro', marginTop:10, alignItems: 'center'}}>
            {Object.keys(dataByDate).map(date => (
              <View key={date}>
                <TouchableOpacity onPress={() => toggleDateOpen(date)}>
                  <Text style={{ fontWeight: 'bold' }}>{`Date: ${date}`}</Text>
                </TouchableOpacity>
                {dateOpen[date] && (
                  <View>
                    {dataByDate[date].map(item => (
                      <View key={item.hora} style={{ marginBottom: 10 }}>
                        <Text>{`Hora: ${item.hora}`}</Text>
                        <Text>{`Planograma: ${item.planograma}`}</Text>
                        <Text>{`Precision: ${item.precision}`}</Text>
                        <Text>{`Sucursal: ${item.sucursal}`}</Text>
                        <Text>{`Uploaded: ${item.uploaded ? 'Yes' : 'No'}`}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
      <Button onPress={handleCapturar} title="Capturar" />
      <Button onPress={clearData} title="Borrar" />
    </ScrollView>
  );
}  