const bearcat = require('bearcat');

let AuthRemote = function(app) {
    this.app = app;
    this.accountDB = null;
    this.utils = null;
};

AuthRemote.prototype.authAccount = function(pUid, cb) {
    let self = this;
    this.accountDB.getRecord(this.app, pUid, function(err, results) {
        if (!!err) {
            self.utils.invokeCallback(cb, err.message);
            return;
        }

        // 没有账号，则创建一个
        if (!results || results.length === 0) {
            self.createAccount(pUid, cb);
            return;
        } else {
            self.utils.invokeCallback(cb, null,  results[0]);
            return;
        }
    })
}

AuthRemote.prototype.createAccount = function(pUid, cb) {
    let self = this;
    this.accountDB.createAccount(this.app, pUid, function(err, results, fileds) {
        if (!!err) {
            self.utils.invokeCallback(cb, err.message);
            return;
        }

    })
}

module.exports = function(app) {
    return bearcat.getBean({
        id: 'authRemote',
        func: AuthRemote,
        args: [
            {
                name: 'app',
                value: app
            }
        ],
        props: [
            {
                name: 'accountDB',
                ref: 'accountDB'
            }
        ]
    })
}