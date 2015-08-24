var chai = require('chai')
var spies = require('chai-spies')
var BentoBox = require('bento-box')
var BentoBoxExpress = require('../../index')
var expect = chai.expect

chai.use(spies)

describe('BentoBoxExpress', function() {
	
	var bento

	beforeEach(function() {
		bento = new BentoBox({
			express: {
				port: 8080,

				settings: {
					title: 'test app',
					views: 'templates'
				}
			}
		})
	})

	describe('init()', function() {
		
		var bentoExpress

		beforeEach(function() {
			bentoExpress = new BentoBoxExpress(bento)
			chai.spy.on(bentoExpress, '_loadSettings')
			bentoExpress.init()
		})

		afterEach(function(done) {
			bentoExpress.server.close(done)
		})

		it('should start the server on the specified port', function() {
			expect(bentoExpress.server.address().port).to.equal(8080)
		})

		it('should call the the `addRoute` method in response to the routes collections', function() {
			chai.spy.on(bentoExpress, 'addRoute')
			bento.add('routes', { method: 'get', path: '/', callback: function() {} })
			
			setTimeout(function() {
				expect(bentoExpress.addRoute).to.have.been.called.once
			}, 20)
		})

		it('should call not call the `addRoute` method if the route item does not contain neccessary properties', function() {
			chai.spy.on(bentoExpress, 'addRoute')
			bento.add('routes', {})

			setTimeout(function() {
				expect(bentoExpress.addRoute).to.have.not.been.called.once
			}, 20)
		})

		it('should call `_loadSettings()`', function() {
			expect(bentoExpress._loadSettings).to.have.been.called.once
		})

	})


	describe('_loadSettings()', function() {
	
		var bentoExpress

		beforeEach(function() {
			bentoExpress = new BentoBoxExpress(bento)
		})

		it('should set the express settings from the config', function() {
			chai.spy.on(bentoExpress.expressApp, 'set')
			bentoExpress._loadSettings()

			expect(bentoExpress.expressApp.set).to.have.been.called.twice
			expect(bentoExpress.expressApp.get('title')).to.eql('test app')
			expect(bentoExpress.expressApp.get('views')).to.eql('templates')
		})

	})

})
