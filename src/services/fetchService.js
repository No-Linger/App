import AsyncStorage from "@react-native-async-storage/async-storage";

const generateRandomPercentage = () => Math.round(Math.random() * 100);

const saveDataToAsyncStorage = async () => {
  const jsonData = {
    planograma : 'Sabritas',
    fecha: new Date().toLocaleDateString(),
    hora: new Date().toLocaleTimeString(),
    porcentaje_modelo: generateRandomPercentage(),
    porcentaje_error: generateRandomPercentage(),
    id_sucursal: 123456
  };

  try {
    // Get existing data from AsyncStorage
    const existingData = await AsyncStorage.getItem("statData");
    let newData = {};

    if (existingData) {
      newData = JSON.parse(existingData);
    }

    if (!newData[jsonData.fecha]) {
      newData[jsonData.fecha] = [];
    }

    // Append the new capture to the data for today
    newData[jsonData.fecha].push(jsonData);

    // Add a timestamp to the data
    jsonData.timestamp = Date.now();

    // Store the updated data in AsyncStorage
    await AsyncStorage.setItem("statData", JSON.stringify(newData));

    // Remove old data (optional)
    removeOldData(newData);

    console.log("Capture data saved:", jsonData);

    return jsonData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const removeOldData = async (data) => {
  const expirationTime = 48 * 60 * 60 * 1000;

  for (const date in data) {
    data[date] = data[date].filter((item) => {
      return Date.now() - item.timestamp <= expirationTime;
    });
  }

  await AsyncStorage.setItem("statData", JSON.stringify(data));
};

const getDataFromAsyncStorage = async () => {
  try {
    const data = await AsyncStorage.getItem("statData");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    console.log("All data cleared");
  } catch (error) {
    console.error("Error clearing data:", error);
  }
};

export { generateRandomPercentage, saveDataToAsyncStorage, getDataFromAsyncStorage, clearAllData };