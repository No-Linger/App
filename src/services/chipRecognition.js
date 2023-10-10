import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO, decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { Buffer } from "buffer";

const categories = [
  "adobadas",
  "chips",
  "doritos",
  "jalapeno",
  "rancheritos",
  "ruffles",
];

export const loadModel = async () => {
  try {
    await tf.ready();
    console.log("Tensorflow Ready!");
    const modelJson = require("../model/model.json");
    const modelWeights1 = require("../model/group1-shard1of4.bin");
    const modelWeights2 = require("../model/group1-shard2of4.bin");
    const modelWeights3 = require("../model/group1-shard3of4.bin");
    const modelWeights4 = require("../model/group1-shard4of4.bin");

    console.log("Starting model load:", new Date().toISOString());
    const model = await tf.loadLayersModel(
      bundleResourceIO(modelJson, [
        modelWeights1,
        modelWeights2,
        modelWeights3,
        modelWeights4,
      ])
    );
    console.log("Finished model load:", new Date().toISOString());
    return model;
  } catch (err) {
    console.log("model load failed 🙃");
  }
};

export const preprocessImage = async (uri) => {
  let imagePreprocessed;
  try {
    console.log("preprocessing image ...");
    const resizedImage = await ImageManipulator.manipulateAsync(uri, [
      { resize: { width: 224, height: 224 } },
    ]);
    const response = await fetch(resizedImage.uri, {}, { isBinary: true });
    const imageDataArrayBuffer = await response.arrayBuffer();
    const imageData = new Uint8Array(imageDataArrayBuffer);

    imagePreprocessed = tf.tidy(() => {
      const imageTensor = decodeJpeg(imageData);
      const imageTensorFloat = tf.cast(imageTensor, "float32");
      const dividedImage = tf.div(imageTensorFloat, 127.5);
      const normalizedImage = tf.sub(dividedImage, 1);
      const transformedImage = tf.expandDims(normalizedImage, 0);
      return transformedImage;
    });
    console.log("image processed succesfully!");
  } catch (err) {
    console.log(err);
    console.log("image transformationa failed 😫");
  }
  return imagePreprocessed;
};

export const getLabel = async (results) => {
  const predictionLabel = await tf.argMax(results, 1).data();
  const categorieId = predictionLabel[0];
  console.log("Categorie : ", categories[categorieId]);
};
