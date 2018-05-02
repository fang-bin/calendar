const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].[hash:4].js',
    path: path.resolve('dist')
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: ExtractTextWebpackPlugin.extract({
          use: ['css-loader', 'postcss-loader','sass-loader']
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextWebpackPlugin.extract({
          use: ['css-loader', 'postcss-loader', 'less-loader']
        })
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            outputPath: '../images/'
          }
        }]
      },
      {
        test: /\.(htm|html)$/,
        use: 'html-withimg-loader'
      },
      {
        test: /\.(eot|woff|ttf|svg)$/,
        use: 'file-loader'
      },
      // {
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader', 'postcss-loader']
      // },
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: /src/,
        exclude: /node_modules/
      },
      {
        test: /\.jpg$/,
        loader: "file-loader"
      }, {
        test: /\.png$/,
        loader: "url-loader?mimetype=image/png"
      }, {
        test: /\.art$/,
        loader: "art-template-loader",
        options: {
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      hash: true
    }),
    new ExtractTextWebpackPlugin('css/style.[hash:4].css'),
    new CleanWebpackPlugin('dist'),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    port: 3000,             // 端口
    open: true,             // 自动打开浏览器
  },
  resolve: {
    alias: {   //别名
      $: './src/js/zepto.js'
    },
    extensions: ['.js','.json','.css']    //省略后缀
  },
  mode: 'development'
}