const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  devtool: false,
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    usedExports: true,
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
