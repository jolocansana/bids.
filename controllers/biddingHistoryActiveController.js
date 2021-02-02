const db = require("../models/db.js");
const Listing = require("../models/ListingModel.js");
const Participation = require("../models/NotificationModel.js");

const activeController = {
    getActive: function(req, res) {
		var userEmail = req.session.email

		db.findMany(Participation, {email:userEmail}, {status:'active'}, function(result) {
			var orders
			for (var i=0 ; i<result ; i++){
				db.findMany(Listing, {_id:listingId}, null, function(result) {
					var image = result.images[0]
					var name = result.name
					var highestBid = result.highestBid
					var highestBidder = result.highestBidder
					var now = new Date()
					var remaining = now - result.endDate
					var _id = result._id
					var order = {
						image: image,
						name: name,
						highestBid:highestBid,
						highestBidder:highestBidder,
						remaining:remaining,
						_id:_id
					}
					orders.push(order)
					console.log(order)
				})
			}
			res.render('bidding-history-active', orders)
		})
	}
}

module.exports = activeController;