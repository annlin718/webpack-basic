const webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      // production / development
      'process.env.NODE_ENV': JSON.stringify('production')
    }), new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      linkType: false,
      filename: 'static/css/[name].[hash:10].css',
      chunkFilename: 'static/css/[name].[hash:10].chunk.css'
    })
  ]
})
