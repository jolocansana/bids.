const express = require('express');

const homeController = require('../controllers/homeController.js');
const loginController = require('../controllers/loginController.js');
const registerController = require('../controllers/registerController.js');
const navbarController = require('../controllers/navbarController.js');
const logoutController = require('../controllers/logoutController.js');

const searchController = require('../controllers/searchController.js')
const listingConrtoller = require('../controllers/listingConrtoller');
const biddingHistoryActive = require('../controllers/biddingHistoryActiveController.js');
const biddingHistoryCompleted = require('../controllers/biddingHistoryCompletedController.js');
const biddingHistoryLost = require('../controllers/biddingHistoryLostController.js');
const yourListingController = require('../controllers/yourListingController.js')

const app = express();

module.exports = app;

// Register and Login
app.get('/login', loginController.login);
app.post('/postLogin', loginController.postLogin);
app.get('/getCheckLogin', loginController.getCheckLogin);
app.get('/register', registerController.register);
app.post('/postLogin', loginController.postLogin);
app.post('/postRegister', registerController.postRegister);
app.get('/getCheckEmail', registerController.getCheckEmail);
app.get('/logout', logoutController.getLogout);
app.post('/changePassword', registerController.postChangePassword);

// Static Pages
app.get('/privacy', (req,res) => {
  res.render('privacy');
})
app.get('/terms', (req,res) => {
  res.render('terms');
})

// Navbar
app.get('/getNavbar', navbarController.getNavbar);
app.get('/getNotifications', navbarController.getNotifications);
app.get('/getName', navbarController.getName);

// Home
app.get('/', homeController.home);
app.get('/getListings', homeController.getListings);

// Search and Filter
app.get('/s', searchController.getSearch);
app.get('/f', searchController.getFilter);

// Bidding History
app.get('/biddingHistoryActive', biddingHistoryActive.getActive);
app.get('/biddingHistoryCompleted', biddingHistoryCompleted.getCompleted);
app.get('/biddingHistoryLost', biddingHistoryLost.getLost);
app.post('/report', biddingHistoryCompleted.report);

// Seller listings
app.get('/listingHistoryActive', yourListingController.getActive);
app.get('/listingHistoryClosed', yourListingController.getCompleted);

// Bidding item
app.get('/createListing', listingConrtoller.createListingPage);
app.get('/listingItem', listingConrtoller.getListItemPage);
app.post('/postListing', listingConrtoller.postListing)
app.post('/listing/addBidding/:_id', listingConrtoller.postBidding);
app.post('/listing/buyoutBidding/:_id', listingConrtoller.buyoutBidding);
app.post('/listing/closeBidding/:_id', listingConrtoller.closeBidding);
app.put('/updateListing/:_id', listingConrtoller.putListing);

// About page
app.get('/about', homeController.getAbout);
