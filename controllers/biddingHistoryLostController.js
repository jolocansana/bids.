const db = require("../models/db.js");
const Listing = require("../models/ListingModel.js");
const Participation = require("../models/ParticipationModel.js");

const lostController = {
    getLost: function(req, res) {
		var userEmail = req.session.email
		db.findMany(Participation, {email:userEmail, status:'lost'}, null, function(result) {
			var ids = []
			for(var i=0; i<result.length; i++)
				ids.push(result[i].listingId)
				
			ids = [...new Set(ids)]
			
			db.findMany(Listing, {_id:ids}, null, function(results) {
				var orders = []
				for (var i=0; i<results.length ; i++){ 
					var image = results[i].images[0]
					var name = results[i].name
					var highestBid = results[i].highestBid
					var highestBidder = results[i].highestBidder
					var endDate = results[i].endDate.toDateString()
					var _id = results[i]._id
					var order = {
						image: image,
						name: name,
						highestBid:highestBid,
						highestBidder:highestBidder,
						endDate:endDate,
						_id:_id
					}
					orders.push(order)
				}
				res.render('bidding-history-lost', {orders:orders})
			})
		})	
	}
}

module.exports = lostController;