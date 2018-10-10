const webpack = require('webpack');
const merge = require("webpack-merge");
const baseConf = require('./webpack.base.config');
const VueSSRPlugin = require('vue-ssr-webpack-plugin').VueSSRServerPlugin;
var nodeExternals = require('webpack-node-externals');
const isProd = process.env.NODE_ENV === 'production'

const config = merge(baseConf, {
    target: 'node',
    entry: './src/entry-server.js',
    output: {
        // filename: 'server-bundle.js',
        libraryTarget: 'commonjs2'
    },
    externals: [nodeExternals()],
    plugins: [
        new VueSSRPlugin()
    ]
})
module.exports = config;