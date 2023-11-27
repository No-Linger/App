import AsyncStorage from "@react-native-async-storage/async-storage";

STATS_API = "http://10.48.74.125:8082/postStats";
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
    let response = await fetchWithTimeout(STATS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
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
    return data;
  } else {
    return [];
  }
};

// Manejador del botón para capturar datos
// separate ui and system
export const handleCapturar = async (capture) => {
  console.log("uploading", capture);
  let data = await AsyncStorage.getItem("capturas");
  data = JSON.parse(data);
  if (!Array.isArray(data)) {
    data = [];
  }
  capture["uploaded"] = false;
  data.push(capture);
  let newRecords = await tryUploadRecords(data);
  await AsyncStorage.setItem("capturas", JSON.stringify(newRecords));
};
