// Importamos las librerías de React y componentes necesarios
import React, { useEffect, useState } from "react";
import { View, Button, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

export default function TestStats() {
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
      return data;
    } else {
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

  // Función para obtener los datos almacenados
  const getData = async () => {
    let data = await AsyncStorage.getItem("capturas");
    console.log(data);
  };

  // Función para borrar los datos almacenados
  const clearData = async () => {
    await AsyncStorage.setItem("capturas", JSON.stringify([]));
  };

  // Renderizado del componente
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Connected : {isConnected ? "Sí" : "No"}</Text>
      <Button onPress={handleCapturar} title="Capturar" />
      <Button onPress={getData} title="Datos" />
      <Button onPress={clearData} title="Borrar" />
    </View>
  );
}
