
const db = require('../models/db.js');
const Listing = require('../models/ListingModel');
const Participation = require('../models/ParticipationModel');
const User = require('../models/UserModel');
const listingValidation = require('../utils/listingValidation');

const bidController = {
    postListing: function (req, res) {

        console.log('in post');
        
        const { error } = listingValidation(req.body);
        if(error) {
            console.log(error.details[0].message);
            return res.status(400).json(error.details[0].message);
        }

        if(req.body.bidIncrease < 5) return res.status(400).json(`"buy-out price" field requries value to be greater than or equal to 5`);

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

            const new_participation = await Participation.create(body);

            const updateBid = await Listing.updateOne({
                _id: req.params._id
            }, {
                highestBid: req.body.bid_amount,
                highestBidder: `${user.firstname} ${user.lastname}`
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
                status: "active"
            }

            const new_participation = await Participation.create(body);

            const updateBid = await Listing.updateOne({
                _id: req.params._id
            }, {
                highestBid: req.body.buyout_price,
                highestBidder: `${user.firstname} ${user.lastname}`,
                soldToUser: user._id,
                status: 'inactive'
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

            const lastParticipant = await Participation.findOne({
                listingId: req.params._id
            }).sort({ createdAt: -1, bids: 1 }).limit(1);

            const closeListing = await Listing.updateOne({
                _id: req.params._id
            }, {
                status: inactive,
                soldToUser: lastParticipant.user._id
            });

            return res.json(true);

        } catch (err) {
            console.log(err);
            if(err.error) {
                if(err.status == 400) return res.status(400).json(err.message);
            } else return res.status(500).json('Internal Server Error');
        }
    }
}

module.exports = bidController;