const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

function getStyleLoader (pre) {
  return [
    // Creates `style` nodes from JS strings
    // 以 MiniCssExtractPlugin.loader 取代 style-loader
    { loader: MiniCssExtractPlugin.loader },
    // Translates CSS into CommonJS
    {
      loader: 'css-loader',
      options: {
        url: true
      }
    },
    { loader: 'postcss-loader' },
    pre
  ].filter(Boolean)
}

module.exports = ({
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/main.bundle.js',
    assetModuleFilename: 'static/images/[hash:10][ext][query]',
    clean: true
  },
  module: {
    rules: [
      {
        // oneOf 設置每個文件僅能被一種loader處理，增加效率
        oneOf: [
          {
            test: /\.(png|svg|jpg|jpeg|gif|txt)$/i,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                // 轉成base64可以減少發送請求，但是資料體積會變大。
                // 小於10kb則轉base64。
                maxSize: 10 * 1024
              }
            }
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
            generator: {
              filename: 'static/media/[name][ext]'
            }
          },
          {
            test: /\.css$/i,
            use: getStyleLoader()
          },
          {
            test: /\.(s[ac]ss)$/i,
            use: getStyleLoader('sass-loader')
          },
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader'
              //   options: {
              //     presets: ['@babel/preset-env']
              //   }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx']
  },
  plugins: [
    new CssMinimizerPlugin(),
    new ESLintPlugin({
      context: path.resolve(__dirname, 'src'),
      fix: true
    }),
    /* 只是要在 HTML 添加打包好的 webpack 檔案 */
    // new HtmlWebpackPlugin(),
    /* 或者也可以定義要使用的樣版，或其他更多參數 */
    new HtmlWebpackPlugin({
      title: 'webpack 測試頁面',
      template: './index.html' // 以 index.html 這支檔案當作模版注入 html
    })
  ]
})