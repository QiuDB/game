
const bearcat = require('bearcat');

let GateHandler = function(app) {
    this.app = app;
    this.dispatcher = null;
}

/**
 * Gate handler that dispatch user to connectors.
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param {Function} next next stemp callback
 *
 */
GateHandler.prototype.queryEntry = function(msg, session, next) {
    let uid = msg.uid || '1';
    if (!uid) {
        next (null, {code: 500, message: 'Not find uid of session'});
        return;
    }

    // get all connectors
    let connectors = this.app.getServersByType('connector');
    if (!connectors || connectors.length === 0) {
        next(null, {code: 500, message: 'Not find any connector'});
        return;
    }

    // select connector
    let res = this.dispatcher.dispatch(uid, connectors);
    next (null, {
        code: 200,
        host: res.host,
        port: res.clientPort
    })
}

module.exports = function(app) {
    return bearcat.getBean({
        id: 'gateHandler',
        func: GateHandler,
        args: [
            {
                name: 'app',
                value: app
            }
        ],
        props: [
            {
                name: 'dispatcher',
                ref: 'dispatcher'
            }
        ]
    })
}