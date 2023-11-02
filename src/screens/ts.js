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
import { syncDataToMongoDB } from "../services/statsUpdate";

export default function Stats({ navigation }) {
  const [statData, setStatData] = useState(null); // Data from JSON
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString());

  const [records, setRecords] = useState({}); // Object with all the data saved.
  const [isConnected, setIsConnected] = useState(true); // To track internet connection.

  const [showRecords, setShowRecords] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(
      () => setCurrentDate(new Date().toLocaleDateString()),
      1000
    );
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Check for internet connection on component mount
    NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    const fetchData = async () => {
      try {
        // Retrieve data from AsyncStorage
        const data = await AsyncStorage.getItem("statData");

        // Parse the data into parsedData, or initialize it as an empty array
        const parsedData = data ? JSON.parse(data) : [];

        // Set the parsedData in the state
        setRecords(parsedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // When the internet connection becomes available, sync the data with MongoDB
    if (isConnected) {
      syncDataWithMongoDB();
    }
  }, [isConnected]);

  const syncDataWithMongoDB = async () => {
    try {
      for (const date in records) {
        for (const data of records[date]) {
          await syncDataToMongoDB(data);
        }
      }
    } catch (error) {
      console.error("Error uploading data to MongoDB:", error);
    }
  };

  const saveDataAndLoadFecha = async () => {
    try {
      // Capture data immediately
      const jsonData = await saveDataToAsyncStorage();
      setStatData(jsonData);

      // Create a temporary array to hold data that needs to be uploaded
      const tempRecords = { ...records };
      if (!tempRecords[currentDate]) {
        tempRecords[currentDate] = [];
      }
      tempRecords[currentDate].push(jsonData);

      // Log the tempRecords to see the captures
      console.log("Temp Records:", tempRecords);

      // Display the data immediately
      setRecords(tempRecords);

      // If there's an internet connection, sync data with MongoDB immediately
      if (isConnected) {
        await syncDataToMongoDB(jsonData);
      }

      // Save updated tempRecords to AsyncStorage
      await AsyncStorage.setItem("statData", JSON.stringify(tempRecords));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClearData = async () => {
    try {
      await AsyncStorage.removeItem("statData");
      setRecords({});
      console.log("Data cleared successfully.");
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>¡Hola! Hoy es: {currentDate}</Text>
      {records[currentDate] && records[currentDate].length > 0 ? (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Captura</Text>
          {statData && (
            <>
              <View style={styles.statsRow}>
                <Text style={styles.leftText}>Fecha:</Text>
                <Text>{statData.fecha}</Text>
              </View>
              <View style={styles.statsRow}>
                <Text style={styles.leftText}>Hora:</Text>
                <Text>{statData.hora}</Text>
              </View>
              <View style={styles.statsRow}>
                <Text style={styles.leftText}>Porcentaje modelo:</Text>
                <Text style={styles.greenText}>{statData.porcentaje_modelo}%</Text>
              </View>
              <View style={styles.statsRow}>
                <Text style={styles.leftText}>Porcentaje error:</Text>
                <Text style={styles.redText}>{statData.porcentaje_error}%</Text>
              </View>
            </>
          )}
        </View>
      ) : (
        <View style={styles.noCaptureContainer}>
          <Text style={styles.noCaptureText}>
            Aún no has realizado ninguna captura hoy.
          </Text>
          <LottieAnimation
            source={require("../../assets/lotties/potatoeWalking.json")}
            width={"50"}
            height={"50"}
          />
          <TouchableOpacity
            style={styles.captureButton}
            onPress={saveDataAndLoadFecha}
          >
            <Text style={styles.captureButtonText}>Capturar</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.clearDataContainer}>
        <Button title="Clear All Data" onPress={handleClearData} />
      </View>
      <TouchableOpacity
        style={styles.captureButton}
        onPress={saveDataAndLoadFecha}
      >
        <Text style={styles.captureButtonText}>Capturar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setShowRecords(!showRecords)}
        style={styles.showRecordsButton}
      >
        <View style={styles.buttonContainer}>
          <Text>Datos Guardados</Text>
          <Icon name={showRecords ? "arrow-up" : "arrow-down"} size={16} />
        </View>
      </TouchableOpacity>
      {showRecords && (
        <View style={styles.recordsContainer}>
          {Object.entries(records).map(([fecha, captureArray]) => (
            <View key={fecha}>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() =>
                  setSelectedDate(selectedDate === fecha ? null : fecha)
                }
              >
                <Text style={styles.boldText}>Fecha: {fecha}</Text>
                <Icon
                  name={selectedDate === fecha ? "folder-open" : "folder"}
                  size={15}
                />
              </TouchableOpacity>
              {selectedDate === fecha &&
                captureArray.map((capture, captureIndex) => (
                  <View key={captureIndex} style={styles.captureInfo}>
                    <View style={styles.captureRow}>
                      <Text style={styles.leftText}>Hora:</Text>
                      <Text>{capture.hora}</Text>
                    </View>
                    <View style={styles.captureRow}>
                      <Text style={styles.leftText}>Porcentaje modelo:</Text>
                      <Text style={styles.greenText}>
                        {capture.porcentaje_modelo}%
                      </Text>
                    </View>
                    <View style={styles.captureRow}>
                      <Text style={styles.leftText}>Porcentaje error:</Text>
                      <Text style={styles.redText}>
                        {capture.porcentaje_error}%
                      </Text>
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
    fontWeight: "bold",
    padding: 3,
    marginBottom: 10,
  },
  statsContainer: {
    marginTop: 10,
    backgroundColor: "gainsboro",
    overflow: "hidden",
    borderRadius: 10,
    padding: 10,
    
  },
  statsTitle: {
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
    overflow:'hidden',
    borderRadius: 5,
    padding: 5,
  },
  greenText: {
    color: "green",
    marginBottom: 3,
  },
  redText: {
    marginBottom: 5,
    color: "red",
  },
  noCaptureContainer: {
    backgroundColor: "gainsboro",
    overflow: "hidden",
    borderRadius: 20,
    alignItems: "center",
    shadowOffset: { width: -2, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  noCaptureText: {
    textAlign: "center",
    padding: 15,
    fontWeight: "500",
    backgroundColor: 'gray',
    color:'white',
    overflow: 'hidden',
    borderRadius: 10,
    marginTop: 15
  },
  captureButton: {
    alignItems: "center",
  },
  captureButtonText: {
    padding: 10,
    textAlign: "center",
    backgroundColor: "dodgerblue",
    color: "white",
    paddingBottom: 10,
    overflow: "hidden",
    borderRadius: 10,
    width: 180,
    marginBottom: 15,
    fontWeight: "bold",
  },
  showRecordsButton: {
    marginTop: 5,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  recordsContainer: {
    marginTop: 5,
    padding: 10,
    backgroundColor: "gainsboro",
    borderRadius: 10,
  },
  boldText: {
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 4,
  },
  captureInfo: {
    marginLeft: 5,
  },
  captureSeparator: {
    marginBottom: 2,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  captureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
});
