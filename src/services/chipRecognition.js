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

const COLS = 4;
const ROWS = 2;

export const loadModel = async () => {
  try {
    await tf.ready();
    console.log("Tensorflow Ready!");
    const modelJson = require("../model/model.json");
    const modelWeights1 = require("../model/group1-shard1of4.bin");
    const modelWeights2 = require("../model/group1-shard2of4.bin");
    const modelWeights3 = require("../model/group1-shard3of4.bin");
    const modelWeights4 = require("../model/group1-shard4of4.bin");

    let start = performance.now();
    const model = await tf.loadLayersModel(
      bundleResourceIO(modelJson, [
        modelWeights1,
        modelWeights2,
        modelWeights3,
        modelWeights4,
      ])
    );
    let end = performance.now();
    console.log("Model Loaded in : ", ((end - start) / 1000).toFixed(2));
    return model;
  } catch (err) {
    console.log("model load failed 🙃");
  }
};

export const sliceImage = async (uri) => {
  const imageInfo = await ImageManipulator.manipulateAsync(uri);
  const { width, height } = imageInfo;

  const pieceWidth = width / COLS;
  const pieceHeight = height / ROWS;

  const slices = [];

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const slice = await ImageManipulator.manipulateAsync(uri, [
        {
          crop: {
            originX: x * pieceWidth,
            originY: y * pieceHeight,
            width: pieceWidth,
            height: pieceHeight,
          },
        },
        { resize: { width: 224, height: 224 } },
      ]);
      slices.push(slice.uri);
    }
  }
  return slices;
};

export const preprocessImage = async (uri) => {
  let imagePreprocessed;
  try {
    const response = await fetch(uri, {}, { isBinary: true });
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
  } catch (err) {
    console.log(err);
    console.log("image transformationa failed 😫");
  }
  return imagePreprocessed;
};

export const getLabel = async (results) => {
  const predictionLabel = await tf.argMax(results, 1).data();
  const categorieId = predictionLabel[0];
  return categories[categorieId];
};

export const classifyGrid = async (model, imagesUris) => {
  let result = [];
  let imageTensor;
  let start = performance.now();
  for (let i = 0; i < ROWS; i++) {
    let temp = [];
    for (let j = 0; j < COLS; j++) {
      imageTensor = await preprocessImage(imagesUris[i + j]);
      let predcition = tf.tidy(() => {
        return model.predict(imageTensor);
      });
      let label = await getLabel(predcition);
      temp.push(label);
    }
    result.push(temp);
  }
  let end = performance.now();
  console.log("Image processed in : ", ((end - start) / 1000).toFixed(2));
  return result;
};
