const express = require('express');
const multer  = require('multer');

const homeController = require('../controllers/homeController.js');
const loginController = require('../controllers/loginController.js');
const registerController = require('../controllers/registerController.js');
const navbarController = require('../controllers/navbarController.js');
const logoutController = require('../controllers/logoutController.js');
const listingConrtoller = require('../controllers/listingConrtoller');

const app = express();

module.exports = app;

var storage = multer.diskStorage({
    destination:'views/uploads/',
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-';
        cb(null, uniqueSuffix + file.originalname);
    }
});

const upload = multer({ storage })

// Register and Login
app.get('/login', loginController.login);
app.post('/postLogin', loginController.postLogin);
app.get('/getCheckLogin', loginController.getCheckLogin);
app.get('/register', registerController.register);
app.post('/postLogin', loginController.postLogin);
app.post('/postRegister', registerController.postRegister);
app.get('/getCheckEmail', registerController.getCheckEmail);
app.get('/logout', logoutController.getLogout);

// Navbar
app.get('/getNavbar', navbarController.getNavbar);
app.get('/getName', navbarController.getName);

// home
app.get('/', homeController.home);
app.get('/getListings', homeController.getListings);

// bidding item
app.get('/createListing', listingConrtoller.createListingPage);
app.get('/listingItem', listingConrtoller.getListItemPage);
app.post('/postListing', upload.array('images', 10), listingConrtoller.postListing)
app.post('/listing/addBidding/:_id', listingConrtoller.postBidding);
app.post('/listing/buyoutBidding/:_id', listingConrtoller.buyoutBidding);
app.post('/listing/closeBidding/:_id', listingConrtoller.closeBidding);
// app.get('/bid/item/:id', bidController.page);


