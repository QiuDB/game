const crc = require('crc');

let Dispatcher = function() {

};

Dispatcher.prototype.dispatch = function(uid, connectors) {
    let index = Math.abs(parseInt(crc.crc32(uid), 16) % connectors.length);
    return connectors[index];
};

module.exports = {
    id: 'dispatcher',
    func: Dispatcher
}