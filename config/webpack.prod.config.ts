import Merge from 'webpack-merge'
import BaseConfig from './webpack.base.config'
import type { Configuration } from 'webpack'

const config = {
    mode: 'production',
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    chunks: 'all',
                    priority: -10,
                    test: /[\\/]node_modules[\\/]/
                }
            }
        }
    },
} as Configuration

export default Merge(BaseConfig, config)