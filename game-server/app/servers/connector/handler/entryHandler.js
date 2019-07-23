var bearcat = require('bearcat');
var logger = require('pomelo-logger').getLogger('pomelo', __filename)

var Handler = function (app) {
	this.app = app;
	this.consts = null;
	this.dispatcher = null;
	this.utils = null;
};

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function (msg, session, next) {
	var self = this;
	var pUid = msg.pUid || this.utils.random(1,10).toString();
	logger.warn('pUid is %j', pUid)
	if (!pUid || typeof pUid !== 'string') {
		next(null, { code: this.consts.MESSAGE.ERR, message: 'pUid invalid' });
		return;
	}

	self.app.rpc.auth.authRemote.authAccount.toServer('auth-server', {
		pUid: pUid
	}, function (err, result) {
		if (!!err) {
			next(null, { code: self.consts.MESSAGE.ERR, message: 'auth failed' });
			return;
		}

		let uid = result.uid;
		var areas = self.app.getServersByType('area');
		if (!areas || areas.length === 0) {
			next(null, {
				code: self.consts.MESSAGE.ERR,
				message: 'Not find any area server'
			});
			return;
		}
		let res = self.dispatcher.dispatch(uid.toString(), areas);
		session.bind(uid);
		session.set('areaId', res.areaId);

		session.on('closed', onUserLeave.bind(null, self.app));
		session.pushAll();
		next(null, {
			code: self.consts.MESSAGE.RES,
			uid: uid
		});
	})
};

var onUserLeave = function (app, session, reason) {
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
Handler.prototype.publish = function (msg, session, next) {
	var result = {
		topic: 'publish',
		payload: JSON.stringify({ code: 200, msg: 'publish message is ok.' })
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
Handler.prototype.subscribe = function (msg, session, next) {
	var result = {
		topic: 'subscribe',
		payload: JSON.stringify({ code: 200, msg: 'subscribe message is ok.' })
	};
	next(null, result);
};

module.exports = function (app) {
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
			},
			{
				name: 'utils',
				ref: 'utils'
			}
		]
	})
};