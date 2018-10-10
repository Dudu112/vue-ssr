const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const isProd = process.env.NODE_ENV === 'production'


const config = {
    mode:process.env.NODE_ENV || 'development',
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: '[name].[chunkhash].js'
    },
    optimization:{
        minimizer:[]
    },
    devtool: '#source-map',
    resolve: {
        alias: {
        },
        extensions: ['.vue', '.js', '.json','.css','less']
    },
    module: {
        rules: [
            {
                test: /.vue$/,
                use: 'eslint-loader',
                enforce: 'pre',
                exclude: [/node_modules/]
            }, {
                test: /.js$/,
                use: 'eslint-loader',
                enforce: 'pre',
                exclude: [/node_modules/,/src\\static/]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    preserveWhitespace: false,
                    postcss: [
                        require('autoprefixer')({
                            browsers: ['last 3 versions']
                        })
                    ],
                    optimizeSSR: isProd
                }
            },
            {
                test: /\.less$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'less-loader'
        ]
    },
{
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015'],
                        plugins: ["transform-runtime","syntax-dynamic-import"]
                    }
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {}
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
        //
    ],
    // performance: {
    //     hints: isProd ? 'error' : 'warning'
    // }
}
module.exports = config;