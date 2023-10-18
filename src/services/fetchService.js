import AsyncStorage from "@react-native-async-storage/async-storage";

const generateRandomPercentage = () => Math.round(Math.random() * 100);

const saveDataToAsyncStorage = async () => {
    const jsonData = {
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString(),
        porcentaje_modelo: generateRandomPercentage(),
        porcentaje_error: generateRandomPercentage(),
      };
    
      try {
        const existingData = await AsyncStorage.getItem("statData");
        let newData = {};
    
        if (existingData) {
          // Parse the existing data
          newData = JSON.parse(existingData);
        }
    
        if (!newData[jsonData.fecha]) {
          newData[jsonData.fecha] = [];
        }
    
        // Append the new capture to the data for today
        newData[jsonData.fecha].push(jsonData);
    
        // Store the updated data in AsyncStorage
        await AsyncStorage.setItem("statData", JSON.stringify(newData));
    
        console.log("Capture data saved:", jsonData);
    
        return jsonData;
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
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
