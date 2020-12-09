const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const config = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: ['@babel/polyfill', './index.ts'],
  output: {
    filename: 'bundle.[fullhash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
      extensions: ['.ts', '.tsx', '.js', '.scss', '.css' ],
      alias: {
          '@': path.resolve(__dirname, 'src'),
          '@core': path.resolve(__dirname, 'src/core'),
      }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
        template: 'index.html',
        removeComments: isProd,
        collapse: isProd,
    }),
    new CopyPlugin({
        patterns: [
          { 
              from: path.resolve(__dirname, 'src/favicon.ico'), 
              to: path.resolve(__dirname, 'dist'),
          },
        ],
      }),
    new MiniCssExtractPlugin({
        filename: 'bundle.[fullhash].css',
        
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: isDev ? 'source-map' : false,
  devServer: {
    hot: isDev,
    port: 3050,
    contentBase: path.resolve(__dirname, 'src'),
    inline: true,
    publicPath: '/',
    watchContentBase: true,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          }
        ],
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript',
              ],
              plugins: [
                '@babel/proposal-class-properties',
                '@babel/proposal-object-rest-spread',
              ],
            }
          }
        ],
        exclude: /node_modules/,
      },
    ],
  },
}

module.exports = config
