const bearcat = require('bearcat');

let AuthRemote = function(app) {
    this.app = app;
    this.accountDB = null;
    this.utils = null;
};

AuthRemote.prototype.authAccount = function(msg, cb) {
    let self = this;
    let pUid = msg.pUid;
    this.accountDB.getAccountByPUid(this.app.get('dbClient_adb'), pUid, function(err, results) {
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
    this.accountDB.createAccount(this.app.get('dbClient_adb'), pUid, function(err, result, fileds) {
        if (!!err) {
            self.utils.invokeCallback(cb, err.message);
            return;
        }
        self.utils.invokeCallback(cb, null, result)
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
            },
            {
                name: 'utils',
                ref: 'utils'
            }
        ]
    })
}