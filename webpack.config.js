// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: './src/index.js',
        llmchatbot: './src/llmchatbot/index.js',
        portfolio: './src/portfolio/index.js',
        confer: './src/confer/index.js',
        demo: './src/demo/index.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        fallback: {
            "path": require.resolve("path-browserify"),
            "os": require.resolve("os-browserify/browser"),
            "crypto": require.resolve("crypto-browserify")
        }
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
            template: './src/portfolio/index.html',
            chunks: ['portfolio'],
            filename: 'portfolio.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/llmchatbot/index.html',
            chunks: ['llmchatbot'],
            filename: 'llmchatbot.html'
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
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 3000
    },
    mode: 'development', // or 'production'
};