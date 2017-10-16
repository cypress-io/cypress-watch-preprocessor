'use strict'

const chai = require('chai')
const chokidar = require('chokidar')
const sinon = require('sinon')

const expect = chai.expect
chai.use(require('sinon-chai'))

const sandbox = sinon.sandbox.create()

const preprocessor = require('../index')

describe('watch preprocessor', function () {
  beforeEach(function () {
    sandbox.restore()

    this.watcherApi = {
      on: sandbox.stub(),
      close: sandbox.stub(),
    }

    sandbox.stub(chokidar, 'watch').returns(this.watcherApi)

    this.config = {
      isTextTerminal: false,
    }
    this.filePath = 'path/to/file.js'
    this.util = {
      fileUpdated: sandbox.spy(),
      onClose: sandbox.stub(),
    }

    this.run = () => {
      return preprocessor(this.config, this.userOptions)(this.filePath, this.util)
    }
  })

  describe('exported function', function () {
    it('receives user options and returns a preprocessor function', function () {
      expect(preprocessor(this.config, this.userOptions)).to.be.a('function')
    })

    it('throws error if config is not the first argument', function () {
      expect(preprocessor).to.throw('must be called with the Cypress config')
    })
  })

  describe('preprocessor function', function () {
    afterEach(function () {
      this.util.onClose.yield() // resets the cached watchers
    })

    it('returns filePath', function () {
      expect(this.run()).to.equal(this.filePath)
    })

    it('watches when isTextTerminal is false', function () {
      this.run()
      expect(chokidar.watch).to.be.calledWith(this.filePath)
    })

    it('returns early if called again with same filePath', function () {
      const run = preprocessor(this.config)
      run(this.filePath, this.util)
      run(this.filePath, this.util)
      expect(chokidar.watch).to.be.calledOnce
    })

    it('calls util.fileUpdated when there is an update', function () {
      this.watcherApi.on.withArgs('all').yields()
      this.run()
      expect(this.util.fileUpdated).to.be.calledWith(this.filePath)
    })

    it('registers onClose callback', function () {
      this.run()
      expect(this.util.onClose).to.be.called
      expect(this.util.onClose.lastCall.args[0]).to.be.a('function')
    })

    it('closes watcher when onClose callback is called', function () {
      this.run()
      this.util.onClose.lastCall.args[0]()
      expect(this.watcherApi.close).to.be.called
    })
  })

  describe('when isTextTerminal is true', function () {
    beforeEach(function () {
      this.config.isTextTerminal = true
    })

    it('does not watch', function () {
      this.run()
      expect(chokidar.watch).not.to.be.called
    })
  })
})
