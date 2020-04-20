import Merge from 'webpack-merge'
import BaseConfig from './webpack.base.config'
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
import type { Configuration } from 'webpack'

const config = {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        port: 8080,
        quiet: true,
    },
    plugins:[
        new FriendlyErrorsWebpackPlugin()
    ]
} as Configuration

export default Merge(BaseConfig, config)