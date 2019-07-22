
const bearcat = require('bearcat');

let GateHandler = function() {
    this.app = app;
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
        props: []
    })
}