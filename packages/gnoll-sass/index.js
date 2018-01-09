const path = require('path')

const ROOT_PATH = process.env.PWD

module.exports = function gnollSass(options) {
  const modules = options && 'modules' in options ? options.modules : true
  const cacheDirectory = path.join(ROOT_PATH, 'node_modules', '.cache', 'css-loader')

  return {
    module: {
      rules: [
        {
          test: /\.css/,
          use: [
            { loader: 'style-loader' },
            {
              loader: 'cache-loader',
              options: { cacheDirectory }
            },
            {
              loader: 'css-loader',
              options: {
                modules,
                localIdentName: '[name]__[local]--[hash:base64:5]'
              }
            }
          ]
        },
        {
          test: /\.sass/,
          use: [
            { loader: 'style-loader' },
            {
              loader: 'cache-loader',
              options: { cacheDirectory }
            },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[name]__[local]--[hash:base64:5]'
              }
            },
            { loader: 'sass-loader' }
          ]
        }
      ]
    },
    resolveLoader: {
      modules: [path.resolve(__dirname, 'node_modules')]
    }
  }
}
