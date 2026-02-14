const path = require("path");

module.exports = {
  target: "web",
  entry: path.resolve(__dirname, "client.js"),
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
    clean: false
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            envName: "client"
          }
        }
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  devtool: "source-map"
};

