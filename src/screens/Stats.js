import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { LottieAnimation } from "../components";
import { useNavigation } from "@react-navigation/native";

import StatsData from "./StatsStorage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DataCapture from "./StatsCapture";
import FlappyBird from "./FlappyBird";

import { useFocusEffect } from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator();

export default function TestStats() {
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

  // separate ui and system
  function fetchWithTimeout(url, options, timeout = 3000) {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), timeout)
      ),
    ]);
  }

  // Función para subir los datos a la API
  // separate ui and system
  const uploadData = async (data) => {
    try {
      let response = await fetchWithTimeout(
        "http://10.48.74.125:8082/postStats",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const d = await response.json();
      if (response.ok) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Función para intentar subir los registros almacenados
  // separate ui and system
  const tryUploadRecords = async (data) => {
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        if (!data[i]["uploaded"]) {
          let state = await uploadData(data[i]);
          if (!state) {
            break;
          }
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
  // separate ui and system
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

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        let data = await AsyncStorage.getItem("capturas");
        data = JSON.parse(data);
        await tryUploadRecords(data);
      };

      fetchData();
    }, [])
  );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#4B6CFE",
        tabBarLabelStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tab.Screen name="Captura" style={{ fontWeight: "bold" }}>
        {() => (
          <DataCapture
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
    </Tab.Navigator>
  );
}
