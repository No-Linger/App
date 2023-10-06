const defaultAssetExts =
  require("metro-config/src/defaults/defaults").assetExts;

module.exports = {
  resolver: {
    assetExts: [
      ...defaultAssetExts,
      "bin", // Add .bin as a recognized asset extension
    ],
  },
};
