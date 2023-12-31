//import { PLANOGRAM_API } from "@env";
const PLANOGRAM_API = "https://api.stage.no-linger.tech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { classifyGrid, sliceImage } from "./chipRecognition";
import { Image } from "react-native";
import { authClient } from "./firebaseConfig";

export const resetPlanogramTracker = async () => {
  const actual = await getLocalPlanograms();
  try {
    actual.map(
      async (value, index) => await FileSystem.deleteAsync(value.localUri)
    );
  } catch (err) {}
  await AsyncStorage.setItem("planograms", JSON.stringify({}));
  await AsyncStorage.setItem("planogramsMatrix", JSON.stringify({}));
  return {};
};

export const getLocalPlanograms = async () => {
  let actualPlanograms = await AsyncStorage.getItem("planograms");
  actualPlanograms = JSON.parse(actualPlanograms);
  if (!actualPlanograms) {
    await AsyncStorage.setItem("planograms", JSON.stringify({}));
    actualPlanograms = {};
  }
  return actualPlanograms;
};

export const getLocalPlanogramsMatrix = async () => {
  let actualPlanogramsMatrix = await AsyncStorage.getItem("planogramsMatrix");
  actualPlanogramsMatrix = JSON.parse(actualPlanogramsMatrix);
  if (!actualPlanogramsMatrix) {
    await AsyncStorage.setItem("planogramsMatrix", JSON.stringify({}));
    actualPlanogramsMatrix = {};
  }
  return actualPlanogramsMatrix;
};

function fetchWithTimeout(url, options, timeout = 3000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeout)
    ),
  ]);
}

function transformJsonArray(jsonArray) {
  return jsonArray.map((item) => {
    return {
      _id: item._id,
      url: item.Ver,
      name: item.Nombre,
      tienda: item.Tienda,
      fecha: formatDate(item.Fecha),
    };
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formattedDate;
}

export const updatePlanogramRecord = async () => {
  try {
    const response = await fetchWithTimeout(PLANOGRAM_API + "/getPlanograms", {
      headers: {
        Authorization: await authClient.currentUser.getIdToken(),
      },
    });
    const data = await response.json();
    let planograms = transformJsonArray(data.planograms);
    let actualPlanograms = await getLocalPlanograms();
    let actualPlanogramsKeys = Object.keys(actualPlanograms);
    for (let planogram of planograms) {
      if (!actualPlanogramsKeys.includes(planogram["_id"])) {
        const id = planogram["_id"];
        delete planogram["_id"];
        actualPlanograms[id] = planogram;
        actualPlanograms[id]["downloaded"] = false;
        actualPlanograms[id]["processed"] = false;
        actualPlanograms[id]["localUri"] = "";
      }
    }
    await AsyncStorage.setItem("planograms", JSON.stringify(actualPlanograms));
    return actualPlanograms;
  } catch (err) {
    console.log(err);
    return {};
  }
};

const getLocalImageSize = async (uri) => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => {
        resolve({ width, height });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

export const downloadPlanogram = async (planogramId) => {
  let actualPlanograms = await getLocalPlanograms();
  const fileType = actualPlanograms[planogramId].url.split(".").pop();
  const localUri = `${FileSystem.documentDirectory}${
    planogramId + "." + fileType
  }`;
  try {
    const { uri } = await FileSystem.downloadAsync(
      actualPlanograms[planogramId].url,
      localUri
    );
    const { width, height } = await getLocalImageSize(uri);
    actualPlanograms[planogramId]["downloaded"] = true;
    actualPlanograms[planogramId]["localUri"] = uri;
    actualPlanograms[planogramId]["width"] = width;
    actualPlanograms[planogramId]["height"] = height;
    await AsyncStorage.setItem("planograms", JSON.stringify(actualPlanograms));
    return actualPlanograms;
  } catch (err) {
    console.log("Error", err);
  }
};

export const processPlanogram = async (model, planogramId, uri, cols, rows) => {
  const slices = await sliceImage(uri, rows, cols);
  const predicitons = await classifyGrid(model, slices, rows, cols);
  let actualPlanograms = await getLocalPlanograms();
  actualPlanograms[planogramId]["cols"] = cols;
  actualPlanograms[planogramId]["rows"] = rows;
  actualPlanograms[planogramId]["processed"] = true;
  let actualPlanogramsMatrix = await getLocalPlanogramsMatrix();
  actualPlanogramsMatrix[planogramId] = predicitons;
  await AsyncStorage.setItem(
    "planogramsMatrix",
    JSON.stringify(actualPlanogramsMatrix)
  );
  await AsyncStorage.setItem("planograms", JSON.stringify(actualPlanograms));
  return actualPlanograms;
};

export const deletePlanogramRecord = async (planogramId, uri) => {
  let actualPlanograms = await getLocalPlanograms();
  let actualPlanogramsMatrix = await getLocalPlanogramsMatrix();
  if (actualPlanograms[planogramId]) {
    delete actualPlanograms[planogramId];
  }
  if (actualPlanogramsMatrix[planogramId]) {
    delete actualPlanogramsMatrix[planogramId];
  }
  await AsyncStorage.setItem(
    "planogramsMatrix",
    JSON.stringify(actualPlanogramsMatrix)
  );
  await AsyncStorage.setItem("planograms", JSON.stringify(actualPlanograms));
  await FileSystem.deleteAsync(uri);
  return actualPlanograms;
};

export const addCustomePlanogram = async (tempUri, planogram) => {
  let actualPlanograms = await getLocalPlanograms();
  const id = "id-" + Date.now();
  actualPlanograms[id] = planogram;
  actualPlanograms[id]["downloaded"] = true;
  actualPlanograms[id]["processed"] = false;

  const fileType = tempUri.split(".").pop();
  const localUri = `${FileSystem.documentDirectory}${id + "." + fileType}`;
  try {
    await FileSystem.copyAsync({ from: tempUri, to: localUri });
    actualPlanograms[id]["localUri"] = localUri;
    await AsyncStorage.setItem("planograms", JSON.stringify(actualPlanograms));
    return { id, localUri };
  } catch (err) {
    console.warn(err);
  }
};
