import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { LottieAnimation } from "../components";
import { useNavigation } from "@react-navigation/native";

import StatsData from "./StatsStorage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DataCapture from "./StatsCapture";
import FlappyBird from "./FlappyBird";
const Tab = createMaterialTopTabNavigator();

export default function TestStats() {
  const [capture, setCapture] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString()
  );
  const [open, setOpen] = useState(true);
  const [dateOpen, setDateOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
    const planograma = getRandomArrayElement([
      "Sabritas",
      "CocaCola",
      "Barcel",
    ]);
    const sucrusal = 123456;
    const fakeJSON = { planograma, fecha, hora, precision, sucrusal };
    return fakeJSON;
  };

  // Función para subir los datos a la API
  const uploadData = async (data) => {
    try {
      let response = await fetch("http://10.48.77.242:8082/postStats", {
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
      setHistory([]);
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
    await AsyncStorage.setItem("capturas", JSON.stringify([]));
    setCapture([]);
    setHistory([]);
  };

  const toggleOpen = () => {
    setOpen(!open);
  };

  const toggleDateOpen = (date) => {
    setDateOpen((prevDateOpen) => ({
      ...prevDateOpen,
      [date]: !prevDateOpen[date],
    }));
  };

  //Acomodo de datos por fecha
  const dataByDate = {};
  for (const item of history) {
    const date = item.fecha;
    if (!dataByDate[date]) {
      dataByDate[date] = [];
    }
    dataByDate[date].push(item);
  }

  return (
    <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#4B6CFE', 
      tabBarLabelStyle: {
        fontWeight: 'bold'
      }
    }}
    >
      <Tab.Screen name="Captura" style={{fontWeight:'bold'}}>
        {() => (
          <DataCapture
            capture={capture}
            history={history}
            currentDate={currentDate}
            open={open}
            setOpen={setOpen}
            dateOpen={dateOpen}
            setDateOpen={setDateOpen}
            loading={loading}
            setLoading={setLoading}
            dataByDate={dataByDate}
            handleCapturar={handleCapturar}
            clearData={clearData}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Bitácora">
        {() => (
          <StatsData
            dataByDate={dataByDate}
            open={open}
            toggleOpen={toggleOpen}
            dateOpen={dateOpen}
            toggleDateOpen={toggleDateOpen}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Game">{() => <FlappyBird />}</Tab.Screen>
    </Tab.Navigator>
  );
}
