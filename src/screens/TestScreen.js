import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImageEditor } from "expo-crop-image";

export default function TestScreen() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && (
        <ImageEditor
          imageUri={image}
          onEditingCancel={() => {
            console.log("onEditingCancel");
            setImage(null);
          }}
          onEditingComplete={(image) => {
            console.log(image);
          }}
        />
      )}
    </View>
  );
}
