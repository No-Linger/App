import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO, decodeJpeg } from "@tensorflow/tfjs-react-native";

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
    const modelWeights1 = require("../model/group1-shard1of9.bin");
    const modelWeights2 = require("../model/group1-shard2of9.bin");
    const modelWeights3 = require("../model/group1-shard3of9.bin");
    const modelWeights4 = require("../model/group1-shard4of9.bin");
    const modelWeights5 = require("../model/group1-shard5of9.bin");
    const modelWeights6 = require("../model/group1-shard6of9.bin");
    const modelWeights7 = require("../model/group1-shard7of9.bin");
    const modelWeights8 = require("../model/group1-shard8of9.bin");
    const modelWeights9 = require("../model/group1-shard9of9.bin");

    console.log("Starting model load:", new Date().toISOString());
    const model = await tf.loadLayersModel(
      bundleResourceIO(modelJson, [
        modelWeights1,
        modelWeights2,
        modelWeights3,
        modelWeights4,
        modelWeights5,
        modelWeights6,
        modelWeights7,
        modelWeights8,
        modelWeights9,
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
    const response = await fetch(uri, {}, { isBinary: true });
    const imageDataArrayBuffer = await response.arrayBuffer();
    const imageData = new Uint8Array(imageDataArrayBuffer);

    imagePreprocessed = tf.tidy(() => {
      const imageTensor = decodeJpeg(imageData);
      const imageTensorFloat = tf.cast(imageTensor, "float32");
      const normalizedTensor = tf.div(imageTensorFloat, 255.0);
      const resizedTensor = tf.image.resizeBilinear(
        normalizedTensor,
        [200, 200]
      );
      const transformedImage = tf.expandDims(resizedTensor, 0);
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
  console.log("Categorie : ", categories[categorieId]);
};
