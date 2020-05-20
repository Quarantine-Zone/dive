let _db = require('@services/db.js');

/**
 * @Param {string} uid - the user id (steamId) to insert
 * @Returns {promise} a promise which resolves to the query result
 */
module.exports.create = (uid) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Get a link and try to create a new user. Then, grab the info about the user
            let link = await _db.getLink();
            let result = await link.query('INSERT IGNORE INTO `users` SET `uid` = ?; SELECT * FROM `users` WHERE `uid` = ?', [uid, uid]);  
            link.release();

            // Resolve our promise
            resolve(result[1][0]);

        } catch (e) {
            return reject(e);
        }
    });
}

/**
 * @Param {string} uid - the user id (steamId) to delete
 * @Returns {promise} a promise which resolves to :user removed"
 */
module.exports.removeById = (uid) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Get a link and try to remove the user
            let link = await _db.getLink();
            let result = await link.query('DELETE FROM `users` WHERE `uid` = ?', [uid]);
            link.release();

            // Error if we didn't do anything
            if (result.affectedRows == 0) throw "no user removed";
            
            // Resolve if successful
            resolve("user removed");

        } catch (e) {
            return reject(e);
        }
    });
}

/**
 * Attempts to find an id associated with a user. Will create one if none can be found.
 * @Param {string array} uidArr - the user ids to return values for
 * @Returns {promise} a promise which resolves to the query result
 */
module.exports.findById = (uid) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Get a link and try to find info about the user
            let link = await _db.getLink();
            let result = await link.query('SELECT * FROM `users` WHERE `uid` = ?', uid);
            link.release();
            
            // Error if we didn't find a user
            if (result.length == 0) throw "no user found";

            // Resolve to the row info
            resolve(result[0]);

        } catch (e) {
            reject(e);
        }
    });
}

/**
 * @Param {string} uid - the user id to update
 * @Param {object} toUpdate - an object of key value pairs which are to be updated
 * @Returns {promise} a promise which resolves to the query result
 */
module.exports.updateById = (uid, toUpdate) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (Object.keys(toUpdate).length == 0) {
                throw 'no updates to perform';
            }

            // Get a link
            let link = await _db.getLink();
            
            let updateParams = '';
            let updateList = [];
            
            // Loop through the target columns
            Object.keys(toUpdate).forEach(property => {
                let escaped = link.escape(property); // escape the column (since we are hard coding it)

                updateParams += '`' + escaped + '` = ?,'; // generate the string
                updateList.push(toUpdate[property]); // also push the new values into an update array
            });

            // Escaping the parameter adds single quotes in our string, we don't want that
            updateParams = updateParams.replace(/'/g, "");
        
            // Try to perform the update!
            let result = await link.query(`UPDATE \`users\` SET ${updateParams.substr(0, updateParams.length - 1)} WHERE uid = ?; SELECT * FROM \`users\` WHERE uid = ?`, [...updateList, uid, uid]);
            link.release();

            // Error if we didn't update anything
            if (result[1].length == 0) throw "no user updated";
            
            // If we did, resolve to the new row
            resolve(result[1][0]);
            
        } catch (e) {
            reject(e);
        }
    });
}