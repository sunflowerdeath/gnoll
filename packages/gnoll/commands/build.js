const emoji = require('node-emoji')

const getWebpackConfig = require('../utils/getWebpackConfig')
const createWebpackCompiler = require('../utils/createWebpackCompiler')

module.exports = function build(options) {
  const config = getWebpackConfig(options)
  const compiler = createWebpackCompiler(config)
  console.log(
    emoji.get('building_construction'),
    ' Creating an optimized production build...\n'
  )
  compiler.run((err, stats) => {
    if (stats.hasErrors()) process.exit(1)
  })
}
