// If gnoll is installed with `npm link`, presets and plugins are inside local node_modules
const presetEnv = require('babel-preset-env')
const presetStage0 = require('babel-preset-stage-0')
const presetReact = require('babel-preset-react')
const decoratorsPlugin = require('babel-plugin-transform-decorators-legacy').default

const GNOLL_LIBRARY = Boolean(process.env.GNOLL_LIBRARY)

module.exports = {
  presets: [
    [
      presetEnv,
      {
        targets: {
          browsers: ['last 2 versions', '>1%', 'ie 11']
        },
        modules: GNOLL_LIBRARY ? 'commonjs' : false
      }
    ],
    presetStage0,
    presetReact
  ],
  plugins: [decoratorsPlugin]
}
