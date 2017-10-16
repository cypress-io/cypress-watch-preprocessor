'use strict'

const chokidar = require('chokidar')

const watchers = {}

module.exports = (config) => {
  if (!config || typeof config.isTextTerminal !== 'boolean') {
    throw new Error(`Cypress Watch Preprocessor must be called with the Cypress config as its first argument. You passed: ${JSON.stringify(config, null, 2)}`)
  }

  return (filePath, util) => {
    if (config.isTextTerminal || watchers[filePath]) {
      return filePath
    }

    const watcher = watchers[filePath] = chokidar.watch(filePath)

    watcher.on('all', () => {
      util.fileUpdated(filePath)
    })

    util.onClose(() => {
      delete watchers[filePath]
      watcher.close()
    })

    return filePath
  }
}
