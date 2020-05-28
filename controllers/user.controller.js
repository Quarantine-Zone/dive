let _user = require('@models/user.model');
let _utils = require('@services/utils');

// Handles removing a user
// Payload requires: uid: string
module.exports.remove = async (req, response) => {
    try {
        if (!req.payload.uid) throw "fields not set";

        let result = await _user.removeById(req.payload.uid);

        _utils.sendOk(response, result, 'remove_user');
    } catch (error) {
        _utils.sendNotOk(response, error, 'remove_user');
    }
}

// Handles updating a user
// Required payload: uid: string, toUpdate: {property: newValue, ...}
module.exports.update = async(req, response) => {
    try {
        if (!req.payload.uid || !req.payload.toUpdate || Object.entries(req.payload.toUpdate).length == 0) throw "fields not set";

        let result = await _user.updateById(req.payload.uid, req.payload.toUpdate);

        _utils.sendOk(response, result, 'update_user');
    } catch (error) {
        _utils.sendNotOk(response, error, 'update_user');
    }
}

// Gets all properties of a given user
// Required payload: uid: string
module.exports.getById = async (req, response) => {
    try {
        if (!req.payload.uid) throw "fields not set";

        // Creates the user if they don't exist
        let result = await _user.create(req.payload.uid);

        _utils.sendOk(response, result, 'get_user');
    } catch (error) {
        _utils.sendNotOk(response, error, 'get_user');
    }
}