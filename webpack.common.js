const os = require('os')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const threads = os.cpus().length// CPU核數

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
  entry: { main: './src/main.js', app: './src/app.js' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].bundle.js',
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
            use: [
              {
                loader: 'thread-loader',
                options: {
                  works: threads
                }
              },
              {
                loader: 'babel-loader',
                options: {
                // presets: ['@babel/preset-env']
                // 開啟babel緩存，加快打包速度
                  cacheDirectory: true,
                  // 關閉緩存文件壓縮
                  cacheCompression: false,
                  plugins: [
                    [
                      // 減少代碼體積
                      '@babel/plugin-transform-runtime',
                      {
                        absoluteRuntime: false,
                        corejs: false,
                        helpers: true,
                        regenerator: true,
                        version: '7.0.0-beta.0'
                      }
                    ]
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx']
  },
  plugins: [
    new ESLintPlugin({
      context: path.resolve(__dirname, 'src'),
      // fix: true,
      cache: true,
      cacheLocation: path.resolve(__dirname, './node_modules/.cache/eslintcache'),
      threads
    }),
    /* 只是要在 HTML 添加打包好的 webpack 檔案 */
    // new HtmlWebpackPlugin(),
    /* 或者也可以定義要使用的樣版，或其他更多參數 */
    new HtmlWebpackPlugin({
      title: 'webpack 測試頁面',
      template: './index.html' // 以 index.html 這支檔案當作模版注入 html
    })
  ],
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [
      // 壓縮JS
      new TerserWebpackPlugin({
        parallel: threads
        // exclude: /\.(js)$/i
      }),
      // 壓縮CSS
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000, // 超過50KB一定會單獨打包
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
})
