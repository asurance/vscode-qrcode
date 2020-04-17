import Merge from 'webpack-merge'
import BaseConfig from './webpack.base.config'
import type { Configuration } from 'webpack'

const config = {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        port: 8080
    }
} as Configuration

export default Merge(BaseConfig, config)