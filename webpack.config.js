const path = require("path");
const ZipPlugin = require("zip-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "docs"),
  },
  watch: process.argv.indexOf("--watch") > -1,
  plugins: [
    new ZipPlugin({
      include: [/\.js$/, /\.html$/],
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
  ], 
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: true,
        terserOptions: {
          output: {
            comments: false,
          }
        },
      }),
      new HtmlMinimizerPlugin(),
    ],
  },
};
