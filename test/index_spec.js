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
      shouldWatch: true,
      filePath: 'path/to/file.js',
      on: sandbox.stub(),
      emit: sandbox.spy(),
    }

    this.run = () => {
      return preprocessor(this.options)(this.config)
    }
  })

  describe('exported function', function () {
    it('receives user options and returns a preprocessor function', function () {
      expect(preprocessor(this.options)).to.be.a('function')
    })
  })

  describe('preprocessor function', function () {
    afterEach(function () {
      this.config.on.withArgs('close').yield() // resets the cached watchers
    })

    it('returns filePath', function () {
      expect(this.run()).to.equal(this.config.filePath)
    })

    it('watches when shouldWatch is true', function () {
      this.run()
      expect(chokidar.watch).to.be.calledWith(this.config.filePath)
    })

    it('returns early if called again with same filePath', function () {
      const run = preprocessor(this.config)
      run(this.config)
      run(this.config)
      expect(chokidar.watch).to.be.calledOnce
    })

    it('emits `rerun` when there is an update', function () {
      this.watcherApi.on.withArgs('all').yields()
      this.run()
      expect(this.config.emit).to.be.calledWith('rerun')
    })

    it('closes watcher when onClose callback is called', function () {
      this.run()
      this.config.on.withArgs('close').yield()
      expect(this.watcherApi.close).to.be.called
    })
  })

  describe('when shouldWatch is false', function () {
    beforeEach(function () {
      this.config.shouldWatch = false
    })

    it('does not watch', function () {
      this.run()
      expect(chokidar.watch).not.to.be.called
    })
  })
})
