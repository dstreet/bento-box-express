/*!
 * Bento Box Express
 * `````````````````````````````````````````````
 */

var express = require('express')

module.exports = BentoBoxExpress = {

	getRequestedConfig: function() {
		return 'express'
	},

	getAccessors: function() {
		var self = this

		return {
			addRoute: self.addRoute,
			addMiddleware: self.addMiddleware,
			server: self.server,
			expressApp: self.expressApp
		}
	},

	init: function() {
		this.expressApp = express()
	},

	ready: function(bento, config) {
		this.config = config

		this._loadSettings()

		var port = config.port || 3000

		// Start the web server
		this.server = this.expressApp.listen(port, function() {
			console.log('Example app listening at http://%s:%s', this.server.address().address, this.server.address().port)
		}.bind(this))
		
		// Listen to route additions
		bento.on('routes').add(this.addRoute.bind(this), this._isValidRoute)

		// Listen to middleware additions
		bento.on('middleware').add(this.addMiddleware.bind(this), this._isValidMiddleware)
	},

	/**
	 * Load and set the Express applications settings from the config
	 *
	 * @private 
	 */
	_loadSettings: function() {
		var settings = this.config.settings || {}

		for (s in settings) {
			this.expressApp.set(s, settings[s])
		}
	},
	
	/**
	 * Determine whether or not an object contains all neccessary
	 * properties of a route
	 *
	 * @param {Object} obj
	 * @returns {Boolean}
	 * @private
	 */
	_isValidRoute: function(obj) {
		return obj.hasOwnProperty('method') &&
				obj.hasOwnProperty('path') &&
				(obj.hasOwnProperty('callback') && typeof obj.callback == 'function')
	},
	
	/**
	 * Determine whether or not parameter is valid middleware
	 *
	 * @param {*} param
	 * @returns {Boolean}
	 * @private
	 */
	_isValidMiddleware: function(param) {
		return typeof param == 'function' ||
			(param.hasOwnProperty('path') && param.hasOwnProperty('callback') && typeof param.callback == 'function')
	},

	/**
	 * Add a route to express
	 *
	 * `route` parameter must have `method`, `path`, and `callback` parameters
	 *
	 * @param {Object} route
	 */
	addRoute: function(route) {
		this.expressApp[route.method](route.path, route.callback)
	},

	/**
	 * Add middleware to express
	 *
	 * @param {Function|Object} val
	 */
	addMiddleware: function(val) {
		if (typeof val == 'function') {
			this.expressApp.use(val)
		} else {
			this.expressApp.use(val.path, val.callback)
		}
	}
}