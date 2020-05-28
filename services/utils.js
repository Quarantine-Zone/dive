let _jwt = require('jsonwebtoken');

/**
 * Handles sending a success response from our api.
 */
module.exports.sendOk = (res, data, scope) => {
    // Payload
    let result = {
        state: 'success',
        result: data
    }

    // Generate the token
    let token = _jwt.sign(JSON.stringify(result), process.env.JWT_SECRET);

    // Send a ok status and the token
    res.set('RequestScope', scope);
    res.set('Authorization', 'Bearer ' + token);
    res.status(200).send();
}

/**
 * Handles sending a failure response from our api.
 */
module.exports.sendNotOk = (res, err, scope) => {
    // Payload
    let result = {
        state: 'failed',
        result: err
    }

    // Generate the token
    let token = _jwt.sign(JSON.stringify(result), process.env.JWT_SECRET);

    // Send a generic internal server error and the token
    res.set('RequestScope', scope);
    res.set('Authorization', 'Bearer ' + token);
    res.status(500).send();
}