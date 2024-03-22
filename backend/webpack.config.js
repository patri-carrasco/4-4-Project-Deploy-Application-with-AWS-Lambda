const path = require("path");
const slsw = require("serverless-webpack");
// var nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  entry: slsw.lib.entries,
  // externals: [nodeExternals()],
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".mjs", ".json"],
  },
  output: {
    libraryTarget: "commonjs",
    path: path.resolve(__dirname, ".webpack"),
    filename: "[name].js",
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        type: "javascript/auto",
        test: /\.mjs$/,
        use: [],
      },
    ],
  },
};
