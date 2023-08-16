const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'source-map',
    plugins: [
        // propagate again the ENV_MODE inside NODE_ENV for subprocesses.
        // Avoid react warnings after uglification
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
});
