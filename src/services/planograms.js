import { PLANOGRAM_API } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

export const resetPlanogramTracker = async () => {
  await AsyncStorage.setItem("planograms", JSON.stringify({}));
  return {};
};

export const getLocalPlanograms = async () => {
  let actualPlanograms = await AsyncStorage.getItem("planograms");
  console.log(actualPlanograms);
  actualPlanograms = JSON.parse(actualPlanograms);
  if (!actualPlanograms) {
    await AsyncStorage.setItem("planograms", JSON.stringify({}));
    actualPlanograms = {};
  }
  return actualPlanograms;
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
        actualPlanograms[id]["grid"] = [];
      }
    }
    await AsyncStorage.setItem("planograms", JSON.stringify(actualPlanograms));
    console.log("Planogram storage updated!");
    return actualPlanograms;
  } catch (err) {
    console.log(err);
  }
};
