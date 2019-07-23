const mysql = require('mysql');

let MysqlPool = function() {
    this.pool = null;
    this.insert = null;
    this.update = null;
    this.delete = null;
    this.query  = null;

    this.utils = null; // bearcat props
};

MysqlPool.prototype.init = function(mysqlConfig) {
    if (this.pool) {
        return this.pool;
    }

    this.NNDInit(mysqlConfig);
    this.insert = this.NNDQuery;
    this.update = this.NNDQuery;
    this.delete = this.NNDQuery;
    this.query = this.NNDQuery;
    return this.pool;
}

MysqlPool.prototype.NNDInit = function(mysqlConfig) {
    this.pool = mysql.createPool({
        host: mysqlConfig.host,
        user: mysqlConfig.user,
        password: mysql.password,
        database: mysqlConfig.database,
        port: mysqlConfig.port,
        connectionLimit: 10
    });
}

MysqlPool.prototype.NNDQuery = function(sql, options, cb) {
    let self = this;
    this.pool.getConnection(function(err, connection) {
        if (err) {
            self.utils.invokeCallback(err);
            return;
        }
        // use the connection
        connection.query(sql, options, function(error, results, fields) {
            // when done with the connection, release it.
            connection.release();

            if (error) {
                self.utils.invokeCallback(err);
                return;
            }
            self.utils.invokeCallback(null, results, fields);
        })
    })
}

module.exports = {
    id: 'mysqlPool',
    func: MysqlPool,
    props: [
        {
            name: 'utils',
            ref: 'utils'
        }
    ]
}