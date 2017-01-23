'use strict';

// Modules
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
const isTest = process.env.npm_lifecycle_event === 'test' || process.env.npm_lifecycle_event === 'test-watch';
const PROD = process.env.NODE_ENV === 'production' || process.env.npm_lifecycle_event === 'build';

const nodeEnv = PROD ? 'production' : 'development';

const appConfig = PROD ? require('./config/app.prod.js') : require('./config/app.dev.js');

module.exports = function makeWebpackConfig() {
    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets set
     */
    var config = {};

    /**
     * Entry
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     * Should be an empty object if it's generating a test build
     * Karma will set this when it's a test build
     */
    config.entry = {
        app: [
            './client/js/app.ts',
            'webpack/hot/dev-server',
        ],

        //vendors: './client/js/vendor.ts',
    };

    /**
     * Output
     * Reference: http://webpack.github.io/docs/configuration.html#output
     * Should be an empty object if it's generating a test build
     * Karma will handle setting it up for you when it's a test build
     */
    config.output = {
        // Absolute output directory
        path: __dirname + '/public',

        // Output path from the view of the page
        // Uses webpack-dev-server in development
        publicPath: PROD ? '/' : `http://localhost:${process.env.PORT}/`,

        // Filename for entry points
        // Only adds hash in build mode
        filename: PROD ? '[name].[hash].js' : '[name].bundle.js',

        // Filename for non-entry points
        // Only adds hash in build mode
        chunkFilename: PROD ? '[name].[hash].js' : '[name].bundle.js'
    };

    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    if (isTest) {
        config.devtool = 'inline-source-map';
    } else if (PROD) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval-source-map';
    }

    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */

    // Initialize module
    config.module = {
        rules: [
            {
                // JS LOADER
                // Reference: https://github.com/babel/babel-loader
                // Transpile .js files using babel-loader
                // Compiles ES6 and ES7 into ES5 code
                test: /(\.js|\.ts)$/,
                use: ['awesome-typescript-loader', 'angular2-template-loader'],
                exclude: /node_modules/,
            },
            {
                // SASS LOADER
                test: /\.scss$/,
                use: isTest ? 'null' : ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                // CSS LOADER
                // Reference: https://github.com/webpack/css-loader
                // Allow loading css through js
                //
                // Reference: https://github.com/postcss/postcss-loader
                // Postprocess your css with PostCSS plugins
                test: /\.css$/,
                // Reference: https://github.com/webpack/extract-text-webpack-plugin
                // Extract css files in production builds
                //
                // Reference: https://github.com/webpack/style-loader
                // Use style-loader in development.
                use: isTest ? 'null' : ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: ['css-loader', 'postcss-loader'],
                    options: {sourceMap: true}
                }),
            },
            {
                // ASSET LOADER
                // Reference: https://github.com/webpack/file-loader
                // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
                // Rename the file using the asset hash
                // Pass along the updated reference to your code
                // You can add here any file extension you want to get copied to your output
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?[A-z0-9]*)?$/,
                loader: 'file-loader'
            },
            {
                // HTML LOADER
                // Reference: https://github.com/webpack/raw-loader
                // Allow loading html through js
                test: /\.html$/,
                loader: 'ejs-compiled-loader'
            },
            {
                test: /\.peg$/,
                loader: 'pegjs-loader'
            }
        ]
    };

    config.resolve = {
        extensions: ['.ts', '.js'],
    };

    config.devtool = 'source-map';

    // ISPARTA LOADER
    // Reference: https://github.com/ColCh/isparta-instrumenter-loader
    // Instrument JS files with Isparta for subsequent code coverage reporting
    // Skips node_modules and files that end with .test.js
    if (isTest) {
        config.module.rules.push({
            test: /\.js$/,
            enforce: 'pre',
            exclude: [
                /node_modules/,
                /\.spec\.js$/
            ],
            loader: 'isparta-instrumenter-loader',
        })
    }

    /**
     * PostCSS
     * Reference: https://github.com/postcss/autoprefixer-core
     * Add vendor prefixes to your css
     */
    // config.postcss = [
    //   autoprefixer({
    //     browsers: ['last 2 version']
    //   })
    // ];

    /**
     * Plugins
     * Reference: http://webpack.github.io/docs/configuration.html#plugins
     * List: http://webpack.github.io/docs/list-of-plugins.html
     */
    config.plugins = [];

    // Skip rendering index.html in test mode
    if (!isTest) {
        // Reference: https://github.com/ampedandwired/html-webpack-plugin
        // Render index.html
        config.plugins.push(
            new HtmlWebpackPlugin({
                template: './client/index.html',
                inject: 'body',
                appConfig: appConfig
            }),

            // Reference: https://github.com/webpack/extract-text-webpack-plugin
            // Extract css files
            // Disabled when in test mode or not in build mode
            new ExtractTextPlugin({
                filename: '[name].[hash].css',
            }),

            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(nodeEnv)
            })
        )
    }

    if (!PROD) {
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    // Add build specific plugins
    if (PROD) {
        config.plugins.push(
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendors',
                filename: '[name].[hash].js',
            }),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
            // Only emit files when there are no errors
            new webpack.NoEmitOnErrorsPlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
            // Minify all javascript, switch loaders to minimizing mode
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true,
                compress: {
                    screw_ie8: true,
                    warnings: true
                }
            }),

            // Copy static assets
            // Reference: https://github.com/kevlened/copy-webpack-plugin
            new CopyWebpackPlugin([
                {
                    from: __dirname + '/client/fonts',
                    to: 'fonts',
                },
                {
                    from: __dirname + '/client/sounds',
                    to: 'sounds',
                },
            ])
        )
    }

    return config;
}();
