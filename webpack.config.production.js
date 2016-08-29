import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import merge from 'webpack-merge';
import baseConfig from './webpack.config.base';

let extractCSS = new ExtractTextPlugin('style.css', { allChunks: true });

const config = merge(baseConfig, {
  devtool: 'cheap-module-source-map',

  entry: './app/index',

  output: {
    publicPath: '../dist/'
  },

  module: {
    loaders: [
      {
        test: /\.scss$/i,
        loader: extractCSS.extract(['css','sass'])
      }
    ]
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    }),
    extractCSS
    // new ExtractTextPlugin('style.css', { allChunks: true })
  ],

  target: 'electron-renderer'
});

export default config;
