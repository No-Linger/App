import { PLANOGRAM_API } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

export const getPlanograms = async () => {
  try {
    const response = await fetch(PLANOGRAM_API + "/getPlanograms");
    const data = await response.json();
    const storageKeys = await AsyncStorage.getAllKeys();
    if (!storageKeys.includes("planograms")) {
      await AsyncStorage.setItem("planograms", JSON.stringify({}));
    }
    let actualPlanograms = await AsyncStorage.getItem("planograms");
    actualPlanograms = JSON.parse(actualPlanograms);
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
