const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
// const fs = require('fs')
const _ = require('lodash')

let cesiumSource = './node_modules/cesium/Source'
let cesiumWorkers = '../Build/Cesium/Workers'

module.exports = {

    // 基本路径
    publicPath: "./",
    // 输出文件目录
    outputDir: "dist",
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,
    // webpack-dev-server 相关配置
    devServer: {
        open: process.platform === "darwin",
        host: "0.0.0.0",
        port: 5000,
        https: false,
        hotOnly: false,
        proxy: {
            '/rsvrApi': { //这里最好有一个 /
                target: 'http://220.180.11.124:8099/rsvrApi', // 后台接口域名
                ws: true, //如果要代理 websockets，配置这个参数
                secure: false, // 如果是https接口，需要配置这个参数
                changeOrigin: true, //是否跨域
                pathRewrite: {
                    '^/rsvrApi': ''
                }
            },
            '/map': { //这里最好有一个 /
                target: 'http://220.180.11.124:8099/map', // 后台接口域名
                ws: true, //如果要代理 websockets，配置这个参数
                secure: false, // 如果是https接口，需要配置这个参数
                changeOrigin: true, //是否跨域
                pathRewrite: {
                    '^/map': ''
                }
            },
            '/public': { //这里最好有一个 /
                target: 'http://220.180.11.124:8099/public', // 后台接口域名
                ws: true, //如果要代理 websockets，配置这个参数
                secure: false, // 如果是https接口，需要配置这个参数
                changeOrigin: true, //是否跨域
                pathRewrite: {
                    '^/public': ''
                }
            },
            // '/rsvrApi': { //这里最好有一个 /
            //     target: 'http://10.6.179.37:8099/rsvrApi', // 后台接口域名
            //     ws: true, //如果要代理 websockets，配置这个参数
            //     secure: false, // 如果是https接口，需要配置这个参数
            //     changeOrigin: true, //是否跨域
            //     pathRewrite: {
            //         '^/rsvrApi': ''
            //     }
            // },
            /*'/rsvrmanage': { //这里最好有一个 /
                target: 'http://220.180.11.124:8099/rsvrApi', // 后台接口域名 http://10.6.180.39:8099
                ws: true, //如果要代理 websockets，配置这个参数
                secure: false, // 如果是https接口，需要配置这个参数
                changeOrigin: true, //是否跨域
                pathRewrite: {
                    '^/rsvrmanage': ''
                }
            },*/
        }
    },
    configureWebpack: {

        output: {
            sourcePrefix: ' '
        },
        amd: {
            toUrlUndefined: true
        },
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': path.resolve('src'),
                'cesium': path.resolve(__dirname, cesiumSource)
            }
        },
        plugins: [
            new webpack.ProvidePlugin({

                $: "jquery",

                jQuery: "jquery",

                "windows.jQuery": "jquery",
                _: 'lodash',

            }),
            new CopyWebpackPlugin({
                patterns: [{
                    from: path.join(cesiumSource, cesiumWorkers),
                    to: 'Workers'
                }]
            }),
            new CopyWebpackPlugin({
                patterns: [{
                    from: path.join(cesiumSource, 'Assets'),
                    to: 'Assets'
                }]
            }),
            new CopyWebpackPlugin({
                patterns: [{
                    from: path.join(cesiumSource, 'Widgets'),
                    to: 'Widgets'
                }]
            }),
            new CopyWebpackPlugin({
                patterns: [{
                    from: path.join(cesiumSource, 'ThirdParty/Workers'),
                    to: 'ThirdParty/Workers'
                }]
            }),
            new webpack.DefinePlugin({
                CESIUM_BASE_URL: JSON.stringify('./')
            })
        ],
        module: {
            unknownContextCritical: /^.\/.*$/,
            unknownContextCritical: false
        }
    },
    transpileDependencies: ['@xdh/my'],
    chainWebpack(config) {
        config.resolve.alias.set('$ui', '@xdh/my/ui/lib')

        // scss全局参数
        const oneOfsMap = config.module.rule('scss').oneOfs.store
        oneOfsMap.forEach(item => {
            item
                .use('sass-resources-loader')
                .loader('sass-resources-loader')
                .options({
                    resources: ['./src/assets/css/mixins.scss', './src/theme/handler_themes.scss']
                })
                .end()
        })
    }
};
