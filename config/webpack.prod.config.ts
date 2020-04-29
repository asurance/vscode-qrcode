import Merge from 'webpack-merge'
import BaseConfig from './webpack.base.config'
import type { Configuration } from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const config = {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin()
    ],
} as Configuration

export default Merge(BaseConfig, config)