/*!
 * Bento Box Express
 * `````````````````````````````````````````````
 */

var express = require('express')

module.exports = function BentoBoxExpres(bento) {

	var config = bento.getConfig('express')
	var port = config.port || 3000

	return {

		expressApp: express(),
		
		/**
		 * Load and set the Express applications settings from the config
		 *
		 * @private 
		 */
		_loadSettings: function() {
			var settings = config.settings || {}

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
		 * @param {Function} fn
		 * @returns {Boolean}
		 * @private
		 */
		_isValidMiddleware: function(fn) {
			return typeof fn == 'function'
		},
		
		/**
		 * Initialize the expres app and listen for
		 * route and middleware data
		 */	
		init: function() {
			this._loadSettings()			

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
		 * @param {Function} fn
		 */
		addMiddleware: function(fn) {
			this.expressApp.use(fn)
		}	

	}

}
