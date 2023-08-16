const PATH = require('path');
const merge = require('webpack-merge');
const WriteFilePlugin = require('write-file-webpack-plugin');
const common = require('./webpack.common');

const ROOT = PATH.resolve(__dirname, '../');
const SRC_FOLDER = PATH.resolve(__dirname, ROOT, 'src/');
const DESIGN_FOLDER = PATH.resolve(__dirname, ROOT, 'design/');

const plugins = [
    new WriteFilePlugin()
];

const devConfig = merge(common, {
    entry: {
        demo: SRC_FOLDER,
        design: DESIGN_FOLDER
    },
    devtool: 'inline-source-map',
    watchOptions: {
        // only permit watcher on digitalext components
        ignored: /^(.*)\/node_modules\/(?!(digitalexp|omni)-(.*)\/)(.*)$/
    },
    plugins,
    devServer: {
        contentBase: [ROOT],
        disableHostCheck: true,
        useLocalIp: false,
        host: '127.0.0.1',
        port: 9099,
        overlay: {
            errors: true
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        },
        open: 'chrome',
        openPage: '../demo/index.html',
        historyApiFallback: true,
        // to watch also the content files
        watchContentBase: true
    }
});

module.exports = merge(devConfig, {
    devServer: {

    }
});
