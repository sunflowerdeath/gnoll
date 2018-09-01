const merge = require('webpack-merge')
const baseConfig = require('gnoll/config/webpack')
const stylesConfig = require('gnoll-styles')

module.exports = merge(baseConfig, stylesConfig)
