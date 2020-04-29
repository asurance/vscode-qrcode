import { resolve } from 'path'
import type { Configuration } from 'webpack'

const config = {
    target: 'node',
    entry: {
        extension: resolve(__dirname, '../src/extension.ts')
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
    externals: {
        vscode: 'commonjs vscode'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, '../dist'),
        libraryTarget: 'commonjs2',
        devtoolModuleFilenameTemplate: '../[resource-path]'
    }
} as Configuration

export default config