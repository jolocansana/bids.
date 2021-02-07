const db = require("../models/db.js");
const Listing = require("../models/ListingModel.js");
const Notification = require('../models/NotificationModel');
const User = require('../models/UserModel');
const Participation = require('../models/ParticipationModel');

const homeController = {
	home:  function(req,res){
		var query = {status: "active"};
		var projection = {};


		db.findMany(Listing, {}, {}, function (results) {
			for (var i = 0; i < results.length; i++) {
				var listID = results[i]._id;
				var closeNow = Date.now();

				if ((results[i].endDate < closeNow) && (results[i].status == "active")) {
					const findListing =  Listing.findOne({
						_id: listID
					})

					const closeListing =  Listing.updateOne({
						_id: listID
					}, {
						status: 'inactive',
						soldToUser: findListing.highestBidderId,
						endDate: new Date()
					});

					//  Win notification
					var winUserID = findListing.highestBidderId;
					var listingID = listID
					var date = Date.now();

					try {
						let updateWinner =  Participation.updateOne({ listingId: listingID, "user._id": winUserID }, {
							status: 'won'
						});

						let updateLosers =  Participation.update({ listingId: listingID, "user._id": { $ne: winUserID } }, {
							status: "lost"
						});
					} catch (err) {
						console.log(err);
					}

					db.findOne(Listing, { _id: listingID }, {}, function (listing) {
						var description = "You won the " + listing.name + " bid for " + listing.highestBid;
						var notif = {
							userID: winUserID,
							listingID: listingID,
							description: description,
							date: date
						};

						db.insertOne(Notification, notif, function (result) {

						});
					});

					// Losers notification
					db.findOne(Listing, { _id: listingID }, {}, function (result) {
						db.findMany(Participation, { listingId: listingID }, {}, function (listing) {
							for (var i = 0; i < listing.length; i++) {
								if (String(listing[i].user._id) != String(winUserID)) {
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
				}

			}
		});


		// Show the current listings
		db.findMany(Listing, query, projection, function(results) {
			
			res.render('home', {
				listings:results
			});
		});
	},
	getListings: function(req, res) {
		
	},
	getAbout: function(req,res) {
		res.render('about', {});
	}
}

module.exports = homeController;