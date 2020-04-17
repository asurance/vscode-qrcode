import { resolve } from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
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
                use: [{
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            module: 'es6'
                        }
                    }
                }],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ title: 'vscode qrcode' })
    ],
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, '../../public'),
        devtoolModuleFilenameTemplate: '../[resource-path]'
    }
} as Configuration

export default config