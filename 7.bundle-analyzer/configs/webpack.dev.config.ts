import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import path from 'path'
import type { Configuration } from 'webpack'
import 'webpack-dev-server'
import { merge } from 'webpack-merge'
import baseConfig from './webpack.base.config'

const config: Configuration = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    client: {
      logging: 'verbose',
      overlay: true,
      progress: true,
    },
    port: 3000,
    hot: true,
    historyApiFallback: {
      index: '/',
      disableDotRule: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: path.resolve(__dirname, '../tsconfig.json'),
      },
    }),
  ],
})

export default config
