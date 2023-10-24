import { PLANOGRAM_API } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { classifyGrid, sliceImage } from "./chipRecognition";

export const resetPlanogramTracker = async () => {
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

export const updatePlanogramRecord = async () => {
  try {
    const response = await fetch(PLANOGRAM_API + "/getPlanograms");
    const data = await response.json();
    console.log(data);
    let actualPlanograms = await getLocalPlanograms();
    let actualPlanogramsKeys = Object.keys(actualPlanograms);
    for (let planogram of data.planograms) {
      if (!actualPlanogramsKeys.includes(planogram["_id"])) {
        const id = planogram["_id"];
        delete planogram["_id"];
        actualPlanograms[id] = planogram;
        actualPlanograms[id]["downloaded"] = false;
        actualPlanograms[id]["processed"] = false;
        actualPlanograms[id]["grid"] = null;
        actualPlanograms[id]["localUri"] = "";
      }
    }
    await AsyncStorage.setItem("planograms", JSON.stringify(actualPlanograms));
    console.log("Planogram storage updated!");
    return actualPlanograms;
  } catch (err) {
    console.log(err);
  }
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
    console.log(`Image saved to ${uri}`);
    actualPlanograms[planogramId]["downloaded"] = true;
    actualPlanograms[planogramId]["localUri"] = uri;
    await AsyncStorage.setItem("planograms", JSON.stringify(actualPlanograms));
    return actualPlanograms;
  } catch (err) {
    console.log("Error", err);
  }
};

export const processPlanogram = async (
  model,
  uri,
  planogramId,
  grid = [4, 2]
) => {
  const slices = await sliceImage(uri, grid);
  const predicitons = await classifyGrid(model, slices, grid);
  let actualPlanograms = await getLocalPlanograms();
  actualPlanograms[planogramId]["grid"] = grid;
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
  actualPlanograms[id]["grid"] = null;

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
