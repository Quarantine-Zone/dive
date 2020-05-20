let _user = require('@models/user.model');
let _utils = require('@services/utils');

// Handles creates a user with a given steam id if it doesn't exist, or returns the existing one
// Payload requires: uid: string
module.exports.create = async (req, response) => {
    try {
        let result = await _user.create(req.payload.uid);

        _utils.sendOk(response, result);
    } catch (error) {
        _utils.sendNotOk(response, error);
    }
}

// Handles removing a user
// Payload requires: uid: string
module.exports.remove = async (req, response) => {
    try {
        if (!req.payload.uid) throw "fields not set";

        let result = await _user.removeById(req.payload.uid);

        _utils.sendOk(response, result);
    } catch (error) {
        _utils.sendNotOk(response, error);
    }
}

// Handles updating a user
// Required payload: uid: string, updateProperties: [property: newValue, ...]
module.exports.update = async(req, response) => {
    try {
        if (!req.payload.uid || !req.payload.updateProperties || Object.entries(req.payload.updateProperties).length == 0) throw "fields not set";

        let result = await _user.updateById(req.payload.uid, req.payload.updateProperties);

        _utils.sendOk(response, result);
    } catch (error) {
        _utils.sendNotOk(response, error);
    }
}

// Gets all properties of a given user
// Required payload: uid: string
module.exports.getById = async (req, response) => {
    try {
        if (!req.payload.uid) throw "fields not set";

        let result = await _user.findById(req.payload.uid);

        _utils.sendOk(response, result);
    } catch (error) {
        _utils.sendNotOk(response, error);
    }
}