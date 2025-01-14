// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: './src/index.js',
        confer: './src/confer/index.js',
        demo: './src/demo/index.js',
        llmchatbot: './src/llmchatbot/index.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ['main'],
            filename: 'index.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/confer/index.html',
            chunks: ['confer'],
            filename: 'confer.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/demo/index.html',
            chunks: ['demo'],
            filename: 'demo.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/llmchatbot/index.html',
            chunks: ['llmchatbot'],
            filename: 'llmchatbot.html'
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 3000
    },
    mode: 'development', // or 'production'
};