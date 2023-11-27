import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO, decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as ImageManipulator from "expo-image-manipulator";

const categories = [
  "adobadas",
  "cheetos",
  "cheetos-hot",
  "cheetos-mix",
  "churrumais",
  "doritos-dinamita",
  "doritos-hot",
  "doritos-nacho",
  "fritos-chorizo",
  "nothing",
  "rancheritos",
  "ruffles",
  "ruffles-jalapeno",
  "ruffles-queso",
  "sabritas",
  "sabritas-limon",
  "tostitos-hot",
];

export const indexToString = (index) => {
  return categories[index];
};

export const loadModel = async () => {
  try {
    await tf.ready();
    console.log("Tensorflow Ready!");
    const modelJson = require("../model/model.json");
    const modelWeights1 = require("../model/group1-shard1of1.bin");

    let start = performance.now();
    const model = await tf.loadGraphModel(
      bundleResourceIO(modelJson, modelWeights1)
    );
    let end = performance.now();

    console.log("Model Loaded in : ", ((end - start) / 1000).toFixed(2));
    return model;
  } catch (err) {
    console.log(err);
    console.log("model load failed 🙃");
  }
};

export const sliceImage = async (uri, rows, cols) => {
  const imageInfo = await ImageManipulator.manipulateAsync(uri);
  const { width, height } = imageInfo;

  const pieceWidth = width / cols;
  const pieceHeight = height / rows;

  const slices = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
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
  return categorieId;
};

export const classifyGrid = async (model, imagesUris, rows, cols) => {
  let result = [];
  let imageTensor;
  let start = performance.now();
  let counter = 0;
  for (let i = 0; i < rows; i++) {
    let temp = [];
    for (let j = 0; j < cols; j++) {
      imageTensor = await preprocessImage(imagesUris[counter]);
      let predcition = tf.tidy(() => {
        return model.predict(imageTensor);
      });
      let label = await getLabel(predcition);
      temp.push(label);
      console.log(categories[label]);
      counter++;
    }
    result.push(temp);
  }
  let end = performance.now();
  console.log("Image processed in : ", ((end - start) / 1000).toFixed(2));
  return result;
};

const calculateError = async (resultMatrix) => {
  let totalCount = 0;
  let falseCount = 0;

  for (let i = 0; i < resultMatrix.length; i++) {
    for (let j = 0; j < resultMatrix[i].length; j++) {
      totalCount++;
      if (resultMatrix[i][j] === false) {
        falseCount++;
      }
    }
  }
  return { errorPercentage: (falseCount / totalCount) * 100, falseCount };
};

export const comparePlanogram = async (
  planogramMatrix,
  gridImages,
  rows,
  cols
) => {
  try {
    let res = [];
    for (let i = 0; i < rows; i++) {
      let temp = [];
      for (let j = 0; j < cols; j++) {
        temp.push(planogramMatrix[i][j] == gridImages[i][j]);
      }
      res.push(temp);
    }
    const { errorPercentage, falseCount } = await calculateError(res);
    return { compareMatrix: res, errorPercentage, falseCount };
  } catch (err) {
    console.log(err);
  }
};
