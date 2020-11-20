const express = require('express');
const multer  = require('multer');

const homeController = require('../controllers/homeController.js');
const loginController = require('../controllers/loginController.js');
const registerController = require('../controllers/registerController.js');

const app = express();

module.exports = app;

var storage = multer.diskStorage({
    destination:'views/uploads/',
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-';
        cb(null, uniqueSuffix + file.originalname);
    }
});


app.get('/login', loginController.login);
app.get('/register', registerController.register);
app.post('/postRegister', registerController.postRegister);
app.get('/getCheckEmail', registerController.getCheckEmail);

// home
app.get('/', homeController.home);
app.get('/getListings', homeController.getListings);

