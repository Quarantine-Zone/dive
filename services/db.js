let mysql = require('promise-mysql');

let pool;

// Begin creating the pool. Once it finishes, assign the result
let poolPromise = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true
}).then(ourPool => {
    pool = ourPool;
});

/**
 * @Returns {Promise} a promise which resolves to a database link
 */
module.exports.getLink = async () => {
    if (!pool) {
        pool = await poolPromise;
    }

    return pool.getConnection();
};