import { resolve } from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import type { Configuration } from 'webpack'

const config = {
    entry: {
        index: resolve(__dirname, '../src/index.ts')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            module: 'es6'
                        }
                    }
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ title: 'vscode qrcode', template: resolve(__dirname, '../index.html') }),
        new ExtractTextPlugin('index.css')
    ],
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, '../../public'),
    }
} as Configuration

export default config