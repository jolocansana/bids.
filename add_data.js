const db = require('./models/db.js');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

db.connect();

const Listing = require('./models/ListingModel.js')
const Participation = require('./models/ParticipationModel.js')
const Pinned = require('./models/PinnedModel.js')
const Rating = require('./models/RatingModel.js')
const User = require('./models/UserModel.js')

// var listingDummy = {
//     name: 'test',
//     brand: 'test',
//     startPrice: 100,
//     buyOutPrice: 200,
//     description: 'test',
//     images: null,
//     startDate: new Date(2020, 11, 13),
//     endDate: new Date(2020, 12, 15),
//     highestBidder: 'test',
//     highestBid: 150,
//     listingOwner: 'test',
//     productType: 'clothes',
//     status: 'active'
// }

// db.insertOne(Listing, listingDummy, function(flag){});

// var participationDummy = {
//     email: 'test@yahoo.com',
//     listingId: 'test',
//     bid: 1000,
//     status: 'active'
// }

// db.insertOne(Participation, participationDummy, function(flag){});

// var pinnedDummy = {
//     email: 'test',
//     listingId: 'test',
//     pinStatus: 'active'
// }

// db.insertOne(Pinned, pinnedDummy, function(flag){});

// var ratingdummy = {
//     rater: 'test',
//     rated: 'test',
//     rating: 10,
//     comment: 'good'
// }

// db.insertOne(Rating, ratingdummy, function(flag){});

var userDummy = {
    email: 'test22',
    phonenum: '09200909090',
    firstname: 'Test',
    lastname: 'Test',
    username: 'Test',
    password: 'test',
    birthday: new Date(1990, 12, 15),
    rating: 10,
    address: 'test address',
    city: 'Manila',
    description: 'test',
    profilePic: 'https://coconuts.co/wp-content/uploads/2019/03/archer_4212_032118-960x540.jpg'
}

db.insertOne(User, userDummy, function(flag){
    console.log("added: " + flag);
});
