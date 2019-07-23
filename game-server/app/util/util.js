let Utils = function() {

};

Utils.prototype.invokeCallback = function(cb) {
    if (!!cb && typeof cb === 'function') {
        cb.apply(null, Array.prototype.slice.call(arguments, 1));
    }
}

module.exports = {
    id: 'utils',
    func: Utils
}