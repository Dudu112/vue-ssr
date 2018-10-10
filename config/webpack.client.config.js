const webpack = require('webpack');
const merge = require("webpack-merge");
const baseConf = require('./webpack.base.config');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const HTMLPlugin = require('html-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production'

const config = merge(baseConf,{
    entry:{
        app: './src/entry-client.js',
    },
    optimization:{
        splitChunks: {
            chunks: "async",
            name: 'common',
            // minChunks: 2,
        },
        minimizer:[]
    },
    plugins: [
        // generate output HTML
        new HTMLPlugin({
            template: 'src/index.html'
        }),
        //this is the plugin which generates a client build manifest that you need to preload resource or prefetch resource
        // new VueSSRClientPlugin()
    ]
})
if(isProd){
    config.optimization.minimizer.push(
        new UglifyJsPlugin()
    )
}

module.exports = config