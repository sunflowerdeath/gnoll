const emoji = require('node-emoji')

const chalk = require('chalk')
const rimrafSync = require('rimraf').sync

const babelConfig = require('../config/babel')
const paths = require('../utils/paths')
const buildLib = require('../utils/buildLib')

module.exports = function lib(cmd) {
  console.log(`Cleaning directory ${paths.lib}`)
  rimrafSync(`${paths.lib}/*`)

  const watcher = buildLib(paths.src, paths.lib, {
    babel: babelConfig,
    watch: cmd.watch,
    sourceMaps: cmd.sourceMaps
  })

  let ready = false
  let errors = false

  if (cmd.watch) {
    console.log(emoji.get('eyes'), ' Starting watch...\n')
  } else {
    console.log(emoji.get('package'), ' Compiling files...\n')
  }

  watcher.on('copy', filepath => {
    if (ready) console.log(`File '${filepath}' copied to dest dir`)
  })
  watcher.on('success', filepath => {
    if (ready) console.log(`File '${filepath}' compiled successfully`)
  })
  watcher.on('error', (filepath, error) => {
    if (!ready) errors = true

    console.log()
    console.log(error.toString())
    if (error.codeFrame) console.log(`\n${error.codeFrame}\n`)
  })
  watcher.on('ready', () => {
    ready = true
    if (errors) {
      console.log(chalk.red('Compiled with errors.\n'))
    } else {
      console.log(chalk.green('Compiled successfully.\n'))
    }
    if (!cmd.watch) {
      watcher.close()
      process.exit(errors ? 1 : 0)
    }
  })
}
