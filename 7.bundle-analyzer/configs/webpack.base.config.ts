import dotenv from 'dotenv'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import type { Configuration } from 'mini-css-extract-plugin'
import path from 'path'
import webpack from 'webpack'

function loadEnv(pathname: string) {
  dotenv.config({ path: path.resolve(__dirname, '../environments', pathname), override: true })
}

loadEnv('.env')
loadEnv(`.env.${process.env.NODE_ENV}`)

const { ModuleFederationPlugin } = webpack.container
const dependencies = require('../package.json').dependencies

const config: Configuration = {
  context: path.resolve(__dirname, '../src'),
  entry: './main.tsx',
  output: {
    clean: true,
    asyncChunks: true,
    path: path.resolve(__dirname, '../dist'),
    filename: 'static/js/[name].[contenthash].js',
    chunkFilename: 'static/js/[name].[contenthash].chunk.js',
    assetModuleFilename: 'static/assets/[name].[hash][ext]',
    // Webpack module federation 需要配置成 'auto' 不然会加载 chunk 失败
    publicPath: 'auto',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '~': path.resolve(__dirname, '../src'),
    },
  },
  stats: {
    children: true,
    errorDetails: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
      title: process.env.SITE_TITLE,
      // 防止刷新时出现 404 错误
      publicPath: '/',
      base: process.env.BASE_URL || '/',
    }),
    new ModuleFederationPlugin({
      remotes: {
        sun: 'sun@http://localhost:3000/remoteEntry.js',
      },
      shared: {
        ...dependencies,
      },
    }),
  ],
  experiments: {
    topLevelAwait: true,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        defaultVendors: false,
      },
    },
  },
}

export default config
