const express = require('express');
const multer  = require('multer');

const homeController = require('../controllers/homeController.js');
const loginController = require('../controllers/loginController.js');

const app = express();

module.exports = app;

var storage = multer.diskStorage({
    destination:'views/uploads/',
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-';
        cb(null, uniqueSuffix + file.originalname);
    }
});

app.get('/', homeController.home);
app.get('/login', loginController.login);

