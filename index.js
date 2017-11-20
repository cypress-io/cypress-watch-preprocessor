'use strict'

const chokidar = require('chokidar')

const watchers = {}

// export a function that returns another function that can be used like so:
//
// on('file:preprocessor', watch())
//
module.exports = () => {
  // we return function that accepts the arguments provided by
  // the event 'file:preprocessor'
  //
  // this function will get called for the support file when a project is loaded
  // (if the support file is not disabled)
  // it will also get called for a spec file when that spec is requested by
  // the Cypress runner
  //
  // when running in the GUI, it will likely get called multiple times
  // with the same filePath, as the user could re-run the tests, causing
  // the supported file and spec file to be requested again
  return (file) => {
    const filePath = file.filePath

    // if shouldWatch is false, this is a one-time run, probably in CI
    // so we don't need to watch
    // since this function can get called multiple times with the same
    // filePath, we return if we already have a cached watcher
    // since we don't want or need to re-initiate a watcher for it
    if (!file.shouldWatch || watchers[filePath]) {
      return filePath
    }

    // cache the watcher so we can return early if this function
    // is called again with the same filePath
    const watcher = watchers[filePath] = chokidar.watch(filePath)

    // when we're notified of an update, we emit `rerun`
    // to let Cypress know to re-run the spec
    watcher.on('all', () => {
      file.emit('rerun')
    })

    // when the spec or project is closed, we need to close the watcher
    // and remove it from the cache
    file.on('close', () => {
      delete watchers[filePath]
      watcher.close()
    })

    // return the filePath we were given, telling Cypress to go ahead and
    // serve the source file as-is
    return filePath
  }
}
