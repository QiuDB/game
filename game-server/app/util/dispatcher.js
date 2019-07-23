const crc = require('crc');

let Dispatcher = function() {

};

Dispatcher.prototype.dispatch = function(uid, servers) {
    let index = Math.abs(parseInt(crc.crc32(uid), 16) % servers.length);
    return servers[index];
};

module.exports = {
    id: 'dispatcher',
    func: Dispatcher
}