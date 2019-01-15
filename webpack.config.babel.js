import path from 'path';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import WorkboxPlugin from 'workbox-webpack-plugin';

import CopyWebpackPlugin from 'copy-webpack-plugin';

const config = {
  entry: {
    main: './src/index.js',
    creater: './src/creater.js',
    postcard: './src/postcard.js',
    list: './src/list.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.hbs$/,
        use: [
          {
            loader: 'handlebars-loader',
            options: {
              inlineRequires: /(images)/,
              minify: true,
            },
          },
          'html-minify-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '',
            },
          },
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          {
            loader: 'eslint-loader',
          },
        ],
      },
      {
        test: /\.(jpg|png|svg)$/,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: './public/assets',
      to: './',
    }]),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: './public/index.hbs',
      filename: 'index.html',
      chunks: ['main', 'creater'],
    }),
    new HtmlWebpackPlugin({
      template: './public/postcard.hbs',
      filename: 'postcard.html',
      chunks: ['main', 'postcard'],
    }),
    new HtmlWebpackPlugin({
      template: './public/list.hbs',
      filename: 'list.html',
      chunks: ['main', 'list'],
    }),
    new HtmlWebpackPlugin({
      template: './public/404.hbs',
      filename: '404.html',
      chunks: ['main'],
    }),
  ],
};

export default (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'cheap-module-source-map';
  }

  if (argv.mode === 'production') {
    config.optimization = {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
        }),
        new OptimizeCSSAssetsPlugin({}),
      ],
    };

    config.plugins = [
      ...config.plugins,
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
      }),
    ];
  }

  return config;
};
