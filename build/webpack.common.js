const PATH = require('path');
const glob = require('glob');
const CopyWebpackPlugin = require('copy-webpack-plugin'); 
const customization = require('./customization');
const aliases = require('./aliases');

const MODULE_PREFIXES = [
    'digital',
    'digitalexp',
    'omni'
];

const ROOT = PATH.resolve(__dirname, '../');
const SRC_FOLDER = PATH.resolve(__dirname, ROOT, 'src/');
const BUILD_FOLDER = PATH.resolve(__dirname, ROOT, 'dist/');
const NODE_MODULES = PATH.resolve(__dirname, ROOT, 'node_modules'); 
const DESIGN_FOLDER = PATH.resolve(__dirname, ROOT, 'design/');

const publicPath = '/';
const externals = {
    fs: '{}',
    'fs-extra': '{}'
};

module.exports = {
    externals,
    cache: true,
    context: ROOT,
    output: {
        filename: '[name].js',
        publicPath,
        path: BUILD_FOLDER,
        chunkFilename: '[name].js'
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minChunks: 2,
            maxInitialRequests: 3,
            cacheGroups: {
                commons: {
                    name: 'common',
                    reuseExistingChunk: true
                }
            }
        }

    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                include: [SRC_FOLDER, DESIGN_FOLDER],
                loader: 'babel-loader',
                options: {
                    compact: false,
                    cacheDirectory: false,
                    babelrc: false,
                    presets: [['env', {modules: false}], 'react'],
                    plugins: [
                        'transform-class-properties',
                        'transform-decorators-legacy',
                        'transform-object-rest-spread',
                        'transform-runtime'
                    ]
                }
            },
            {
                test: /(\.jsx|\.js)$/,
                include: [
                    new RegExp(`^(.*)(${MODULE_PREFIXES.join('|')})-((?!node_modules).)*$`)
                ],
                loader: 'babel-loader',
                options: {
                    compact: false,
                    cacheDirectory: true,
                    babelrc: false,
                    presets: [['env', {modules: false}], 'react'],
                    plugins: [
                        'transform-class-properties',
                        'transform-decorators-legacy',
                        'transform-object-rest-spread',
                        'transform-runtime'
                    ]
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }
        ]
    },
    resolve: {
        mainFields: ['jsnext:amdocs', 'browser', 'main'],
        extensions: ['.js', '.json', '.jsx', '.scss'],

        // priority to root node_modules instead nested ones
        // Usefull for npm linked modules
        modules: [NODE_MODULES, 'node_modules'],
        symlinks: false,

        alias: Object.assign({}, aliases, customization)
    },
    plugins: [
        new CopyWebpackPlugin([
            
        ]) 
    ]
};

