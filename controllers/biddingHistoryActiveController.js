const db = require("../models/db.js");
const Listing = require("../models/ListingModel.js");
const Participation = require("../models/ParticipationModel.js");

const activeController = {
    getActive: function(req, res) {
		var userEmail = req.session.email
		db.findMany(Participation, {email:userEmail, status:'active'}, null, function(result) {
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
					var endDate = results[i].endDate.toString()
					var remaining = Math.abs(new Date() - new Date(endDate.replace(/-/g,'/')));
					var remaining = msToTime(remaining)
					var _id = results[i]._id
					var order = {
						image: image,
						name: name,
						highestBid:highestBid,
						highestBidder:highestBidder,
						remaining:remaining,
						_id:_id
					}
					orders.push(order)
				}
				res.render('bidding-history-active', {orders:orders})
			})
		})	
	}
}

function msToTime(duration) {
	var days = Math.floor((duration / (1000*60*60*24))),
	  minutes = Math.floor((duration / (1000 * 60)) % 60),
	  hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
  
	return days + "d:"+hours + "hr:" + minutes + "min";
}

module.exports = activeController;