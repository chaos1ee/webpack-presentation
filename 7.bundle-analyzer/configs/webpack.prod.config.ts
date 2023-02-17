import CopyPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import type { Configuration, Module } from 'webpack'
import { merge } from 'webpack-merge'
import baseConfig from './webpack.base.config'
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const config: Configuration = merge(baseConfig, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                outputStyle: 'compressed',
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash].css',
      chunkFilename: 'static/css/[name].[contenthash].chunk.css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: '**/*',
          context: path.resolve(__dirname, '../public'),
          globOptions: {
            dot: true,
            ignore: ['**/mockServiceWorker.js'],
          },
        },
      ],
    }),
    new BundleAnalyzerPlugin(),
  ],
  // optimization: {
  //   runtimeChunk: true,
  //   chunkIds: 'deterministic',
  //   splitChunks: {
  //     hidePathInfo: true, // prevents the path from being used in the filename when using maxSize
  //     chunks: 'initial', // default is async, set to initial and then use async inside cacheGroups instead
  //     maxInitialRequests: Infinity, // Default is 3, make this unlimited if using HTTP/2
  //     maxAsyncRequests: Infinity, // Default is 5, make this unlimited if using HTTP/2
  //     // sizes are compared against source before minification
  //     minSize: 10000, // chunk is only created if it would be bigger than minSize
  //     maxSize: 40000, // splits chunks if bigger than 40k, added in webpack v4.15
  //     cacheGroups: {
  //       // create separate js files for bluebird, jQuery, bootstrap, aurelia and one for the remaining node modules
  //       default: false, // disable the built-in groups, default & vendors (vendors is overwritten below)
  //       // generic 'initial/sync' vendor node module splits: separates out larger modules
  //       vendorSplit: {
  //         // each node module as separate chunk file if module is bigger than minSize
  //         test: /[\\/]node_modules[\\/]/,
  //         name(module: Module) {
  //           // Extract the name of the package from the path segment after node_modules
  //           const packageName = (module.context ?? '').match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1]
  //           return `vendor.${packageName?.replace('@', '')}`
  //         },
  //         priority: 20,
  //       },
  //       vendors: {
  //         // picks up everything else being used from node_modules that is less than minSize
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendors',
  //         priority: 19,
  //         enforce: true, // create chunk regardless of the size of the chunk
  //       },
  //       // generic 'async' vendor node module splits: separates out larger modules
  //       vendorAsyncSplit: {
  //         // vendor async chunks, create each asynchronously used node module as separate chunk file if module is bigger than minSize
  //         test: /[\\/]node_modules[\\/]/,
  //         name(module: Module) {
  //           const packageName = (module.context ?? '').match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1]
  //           return `vendor.async.${packageName?.replace('@', '')}`
  //         },
  //         chunks: 'async',
  //         priority: 10,
  //         reuseExistingChunk: true,
  //         minSize: 5000, // only create if 5k or larger
  //       },
  //       vendorsAsync: {
  //         // vendors async chunk, remaining asynchronously used node modules as single chunk file
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendors.async',
  //         chunks: 'async',
  //         priority: 9,
  //         reuseExistingChunk: true,
  //         enforce: true, // create chunk regardless of the size of the chunk
  //       },
  //       // generic 'async' common module splits: separates out larger modules
  //       commonAsync: {
  //         // common async chunks, each asynchronously used module as a separate chunk files
  //         name(module: Module) {
  //           // Extract the name of the module from last path component. 'src/modulename/' results in 'modulename'
  //           const moduleName = (module.context ?? '').match(/[^\\/]+(?=\/$|$)/)?.[0]
  //           return `common.async.${moduleName?.replace('@', '')}`
  //         },
  //         minChunks: 2, // Minimum number of chunks that must share a module before splitting
  //         chunks: 'async',
  //         priority: 1,
  //         reuseExistingChunk: true,
  //         minSize: 5000, // only create if 5k or larger
  //       },
  //       commonsAsync: {
  //         // commons async chunk, remaining asynchronously used modules as single chunk file
  //         name: 'commons.async',
  //         minChunks: 2, // Minimum number of chunks that must share a module before splitting
  //         chunks: 'async',
  //         priority: 0,
  //         reuseExistingChunk: true,
  //         enforce: true, // create chunk regardless of the size of the chunk
  //       },
  //     },
  //   },
  // },
})

export default config
