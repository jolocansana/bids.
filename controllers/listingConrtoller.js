const multer  = require('multer');
const db = require('../models/db.js');
const Listing = require('../models/ListingModel');
const Participation = require('../models/ParticipationModel');
const User = require('../models/UserModel');
const Notification = require('../models/NotificationModel');
const listingValidation = require('../utils/listingValidation');
const listingUpdateValidation = require('../utils/listingUpdateValidation');

var storage = multer.diskStorage({
    destination:'views/uploads/',
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-';
        cb(null, uniqueSuffix + file.originalname);
    }
});

const upload = multer({ storage, limits : { files: 5 } }).array('images', 5);

const bidController = {
    postListing: async function (req, res) {

        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                console.log(err);
                return res.status(400).json('Number of images must be limit up to 5');
            } else if (err) {
                return res.status(500).json('Internal Server Error');
            }

            const { error } = listingValidation(req.body);
            if(error) {
                console.log(error.details[0].message);
                return res.status(400).json(error.details[0].message);
            }

            if(req.body.bidIncrease < 5) return res.status(400).json(`"bid-increase amount" field requries value to be greater than or equal to 5`);

            let today = new Date();

            let compareStartDate = new Date(req.body.startDate);
            let compareEndDate = new Date(req.body.endDate);

            if(compareStartDate < today) {
                return res.status(400).json('Start date must not be earlier than today');
            }

            if(compareEndDate < compareStartDate) {
                return res.status(400).json('End date must be greater than start date');
            }

            let images = [];

            req.files.forEach(element => {
                images.push(element.filename);
            });

            req.body.listingOwner = req.session._id;
            req.body.images = images;
            req.body.highestBid = 0;

            Listing.create(req.body)
                .then((result) => {
                    console.log('created listing: ', result);
                    return res.send(result);
                })
                .catch(err => console.log('error: ', err));

        })
    },
    putListing: async function (req, res) {
        const { error } = listingUpdateValidation(req.body);
        if(error) return res.status(400).json(error.details[0].message);

        Listing.updateOne({ _id: req.params._id }, req.body)
            .then((result) => {
                return res.send(true);
            })
            .catch(err => console.log(err));
    },
    createListingPage: function (req, res) {
        res.render('create-listing');
    },
    getListItemPage: function (req, res) {
        if(!req.query.id) return res.status(400).json('Item not found');

        db.findOne(Listing, { _id: req.query.id }, {}, function (listing) {
            if(!listing) {
                res.render('listing-item', {
                    listingStatus: false
                });
            } else {
                db.findOne(User, { _id: listing.listingOwner }, {}, function (owner) {
                    db.findMany(Participation, { listingId: listing._id }, { sort: { createdAt: -1 }, limit: 3 }, function (participation) {
                        res.render('listing-item', {
                            listingStatus: true,
                            listing: listing,
                            cond1: listing.images.length > 3 ? true : false,
                            cond2: listing.images.length > 6 ? true : false,
                            cond3: listing.highestBid == 0 ? true : false,
                            owner: owner,
                            isLoggedIn: req.session._id ? true : false,
                            isOwner: req.session._id == listing.listingOwner ? true : false,
                            participation: participation,
                            participant: req.session._id, 
                        })
                    })
                    
                })
            }
            
        });
    },
    postBidding: async function (req, res) {

        try {
            const listing = await Listing.findOne({ _id: req.params._id });
            if(!listing) return res.status(400).json('Listing not found');
            
            if(listing.highestBid >= req.body.bid_amount) {
                throw { error: true, status: 400, message: 'Bidding amount must be higher than the latest bid'}
            }

            const user = await User.findOne({ _id: req.session._id }).select('_id firstname lastname email');

            const body = {
                user: user,
                email: user.email,
                listingId: listing._id,
                bid: req.body.bid_amount,
                status: "active"
            }
            
            let findParticipation = await Participation.findOne({ listingId: listing._id, "user._id" : user._id });

            let new_participation;

            if(!findParticipation) {
                new_participation = await Participation.create(body);
            } else {
                let update_participation = await Participation.updateOne({ _id: findParticipation._id }, {
                    bid: req.body.bid_amount
                }); 

                if(update_participation) new_participation = findParticipation;
                new_participation.bid = req.body.bid_amount
            }

            const updateBid = await Listing.updateOne({
                _id: req.params._id
            }, {
                highestBid: req.body.bid_amount,
                highestBidder: `${user.firstname} ${user.lastname}`,
                highestBidderId: user._id
            });

            // Create notification
            var date = Date.now();

            db.findOne(Listing, { _id: req.params._id }, {}, function (listing){
                db.findMany(Participation, {listingId: listing._id}, {}, function(results) {
                    var added = [];
                    for(var i = 0; i < results.length; i++) {
                        if((results[i].user._id != req.session._id) && !(added.includes(String(results[i].user._id)))) {
                            var description = "A higher bid was placed for the " + listing.name + " item" ;
                            var notif = {
                                userID: results[i].user._id,
                                listingID: listing._id,
                                description: description,
                                date: date
                            };
                            added.push(String(results[i].user._id));  
                            db.insertOne(Notification, notif, function (result) {    
                                
                            });
                            
                        }
                    }
                });
            });

            return res.json(new_participation);

        } catch (err) { 
            console.log(err);
            if(err.error) {
                if(err.status == 400) return res.status(400).json(err.message);
            } else return res.status(500).json('Internal Server Error');
        }
    },
    buyoutBidding: async function (req, res) {
        try {
            const listing = await Listing.findOne({ _id: req.params._id });
            if(!listing) return res.status(400).json('Listing not found');

            const user = await User.findOne({ _id: req.session._id }).select('_id firstname lastname email');

            const body = {
                user: user,
                email: user.email,
                listingId: listing._id,
                bid: req.body.buyout_price,
                status: "won"
            }

            let findParticipation = await Participation.findOne({ listingId: listing._id, "user._id" : user._id })
            let new_participation;

            if(!findParticipation) {
                new_participation = await Participation.create(body);
            } else {
                let update_participation = await Participation.updateOne({ _id: findParticipation._id }, {
                    bid: req.body.buyout_price,
                    status: 'won'
                }); 

                if(update_participation) new_participation = findParticipation;
                new_participation.bid = req.body.buyout_price
            }

            try {
                let updateLost = await Participation.update({ listingId: listing._id, "user._id": { $ne: user._id }}, {
                    status: "lost"
                });
            } catch(err) {
                console.log(err);
            }

            const updateBid = await Listing.updateOne({
                _id: req.params._id
            }, {
                highestBid: req.body.buyout_price,
                highestBidder: `${user.firstname} ${user.lastname}`,
                soldToUser: user._id,
                status: 'inactive',
                highestBidderId: user._id,
                endDate: new Date()
            });

            
             var winUserID = user._id;
             var listingID = req.params._id;
             var date = Date.now();
 
 
 
             db.findOne(Listing, { _id: listingID }, {}, function (listing){
                 var description = "You won the "+ listing.name + " bid for " + listing.buyOutPrice;
                 var notif = {
                     userID: winUserID, 
                     listingID: listingID,
                     description: description,
                     date: date 
                 };
 
                 db.insertOne(Notification, notif, function(result) {
 
                 });
             });
 
             // Losers notification
             db.findOne(Listing, { _id: listingID }, {}, function (result){
                 db.findMany(Participation, {listingId: listingID}, {}, function(listing) {
                     for(var i = 0; i <listing.length; i++) {
                         if(String(listing[i].user._id) != String(winUserID)) {
                             var description = "You lost the " + result.name + " bid";
                             var notif = {
                                 userID: listing[i].user._id,
                                 listingID: listingID,
                                 description: description,
                                 date: date
                             };
 
                             db.insertOne(Notification, notif, function (result) {
 
                             });
                         }
                     }
                 });
             });

            return res.json(new_participation);

        } catch(err) {
            console.log(err);
            if(err.error) {
                if(err.status == 400) return res.status(400).json(err.message);
            } else return res.status(500).json('Internal Server Error');
        }
    },
    closeBidding: async function (req, res) {
        try {

            // sorts by latest participant
            // const lastParticipant = await Participation.findOne({
            //     listingId: req.params._id
            // }).sort({ createdAt: -1, bids: 1 }).limit(1);

            const findListing = await Listing.findOne({
                _id: req.params._id
            })

            const closeListing = await Listing.updateOne({
                _id: req.params._id
            }, {
                status: 'inactive',
                soldToUser: findListing.highestBidderId,
                endDate: new Date()
            });

            //  Win notification
            var winUserID = findListing.highestBidderId;
            var listingID = req.params._id;
            var date = Date.now();

            try {
                let updateWinner = await Participation.updateOne({ listingId: listingID, "user._id": winUserID }, {
                    status: 'won'
                });
    
                let updateLosers = await Participation.update({ listingId: listingID, "user._id": { $ne: winUserID }}, {
                    status: "lost"
                });
            } catch(err) {
                console.log(err);
            }

            db.findOne(Listing, { _id: listingID }, {}, function (listing){
                var description = "You won the "+ listing.name + " bid for " + listing.highestBid;
                var notif = {
                    userID: winUserID, 
                    listingID: listingID,
                    description: description,
                    date: date 
                };

                db.insertOne(Notification, notif, function(result) {

                });
            });

            // Losers notification
            db.findOne(Listing, { _id: listingID }, {}, function (result){
                db.findMany(Participation, {listingId: listingID}, {}, function(listing) {
                    for(var i = 0; i <listing.length; i++) {
                        if(String(listing[i].user._id) != String(winUserID)) {
                            var description = "You lost the " + result.name + " bid";
                            var notif = {
                                userID: listing[i].user._id,
                                listingID: listingID,
                                description: description,
                                date: date
                            };

                            db.insertOne(Notification, notif, function (result) {

                            });
                        }
                    }
                });
            });

            
            return res.json(findListing.highestBidderId ? findListing.highestBidderId : null);

        } catch (err) {
            console.log(err);
            if(err.error) {
                if(err.status == 400) return res.status(400).json(err.message);
            } else return res.status(500).json('Internal Server Error');
        }
    }
}

module.exports = bidController;