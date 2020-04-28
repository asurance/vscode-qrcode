import Merge from 'webpack-merge'
import BaseConfig from './webpack.base.config'
import type { Configuration } from 'webpack'

const config = {
    mode: 'production'
} as Configuration

export default Merge(BaseConfig, config)