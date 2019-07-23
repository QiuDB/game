var bearcat = require('bearcat');
var logger = require('pomelo-logger').getLogger('pomelo', __filename)

// generate playerId
var id = 1;

var Handler = function(app) {
  this.app = app;
  this.serverId = app.get('serverId').split('-')[2];
  this.consts = null;
  this.dispatcher = null;
};

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
	var self = this;
	var playerId = parseInt(this.serverId + id, 10);
	id += 1;

	var areas = this.app.getServersByType('area');
	if (!areas || areas.length === 0) {
		next (null, {
			code: this.consts.MESSAGE.ERR,
			message: 'Not find any area server'
		});
		return;
	}
	let res = this.dispatcher.dispatch(playerId.toString(), areas);
	session.bind(playerId);
	session.set('playerId', playerId);
	session.set('areaId', res.areaId);

	session.on('closed', onUserLeave.bind(null, self.app));
	session.pushAll();
	next(null, {
		code: this.consts.MESSAGE.RES,
		playerId: playerId
	});
};

var onUserLeave = function(app, session, reason) {
	if (session && session.uid) {
		logger.info('uid(%j) 离开游戏', session.uid);
	}
}

/**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.publish = function(msg, session, next) {
	var result = {
		topic: 'publish',
		payload: JSON.stringify({code: 200, msg: 'publish message is ok.'})
	};
  next(null, result);
};

/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.subscribe = function(msg, session, next) {
	var result = {
		topic: 'subscribe',
		payload: JSON.stringify({code: 200, msg: 'subscribe message is ok.'})
	};
  next(null, result);
};

module.exports = function(app) {
	return bearcat.getBean({
		id: 'entryHandler',
		func: Handler,
		args: [
			{
				name: 'app',
				value: app
			}
		],
		props: [
			{
				name: 'consts',
				ref: 'consts'
			},
			{
				name: 'dispatcher',
				ref: 'dispatcher'
			}
		]
	})
  };