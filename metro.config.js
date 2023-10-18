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
// const path = require('path');
// const defaultAssetExts =
//   require("metro-config/src/defaults/defaults").assetExts;

// module.exports = {
//   resolver: {
//     extraNodeModules: {
//       'LoginConfig': path.resolve(__dirname, 'Login.config.js'),
//     },
//     assetExts: [
//       ...defaultAssetExts,
//       "bin", // Add .bin as a recognized asset extension
//     ],
//   },
// };

