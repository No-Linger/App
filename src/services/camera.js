import { Camera } from "expo-camera";

export async function getCameraPermission() {
  const { status } = await Camera.requestCameraPermissionsAsync();
  if (status !== "granted") {
    alert("Sorry, we need camera permissions to make this work!");
    return false;
  }
  return true;
}
