
const logger = require('pomelo-logger').getLogger('pomelo', __filename)
let AccountDB = function() {
    this.utils = null;
};

AccountDB.prototype.getAccountByPUid = function(dbClient, pUid, cb) {
    if (!dbClient) {
        this.utils.invokeCallback(new Error('Not find dbClient'));
        return;
    }

    let self = this;
    let sql = 'select pUid, uid from account where pUid = ?';
    let options = [pUid];
    dbClient.query(sql, options, function(err, results, fields) {
        logger.debug('err is %j, results is %o, fields is %o', err, results, fields)
        if (!!err) {
            self.utils.invokeCallback(cb, err);
            return;
        }

        return self.utils.invokeCallback(cb, null, results);
    })
}

AccountDB.prototype.createAccount = function(dbClient, pUid, cb) {
    if (!dbClient) {
        this.utils.invokeCallback(new Error('Not find dbClient'));
        return;
    }

    let self = this;
    let sql = 'insert into account(pUid) values(?)';
    let options = [pUid];
    dbClient.query(sql, options, function(err, result, fields) {
        if (!!err) {
            logger.error(err);
            self.utils.invokeCallback(cb, err);
            return;
        }
        logger.debug('ret is %o', {
            pUid: pUid,
            uid: result.insertId
        })
        return self.utils.invokeCallback(cb, null, {
            pUid: pUid,
            uid: result.insertId
        });
    })
}

module.exports = {
    id: 'accountDB',
    func: AccountDB,
    props: [
        {
            name: 'utils',
            ref: 'utils'
        }
    ]
}