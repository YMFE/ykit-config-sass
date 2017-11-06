'use strict';

module.exports = {
    config: function(plugins) {
        var self = this;

        return {
            // 更改 Webpack 配置
            modifyWebpackConfig: function(baseConfig) {
                var isExists = false;
                var sassLoaderObj = {
                    test: /\.(sass|scss)$/,
                    loader: hadnleExtractLoaders([
                        'css-loader',
                        'fast-sass-loader-china'
                    ])
                }

                // 如果已经有了 sass-loader，替换掉以前的 SCSS 处理器
                baseConfig.module.loaders = baseConfig.module.loaders
                   .map(function (loader) {
                       if (loader.test.toString().match(/scss/)) {
                           isExists = true;
                           return sassLoaderObj;
                       }
                       return loader;
                   })

                if(!isExists) {
                    baseConfig.module.loaders.push(sassLoaderObj);
                }

                baseConfig.resolve.extensions.push('.sass', '.scss');
                baseConfig.entryExtNames.css.push('.sass', '.scss');

                return baseConfig;
            }
        }

        function hadnleExtractLoaders (loaders) {
            var loaderString = loaders.map(function(loader) {
                return require.resolve(loader) + (self.env === 'prd' ? '!' : '?sourceMap!')
            }).join('');

            return self.env === 'local'
            ? require.resolve('style-loader') + '!' + loaderString
            : plugins.ExtractTextPlugin.extract(
                self.webpack.version && self.webpack.version >= 2
                ? require.resolve('style-loader') + '!' + loaderString
                : require.resolve('style-loader'), loaderString
            )
        }
    }
}
