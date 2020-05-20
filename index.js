require('dotenv').config();
require('module-alias/register');
let express = require('express');
let user = require('@controllers/user.controller');

let app = express();

// Will be used for game <--> service encryption and validation
// All requests will be required to pass validation
let jwt = require('express-jwt');

// General server status
app.get('/', (req, res) => {
    res.send('Server is up!');
});

// Any requests will have a property of type payload
let jwtInstance = jwt({
    secret: process.env.JWT_SECRET,
    requestProperty: 'payload'
});


/**
 * Routes for user manipulation
 */

// Create a user
app.post('/user', jwtInstance, user.create);

// Update user
app.post('/user/:uid', jwtInstance, user.update);

// Delete user
app.delete('/user', jwtInstance, user.remove);

// Get a user's info
app.get('/user', jwtInstance, user.getById);

// Handle invalid token (someone tried to manipulate token, sent from a bad source, etc.)
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Invalid request');
    }
});

let server = app.listen(process.env.PORT || 8080, () => {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log('Listening at %s:%s', host, port)
})