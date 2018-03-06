const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const WebpackPwaManifest = require('webpack-pwa-manifest');
// const WebpackMonitor = require('webpack-monitor');
// const webpack = require('webpack');

module.exports = function (env = {}) {
  return {
    context: path.resolve(__dirname, './example'),
    entry: {
      index: './index.js',
    },
    output: {
      path: path.join(__dirname, 'www'),
      filename: 'lib/[name].js',
    },
    devtool: 'sourcemap',
    module: {
      rules: [
        {
          test: /\.s?css$/,
          use: getCssLoader(env),
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: getBabelLoader(env),
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
      }),
    ],
    devServer: {
      compress: true,
      contentBase: path.join(__dirname, 'www'),
      host: '0.0.0.0',
    },
  };
};

function getCssLoader () {
  return [ 'style-loader', 'css-loader' ];
}

function getBabelLoader () {
  let plugins = [
    // require.resolve('babel-plugin-transform-async-to-generator'),
    require.resolve('babel-plugin-syntax-dynamic-import'),
    // require.resolve('babel-plugin-istanbul')
  ];

  let presets = [
    // require.resolve('babel-preset-es2015'),
    // require.resolve('babel-preset-stage-3'),
  ];

  return {
    loader: 'babel-loader',
    options: {
      babelrc: false,
      plugins,
      presets,
      cacheDirectory: true,
    },
  };
}