let Utils = function() {

};

Utils.prototype.invokeCallback = function(cb) {
    if (!!cb && typeof cb === 'function') {
        cb.apply(null, Array.prototype.slice.call(arguments, 1));
    }
}

// 生成[min, max]之间的随机整数
Utils.prototype.random = function(min, max) {
    if (min === max) {
        return min;
    }

    if (min > max) {
        let temp = min;
        min = max;
        max = temp;
    }

    return min + Math.round(Math.random() * (max - min))
}

module.exports = {
    id: 'utils',
    func: Utils
}