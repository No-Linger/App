const defaultAssetExts =
  require("metro-config/src/defaults/defaults").assetExts;

module.exports = {
  resolver: {
    assetExts: [
      ...defaultAssetExts,
      "lottie",
      "bin", // Add .bin as a recognized asset extension
    ],
  },
};
