/**
 * Bento Box Express
 * `````````````````````````````````````````````````````````
 * Express extension for the Bento Box application framework
 *
 * Subscribes to:
 *
 * 		'middleware' - add - (Object|Function)
 * 		'routes'     - add - (Object)
 *
 * Publishes to:
 *
 * 		'express'    - log - (String, String)
 */

var express = require('express')

var defaults = {
	configProp: 'express',
	port:       3000
}

module.exports = BentoBoxExpress = {

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
	 * Start the express server
	 * 
	 * @return {Server}
	 */
	start: function() {
		var server = this.expressApp.listen(this.port, function() {
			this.bento.log('express', 'Listening at http://' + server.address().address + ':' + server.address().port)
		}.bind(this))

		return server
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
		this.bento.log('express', ['Adding route', route.method, route.path].join(' '), 'info')
	},

	/**
	 * Add middleware to express
	 *
	 * @param {Function|Object} val
	 */
	addMiddleware: function(val) {
		if (typeof val == 'function') {
			this.expressApp.use(val)
			this.bento.log('express', 'Adding global middleware', 'info')
		} else {
			this.expressApp.use(val.path, val.callback)
			this.bento.log('express', ['Adding middlware or path', val.path].join(' '), 'info')
		}
	},

	/*
	 * Bento Box Extension API
	 * ========================================================================
	 */
	getRequestedConfig: function() {
		return this.configProp
	},

	getAccessors: function() {
		var self = this

		return {
			start:         self.start.bind(self),
			addRoute:      self.addRoute.bind(self),
			addMiddleware: self.addMiddleware.bind(self),
			expressApp:    self.expressApp
		}
	},

	init: function(configProp) {
		this.configProp = configProp || defaults.configProp
		this.expressApp = express()
	},

	ready: function(bento, config) {
		this.bento = bento
		this.config = config
		this.port = config.port || defaults.port
		this._loadSettings()

		// Listen to route additions
		bento.on('routes').add(this.addRoute.bind(this), this._isValidRoute)

		// Listen to middleware additions
		bento.on('middleware').add(this.addMiddleware.bind(this), this._isValidMiddleware)
	}
}