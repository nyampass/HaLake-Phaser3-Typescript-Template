const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/main.ts',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist_client'),
        filename: 'main.js',
        publicPath: '/dist_client'
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },

    module: {
        rules: [
            {
                test: /\.(tsx?)|(js)$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            },
            { // For shaders
                test: [/\.vert$/, /\.frag$/],
                use: 'raw-loader'
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            CANVAS_RENDERER: JSON.stringify(true),
            WEBGL_RENDERER: JSON.stringify(true)
        }),
        new webpack.NamedModulesPlugin()
    ]
};