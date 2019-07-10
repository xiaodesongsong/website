const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');
const isDEV = true;
//处理非js代码文件
const ExtractPlugin = require('extract-text-webpack-plugin');

const config = {
    target: 'web',
    entry:{
      app:'./src/index.js'
    },
    output:{
      filename: 'bundle.[hash:8].js',
      path:path.join(__dirname,'./dist')
    },
    resolve: {
      extensions: ['','.js', '.vue', '.json'],
      alias: {
        '@':path.join('./src')
      }
    },
    //处理文件
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader'] 
            },
            {
              test:/\.(gif|jpg|png|jpeg|svg|bmp)$/,
              use:[
                {
                  loader: 'url-loader',
                  options:{
                      limit: 1024,
                      name: '[name].[ext]'
                  }
                }
              ]
            },
            {
              test: /\.css$/,
              use: ['style-loader','css-loader']
            }
            ,{
              test:/\.less$/,
              loader:['style-loader','css-loader','less-loader']
            }
           
        ]
    },
    plugins:[
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.join('./index.html'),
        })
    ]
}
if(isDEV){
    //页面调试工具 
    config.devServer = {
        port: 8081,
        host:'0.0.0.0',
        overlay:{
            errors:true
        },
        //启动时自动打开浏览器
        // open:true,
        hot: true
    }
    // 热加载所需配置,插件
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    )
}
module.exports =  config;
