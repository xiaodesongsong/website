const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');
const isDEV = process.env.NODE_ENV == "development";
//处理非js代码文件
const ExtractPlugin = require('extract-text-webpack-plugin');
// const ExtractPlugin = require('');

const config = {
    target: 'web',
    entry:{
      app:'./src/index.js'
    },
    output:{
      filename: 'bundle.[hash:8].js',
      path:path.join(__dirname,'./dist')
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
            // {
            //     test: /\.styl/,
            //     use: [
            //     'style-loader',
            //     'css-loader',
            //     {
            //         loader : 'postcss-loader',
            //         options:  {
            //         sourceMap: true,
            //         }
            //     },
            //     'stylus-loader'
            //     ]
            // }
        ]
    },
    plugins:[
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.join('./index.html'),
        }),
        new webpack.DefinePlugin({
            'process.env': {
            NODE_ENV: isDEV?'"development"':'"production"'
            }
        })
    ]
}
if(isDEV){
    //
    config.output.filename='bundle.[hash:8]js',
    //
    config.module.rules.push({
        test: /\.css$/,
        use: ['style-loader','css-loader']
    },{
        test:/\.less$/,
        loader:['style-loader','css-loader','less-loader']
    })
    //页面调试工具 
    config.devtool = '#cheap-module-eval-source-map'
    config.devServer = {
        port: 8000,
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
}else{
    config.entry ={
        app: path.join(__dirname,'./src/index.js'),
        vendor: ['vue'] //需要单独打包出来的文件，可以长时间的保存
    },
    //与hash的区别是：他可以生成多个节点，产生不同的hash吗
    config.output.filename = '[name].[chunkhash:8].js',
    config.module.rules.push(
        {
            test:/\.less$/,
            use: ExtractPlugin.extract({
                use: ['style-loader','css-loader','less-loader']
            })
        },
        {
            test:/\.css$/,
            use: ExtractPlugin.extract({
                use: ['style-loader','css-loader']
            })
        })
    config.plugins.push(
        new ExtractPlugin('[name].[hash:8].css'),
        //将vue
        new webpack.optimize.CommonsChunkPlugin({
            name:'vendor'
        }),
        //将webpack单独生成一个文件,充分利用浏览器的长缓存
        new webpack.optimize.CommonsChunkPlugin({
            name:'runtime'
        })
    )

}
module.exports =  config;
